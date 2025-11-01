import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { createServerClient } from "@/lib/supabase/server"

// MCP: Resumo e Extração
export async function POST(req: NextRequest) {
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

    // Use Claude for empathetic summarization
    const { text: summary } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      prompt: `Você é uma assistente maternal empática. Resuma o seguinte ${type || "texto"} de forma clara e acolhedora, mantendo os pontos emocionais importantes:

${text}

Crie um resumo em 2-3 parágrafos que capture a essência emocional e os pontos principais.`,
    })

    // Extract key topics
    const { text: topics } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      prompt: `Extraia os principais tópicos e temas do seguinte texto. Liste apenas os tópicos, separados por vírgula:

${text}`,
    })

    return NextResponse.json({
      summary,
      topics: topics.split(",").map((t) => t.trim()),
      originalLength: text.length,
      summaryLength: summary.length,
    })
  } catch (error) {
    console.error("Summarize MCP API: Error", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}
