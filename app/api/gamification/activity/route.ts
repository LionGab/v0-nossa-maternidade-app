import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { GamificationManager } from "@/lib/gamification/gamification-manager"

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

    const { activityType, metadata } = await request.json()

    if (!activityType) {
      return NextResponse.json({ error: "Tipo de atividade é obrigatório" }, { status: 400 })
    }

    const manager = new GamificationManager(supabase, user.id)
    const result = await manager.recordActivity(activityType, metadata)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error recording activity:", error)
    return NextResponse.json({ error: "Erro ao registrar atividade" }, { status: 500 })
  }
}
