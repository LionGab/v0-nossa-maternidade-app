/**
 * API Smart Chat com Roteamento Inteligente Multi-IA
 * Detecta tipo de pergunta e escolhe a melhor IA automaticamente
 */

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { routeQuery, getFallbackProvider, logRoutingDecision, type Provider } from "@/lib/ai/router"
import { getCachedResponse, setCachedResponse } from "@/lib/ai/cache"
import { recordPerformanceMetric } from "@/lib/ai/analytics"
import { recordCost } from "@/lib/ai/cost-tracker"
import { isFeatureEnabled } from "@/lib/feature-flags"
import { grokClient } from "@/lib/ai/providers/grok"
import { geminiProClient } from "@/lib/ai/providers/gemini-pro"
import { getApiKey, hasApiKey } from "@/lib/env"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"
import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"
import { GoogleGenerativeAI } from "@google/generative-ai"

export { OPTIONS } // CORS preflight

// Inicialização condicional das APIs
let anthropic: Anthropic | null = null
let openai: OpenAI | null = null
let genAI: GoogleGenerativeAI | null = null

if (hasApiKey("anthropic")) {
    anthropic = new Anthropic({
        apiKey: getApiKey("anthropic")!,
    })
}

if (hasApiKey("openai")) {
    openai = new OpenAI({
        apiKey: getApiKey("openai")!,
        timeout: 20000,
    })
}

if (hasApiKey("google")) {
    genAI = new GoogleGenerativeAI(getApiKey("google")!)
}

interface SmartChatRequest {
    messages: Array<{ role: "user" | "assistant"; content: string }>
    preferredMode?: "auto" | "empathetic" | "technical" | "research" | "trends"
    userId: string
}

async function handleSmartChat(req: NextRequest) {
    const startTime = Date.now()
    let metricId: string | null = null

    try {
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const body: SmartChatRequest = await req.json()

        if (!body.messages || body.messages.length === 0) {
            return NextResponse.json(
                { error: "Messages are required" },
                { status: 400 }
            )
        }

        const lastMessage = body.messages[body.messages.length - 1]
        const userMessage = lastMessage.content

        // Verificar feature flags
        const smartRoutingEnabled = await isFeatureEnabled(user.id, "smart_routing")
        const preferredMode = body.preferredMode || (smartRoutingEnabled ? "auto" : undefined)

        // Roteamento inteligente
        let routingDecision

        if (preferredMode === "auto" || !preferredMode) {
            routingDecision = routeQuery(userMessage, body.messages.length)
            logRoutingDecision(routingDecision, user.id, userMessage.length)
        } else {
            // Modo preferido manual
            const modeToProvider: Record<string, Provider> = {
                empathetic: "claude",
                technical: "gpt4",
                research: "perplexity",
                trends: "grok",
            }

            // Mapear Provider para nome de API key
            const providerToApiKey: Record<Provider, 'anthropic' | 'openai' | 'google' | 'perplexity' | 'grok'> = {
                claude: "anthropic",
                gpt4: "openai",
                gemini: "google",
                grok: "grok",
                perplexity: "perplexity",
            }

            const selectedProvider = modeToProvider[preferredMode] || "gpt4"
            routingDecision = {
                provider: selectedProvider,
                queryType: preferredMode as any,
                reason: `Modo preferido: ${preferredMode}`,
                available: hasApiKey(providerToApiKey[selectedProvider]),
            }
        }

        // Verificar se provider está disponível, senão usar fallback
        let provider = routingDecision.provider
        if (!routingDecision.available) {
            const fallback = getFallbackProvider(routingDecision.provider)
            if (fallback) {
                provider = fallback
                routingDecision.provider = fallback
                routingDecision.reason = `Fallback para ${fallback} (${routingDecision.reason})`
            } else {
                return NextResponse.json(
                    {
                        error: "Nenhum provider disponível",
                        message: "Configure pelo menos uma API key.",
                    },
                    { status: 503 }
                )
            }
        }

        // Verificar cache primeiro
        const cached = await getCachedResponse(userMessage, provider)
        if (cached) {
            logger.info("Cache hit", {
                userId: user.id,
                provider,
                queryType: routingDecision.queryType,
            })

            return NextResponse.json({
                success: true,
                answer: cached.response,
                provider,
                queryType: routingDecision.queryType,
                cached: true,
                metadata: {
                    reason: routingDecision.reason,
                    tokens: cached.tokens_used,
                    cost: cached.cost_usd,
                },
            })
        }

        // Chamar provider apropriado
        let answer = ""
        let tokensUsed = 0
        let costUsd = 0
        const responseStartTime = Date.now()

        switch (provider) {
            case "claude":
                if (!anthropic) {
                    throw new Error("Claude API não configurada")
                }

                const claudeResponse = await anthropic.messages.create({
                    model: "claude-3-5-haiku-20241022",
                    max_tokens: 800,
                    system: `Você é NathAI, assistente maternal especializada. Seja empática, acolhedora e baseie suas respostas em evidências científicas.`,
                    messages: body.messages.map((msg) => ({
                        role: msg.role as "user" | "assistant",
                        content: msg.content,
                    })),
                })

                answer = claudeResponse.content[0]?.type === "text" ? claudeResponse.content[0].text : ""
                tokensUsed = (claudeResponse.usage?.input_tokens || 0) + (claudeResponse.usage?.output_tokens || 0)
                costUsd = (tokensUsed / 1000) * 0.00025 // Claude Haiku: ~$0.25 por 1M tokens
                break

            case "gpt4":
                if (!openai) {
                    throw new Error("OpenAI API não configurada")
                }

                const gptResponse = await openai.chat.completions.create({
                    model: "gpt-4-turbo-preview",
                    messages: body.messages.map((msg) => ({
                        role: msg.role as "user" | "assistant",
                        content: msg.content,
                    })),
                    temperature: 0.7,
                    max_tokens: 800,
                })

                answer = gptResponse.choices[0]?.message?.content || ""
                tokensUsed = (gptResponse.usage?.prompt_tokens || 0) + (gptResponse.usage?.completion_tokens || 0)
                costUsd = (tokensUsed / 1000) * 0.01 // GPT-4 Turbo: ~$10 por 1M tokens
                break

            case "gemini":
                if (!geminiProClient.isAvailable()) {
                    throw new Error("Gemini API não configurada")
                }

                const geminiResponse = await geminiProClient.chat(
                    body.messages.map((msg) => ({
                        role: msg.role as "user" | "model",
                        content: msg.content,
                    }))
                )

                answer = geminiResponse.text
                tokensUsed = geminiResponse.usage?.totalTokenCount || 0
                costUsd = geminiProClient.estimateCost(tokensUsed)
                break

            case "grok":
                if (!grokClient.isAvailable()) {
                    throw new Error("Grok API não configurada")
                }

                const grokResponse = await grokClient.ask(userMessage)
                answer = grokResponse
                tokensUsed = 1000 // Estimativa
                costUsd = grokClient.estimateCost(tokensUsed)
                break

            case "perplexity":
                if (!hasApiKey("perplexity")) {
                    throw new Error("Perplexity API não configurada")
                }

                const perplexityResponse = await fetch("https://api.perplexity.ai/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getApiKey("perplexity")}`,
                    },
                    body: JSON.stringify({
                        model: "llama-3.1-sonar-large-128k-online",
                        messages: body.messages.map((msg) => ({
                            role: msg.role,
                            content: msg.content,
                        })),
                    }),
                })

                const perplexityData = await perplexityResponse.json()
                answer = perplexityData.choices[0]?.message?.content || ""
                tokensUsed = perplexityData.usage?.total_tokens || 0
                costUsd = (tokensUsed / 1000) * 0.0007 // Perplexity: ~$0.70 por 1M tokens
                break

            default:
                throw new Error(`Provider desconhecido: ${provider}`)
        }

        const responseTime = Date.now() - responseStartTime

        // Salvar em cache
        await setCachedResponse(userMessage, provider, answer, tokensUsed, costUsd)

        // Registrar métrica de performance
        metricId = await recordPerformanceMetric({
            user_id: user.id,
            provider,
            query_type: routingDecision.queryType,
            response_time_ms: responseTime,
            tokens_used: tokensUsed,
            estimated_cost_usd: costUsd,
        })

        // Registrar custo
        await recordCost(provider, tokensUsed, costUsd)

        logger.info("Smart chat completed", {
            userId: user.id,
            provider,
            queryType: routingDecision.queryType,
            responseTime,
            tokensUsed,
            costUsd,
            totalTime: Date.now() - startTime,
        })

        return NextResponse.json({
            success: true,
            answer,
            provider,
            queryType: routingDecision.queryType,
            cached: false,
            metadata: {
                reason: routingDecision.reason,
                responseTime,
                tokens: tokensUsed,
                cost: costUsd,
                metricId,
            },
        })
    } catch (error) {
        logger.error(
            "Smart chat error",
            error instanceof Error ? error : new Error(String(error)),
            {
                message: error instanceof Error ? error.message : String(error),
                duration: Date.now() - startTime,
            }
        )

        return NextResponse.json(
            {
                error: "Erro ao processar chat",
                message: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}

export const POST = withRateLimit(handleSmartChat, RATE_LIMITS.HEAVY)

