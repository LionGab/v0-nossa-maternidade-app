/**
 * Sistema de Agregação de Notícias Maternais
 * Combina Perplexity (notícias científicas/médicas) e Grok (tendências X/Twitter)
 */

import { getApiKey, hasApiKey } from "@/lib/env"
import { logger } from "@/lib/logger"
import { grokClient } from "@/lib/ai/providers/grok"
import { createClient } from "@/lib/supabase/server"

export interface MaternalNews {
    id?: string
    title: string
    summary: string
    category: "scientific" | "trends" | "health" | "general"
    source: "perplexity" | "grok" | "combined"
    url?: string
    published_at?: string
    relevance_score: number
    created_at?: string
}

const CACHE_TTL_HOURS = 6 // Cache válido por 6 horas

/**
 * Busca notícias científicas via Perplexity
 */
async function searchScientificNews(query: string): Promise<MaternalNews[]> {
    if (!hasApiKey("perplexity")) {
        logger.warn("Perplexity API key not configured")
        return []
    }

    try {
        const response = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getApiKey("perplexity")}`,
            },
            body: JSON.stringify({
                model: "llama-3.1-sonar-large-128k-online",
                messages: [
                    {
                        role: "system",
                        content:
                            "Você é uma curadora de notícias científicas sobre maternidade. Forneça notícias recentes, relevantes e baseadas em evidências. Sempre cite fontes confiáveis.",
                    },
                    {
                        role: "user",
                        content: `Busque as 5 notícias científicas mais recentes e relevantes sobre: ${query}

Para cada notícia, forneça:
- Título claro e informativo
- Resumo de 2-3 frases
- URL da fonte (se disponível)
- Data de publicação (se disponível)

Retorne em formato JSON array:
[{
  "title": "string",
  "summary": "string",
  "url": "string",
  "published_at": "ISO date string"
}]`,
                    },
                ],
                max_tokens: 2000,
                temperature: 0.7,
            }),
        })

        if (!response.ok) {
            throw new Error(`Perplexity API error: ${response.status}`)
        }

        const data = await response.json()
        const content = data.choices[0]?.message?.content || "[]"

        // Extrair JSON da resposta
        const jsonMatch = content.match(/\[[\s\S]*\]/)
        const articles = jsonMatch ? JSON.parse(jsonMatch[0]) : []

        return articles.map((article: any) => ({
            title: article.title || "",
            summary: article.summary || "",
            category: "scientific" as const,
            source: "perplexity" as const,
            url: article.url,
            published_at: article.published_at,
            relevance_score: 0.8, // Notícias científicas têm alta relevância
        }))
    } catch (error) {
        logger.error("Error searching scientific news", error instanceof Error ? error : new Error(String(error)), { 
            query,
         })
        return []
    }
}

/**
 * Busca tendências via Grok (X/Twitter)
 */
async function searchTrendingTopics(query: string): Promise<MaternalNews[]> {
    if (!hasApiKey("grok") || !grokClient.isAvailable()) {
        logger.warn("Grok API key not configured")
        return []
    }

    try {
        const trends = await grokClient.searchTrends(query, 1000)

        // Parsear tendências em formato de notícias
        const newsItems: MaternalNews[] = [
            {
                title: `Tendências sobre ${query}`,
                summary: trends.substring(0, 200) + "...",
                category: "trends" as const,
                source: "grok" as const,
                relevance_score: 0.7,
            },
        ]

        return newsItems
    } catch (error) {
        logger.error("Error searching trending topics", error instanceof Error ? error : new Error(String(error)), { 
            query,
         })
        return []
    }
}

/**
 * Agrega notícias de múltiplas fontes
 */
export async function aggregateMaternalNews(
    query: string = "maternidade"
): Promise<MaternalNews[]> {
    try {
        // Verificar cache primeiro
        const cached = await getCachedNews(query)
        if (cached && cached.length > 0) {
            logger.info("Using cached news", { query, count: cached.length })
            return cached
        }

        // Buscar de múltiplas fontes em paralelo
        const [scientificNews, trendingTopics] = await Promise.all([
            searchScientificNews(query),
            searchTrendingTopics(query),
        ])

        // Combinar e filtrar
        const allNews = [...scientificNews, ...trendingTopics]

        // Ordenar por relevância
        allNews.sort((a, b) => b.relevance_score - a.relevance_score)

        // Limitar a 10 notícias mais relevantes
        const topNews = allNews.slice(0, 10)

        // Salvar em cache
        await cacheNews(query, topNews)

        logger.info("Maternal news aggregated", {
            query,
            scientific: scientificNews.length,
            trends: trendingTopics.length,
            total: topNews.length,
        })

        return topNews
    } catch (error) {
        logger.error("Error aggregating maternal news", error instanceof Error ? error : new Error(String(error)), { 
            query,
         })
        return []
    }
}

/**
 * Obtém notícias do cache
 */
async function getCachedNews(query: string): Promise<MaternalNews[] | null> {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from("maternal_news_cache")
            .select("*")
            .eq("query", query)
            .gt("expires_at", new Date().toISOString())
            .order("created_at", { ascending: false })
            .limit(1)
            .single()

        if (error || !data) {
            return null
        }

        return data.news || []
    } catch (error) {
        logger.error("Error getting cached news", error instanceof Error ? error : new Error(String(error)), { 
            query,
         })
        return null
    }
}

/**
 * Salva notícias em cache
 */
async function cacheNews(
    query: string,
    news: MaternalNews[]
): Promise<boolean> {
    try {
        const supabase = await createClient()

        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + CACHE_TTL_HOURS)

        const { error } = await supabase.from("maternal_news_cache").upsert({
            query,
            news,
            expires_at: expiresAt.toISOString(),
            created_at: new Date().toISOString(),
        })

        if (error) {
            logger.error("Failed to cache news", new Error(error.message), { 
                query,
             })
            return false
        }

        return true
    } catch (error) {
        logger.error("Error caching news", error instanceof Error ? error : new Error(String(error)), { 
            query,
         })
        return false
    }
}

/**
 * Limpa cache expirado
 */
export async function clearExpiredNewsCache(): Promise<number> {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from("maternal_news_cache")
            .delete()
            .lt("expires_at", new Date().toISOString())
            .select()

        if (error) {
            logger.error("Failed to clear expired news cache", new Error(error.message), { 
             })
            return 0
        }

        return data?.length || 0
    } catch (error) {
        logger.error("Error clearing expired news cache", error instanceof Error ? error : new Error(String(error)), { 
         })
        return 0
    }
}

