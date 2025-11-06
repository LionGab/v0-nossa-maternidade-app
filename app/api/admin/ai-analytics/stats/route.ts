/**
 * API Admin - Stats de Performance
 * Retorna estatísticas de performance por provider
 */

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getPerformanceStats } from "@/lib/ai/analytics"
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
        // Por enquanto, permitir para todos os usuários autenticados

        const stats = await getPerformanceStats()

        return NextResponse.json({
            success: true,
            stats,
        })
    } catch (error) {
        logger.error(
            "Error getting performance stats",
            error instanceof Error ? error : new Error(String(error)),
            {
                message: error instanceof Error ? error.message : String(error),
            }
        )

        return NextResponse.json(
            {
                error: "Erro ao buscar estatísticas",
                message: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}

