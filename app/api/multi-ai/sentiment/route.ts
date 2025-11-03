import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getApiKey, hasApiKey } from "@/lib/env"

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

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { responses } = await req.json()

    if (!responses) {
      return NextResponse.json({ error: "Responses are required" }, { status: 400 })
    }

    if (!anthropic) {
      return NextResponse.json(
        { 
          error: "Análise de sentimento não disponível",
          message: "Configure ANTHROPIC_API_KEY para habilitar esta funcionalidade."
        }, 
        { status: 503 }
      )
    }

    // Usar Claude para análise empática profunda
    const claudeAnalysis = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Você é uma psicóloga especializada em saúde mental materna. Analise estas respostas de uma mãe e forneça uma análise empática e profunda:

${JSON.stringify(responses, null, 2)}

Forneça:
1. Análise emocional detalhada
2. Identificação de sinais de alerta (depressão pós-parto, ansiedade, burnout)
3. Nível de risco (baixo/médio/alto)
4. Recomendações personalizadas e empáticas
5. Sugestões de autocuidado específicas

Responda em JSON com: { emotion, riskLevel, concerns, recommendations, selfCareActions }`,
        },
      ],
    })

    const claudeResult = JSON.parse(claudeAnalysis.content[0].type === "text" ? claudeAnalysis.content[0].text : "{}")

    // Usar Gemini para análise contextual e padrões (se disponível)
    let geminiAnalysis = {}
    if (genAI) {
      try {
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
        const geminiPrompt = `Analise os padrões de comportamento e contexto desta mãe:

${JSON.stringify(responses, null, 2)}

Identifique:
1. Padrões de sono e energia
2. Rede de apoio disponível
3. Fatores de estresse
4. Recursos e forças pessoais
5. Áreas que precisam de suporte imediato

Responda em JSON com: { sleepPattern, supportNetwork, stressFactors, strengths, urgentNeeds }`

        const geminiResult = await geminiModel.generateContent(geminiPrompt)
        const geminiText = geminiResult.response.text()
        geminiAnalysis = JSON.parse(geminiText.replace(/```json\n?/g, "").replace(/```\n?/g, ""))
      } catch (error) {
        console.warn("Gemini analysis failed, continuing with Claude only:", error)
      }
    }

    // Combinar análises
    const combinedAnalysis = {
      ...claudeResult,
      ...geminiAnalysis,
      timestamp: new Date().toISOString(),
      models_used: genAI ? ["claude-sonnet-4", "gemini-2.0-flash"] : ["claude-sonnet-4"],
    }

    // Salvar no Supabase
    const { error } = await supabase.from("sentiment_analysis").insert({
      user_id: user.id,
      responses,
      analysis: combinedAnalysis,
      risk_level: claudeResult.riskLevel,
      created_at: new Date().toISOString(),
    })

    if (error) throw error

    return NextResponse.json({
      success: true,
      analysis: combinedAnalysis,
    })
  } catch (error) {
    console.error("Sentiment Analysis API: Error", error)
    return NextResponse.json({ error: "Erro ao processar análise" }, { status: 500 })
  }
}
