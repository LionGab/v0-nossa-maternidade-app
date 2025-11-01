import { streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { createServerClient } from "@/lib/supabase/server"
import { MemoryManager } from "@/lib/mcp/memory-manager"

// Enhanced chat with long-term memory (80+ days)
export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1].content

    const memoryManager = new MemoryManager(user.id)

    // Get comprehensive context including memories from 90 days ago
    const historicalContext = await memoryManager.getComprehensiveContext(lastMessage, 90)

    // Get user profile and baby info
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    const { data: babyProfile } = await supabase
      .from("baby_profiles")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    const systemPrompt = `Você é NathAI, assistente maternal do app "Nossa Maternidade".

INFORMAÇÕES DA USUÁRIA:
- Nome: ${profile?.full_name || "Mãe"}
- Bebê: ${babyProfile?.name || "bebê"} (${babyProfile?.age_months || 0} meses)

${historicalContext}

IMPORTANTE: Você tem acesso ao histórico completo da usuária, incluindo conversas de até 90 dias atrás. Use esse contexto para:
- Lembrar de eventos importantes que ela mencionou
- Fazer follow-up de situações anteriores
- Mostrar que você acompanha a jornada dela
- Ser genuinamente empática baseada no histórico

Exemplo: "Lembro que há 2 meses você mencionou que estava com dificuldade com a amamentação. Como está isso agora?"

Seja calorosa, empática e demonstre que você realmente conhece e acompanha a história dela. 💕`

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      async onFinish({ text }) {
        // Store this conversation in memory for future reference
        await memoryManager.storeMemory(`Usuária: ${lastMessage}\nNathAI: ${text}`, "conversation", undefined, {
          timestamp: new Date().toISOString(),
          babyAgeMonths: babyProfile?.age_months,
        })
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Error in chat with memory:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
