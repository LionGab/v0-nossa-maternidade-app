import type { NextRequest } from "next/server"
import { streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { createServerClient } from "@/lib/supabase/server"
import { MemoryManager } from "@/lib/mcp/memory-manager"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"

export { OPTIONS } // CORS preflight

// MCP: Onboarding Conversacional
async function handleConversationalOnboarding(req: NextRequest) {
  const startTime = Date.now()
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { messages } = await req.json()
    const memoryManager = new MemoryManager(user.id)

    // Get user's onboarding progress
    const { data: onboardingData } = await supabase
      .from("onboarding_responses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    const onboardingComplete = !!onboardingData

    const systemPrompt = `Você é NathAI, uma assistente maternal empática e acolhedora do app "Nossa Maternidade".

${
  onboardingComplete
    ? `A usuária já completou o onboarding. Informações dela:
- Estado emocional: ${onboardingData.emotional_state}
- Principais desafios: ${onboardingData.main_challenges?.join(", ")}
- Qualidade do sono: ${onboardingData.sleep_quality}
- Frequência de autocuidado: ${onboardingData.self_care_frequency}
- Idade do bebê: ${onboardingData.baby_age_months} meses

Seja uma companheira de conversa, oferecendo suporte, dicas e empatia.`
    : `Você está conduzindo o onboarding inicial. Faça perguntas acolhedoras para conhecer a mãe:
1. Como ela está se sentindo hoje?
2. Quais são seus principais desafios?
3. Como está a qualidade do sono dela?
4. Com que frequência ela consegue fazer autocuidado?
5. Qual a idade do bebê?
6. Há algo específico que ela precisa?

Faça UMA pergunta por vez, de forma natural e empática. Não seja robótica.`
}

Diretrizes:
- Seja calorosa, empática e genuína
- Use linguagem natural, como uma amiga experiente
- Valide os sentimentos dela
- Ofereça suporte sem julgamentos
- Seja breve e objetiva (2-3 parágrafos no máximo)
- Use emojis ocasionalmente para transmitir calor humano 💕`

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      async onFinish({ text }) {
        // Store conversation in memory
        await memoryManager.storeMemory(
          `Usuária: ${messages[messages.length - 1].content}\nNathAI: ${text}`,
          "conversation",
          undefined,
          { type: "onboarding", complete: onboardingComplete },
        )
        logger.info("Conversational onboarding message processed", {
          userId: user.id,
          onboardingComplete,
          duration: Date.now() - startTime
        })
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    logger.apiError("POST", "/api/mcp/conversational-onboarding", error as Error, { duration: Date.now() - startTime })
    return new Response("Internal Server Error", { status: 500 })
  }
}

export const POST = withRateLimit(handleConversationalOnboarding, RATE_LIMITS.AUTHENTICATED)
