import { OPTIONS, RATE_LIMITS, withRateLimit } from "@/lib/api-utils"
import { getApiKey, hasApiKey } from "@/lib/env"
import { logger } from "@/lib/logger"
import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export { OPTIONS }; // CORS preflight

async function handleGrokTrends(req: NextRequest) {
    const startTime = Date.now()
    try {
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const { query } = await req.json()

        if (!query || typeof query !== "string" || query.trim().length === 0) {
            return NextResponse.json({ error: "Query is required" }, { status: 400 })
        }

        if (!hasApiKey('grok')) {
            return NextResponse.json(
                {
                    error: "Grok trends não disponível",
                    message: "Configure GROK_API_KEY para habilitar esta funcionalidade."
                },
                { status: 503 }
            )
        }

        // Usar Grok (xAI) para pesquisar tendências no X/Twitter
        const response = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getApiKey('grok')}`,
            },
            body: JSON.stringify({
                model: "grok-beta",
                messages: [
                    {
                        role: "system",
                        content:
                            "Você é uma especialista em análise de tendências maternais no X/Twitter. Analise e resuma as discussões, opiniões e tendências recentes sobre maternidade, focando em insights práticos e relevantes para mães. Sempre cite quando possível as principais discussões e opiniões.",
                    },
                    {
                        role: "user",
                        content: `Analise as tendências e discussões recentes no X/Twitter sobre: ${query}

Forneça:
1. Principais temas e discussões em destaque
2. Opiniões e sentimentos predominantes
3. Tendências emergentes
4. Insights práticos para mães
5. Recursos e contas relevantes mencionadas`,
                    },
                ],
                max_tokens: 1000,
                temperature: 0.7,
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            const error = new Error(`Grok API error: ${response.status} - ${errorText}`)
            logger.apiError("POST", "/api/multi-ai/grok-trends", error, {
                status: response.status,
                userId: user.id,
            })
            throw error
        }

        const data = await response.json()

        logger.info("Grok trends completed successfully", {
            userId: user.id,
            queryLength: query.length,
            duration: Date.now() - startTime
        })

        return NextResponse.json({
            success: true,
            answer: data.choices[0]?.message?.content || "Nenhuma tendência encontrada",
            model: "grok-beta",
            sources: "X/Twitter",
        })
    } catch (error) {
        logger.apiError("POST", "/api/multi-ai/grok-trends", error as Error, { duration: Date.now() - startTime })
        return NextResponse.json({ error: "Erro ao buscar tendências" }, { status: 500 })
    }
}

export const POST = withRateLimit(handleGrokTrends, RATE_LIMITS.HEAVY)
