import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { GamificationManager } from "@/lib/gamification/gamification-manager"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"

export { OPTIONS } // CORS preflight

async function handleGetStats(req: NextRequest) {
  const startTime = Date.now()
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    try {
      const manager = new GamificationManager(supabase, user.id)
      const stats = await manager.getStats()
      logger.info("Gamification stats retrieved successfully", {
        userId: user.id,
        duration: Date.now() - startTime
      })
      return NextResponse.json(stats)
    } catch (managerError) {
      logger.debug("Gamification Stats: Manager error - returning defaults", {
        userId: user.id,
        error: managerError,
        duration: Date.now() - startTime
      })
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
    logger.apiError("GET", "/api/gamification/stats", error as Error, { duration: Date.now() - startTime })
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    return NextResponse.json({ error: "Erro ao buscar estatísticas", details: errorMessage }, { status: 500 })
  }
}

export const GET = withRateLimit(handleGetStats, RATE_LIMITS.AUTHENTICATED)
