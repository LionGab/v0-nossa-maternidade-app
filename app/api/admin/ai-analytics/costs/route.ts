/**
 * API Admin - Custos
 * Retorna resumo de custos por provider
 */

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCostSummary } from "@/lib/ai/cost-tracker"
import { logger } from "@/lib/logger"

export async function GET() {
    try {
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        // TODO: Verificar se usuário é admin

        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        const costs = await getCostSummary(startOfMonth, now)

        return NextResponse.json({
            success: true,
            costs,
        })
    } catch (error) {
        logger.error(
            "Error getting cost summary",
            error instanceof Error ? error : new Error(String(error)),
            {
                message: error instanceof Error ? error.message : String(error),
            }
        )

        return NextResponse.json(
            {
                error: "Erro ao buscar custos",
                message: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}

