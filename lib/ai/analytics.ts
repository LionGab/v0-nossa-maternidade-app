/**
 * Analytics de Performance Multi-IA
 * Registra métricas de uso, performance e custos de cada provider
 */

import { createClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"
import type { Provider, QueryType } from "@/lib/ai/router"

export interface PerformanceMetric {
    id?: string
    user_id: string
    provider: Provider
    query_type: QueryType
    response_time_ms: number
    tokens_used?: number
    estimated_cost_usd?: number
    user_rating?: number | null
    user_comment?: string | null
    created_at?: string
}

export interface PerformanceStats {
    provider: Provider
    total_queries: number
    avg_response_time_ms: number
    total_tokens: number
    total_cost_usd: number
    avg_rating: number | null
    success_rate: number
}

/**
 * Registra uma métrica de performance
 */
export async function recordPerformanceMetric(
    metric: Omit<PerformanceMetric, "id" | "created_at">
): Promise<string | null> {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from("ai_performance_metrics")
            .insert({
                user_id: metric.user_id,
                provider: metric.provider,
                query_type: metric.query_type,
                response_time_ms: metric.response_time_ms,
                tokens_used: metric.tokens_used || null,
                estimated_cost_usd: metric.estimated_cost_usd || null,
                user_rating: metric.user_rating || null,
                user_comment: metric.user_comment || null,
            })
            .select("id")
            .single()

        if (error) {
            logger.error(
                "Failed to record performance metric",
                error instanceof Error ? error : new Error(String(error)),
                {
                    metric,
                }
            )
            return null
        }

        logger.info("Performance metric recorded", {
            metricId: data.id,
            provider: metric.provider,
            queryType: metric.query_type,
        })

        return data.id
    } catch (error) {
        logger.error(
            "Error recording performance metric",
            error instanceof Error ? error : new Error(String(error)),
            {
                metric,
            }
        )
        return null
    }
}

/**
 * Registra feedback do usuário (rating + comentário)
 */
export async function recordUserFeedback(
    metricId: string,
    rating: number,
    comment?: string
): Promise<boolean> {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from("ai_performance_metrics")
            .update({
                user_rating: rating,
                user_comment: comment || null,
            })
            .eq("id", metricId)

        if (error) {
            logger.error(
                "Failed to record user feedback",
                new Error(error.message),
                {
                    metricId,
                }
            )
            return false
        }

        logger.info("User feedback recorded", {
            metricId,
            rating,
        })

        return true
    } catch (error) {
        logger.error(
            "Error recording user feedback",
            error instanceof Error ? error : new Error(String(error)),
            {
                metricId,
            }
        )
        return false
    }
}

/**
 * Obtém estatísticas de performance por provider
 */
export async function getPerformanceStats(
    provider?: Provider,
    startDate?: Date,
    endDate?: Date
): Promise<PerformanceStats[]> {
    try {
        const supabase = await createClient()

        let query = supabase
            .from("ai_performance_metrics")
            .select("*")

        if (provider) {
            query = query.eq("provider", provider)
        }

        if (startDate) {
            query = query.gte("created_at", startDate.toISOString())
        }

        if (endDate) {
            query = query.lte("created_at", endDate.toISOString())
        }

        const { data, error } = await query

        if (error) {
            logger.error(
                "Failed to get performance stats",
                new Error(error.message),
                {}
            )
            return []
        }

        // Agrupar por provider e calcular estatísticas
        const statsByProvider = new Map<Provider, PerformanceStats>()

        for (const metric of data || []) {
            const provider = metric.provider as Provider

            if (!statsByProvider.has(provider)) {
                statsByProvider.set(provider, {
                    provider,
                    total_queries: 0,
                    avg_response_time_ms: 0,
                    total_tokens: 0,
                    total_cost_usd: 0,
                    avg_rating: null,
                    success_rate: 0,
                })
            }

            const stats = statsByProvider.get(provider)!

            stats.total_queries++
            stats.avg_response_time_ms += metric.response_time_ms
            stats.total_tokens += metric.tokens_used || 0
            stats.total_cost_usd += metric.estimated_cost_usd || 0

            if (metric.user_rating) {
                if (stats.avg_rating === null) {
                    stats.avg_rating = 0
                }
                stats.avg_rating += metric.user_rating
            }
        }

        // Calcular médias
        for (const stats of statsByProvider.values()) {
            stats.avg_response_time_ms = Math.round(
                stats.avg_response_time_ms / stats.total_queries
            )

            if (stats.avg_rating !== null) {
                const ratingsCount = data?.filter(
                    (m) => m.provider === stats.provider && m.user_rating
                ).length || 0

                if (ratingsCount > 0) {
                    stats.avg_rating = Number((stats.avg_rating / ratingsCount).toFixed(2))
                }
            }

            // Calcular taxa de sucesso (queries sem erro)
            const successfulQueries = data?.filter(
                (m) => m.provider === stats.provider && m.response_time_ms > 0
            ).length || 0

            stats.success_rate = Number(
                ((successfulQueries / stats.total_queries) * 100).toFixed(2)
            )
        }

        return Array.from(statsByProvider.values())
    } catch (error) {
        logger.error(
            "Error getting performance stats",
            error instanceof Error ? error : new Error(String(error)),
            {}
        )
        return []
    }
}

/**
 * Compara performance entre providers
 */
export async function compareProviders(
    providers: Provider[],
    startDate?: Date,
    endDate?: Date
): Promise<Record<Provider, PerformanceStats | null>> {
    const allStats = await getPerformanceStats(undefined, startDate, endDate)

    const comparison: Record<Provider, PerformanceStats | null> = {} as Record<
        Provider,
        PerformanceStats | null
    >

    for (const provider of providers) {
        comparison[provider] =
            allStats.find((s) => s.provider === provider) || null
    }

    return comparison
}

/**
 * Obtém métricas de um usuário específico
 */
export async function getUserMetrics(
    userId: string,
    limit: number = 50
): Promise<PerformanceMetric[]> {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from("ai_performance_metrics")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(limit)

        if (error) {
            logger.error(
                "Failed to get user metrics",
                new Error(error.message),
                { userId }
            )
            return []
        }

        return (data || []) as PerformanceMetric[]
    } catch (error) {
        logger.error(
            "Error getting user metrics",
            error instanceof Error ? error : new Error(String(error)),
            { userId }
        )
        return []
    }
}
