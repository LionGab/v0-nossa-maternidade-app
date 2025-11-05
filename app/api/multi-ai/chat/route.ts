import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { chatRequestSchema } from "@/lib/validations/schemas"
import { getApiKey } from "@/lib/env"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"
import { sanitizeMessages } from "@/lib/sanitize"
import { validateContext, isResponseInContext } from "@/lib/guardrails"
import { getAnthropicClient, getOpenAIClient } from "@/lib/ai/providers"

export { OPTIONS } // CORS preflight

async function multiAIChatHandler(req: NextRequest) {
  const startTime = Date.now()
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return new Response("Não autorizado", { status: 401 })
    }

    const body = await req.json()

    // Validar dados de entrada
    const validationResult = chatRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Formato de mensagens inválido",
          details: validationResult.error.errors,
        }),
        { status: 400 }
      )
    }

    const { messages, useEmpatheticMode } = validationResult.data

    // Limitar histórico para as últimas 10 mensagens (5 interações) para respostas mais rápidas
    const limitedMessages = messages.slice(-10)

    // Validar contexto da última mensagem do usuário
    const lastUserMessage = limitedMessages.filter((m) => m.role === "user").pop()?.content || ""
    const contextValidation = validateContext(lastUserMessage)

    // Se estiver fora do contexto, retornar redirecionamento
    if (contextValidation.shouldRedirect && contextValidation.redirectMessage) {
      return new Response(contextValidation.redirectMessage, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      })
    }

    // Usar modo empático se detectar necessidade emocional
    const shouldUseEmpatheticMode = useEmpatheticMode || contextValidation.needsEmpathy

    // Sanitize message content to prevent XSS
    const sanitizedMessages = sanitizeMessages(limitedMessages)

    let profile = null
    let latestAnalysis = null

    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      profile = profileData
    } catch (error) {
      logger.debug("Profile fetch failed", { userId: user.id, error })
    }

    try {
      const { data: analysisData } = await supabase
        .from("sentiment_analysis")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()
      latestAnalysis = analysisData
    } catch (error) {
      logger.debug("Sentiment analysis fetch failed", { userId: user.id, error })
    }

    // Coletar informações do perfil do bebê se disponível
    let babyProfile = null
    try {
      const { data: babyData } = await supabase
        .from("baby_profiles")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()
      babyProfile = babyData
    } catch (error) {
      logger.debug("Baby profile fetch failed", { userId: user.id, error })
    }

    const context = `
Contexto da usuária:
- Nome: ${profile?.full_name || "Mãe"}
- Última análise emocional: ${latestAnalysis?.analysis?.emotion || "não disponível"}
- Nível de risco: ${latestAnalysis?.risk_level || "não avaliado"}
${
  babyProfile
    ? `
- Perfil do bebê:
  * Nome: ${babyProfile.name || "bebê"}
  * Idade: ${babyProfile.age_months ? `${babyProfile.age_months} meses` : "não informado"}
  * Peso: ${babyProfile.weight ? `${babyProfile.weight}kg` : "não informado"}
  * Alimentação: ${babyProfile.feeding_type || "não informado"}
  * Desenvolvimento: ${babyProfile.development_stage || "não informado"}
`
    : ""
}
`

    // Usar Claude para modo empático (melhor para suporte emocional)
    if (shouldUseEmpatheticMode) {
      const anthropic = getAnthropicClient()
      if (!anthropic) {
        return new Response(
          JSON.stringify({
            error: "Modo empático não disponível",
            message: "A API do Anthropic não está configurada. Configure ANTHROPIC_API_KEY.",
          }),
          { status: 503, headers: { "Content-Type": "application/json" } }
        )
      }

      const stream = await anthropic.messages.stream({
        model: "claude-3-5-haiku-20241022", // Modelo mais rápido
        max_tokens: 800, // Aumentar para respostas mais completas
        system: `Você é NathAI, assistente maternal especializada criada pela influenciadora Nathália Valente.

IMPORTANTE: Você APENAS responde questões relacionadas à MATERNIDADE. Se a pergunta não for sobre maternidade, puerpério, cuidados com bebê, amamentação, desenvolvimento infantil, rotina, autocuidado materno ou bem-estar materno, você DEVE educadamente redirecionar para tópicos de maternidade.

Você tem conhecimento profundo em:

ÁREAS DE ESPECIALIZAÇÃO:
- Puerpério e pós-parto (física e emocional)
- Desenvolvimento infantil (0-24 meses)
- Amamentação e alimentação complementar
- Sono do bebê e rotinas
- Cuidados maternos (físicos, emocionais, mentais)
- Relacionamento mãe-bebê e vínculo
- Gestão de rotina e organização doméstica
- Autocuidado materno e bem-estar
- Desafios comuns da maternidade (birras, cólicas, regressões)

PRINCÍPIOS FUNDAMENTAIS:
- Base suas respostas em evidências científicas e práticas recomendadas
- Seja empática, acolhedora e realista (não idealize)
- Reconheça que cada mãe e bebê são únicos
- Priorize saúde física e mental da mãe
- Sempre recomende consultar profissionais quando necessário
- Use linguagem acessível mas profissional

${context}

REGRAS DE RESPOSTA:
- Seja ESPECÍFICA e QUALIFICADA (não genérica)
- Forneça informações práticas e acionáveis
- Adapte respostas ao contexto da mãe quando disponível
- Seja concisa mas completa (3-5 parágrafos)
- Evite clichês e respostas superficiais
- Sempre que possível, mencione precauções importantes
- NUNCA responda questões fora de maternidade - sempre redirecione
- Seja empática, acolhedora e valide os sentimentos da mãe
- Use linguagem "eu entendo", "isso é normal", "você não está sozinha"`,
        messages: sanitizedMessages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      })

      const encoder = new TextEncoder()
      let fullResponse = ""

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
                const text = chunk.delta.text
                fullResponse += text
                controller.enqueue(encoder.encode(text))
              }
            }

            // Validar resposta após completar
            if (!isResponseInContext(fullResponse)) {
              logger.warn("Response out of context detected", {
                userId: user.id,
                mode: "empathetic",
                responseLength: fullResponse.length,
              })
              // Nota: A resposta já foi enviada, mas logamos para monitoramento
            }

            controller.close()
          } catch (error) {
            logger.apiError("POST", "/api/multi-ai/chat", error as Error, {
              userId: user.id,
              mode: "empathetic",
            })
            controller.error(error)
          }
        },
      })

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      })
    }

    // Usar GPT-4 para conversação geral e recomendações
    const openai = getOpenAIClient()
    if (!openai) {
      return new Response(
        JSON.stringify({
          error: "Chat não disponível",
          message: "A API da OpenAI não está configurada. Configure OPENAI_API_KEY.",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      )
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Modelo mais rápido e eficiente
      max_tokens: 800, // Aumentar para respostas mais completas
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `Você é NathAI, assistente maternal especializada criada pela influenciadora Nathália Valente.

IMPORTANTE: Você APENAS responde questões relacionadas à MATERNIDADE. Se a pergunta não for sobre maternidade, puerpério, cuidados com bebê, amamentação, desenvolvimento infantil, rotina, autocuidado materno ou bem-estar materno, você DEVE educadamente redirecionar para tópicos de maternidade.

Você tem conhecimento profundo em:

ÁREAS DE ESPECIALIZAÇÃO:
- Puerpério e pós-parto (física e emocional)
- Desenvolvimento infantil (0-24 meses)
- Amamentação e alimentação complementar
- Sono do bebê e estabelecimento de rotinas
- Cuidados maternos (físicos, emocionais, mentais)
- Relacionamento mãe-bebê e fortalecimento do vínculo
- Gestão de rotina e organização doméstica com bebê
- Autocuidado materno e bem-estar
- Desafios comuns da maternidade (birras, cólicas, regressões, desmame)

PRINCÍPIOS FUNDAMENTAIS:
- Base suas respostas em evidências científicas e práticas recomendadas por profissionais
- Seja empática, acolhedora e realista (evite idealizar a maternidade)
- Reconheça que cada mãe e bebê são únicos - não há uma fórmula única
- Priorize sempre a saúde física e mental da mãe
- Sempre recomende consultar profissionais de saúde quando necessário
- Use linguagem acessível mas profissional e respeitosa

${context}

REGRAS DE RESPOSTA:
- Seja ESPECÍFICA e QUALIFICADA (evite respostas genéricas como "cada caso é diferente" sem dar orientações)
- Forneça informações práticas, acionáveis e baseadas em evidências
- Adapte respostas ao contexto da mãe quando informações disponíveis (idade do bebê, situação emocional, etc)
- Seja concisa mas completa (3-5 parágrafos quando necessário para uma resposta qualificada)
- Evite clichês, respostas superficiais ou genéricas
- Sempre que relevante, mencione precauções importantes e quando consultar profissional
- Se não tiver certeza sobre algo, seja honesta e recomende consultar especialista
- NUNCA responda questões fora de maternidade - sempre redirecione educadamente
- Seja empática, acolhedora e valide os sentimentos da mãe
- Use linguagem "eu entendo", "isso é normal", "você não está sozinha"
- Para mães que estão desabafando, seja mais acolhedora e valide os sentimentos`,
        },
        ...sanitizedMessages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      ],
      stream: true,
    })

    const encoder = new TextEncoder()
    let fullResponse = ""

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content || ""
            if (text) {
              fullResponse += text
              controller.enqueue(encoder.encode(text))
            }
          }

          // Validar resposta após completar
          if (!isResponseInContext(fullResponse)) {
            logger.warn("Response out of context detected", {
              userId: user.id,
              mode: "general",
              responseLength: fullResponse.length,
            })
            // Nota: A resposta já foi enviada, mas logamos para monitoramento
          }

          controller.close()
        } catch (error) {
          logger.apiError("POST", "/api/multi-ai/chat", error as Error, {
            userId: user.id,
            mode: "general",
          })
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    logger.apiError("POST", "/api/multi-ai/chat", error as Error, {
      duration: Date.now() - startTime,
    })
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    return new Response(`Erro ao processar mensagem: ${errorMessage}`, { status: 500 })
  }
}

export const POST = withRateLimit(multiAIChatHandler, RATE_LIMITS.HEAVY)
