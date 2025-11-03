import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { onboardingSchema } from "@/lib/validations/schemas"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"

export { OPTIONS } // CORS preflight

async function onboardingHandler(req: NextRequest) {
  const startTime = Date.now()

  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      logger.warn("Unauthorized onboarding attempt")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validar dados de entrada
    const validationResult = onboardingSchema.safeParse(body)
    if (!validationResult.success) {
      logger.warn("Invalid onboarding data", { userId: user.id, errors: validationResult.error.errors })
      return Response.json(
        { error: "Invalid input data", details: validationResult.error.errors },
        { status: 400 },
      )
    }

    const responses = validationResult.data

    // Store onboarding responses
    const { data, error } = await supabase
      .from("onboarding_responses")
      .insert({
        user_id: user.id,
        emotional_state: responses.emotionalState,
        main_challenges: responses.mainChallenges || [],
        sleep_quality: responses.sleepQuality,
        self_care_frequency: responses.selfCareFrequency,
        baby_age_months: responses.babyAge,
        specific_needs: responses.specificNeeds || [],
      })
      .select()
      .single()

    if (error) {
      logger.apiError("POST", "/api/onboarding", error as Error, {
        userId: user.id,
        duration: Date.now() - startTime,
      })
      return Response.json({ error: "Failed to store responses", details: error.message }, { status: 500 })
    }

    // ⭐ Update profile to mark onboarding as completed
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ onboarding_completed: true })
      .eq("id", user.id)

    if (updateError) {
      logger.warn("Failed to update onboarding_completed flag", {
        userId: user.id,
        error: updateError.message,
      })
      // Don't fail the request - the responses are already saved
    }

    logger.info("Onboarding completed", { userId: user.id, duration: Date.now() - startTime })
    return Response.json({ success: true, data })
  } catch (error) {
    logger.apiError("POST", "/api/onboarding", error as Error, {
      duration: Date.now() - startTime,
    })
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return Response.json({ error: "Failed to process onboarding", details: errorMessage }, { status: 500 })
  }
}

export const POST = withRateLimit(onboardingHandler, RATE_LIMITS.AUTHENTICATED)
