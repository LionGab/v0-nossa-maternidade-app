import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import { GoogleGenerativeAI } from "@google/generative-ai"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

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

    // Usar Gemini para análise contextual e padrões
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
    const geminiAnalysis = JSON.parse(geminiText.replace(/```json\n?/g, "").replace(/```\n?/g, ""))

    // Combinar análises
    const combinedAnalysis = {
      ...claudeResult,
      ...geminiAnalysis,
      timestamp: new Date().toISOString(),
      models_used: ["claude-sonnet-4", "gemini-2.0-flash"],
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
    console.error("[v0] Erro na análise multi-modelo:", error)
    return NextResponse.json({ error: "Erro ao processar análise" }, { status: 500 })
  }
}
