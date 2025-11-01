import { createClient } from "@/lib/supabase/server"
import { onboardingSchema } from "@/lib/validations/schemas"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validar dados de entrada
    const validationResult = onboardingSchema.safeParse(body)
    if (!validationResult.success) {
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
      console.error("Onboarding API: Database error", error)
      return Response.json({ error: "Failed to store responses", details: error.message }, { status: 500 })
    }

    return Response.json({ success: true, data })
  } catch (error) {
    console.error("Onboarding API: Unexpected error", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return Response.json({ error: "Failed to process onboarding", details: errorMessage }, { status: 500 })
  }
}
