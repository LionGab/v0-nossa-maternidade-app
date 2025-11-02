import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { query } = await req.json()

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

    return NextResponse.json({
      success: true,
      answer: data.choices[0].message.content,
      sources: data.citations || [],
      model: "perplexity-sonar",
    })
  } catch (error) {
    console.error(", error)
    return NextResponse.json({ error: "Erro ao pesquisar" }, { status: 500 })
  }
}
