/**
 * Sistema de Roteamento Inteligente Multi-IA
 * Detecta tipo de pergunta e escolhe a melhor IA para responder
 */

import { hasApiKey } from "@/lib/env"
import { logger } from "@/lib/logger"

export type QueryType =
    | "empathetic"      // Perguntas emocionais/sensíveis → Claude
    | "general"         // Perguntas gerais sobre maternidade → GPT-4
    | "contextual"      // Análise de contexto longo → Gemini 2.5 Pro
    | "trends"          // Tendências no X/Twitter → Grok
    | "research"        // Pesquisa científica/médica → Perplexity

export type Provider =
    | "claude"
    | "gpt4"
    | "gemini"
    | "grok"
    | "perplexity"

export interface RoutingDecision {
    provider: Provider
    queryType: QueryType
    reason: string
    available: boolean
}

/**
 * Detecta palavras-chave que indicam tipo de pergunta emocional/empática
 */
function detectEmpatheticQuery(message: string): boolean {
    const empatheticKeywords = [
        "ansiosa", "ansiedade", "deprimida", "depressão", "triste", "tristeza",
        "cansaço", "cansada", "exausta", "sozinha", "medo", "preocupada",
        "nervosa", "estressada", "sobrecarregada", "culpa", "frustrada",
        "desanimada", "isolada", "abandonada", "confusa", "desesperada",
        "não aguento mais", "socorro", "ajuda", "apoio", "sentimentos",
        "como me sinto", "me ajuda", "preciso de ajuda", "não sei o que fazer"
    ]

    const lowerMessage = message.toLowerCase()
    return empatheticKeywords.some(keyword => lowerMessage.includes(keyword))
}

/**
 * Detecta se a pergunta é sobre tendências/opiniões/popularidade
 */
function detectTrendsQuery(message: string): boolean {
    const trendsKeywords = [
        "tendências", "tendencia", "está na moda", "popular", "todo mundo",
        "redes sociais", "twitter", "instagram", "opiniões", "discussões",
        "o que estão falando", "está bombando", "viral", "meme",
        "comunidade", "grupos", "debates", "polêmica"
    ]

    const lowerMessage = message.toLowerCase()
    return trendsKeywords.some(keyword => lowerMessage.includes(keyword))
}

/**
 * Detecta se a pergunta requer pesquisa científica/médica
 */
function detectResearchQuery(message: string): boolean {
    const researchKeywords = [
        "pesquisa", "estudo", "científico", "evidências", "comprovado",
        "estatísticas", "dados", "médico", "pediatra", "especialista",
        "recomendação médica", "OMS", "OMS recomenda", "pesquisa mostra",
        "baseado em", "fundamento científico", "literatura", "artigos"
    ]

    const lowerMessage = message.toLowerCase()
    return researchKeywords.some(keyword => lowerMessage.includes(keyword))
}

/**
 * Detecta se a pergunta requer análise de contexto longo
 */
function detectContextualQuery(message: string, messageHistoryLength: number): boolean {
    const contextualKeywords = [
        "histórico", "últimas semanas", "desde que", "evolução",
        "mudou", "melhorou", "piorou", "antes e depois", "comparar",
        "padrão", "tendência", "trajetória", "jornada", "progresso"
    ]

    const lowerMessage = message.toLowerCase()
    const hasContextualKeywords = contextualKeywords.some(keyword => lowerMessage.includes(keyword))

    // Se tem histórico grande E keywords contextuais, usar Gemini
    return hasContextualKeywords && messageHistoryLength > 10
}

/**
 * Roteia a pergunta para a melhor IA disponível
 */
export function routeQuery(
    message: string,
    messageHistoryLength: number = 0
): RoutingDecision {
    // Prioridade: Emocional → Research → Trends → Contextual → Geral

    if (detectEmpatheticQuery(message)) {
        return {
            provider: "claude",
            queryType: "empathetic",
            reason: "Pergunta emocional detectada - Claude é melhor para suporte empático",
            available: hasApiKey("anthropic"),
        }
    }

    if (detectResearchQuery(message)) {
        return {
            provider: "perplexity",
            queryType: "research",
            reason: "Pergunta de pesquisa científica detectada - Perplexity tem acesso a fontes atualizadas",
            available: hasApiKey("perplexity"),
        }
    }

    if (detectTrendsQuery(message)) {
        return {
            provider: "grok",
            queryType: "trends",
            reason: "Pergunta sobre tendências detectada - Grok acessa X/Twitter em tempo real",
            available: hasApiKey("grok"),
        }
    }

    if (detectContextualQuery(message, messageHistoryLength)) {
        return {
            provider: "gemini",
            queryType: "contextual",
            reason: "Análise de contexto longo necessária - Gemini 2.5 Pro tem 2M tokens de contexto",
            available: hasApiKey("google"),
        }
    }

    // Default: GPT-4 para perguntas gerais
    return {
        provider: "gpt4",
        queryType: "general",
        reason: "Pergunta geral sobre maternidade - GPT-4 é eficiente e equilibrado",
        available: hasApiKey("openai"),
    }
}

/**
 * Obtém fallback se o provider escolhido não estiver disponível
 */
export function getFallbackProvider(originalProvider: Provider): Provider | null {
    const fallbacks: Record<Provider, Provider[]> = {
        claude: ["gpt4", "gemini"],
        gpt4: ["claude", "gemini"],
        gemini: ["gpt4", "claude"],
        grok: ["perplexity", "gpt4"],
        perplexity: ["gpt4", "claude"],
    }

    const apiKeyMap: Record<Provider, string> = {
        claude: "anthropic",
        gpt4: "openai",
        gemini: "google",
        grok: "grok",
        perplexity: "perplexity",
    }

    const availableFallbacks = fallbacks[originalProvider] || []

    for (const fallback of availableFallbacks) {
        const apiKeyName = apiKeyMap[fallback]
        if (apiKeyName && hasApiKey(apiKeyName as any)) {
            logger.info("Using fallback provider", {
                original: originalProvider,
                fallback,
            })
            return fallback
        }
    }

    return null
}

/**
 * Loga a decisão de roteamento para analytics
 */
export function logRoutingDecision(
    decision: RoutingDecision,
    userId: string,
    messageLength: number
): void {
    logger.info("Query routed", {
        userId,
        provider: decision.provider,
        queryType: decision.queryType,
        reason: decision.reason,
        available: decision.available,
        messageLength,
    })
}
