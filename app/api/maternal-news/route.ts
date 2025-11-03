import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { newsRequestSchema } from "@/lib/validations/schemas"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"

export { OPTIONS } // CORS preflight

async function handleMaternalNews(request: NextRequest) {
  const startTime = Date.now()
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

    logger.info("Maternal news generated successfully", {
      userId: user.id,
      category,
      articlesCount: articles.length,
      duration: Date.now() - startTime
    })
    return NextResponse.json({ articles })
  } catch (error) {
    logger.apiError("POST", "/api/maternal-news", error as Error, { duration: Date.now() - startTime })
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}

export const POST = withRateLimit(handleMaternalNews, RATE_LIMITS.HEAVY)
