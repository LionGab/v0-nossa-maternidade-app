import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { createServerClient } from "@/lib/supabase/server"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"
import { sanitizeString } from "@/lib/sanitize"

export { OPTIONS } // CORS preflight

// MCP: Resumo e Extração
async function handleSummarize(req: NextRequest) {
  const startTime = Date.now()
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text, type } = await req.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Sanitize input text to prevent XSS
    const sanitizedText = sanitizeString(text)
    const sanitizedType = type ? sanitizeString(type) : "texto"

    // Use Claude for empathetic summarization
    const { text: summary } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      prompt: `Você é uma assistente maternal empática. Resuma o seguinte ${sanitizedType} de forma clara e acolhedora, mantendo os pontos emocionais importantes:

${sanitizedText}

Crie um resumo em 2-3 parágrafos que capture a essência emocional e os pontos principais.`,
    })

    // Extract key topics
    const { text: topics } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      prompt: `Extraia os principais tópicos e temas do seguinte texto. Liste apenas os tópicos, separados por vírgula:

${sanitizedText}`,
    })

    logger.info("Summary generated successfully", {
      userId: user.id,
      originalLength: text.length,
      summaryLength: summary.length,
      duration: Date.now() - startTime
    })
    return NextResponse.json({
      summary,
      topics: topics.split(",").map((t) => t.trim()),
      originalLength: text.length,
      summaryLength: summary.length,
    })
  } catch (error) {
    logger.apiError("POST", "/api/mcp/summarize", error as Error, { duration: Date.now() - startTime })
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}

export const POST = withRateLimit(handleSummarize, RATE_LIMITS.HEAVY)
