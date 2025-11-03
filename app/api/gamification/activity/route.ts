import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { GamificationManager } from "@/lib/gamification/gamification-manager"
import { gamificationActivitySchema } from "@/lib/validations/schemas"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"

export { OPTIONS } // CORS preflight

async function handleActivityRecord(request: NextRequest) {
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

    logger.info("Gamification activity recorded", {
      userId: user.id,
      activityType,
      duration: Date.now() - startTime
    })
    return NextResponse.json(result)
  } catch (error) {
    logger.apiError("POST", "/api/gamification/activity", error as Error, { duration: Date.now() - startTime })
    return NextResponse.json({ error: "Erro ao registrar atividade" }, { status: 500 })
  }
}

export const POST = withRateLimit(handleActivityRecord, RATE_LIMITS.AUTHENTICATED)
