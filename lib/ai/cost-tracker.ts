/**
 * Rastreamento de Custos Multi-IA
 * Monitora custos por provider
 * Alerta se ultrapassar budget
 */

import { createClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"
import type { Provider } from "@/lib/ai/router"

export interface CostRecord {
    id?: string
    provider: Provider
    date: string
    tokens_used: number
    cost_usd: number
    query_count: number
    created_at?: string
}

export interface CostSummary {
    provider: Provider
    total_cost_usd: number
    total_tokens: number
    query_count: number
    avg_cost_per_query: number
    daily_costs: Array<{ date: string; cost_usd: number }>
}

const DEFAULT_BUDGET_USD = 50.0 // Budget padrão: $50/mês

/**
 * Registra um custo de API
 */
export async function recordCost(
    provider: Provider,
    tokensUsed: number,
    costUsd: number,
    date?: Date
): Promise<boolean> {
    try {
        const recordDate = date || new Date()
        const dateString = recordDate.toISOString().split("T")[0] // YYYY-MM-DD

        const supabase = await createClient()

        // Verificar se já existe registro para este provider e data
        const { data: existing } = await supabase
            .from("ai_cost_tracking")
            .select("*")
            .eq("provider", provider)
            .eq("date", dateString)
            .single()

        if (existing) {
            // Atualizar registro existente
            const { error } = await supabase
                .from("ai_cost_tracking")
                .update({
                    tokens_used: existing.tokens_used + tokensUsed,
                    cost_usd: existing.cost_usd + costUsd,
                    query_count: existing.query_count + 1,
                })
                .eq("id", existing.id)

            if (error) {
                logger.error("Failed to update cost record", new Error(error.message), { 
                    provider,
                    date: dateString,
                 })
                return false
            }
        } else {
            // Criar novo registro
            const { error } = await supabase.from("ai_cost_tracking").insert({
                provider,
                date: dateString,
                tokens_used: tokensUsed,
                cost_usd: costUsd,
                query_count: 1,
            })

            if (error) {
                logger.error("Failed to record cost", new Error(error.message), { 
                    provider,
                    date: dateString,
                 })
                return false
            }
        }

        logger.info("Cost recorded", {
            provider,
            tokensUsed,
            costUsd,
            date: dateString,
        })

        // Verificar se ultrapassou budget
        await checkBudget()

        return true
    } catch (error) {
        logger.error("Error recording cost", error instanceof Error ? error : new Error(String(error)), { 
            provider,
         })
        return false
    }
}

/**
 * Verifica se o budget foi ultrapassado
 */
export async function checkBudget(budgetUsd: number = DEFAULT_BUDGET_USD): Promise<{
    exceeded: boolean
    currentCost: number
    budget: number
    percentage: number
}> {
    try {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        const summary = await getCostSummary(startOfMonth, endOfMonth)

        const totalCost = summary.reduce((sum, s) => sum + s.total_cost_usd, 0)
        const exceeded = totalCost > budgetUsd
        const percentage = Number(((totalCost / budgetUsd) * 100).toFixed(2))

        if (exceeded) {
            logger.warn("Budget exceeded", {
                budget: budgetUsd,
                currentCost: totalCost,
                percentage,
            })
        }

        return {
            exceeded,
            currentCost: totalCost,
            budget: budgetUsd,
            percentage,
        }
    } catch (error) {
        logger.error("Error checking budget", error instanceof Error ? error : new Error(String(error)), { 
         })
        return {
            exceeded: false,
            currentCost: 0,
            budget: budgetUsd,
            percentage: 0,
        }
    }
}

/**
 * Obtém resumo de custos por provider
 */
export async function getCostSummary(
    startDate?: Date,
    endDate?: Date
): Promise<CostSummary[]> {
    try {
        const supabase = await createClient()

        let query = supabase.from("ai_cost_tracking").select("*")

        if (startDate) {
            query = query.gte("date", startDate.toISOString().split("T")[0])
        }

        if (endDate) {
            query = query.lte("date", endDate.toISOString().split("T")[0])
        }

        const { data, error } = await query

        if (error) {
            logger.error("Failed to get cost summary", new Error(error.message), { 
             })
            return []
        }

        // Agrupar por provider
        const summaryByProvider = new Map<Provider, CostSummary>()

        for (const record of data || []) {
            const provider = record.provider as Provider

            if (!summaryByProvider.has(provider)) {
                summaryByProvider.set(provider, {
                    provider,
                    total_cost_usd: 0,
                    total_tokens: 0,
                    query_count: 0,
                    avg_cost_per_query: 0,
                    daily_costs: [],
                })
            }

            const summary = summaryByProvider.get(provider)!

            summary.total_cost_usd += record.cost_usd
            summary.total_tokens += record.tokens_used
            summary.query_count += record.query_count
            summary.daily_costs.push({
                date: record.date,
                cost_usd: record.cost_usd,
            })
        }

        // Calcular médias
        for (const summary of summaryByProvider.values()) {
            summary.avg_cost_per_query = Number(
                (summary.total_cost_usd / summary.query_count).toFixed(6)
            )
            summary.daily_costs.sort((a, b) => a.date.localeCompare(b.date))
        }

        return Array.from(summaryByProvider.values())
    } catch (error) {
        logger.error("Error getting cost summary", error instanceof Error ? error : new Error(String(error)), { 
         })
        return []
    }
}

/**
 * Obtém custos em tempo real (últimas 24 horas)
 */
export async function getRealtimeCosts(): Promise<Record<Provider, number>> {
    try {
        const now = new Date()
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

        const summary = await getCostSummary(yesterday, now)

        const realtimeCosts: Record<Provider, number> = {} as Record<Provider, number>

        for (const s of summary) {
            realtimeCosts[s.provider] = s.total_cost_usd
        }

        return realtimeCosts
    } catch (error) {
        logger.error("Error getting realtime costs", error instanceof Error ? error : new Error(String(error)), { 
         })
        return {} as Record<Provider, number>
    }
}

/**
 * Estima custo futuro baseado em tendências
 */
export async function estimateFutureCost(
    days: number = 30
): Promise<{ estimatedCost: number; confidence: number }> {
    try {
        const now = new Date()
        const last7Days = new Date(now.getTime() - 7 * 60 * 60 * 24 * 1000)

        const summary = await getCostSummary(last7Days, now)

        const totalCostLast7Days = summary.reduce(
            (sum, s) => sum + s.total_cost_usd,
            0
        )
        const avgDailyCost = totalCostLast7Days / 7
        const estimatedCost = avgDailyCost * days

        // Confidence baseada em quantidade de dados
        const totalQueries = summary.reduce((sum, s) => sum + s.query_count, 0)
        const confidence = Math.min(100, Math.max(50, (totalQueries / 100) * 100))

        return {
            estimatedCost: Number(estimatedCost.toFixed(2)),
            confidence: Number(confidence.toFixed(2)),
        }
    } catch (error) {
        logger.error("Error estimating future cost", error instanceof Error ? error : new Error(String(error)), { 
         })
        return {
            estimatedCost: 0,
            confidence: 0,
        }
    }
}

