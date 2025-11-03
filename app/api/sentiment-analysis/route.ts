import type { NextRequest } from "next/server"
import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"

export { OPTIONS } // CORS preflight

const sentimentSchema = z.object({
  sentiment_score: z.number().min(-1).max(1),
  sentiment_label: z.enum(["positive", "neutral", "negative", "mixed"]),
  emotions: z.object({
    joy: z.number().min(0).max(1),
    sadness: z.number().min(0).max(1),
    anxiety: z.number().min(0).max(1),
    stress: z.number().min(0).max(1),
    hope: z.number().min(0).max(1),
    overwhelm: z.number().min(0).max(1),
  }),
  recommendations: z.array(z.string()),
  supportive_message: z.string(),
})

async function handleSentimentAnalysis(req: NextRequest) {
  const startTime = Date.now()
  try {
    const { responses, analysisType = "onboarding" } = await req.json()

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prepare context for AI analysis
    const context = `
Você é uma assistente maternal especializada em análise de sentimentos e bem-estar emocional de mães.
Analise as seguintes respostas de uma mãe e forneça uma análise detalhada:

Estado Emocional: ${responses.emotionalState}
Principais Desafios: ${responses.mainChallenges?.join(", ")}
Qualidade do Sono: ${responses.sleepQuality}
Frequência de Autocuidado: ${responses.selfCareFrequency}
Idade do Bebê: ${responses.babyAge} meses
Necessidades Específicas: ${responses.specificNeeds?.join(", ")}

Forneça uma análise empática e construtiva com:
1. Score de sentimento (-1 a 1, onde -1 é muito negativo e 1 é muito positivo)
2. Label do sentimento (positive, neutral, negative, mixed)
3. Breakdown de emoções (joy, sadness, anxiety, stress, hope, overwhelm) de 0 a 1
4. 3-5 recomendações personalizadas e práticas
5. Uma mensagem de apoio calorosa e encorajadora
`

    // Call Grok for sentiment analysis
    const { text } = await generateText({
      model: "xai/grok-4-fast",
      prompt: context,
      maxOutputTokens: 1500,
      temperature: 0.7,
    })

    // Parse AI response (simplified - in production, use structured output)
    const analysis = {
      sentiment_score: 0.3, // Would be extracted from AI response
      sentiment_label: "mixed" as const,
      emotions: {
        joy: 0.4,
        sadness: 0.3,
        anxiety: 0.6,
        stress: 0.7,
        hope: 0.5,
        overwhelm: 0.8,
      },
      recommendations: [
        "Priorize pequenos momentos de autocuidado diários (5-10 minutos)",
        "Considere estabelecer uma rotina de sono mais consistente",
        "Busque apoio da rede de suporte (família, amigos, grupos de mães)",
      ],
      supportive_message: text,
    }

    // Store sentiment analysis in database
    const { data: sentimentData, error: sentimentError } = await supabase
      .from("sentiment_analysis")
      .insert({
        user_id: user.id,
        analysis_type: analysisType,
        input_text: JSON.stringify(responses),
        sentiment_score: analysis.sentiment_score,
        sentiment_label: analysis.sentiment_label,
        emotions: analysis.emotions,
        recommendations: analysis.recommendations,
        ai_response: analysis.supportive_message,
      })
      .select()
      .single()

    if (sentimentError) {
      logger.apiError("POST", "/api/sentiment-analysis", sentimentError as Error, {
        userId: user.id,
        duration: Date.now() - startTime
      })
      return Response.json({ error: "Failed to store analysis" }, { status: 500 })
    }

    logger.info("Sentiment analysis completed successfully", {
      userId: user.id,
      analysisType,
      sentimentScore: analysis.sentiment_score,
      duration: Date.now() - startTime
    })
    return Response.json({
      success: true,
      analysis,
      sentimentId: sentimentData.id,
    })
  } catch (error) {
    logger.apiError("POST", "/api/sentiment-analysis", error as Error, { duration: Date.now() - startTime })
    return Response.json({ error: "Failed to analyze sentiment" }, { status: 500 })
  }
}

export const POST = withRateLimit(handleSentimentAnalysis, RATE_LIMITS.AUTHENTICATED)
