import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  console.log("[v0] Onboarding API: Request received")

  try {
    const responses = await req.json()
    console.log("[v0] Onboarding API: Parsed request body", responses)

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] Onboarding API: Auth check", { hasUser: !!user, authError: authError?.message })

    if (authError || !user) {
      console.error("[v0] Onboarding API: Unauthorized", authError)
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!responses.emotionalState || !responses.babyAge) {
      console.error("[v0] Onboarding API: Missing required fields")
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Onboarding API: Inserting onboarding responses for user", user.id)

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
      console.error("[v0] Onboarding API: Database error", error)
      return Response.json({ error: "Failed to store responses", details: error.message }, { status: 500 })
    }

    console.log("[v0] Onboarding API: Successfully stored responses", data)
    return Response.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Onboarding API: Unexpected error", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return Response.json({ error: "Failed to process onboarding", details: errorMessage }, { status: 500 })
  }
}
