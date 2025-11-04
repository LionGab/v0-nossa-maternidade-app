/**
 * Cliente Grok (xAI) para pesquisa no X/Twitter
 * Modelo: grok-beta
 * Endpoint: https://api.x.ai/v1/chat/completions
 */

import { getApiKey, hasApiKey } from "@/lib/env"
import { logger } from "@/lib/logger"

export interface GrokMessage {
    role: "system" | "user" | "assistant"
    content: string
}

export interface GrokOptions {
    model?: string
    max_tokens?: number
    temperature?: number
    stream?: boolean
}

export interface GrokResponse {
    id: string
    object: string
    created: number
    model: string
    choices: Array<{
        index: number
        message: {
            role: string
            content: string
        }
        finish_reason: string | null
    }>
    usage?: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
    }
}

/**
 * Cliente Grok para interagir com a API do xAI
 */
export class GrokClient {
    private apiKey: string | null
    private baseUrl = "https://api.x.ai/v1"
    private defaultModel = "grok-beta"

    constructor() {
        this.apiKey = getApiKey("grok")
    }

    /**
     * Verifica se o cliente está disponível (API key configurada)
     */
    isAvailable(): boolean {
        return hasApiKey("grok")
    }

    /**
     * Faz uma chamada para a API do Grok
     */
    async chat(
        messages: GrokMessage[],
        options: GrokOptions = {}
    ): Promise<GrokResponse> {
        if (!this.isAvailable()) {
            throw new Error("Grok API key não configurada. Configure GROK_API_KEY.")
        }

        const startTime = Date.now()

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: options.model || this.defaultModel,
                    messages,
                    max_tokens: options.max_tokens || 1000,
                    temperature: options.temperature ?? 0.7,
                    stream: options.stream || false,
                }),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Grok API error: ${response.status} - ${errorText}`)
            }

            const data: GrokResponse = await response.json()

            logger.info("Grok API call successful", {
                model: data.model,
                tokens: data.usage?.total_tokens,
                duration: Date.now() - startTime,
            })

            return data
        } catch (error) {
            logger.error("Grok API call failed", error instanceof Error ? error : new Error(String(error)), { 
                duration: Date.now() - startTime,
             })
            throw error
        }
    }

    /**
     * Busca tendências e discussões no X/Twitter sobre um tópico
     */
    async searchTrends(topic: string, maxTokens: number = 1000): Promise<string> {
        const messages: GrokMessage[] = [
            {
                role: "system",
                content:
                    "Você é uma especialista em análise de tendências maternais no X/Twitter. Analise e resuma as discussões, opiniões e tendências recentes sobre maternidade, focando em insights práticos e relevantes para mães. Sempre cite quando possível as principais discussões e opiniões.",
            },
            {
                role: "user",
                content: `Analise as tendências e discussões recentes no X/Twitter sobre: ${topic}

Forneça:
1. Principais temas e discussões em destaque
2. Opiniões e sentimentos predominantes
3. Tendências emergentes
4. Insights práticos para mães
5. Recursos e contas relevantes mencionadas`,
            },
        ]

        const response = await this.chat(messages, {
            max_tokens: maxTokens,
            temperature: 0.7,
        })

        return response.choices[0]?.message?.content || "Nenhuma tendência encontrada"
    }

    /**
     * Faz uma pergunta geral ao Grok
     */
    async ask(question: string, context?: string): Promise<string> {
        const messages: GrokMessage[] = []

        if (context) {
            messages.push({
                role: "system",
                content: context,
            })
        }

        messages.push({
            role: "user",
            content: question,
        })

        const response = await this.chat(messages)

        return response.choices[0]?.message?.content || "Resposta não disponível"
    }

    /**
     * Estima o custo de uma chamada baseado em tokens
     */
    estimateCost(tokens: number): number {
        // Grok beta: ~$0.01 por 1K tokens (preço aproximado)
        // Ajustar conforme preço real da API
        const costPer1KTokens = 0.01
        return (tokens / 1000) * costPer1KTokens
    }
}

/**
 * Instância singleton do cliente Grok
 */
export const grokClient = new GrokClient()

