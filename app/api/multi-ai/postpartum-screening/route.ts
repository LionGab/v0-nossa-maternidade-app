import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getApiKey, hasApiKey } from "@/lib/env"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"

export { OPTIONS } // CORS preflight

// Inicialização condicional das APIs
let anthropic: Anthropic | null = null
let genAI: GoogleGenerativeAI | null = null

if (hasApiKey('anthropic')) {
  anthropic = new Anthropic({
    apiKey: getApiKey('anthropic')!,
  })
}

if (hasApiKey('google')) {
  genAI = new GoogleGenerativeAI(getApiKey('google')!)
}

async function handlePostpartumScreening(req: NextRequest) {
  const startTime = Date.now()
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    if (!anthropic) {
      return NextResponse.json(
        { 
          error: "Triagem não disponível",
          message: "Configure ANTHROPIC_API_KEY para habilitar esta funcionalidade."
        }, 
        { status: 503 }
      )
    }

    // Buscar histórico completo do usuário
    const { data: analyses } = await supabase
      .from("sentiment_analysis")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    const { data: conversations } = await supabase
      .from("ai_conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)

    // Usar Claude para análise psicológica profunda
    const claudeAnalysis = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Você é uma psicóloga perinatal especializada em depressão pós-parto. Analise o histórico completo desta mãe:

Análises de sentimento: ${JSON.stringify(analyses)}
Conversas recentes: ${JSON.stringify(conversations)}

Realize uma triagem para depressão pós-parto (DPP) baseada nos critérios do Edinburgh Postnatal Depression Scale (EPDS) e DSM-5.

Forneça:
1. Score de risco (0-30, onde >13 indica possível DPP)
2. Sintomas identificados
3. Fatores de risco presentes
4. Fatores de proteção
5. Recomendações urgentes
6. Necessidade de encaminhamento profissional (sim/não)

IMPORTANTE: Se identificar risco alto, inclua recursos de emergência.

Responda em JSON com: { riskScore, symptoms, riskFactors, protectiveFactors, recommendations, needsProfessionalHelp, emergencyResources }`,
        },
      ],
    })

    const claudeResult = JSON.parse(claudeAnalysis.content[0].type === "text" ? claudeAnalysis.content[0].text : "{}")

    // Usar Gemini para análise de padrões temporais (se disponível)
    let geminiAnalysis = {}
    if (genAI) {
      try {
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
        const geminiPrompt = `Analise os padrões temporais e evolução do estado emocional:

${JSON.stringify(analyses)}

Identifique:
1. Tendências (melhorando/piorando/estável)
2. Gatilhos identificados
3. Momentos críticos do dia
4. Padrões de sono e energia
5. Eficácia de estratégias de autocuidado

Responda em JSON com: { trend, triggers, criticalTimes, sleepEnergyPattern, selfCareEffectiveness }`

        const geminiResult = await geminiModel.generateContent(geminiPrompt)
        const geminiText = geminiResult.response.text()
        geminiAnalysis = JSON.parse(geminiText.replace(/```json\n?/g, "").replace(/```\n?/g, ""))
      } catch (error) {
        logger.debug("Gemini temporal analysis failed, continuing with Claude only", { error })
      }
    }

    // Combinar análises
    const screening = {
      ...claudeResult,
      temporalAnalysis: geminiAnalysis,
      screeningDate: new Date().toISOString(),
      models_used: genAI ? ["claude-sonnet-4", "gemini-2.0-flash"] : ["claude-sonnet-4"],
    }

    // Salvar triagem
    const { error } = await supabase.from("postpartum_screenings").insert({
      user_id: user.id,
      risk_score: claudeResult.riskScore,
      screening_data: screening,
      needs_professional_help: claudeResult.needsProfessionalHelp,
      created_at: new Date().toISOString(),
    })

    if (error) throw error

    // Se risco alto, criar alerta
    if (claudeResult.riskScore > 13 || claudeResult.needsProfessionalHelp) {
      await supabase.from("health_alerts").insert({
        user_id: user.id,
        alert_type: "high_risk_dpp",
        severity: claudeResult.riskScore > 20 ? "critical" : "high",
        data: screening,
        created_at: new Date().toISOString(),
      })
    }

    logger.info("Postpartum screening completed", {
      userId: user.id,
      riskScore: claudeResult.riskScore,
      needsProfessionalHelp: claudeResult.needsProfessionalHelp,
      modelsUsed: screening.models_used,
      duration: Date.now() - startTime
    })
    return NextResponse.json({
      success: true,
      screening,
    })
  } catch (error) {
    logger.apiError("POST", "/api/multi-ai/postpartum-screening", error as Error, { duration: Date.now() - startTime })
    return NextResponse.json({ error: "Erro ao realizar triagem" }, { status: 500 })
  }
}

export const POST = withRateLimit(handlePostpartumScreening, RATE_LIMITS.HEAVY)
