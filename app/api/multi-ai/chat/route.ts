import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"
import { chatRequestSchema } from "@/lib/validations/schemas"
import { getApiKey, hasApiKey } from "@/lib/env"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"
import { sanitizeMessages } from "@/lib/sanitize"

export { OPTIONS } // CORS preflight

// Inicialização condicional das APIs
let anthropic: Anthropic | null = null
let openai: OpenAI | null = null

if (hasApiKey('anthropic')) {
  anthropic = new Anthropic({
    apiKey: getApiKey('anthropic')!,
  })
}

if (hasApiKey('openai')) {
  openai = new OpenAI({
    apiKey: getApiKey('openai')!,
    timeout: 20000, // Timeout de 20 segundos
  })
}

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
        JSON.stringify({ error: "Formato de mensagens inválido", details: validationResult.error.errors }),
        { status: 400 },
      )
    }

    const { messages, useEmpatheticMode } = validationResult.data

    // Limitar histórico para as últimas 10 mensagens (5 interações) para respostas mais rápidas
    const limitedMessages = messages.slice(-10)

    // Sanitize message content to prevent XSS
    const sanitizedMessages = sanitizeMessages(limitedMessages)

    let profile = null
    let latestAnalysis = null

    try {
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
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

    const context = `
Contexto da usuária:
- Nome: ${profile?.full_name || "Mãe"}
- Última análise emocional: ${latestAnalysis?.analysis?.emotion || "não disponível"}
- Nível de risco: ${latestAnalysis?.risk_level || "não avaliado"}
`

    // Usar Claude para modo empático (melhor para suporte emocional)
    if (useEmpatheticMode) {
      if (!anthropic) {
        return new Response(
          JSON.stringify({
            error: "Modo empático não disponível",
            message: "A API do Anthropic não está configurada. Configure ANTHROPIC_API_KEY."
          }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      }

      const stream = await anthropic.messages.stream({
        model: "claude-3-5-haiku-20241022", // Modelo mais rápido
        max_tokens: 500, // Limitar resposta
        system: `Você é NathAI, assistente maternal. ${context}

REGRAS IMPORTANTES:
- Seja CONCISA e DIRETA (máximo 3-4 parágrafos)
- Respostas curtas e práticas
- Evite explicações longas`,
        messages: sanitizedMessages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      })

      const encoder = new TextEncoder()
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
                controller.enqueue(encoder.encode(chunk.delta.text))
              }
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
    if (!openai) {
      return new Response(
        JSON.stringify({
          error: "Chat não disponível",
          message: "A API da OpenAI não está configurada. Configure OPENAI_API_KEY."
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Usar modelo mais rápido (gpt-4o-mini) para respostas mais rápidas
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Modelo mais rápido e eficiente
      max_tokens: 400, // Limitar tamanho da resposta
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `Você é NathAI, assistente maternal. ${context}

REGRAS IMPORTANTES:
- Seja CONCISA e DIRETA (máximo 2-3 parágrafos)
- Respostas curtas, práticas e objetivas
- Evite explicações longas ou repetitivas
- Foque em ações práticas imediatas`,
        },
        ...sanitizedMessages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      ],
      stream: true,
    })

    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content || ""
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
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
