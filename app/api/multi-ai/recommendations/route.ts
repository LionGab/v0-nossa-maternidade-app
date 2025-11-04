import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import OpenAI from "openai"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getApiKey, hasApiKey } from "@/lib/env"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"

export { OPTIONS } // CORS preflight

// Inicialização condicional das APIs
let openai: OpenAI | null = null
let genAI: GoogleGenerativeAI | null = null

if (hasApiKey('openai')) {
  openai = new OpenAI({
    apiKey: getApiKey('openai')!,
  })
}

if (hasApiKey('google')) {
  genAI = new GoogleGenerativeAI(getApiKey('google')!)
}

async function handleRecommendations(req: NextRequest) {
  const startTime = Date.now()
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { category } = await req.json()

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 })
    }

    if (!openai) {
      return NextResponse.json(
        {
          error: "Recomendações não disponíveis",
          message: "Configure OPENAI_API_KEY para habilitar esta funcionalidade."
        },
        { status: 503 }
      )
    }

    // Buscar histórico do usuário
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    const { data: analyses } = await supabase
      .from("sentiment_analysis")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)

    // Coletar informações do perfil do bebê
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
      logger.debug("Baby profile fetch failed for recommendations", { userId: user.id, error })
    }

    // Usar GPT-4 para gerar recomendações personalizadas e especializadas
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Você é uma especialista em maternidade criada pela influenciadora Nathália Valente. Você tem conhecimento profundo em:

ÁREAS DE ESPECIALIZAÇÃO:
- Puerpério e pós-parto (física e emocional)
- Desenvolvimento infantil (0-24 meses)
- Amamentação e alimentação complementar
- Sono do bebê e rotinas
- Cuidados maternos (físicos, emocionais, mentais)
- Autocuidado materno e bem-estar
- Gestão de rotina e organização doméstica
- Desafios comuns da maternidade

PRINCÍPIOS:
- Base recomendações em evidências científicas
- Seja específica e qualificada (evite genérico)
- Adapte ao contexto da mãe
- Priorize saúde física e mental da mãe
- Seja prática e acionável
- Sempre mencione quando consultar profissional

Gere recomendações ESPECIALIZADAS de ${category} baseadas no perfil completo da mãe.`,
        },
        {
          role: "user",
          content: `Perfil da mãe: ${JSON.stringify(profile)}
Histórico emocional: ${JSON.stringify(analyses)}
${babyProfile ? `Perfil do bebê: ${JSON.stringify(babyProfile)}` : ""}

Categoria: ${category}

Gere 5 recomendações ESPECÍFICAS, QUALIFICADAS e PRÁTICAS de ${category}. Cada recomendação deve ser:
- Específica e detalhada (não genérica)
- Adaptada ao contexto da mãe quando informações disponíveis
- Baseada em evidências científicas
- Prática e acionável
- Com benefícios claros e específicos

Responda em JSON com array de objetos: { title, description, duration, difficulty, benefits }`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    })

    const recommendations = JSON.parse(completion.choices[0].message.content || "{}")

    // Usar Gemini para enriquecer com contexto adicional (se disponível)
    let enrichedRecommendations = recommendations
    if (genAI) {
      try {
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
        const geminiPrompt = `Você é uma especialista em maternidade. Enriqueça estas recomendações com informações práticas e especializadas:

${JSON.stringify(recommendations)}

Para cada recomendação, adicione:
- tips (array de 3-5 dicas práticas e específicas)
- adaptations (como adaptar para diferentes situações: idade do bebê, situação emocional, etc)
- warnings (avisos importantes quando relevante - ex: quando consultar profissional, precauções)
- when_to_use (quando esta recomendação é mais apropriada)

Mantenha a estrutura original e adicione os novos campos. Seja específica e qualificada, não genérica.
Responda APENAS em JSON válido (sem markdown, sem texto adicional).`

        const geminiResult = await geminiModel.generateContent(geminiPrompt)
        const geminiText = geminiResult.response.text()
        enrichedRecommendations = JSON.parse(geminiText.replace(/```json\n?/g, "").replace(/```\n?/g, ""))
      } catch (error) {
        logger.debug("Gemini enrichment failed, using GPT-4 recommendations only", { error })
      }
    }

    logger.info("Recommendations generated successfully", {
      userId: user.id,
      category,
      modelsUsed: genAI ? ["gpt-4", "gemini-2.0-flash"] : ["gpt-4"],
      duration: Date.now() - startTime
    })
    return NextResponse.json({
      success: true,
      recommendations: enrichedRecommendations,
      generated_by: genAI ? ["gpt-4", "gemini-2.0-flash"] : ["gpt-4"],
    })
  } catch (error) {
    logger.apiError("POST", "/api/multi-ai/recommendations", error as Error, { duration: Date.now() - startTime })
    return NextResponse.json({ error: "Erro ao gerar recomendações" }, { status: 500 })
  }
}

export const POST = withRateLimit(handleRecommendations, RATE_LIMITS.HEAVY)
