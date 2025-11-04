/**
 * API de Tendências Maternais
 * Retorna notícias + tendências agregadas
 * Atualiza cache a cada 6 horas
 */

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { aggregateMaternalNews, clearExpiredNewsCache } from "@/lib/content/news-aggregator"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"

export { OPTIONS } // CORS preflight

async function handleMaternalTrends(req: NextRequest) {
    const startTime = Date.now()

    try {
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const body = await req.json().catch(() => ({}))
        const { query = "maternidade", category = "all" } = body

        // Limpar cache expirado (background)
        clearExpiredNewsCache().catch((err) => {
            logger.warn("Failed to clear expired news cache", {
                error: err instanceof Error ? err.message : String(err),
            })
        })

        // Agregar notícias
        const news = await aggregateMaternalNews(query)

        // Filtrar por categoria se especificado
        const filteredNews = category === "all"
            ? news
            : news.filter((n) => n.category === category)

        logger.info("Maternal trends fetched", {
            userId: user.id,
            query,
            category,
            newsCount: filteredNews.length,
            duration: Date.now() - startTime,
        })

        return NextResponse.json({
            success: true,
            news: filteredNews,
            query,
            category,
            count: filteredNews.length,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        logger.error(
            "Error fetching maternal trends",
            error instanceof Error ? error : new Error(String(error)),
            {
                message: error instanceof Error ? error.message : String(error),
                duration: Date.now() - startTime,
            }
        )

        return NextResponse.json(
            {
                error: "Erro ao buscar tendências",
                message: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}

export const POST = withRateLimit(handleMaternalTrends, RATE_LIMITS.HEAVY)
