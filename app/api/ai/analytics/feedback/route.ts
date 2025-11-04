/**
 * API - Feedback de Respostas
 * Registra feedback do usuário (rating + comentário)
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { recordUserFeedback } from "@/lib/ai/analytics"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"

export { OPTIONS } // CORS preflight

async function handleFeedback(req: NextRequest) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const body = await req.json()
        const { metricId, rating, comment } = body

        if (!metricId || !rating) {
            return NextResponse.json(
                { error: "metricId e rating são obrigatórios" },
                { status: 400 }
            )
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating deve ser entre 1 e 5" },
                { status: 400 }
            )
        }

        const success = await recordUserFeedback(metricId, rating, comment)

        if (!success) {
            return NextResponse.json(
                { error: "Erro ao registrar feedback" },
                { status: 500 }
            )
        }

        logger.info("User feedback recorded", {
            userId: user.id,
            metricId,
            rating,
        })

        return NextResponse.json({
            success: true,
            message: "Feedback registrado com sucesso",
        })
    } catch (error) {
        logger.error(
            "Error recording feedback",
            error instanceof Error ? error : new Error(String(error)),
            {
                message: error instanceof Error ? error.message : String(error),
            }
        )

        return NextResponse.json(
            {
                error: "Erro ao registrar feedback",
                message: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}

export const POST = withRateLimit(handleFeedback, RATE_LIMITS.AUTHENTICATED)

