import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return new Response("Não autorizado", { status: 401 })
    }

    const { messages, useEmpatheticMode } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Formato de mensagens inválido", { status: 400 })
    }

    // Validate message structure
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return new Response("Mensagem com formato inválido", { status: 400 })
      }
      if (typeof msg.content !== "string" || msg.content.trim().length === 0) {
        return new Response("Conteúdo da mensagem inválido", { status: 400 })
      }
      if (msg.content.length > 5000) {
        return new Response("Mensagem muito longa (máximo 5000 caracteres)", { status: 400 })
      }
    }

    let profile = null
    let latestAnalysis = null

    try {
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      profile = profileData
    } catch (error) {
      // Profile fetch is optional
    }

    try {
      const { data: analysisData } = await supabase
        .from("sentiment_analysis")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()
      latestAnalysis = analysisData
    } catch (error) {
      // Sentiment analysis is optional
    }

    const context = `
Contexto da usuária:
- Nome: ${profile?.full_name || "Mãe"}
- Última análise emocional: ${latestAnalysis?.analysis?.emotion || "não disponível"}
- Nível de risco: ${latestAnalysis?.risk_level || "não avaliado"}
`

    // Usar Claude para modo empático (melhor para suporte emocional)
    if (useEmpatheticMode) {
      const stream = await anthropic.messages.stream({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Você é NathAI, uma assistente maternal empática e acolhedora. ${context}

Histórico da conversa:
${messages.map((m: any) => `${m.role}: ${m.content}`).join("\n")}

Responda de forma calorosa, empática e prática. Ofereça suporte emocional genuíno e conselhos baseados em evidências.`,
          },
        ],
      })

      const encoder = new TextEncoder()
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
                controller.enqueue(encoder.encode(chunk.delta.text))
              }
            }
            controller.close()
          } catch (error) {
            console.error("[v0] Multi-AI Chat: Stream error", error)
            controller.error(error)
          }
        },
      })

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      })
    }

    // Usar GPT-4 para conversação geral e recomendações
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Você é NathAI, uma assistente maternal inteligente. ${context}

Forneça respostas práticas, baseadas em evidências e personalizadas para a situação da mãe.`,
        },
        ...messages,
      ],
      stream: true,
    })

    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content || ""
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
          }
          controller.close()
        } catch (error) {
          console.error("[v0] Multi-AI Chat: Stream error", error)
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("[v0] Multi-AI Chat: Unexpected error", error)
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    return new Response(`Erro ao processar mensagem: ${errorMessage}`, { status: 500 })
  }
}
