import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { newsRequestSchema } from "@/lib/validations/schemas"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()

    // Validar dados de entrada
    const validationResult = newsRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validationResult.error.errors },
        { status: 400 },
      )
    }

    const { category } = validationResult.data

    const categoryMap: Record<string, string> = {
      all: "maternidade, gestação, criação de filhos, saúde materna",
      pregnancy: "gestação, gravidez, pré-natal",
      parenting: "criação de filhos, educação infantil, desenvolvimento infantil",
      health: "saúde materna, saúde do bebê, pós-parto",
      trends: "tendências em maternidade, novidades para mães",
    }

    const searchQuery = categoryMap[category] || categoryMap.all

    const prompt = `Você é um curador de notícias sobre maternidade. Crie 6 artigos informativos e atualizados sobre: ${searchQuery}

Para cada artigo, forneça:
- Título chamativo e informativo
- Resumo de 2-3 frases
- Categoria (Gestação, Criação, Saúde, Tendências)
- Fonte fictícia mas realista (ex: "Portal Mãe Moderna", "Revista Crescer", "Blog Maternidade Real")
- Data de publicação recente
- URL fictícia

Retorne em formato JSON array:
[{
  "title": "string",
  "summary": "string",
  "category": "string",
  "source": "string",
  "publishedAt": "ISO date string",
  "url": "string"
}]

Os artigos devem ser relevantes, baseados em evidências e úteis para mães modernas.`

    const { text } = await generateText({
      model: "perplexity/llama-3.1-sonar-large-128k-online",
      prompt,
      temperature: 0.7,
    })

    // Parse JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    const articles = jsonMatch ? JSON.parse(jsonMatch[0]) : []

    return NextResponse.json({ articles })
  } catch (error) {
<<<<<<< Current (Your changes)
    console.error("Maternal News API: Error", error)
=======
    console.error("News API: Error fetching maternal news", error)
>>>>>>> Incoming (Background Agent changes)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
