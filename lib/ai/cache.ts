/**
 * Cache Inteligente de Respostas
 * Evita chamadas repetidas de API
 * Economiza custo e melhora latência
 */

import { createClient } from "@/lib/supabase/server"
import { createHash } from "crypto"
import { logger } from "@/lib/logger"
import type { Provider } from "@/lib/ai/router"

export interface CachedResponse {
    id: string
    query_hash: string
    provider: Provider
    query: string
    response: string
    tokens_used?: number
    cost_usd?: number
    created_at: string
    expires_at: string
}

const CACHE_TTL_HOURS = 24 // Cache válido por 24 horas
const CACHE_PREFIX = "ai_response_"

/**
 * Gera hash de uma query para usar como chave de cache
 */
function generateQueryHash(query: string, provider: Provider): string {
    const normalizedQuery = query.toLowerCase().trim()
    const hashInput = `${provider}:${normalizedQuery}`
    return createHash("sha256").update(hashInput).digest("hex")
}

/**
 * Verifica se uma resposta está em cache
 */
export async function getCachedResponse(
    query: string,
    provider: Provider
): Promise<CachedResponse | null> {
    try {
        const queryHash = generateQueryHash(query, provider)

        const supabase = await createClient()

        const { data, error } = await supabase
            .from("ai_response_cache")
            .select("*")
            .eq("query_hash", queryHash)
            .eq("provider", provider)
            .gt("expires_at", new Date().toISOString())
            .order("created_at", { ascending: false })
            .limit(1)
            .single()

        if (error) {
            // Se não encontrou, não é erro - apenas cache miss
            if (error.code === "PGRST116") {
                return null
            }

            logger.error("Failed to get cached response", new Error(error.message), { 
                queryHash,
             })
            return null
        }

        logger.info("Cache hit", {
            queryHash,
            provider,
        })

        return data as CachedResponse
    } catch (error) {
        logger.error("Error getting cached response", error instanceof Error ? error : new Error(String(error)), { 
            query,
            provider,
         })
        return null
    }
}

/**
 * Armazena uma resposta em cache
 */
export async function setCachedResponse(
    query: string,
    provider: Provider,
    response: string,
    tokensUsed?: number,
    costUsd?: number
): Promise<boolean> {
    try {
        const queryHash = generateQueryHash(query, provider)

        const now = new Date()
        const expiresAt = new Date(now.getTime() + CACHE_TTL_HOURS * 60 * 60 * 1000)

        const supabase = await createClient()

        const { error } = await supabase.from("ai_response_cache").insert({
            query_hash: queryHash,
            provider,
            query,
            response,
            tokens_used: tokensUsed || null,
            cost_usd: costUsd || null,
            created_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
        })

        if (error) {
            logger.error("Failed to cache response", new Error(error.message), { 
                queryHash,
             })
            return false
        }

        logger.info("Response cached", {
            queryHash,
            provider,
            expiresAt: expiresAt.toISOString(),
        })

        return true
    } catch (error) {
        logger.error("Error caching response", error instanceof Error ? error : new Error(String(error)), { 
            query,
            provider,
         })
        return false
    }
}

/**
 * Limpa cache expirado
 */
export async function clearExpiredCache(): Promise<number> {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from("ai_response_cache")
            .delete()
            .lt("expires_at", new Date().toISOString())
            .select()

        if (error) {
            logger.error("Failed to clear expired cache", new Error(error.message), { 
             })
            return 0
        }

        const deletedCount = data?.length || 0

        logger.info("Expired cache cleared", {
            deletedCount,
        })

        return deletedCount
    } catch (error) {
        logger.error("Error clearing expired cache", error instanceof Error ? error : new Error(String(error)), { 
         })
        return 0
    }
}

/**
 * Limpa todo o cache de um provider
 */
export async function clearProviderCache(provider: Provider): Promise<boolean> {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from("ai_response_cache")
            .delete()
            .eq("provider", provider)

        if (error) {
            logger.error("Failed to clear provider cache", new Error(error.message), { 
                provider,
             })
            return false
        }

        logger.info("Provider cache cleared", {
            provider,
        })

        return true
    } catch (error) {
        logger.error("Error clearing provider cache", error instanceof Error ? error : new Error(String(error)), { 
            provider,
         })
        return false
    }
}

/**
 * Obtém estatísticas do cache
 */
export async function getCacheStats(): Promise<{
    total_entries: number
    total_size_mb: number
    by_provider: Record<Provider, number>
}> {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from("ai_response_cache")
            .select("provider, response")

        if (error) {
            logger.error("Failed to get cache stats", new Error(error.message), { 
             })
            return {
                total_entries: 0,
                total_size_mb: 0,
                by_provider: {} as Record<Provider, number>,
            }
        }

        const byProvider: Record<Provider, number> = {} as Record<Provider, number>
        let totalSize = 0

        for (const entry of data || []) {
            const provider = entry.provider as Provider
            byProvider[provider] = (byProvider[provider] || 0) + 1
            totalSize += new Blob([entry.response]).size
        }

        return {
            total_entries: data?.length || 0,
            total_size_mb: Number((totalSize / (1024 * 1024)).toFixed(2)),
            by_provider: byProvider,
        }
    } catch (error) {
        logger.error("Error getting cache stats", error instanceof Error ? error : new Error(String(error)), { 
         })
        return {
            total_entries: 0,
            total_size_mb: 0,
            by_provider: {} as Record<Provider, number>,
        }
    }
}

