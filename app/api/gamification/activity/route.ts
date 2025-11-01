import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { GamificationManager } from "@/lib/gamification/gamification-manager"
import { gamificationActivitySchema } from "@/lib/validations/schemas"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()

    // Validar dados de entrada
    const validationResult = gamificationActivitySchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validationResult.error.errors },
        { status: 400 },
      )
    }

    const { activityType, metadata } = validationResult.data

    const manager = new GamificationManager(supabase, user.id)
    const result = await manager.recordActivity(activityType, metadata)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Gamification Activity: Error", error)
    return NextResponse.json({ error: "Erro ao registrar atividade" }, { status: 500 })
  }
}
