import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import OpenAI from "openai"
import { GoogleGenerativeAI } from "@google/generative-ai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

    const { category } = await req.json() // 'selfcare', 'activities', 'recipes', 'sleep'

    // Buscar histórico do usuário
    const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

    const { data: analyses } = await supabase
      .from("sentiment_analysis")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)

    // Usar GPT-4 para gerar recomendações personalizadas
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Você é uma especialista em maternidade. Gere recomendações personalizadas de ${category} baseadas no perfil e histórico emocional da mãe.`,
        },
        {
          role: "user",
          content: `Perfil: ${JSON.stringify(profile)}
Histórico emocional: ${JSON.stringify(analyses)}

Gere 5 recomendações específicas e práticas de ${category}. Responda em JSON com array de objetos: { title, description, duration, difficulty, benefits }`,
        },
      ],
      response_format: { type: "json_object" },
    })

    const recommendations = JSON.parse(completion.choices[0].message.content || "{}")

    // Usar Gemini para enriquecer com contexto adicional
    const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
    const geminiPrompt = `Enriqueça estas recomendações com dicas práticas e adaptações:
${JSON.stringify(recommendations)}

Adicione para cada item: tips (array de dicas), adaptations (como adaptar para diferentes situações), warnings (avisos importantes).
Responda em JSON mantendo a estrutura original e adicionando os novos campos.`

    const geminiResult = await geminiModel.generateContent(geminiPrompt)
    const geminiText = geminiResult.response.text()
    const enrichedRecommendations = JSON.parse(geminiText.replace(/```json\n?/g, "").replace(/```\n?/g, ""))

    return NextResponse.json({
      success: true,
      recommendations: enrichedRecommendations,
      generated_by: ["gpt-4", "gemini-2.0-flash"],
    })
  } catch (error) {
    console.error(", error)
    return NextResponse.json({ error: "Erro ao gerar recomendações" }, { status: 500 })
  }
}
