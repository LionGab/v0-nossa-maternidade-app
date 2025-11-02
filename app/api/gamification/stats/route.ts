import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { GamificationManager } from "@/lib/gamification/gamification-manager"

export async function GET() {

  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] Gamification Stats: Unauthorized", authError)
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }


    try {
      const manager = new GamificationManager(supabase, user.id)
      const stats = await manager.getStats()
      return NextResponse.json(stats)
    } catch (managerError) {
      console.error("[v0] Gamification Stats: Manager error", managerError)
      // Return default stats if manager fails
      return NextResponse.json({
        level: 1,
        points: 0,
        streak: 0,
        achievements: [],
        challenges: [],
      })
    }
  } catch (error) {
    console.error("[v0] Gamification Stats: Unexpected error", error)
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    return NextResponse.json({ error: "Erro ao buscar estatísticas", details: errorMessage }, { status: 500 })
  }
}
