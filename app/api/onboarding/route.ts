import { createClient } from "@/lib/supabase/server"
import { onboardingSchema } from "@/lib/validations/onboarding"
import { NextResponse } from "next/server"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate request body
    const validatedData = onboardingSchema.parse(body)

    // Update profile with onboarding data
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: validatedData.fullName,
        maternal_journey: validatedData.maternalJourney,
        gestation_week: validatedData.gestationWeek,
        interests: validatedData.interests,
        nath_content_preferences: validatedData.nathContentPreferences,
        recipe_preferences: validatedData.recipePreferences,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (profileError) {
      console.error("Onboarding API: Profile update error", profileError)
      return NextResponse.json({ error: "Failed to update profile", details: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Onboarding API: Unexpected error", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: "Failed to process onboarding", details: errorMessage }, { status: 500 })
  }
}
