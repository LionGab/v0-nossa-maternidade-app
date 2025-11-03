import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"

export { OPTIONS } // CORS preflight

async function handleResearch(req: NextRequest) {
  const startTime = Date.now()
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { query } = await req.json()

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Usar Perplexity para pesquisa de informações médicas atualizadas
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-large-128k-online",
        messages: [
          {
            role: "system",
            content:
              "Você é uma assistente especializada em saúde materna. Forneça informações baseadas em evidências científicas recentes, sempre citando fontes confiáveis.",
          },
          {
            role: "user",
            content: query,
          },
        ],
      }),
    })

    const data = await response.json()

    logger.info("Research completed successfully", {
      userId: user.id,
      queryLength: query.length,
      duration: Date.now() - startTime
    })
    return NextResponse.json({
      success: true,
      answer: data.choices[0].message.content,
      sources: data.citations || [],
      model: "perplexity-sonar",
    })
  } catch (error) {
    logger.apiError("POST", "/api/multi-ai/research", error as Error, { duration: Date.now() - startTime })
    return NextResponse.json({ error: "Erro ao pesquisar" }, { status: 500 })
  }
}

export const POST = withRateLimit(handleResearch, RATE_LIMITS.HEAVY)
