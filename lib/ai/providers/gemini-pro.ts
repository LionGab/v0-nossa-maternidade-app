/**
 * Cliente Gemini 2.5 Pro com contexto estendido
 * Modelo: gemini-2.5-pro (2M tokens de contexto)
 * Uso: análise de histórico completo de conversas
 */

import { GoogleGenerativeAI } from "@google/generative-ai"
import { getApiKey, hasApiKey } from "@/lib/env"
import { logger } from "@/lib/logger"

export interface GeminiMessage {
    role: "user" | "model"
    parts: string | Array<{ text: string }>
}

export interface GeminiOptions {
    model?: string
    maxOutputTokens?: number
    temperature?: number
    topP?: number
    topK?: number
}

export interface GeminiResponse {
    text: string
    usage?: {
        promptTokenCount?: number
        candidatesTokenCount?: number
        totalTokenCount?: number
    }
}

/**
 * Cliente Gemini 2.5 Pro para análise de contexto longo
 */
export class GeminiProClient {
    private genAI: GoogleGenerativeAI | null = null
    private defaultModel = "gemini-2.5-pro"

    constructor() {
        const apiKey = getApiKey("google")
        if (apiKey) {
            try {
                this.genAI = new GoogleGenerativeAI(apiKey)
            } catch (error) {
                logger.error("Failed to initialize Gemini client", error instanceof Error ? error : new Error(String(error)), {
                 })
            }
        }
    }

    /**
     * Verifica se o cliente está disponível (API key configurada)
     */
    isAvailable(): boolean {
        return hasApiKey("google") && this.genAI !== null
    }

    /**
     * Faz uma chamada para a API do Gemini
     */
    async chat(
        messages: Array<{ role: "user" | "model"; content: string }>,
        options: GeminiOptions = {}
    ): Promise<GeminiResponse> {
        if (!this.isAvailable()) {
            throw new Error(
                "Gemini API key não configurada. Configure GOOGLE_AI_API_KEY."
            )
        }

        const startTime = Date.now()

        try {
            const model = this.genAI!.getGenerativeModel({
                model: options.model || this.defaultModel,
                generationConfig: {
                    maxOutputTokens: options.maxOutputTokens || 8192,
                    temperature: options.temperature ?? 0.7,
                    topP: options.topP ?? 0.95,
                    topK: options.topK ?? 40,
                },
            })

            // Converter mensagens para o formato do Gemini
            const history = messages.slice(0, -1).map((msg) => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }],
            }))

            const lastMessage = messages[messages.length - 1]

            const chat = model.startChat({
                history: history.length > 0 ? history : undefined,
            })

            const result = await chat.sendMessage(lastMessage.content)
            const response = await result.response

            const text = response.text()

            logger.info("Gemini API call successful", {
                model: options.model || this.defaultModel,
                duration: Date.now() - startTime,
            })

            return {
                text,
                usage: {
                    promptTokenCount: response.usageMetadata?.promptTokenCount,
                    candidatesTokenCount: response.usageMetadata?.candidatesTokenCount,
                    totalTokenCount: response.usageMetadata?.totalTokenCount,
                },
            }
        } catch (error) {
            logger.error("Gemini API call failed", error instanceof Error ? error : new Error(String(error)), {
                duration: Date.now() - startTime,
             })
            throw error
        }
    }

    /**
     * Analisa contexto longo (histórico completo de conversas)
     */
    async analyzeLongContext(
        context: string,
        question: string,
        maxTokens: number = 8192
    ): Promise<string> {
        const systemPrompt = `Você é uma especialista em análise de contexto materno. Analise o histórico completo de conversas e forneça insights profundos e personalizados.

Contexto:
${context}

Questão: ${question}

Forneça uma análise detalhada considerando:
1. Padrões e tendências no histórico
2. Evolução emocional e comportamental
3. Insights personalizados baseados no contexto completo
4. Recomendações específicas baseadas na jornada completa`

        const messages = [
            {
                role: "user" as const,
                content: systemPrompt,
            },
        ]

        const response = await this.chat(messages, {
            maxOutputTokens: maxTokens,
            temperature: 0.7,
        })

        return response.text
    }

    /**
     * Resume um histórico longo de mensagens
     */
    async summarizeHistory(
        messages: Array<{ role: string; content: string }>,
        maxTokens: number = 4096
    ): Promise<string> {
        const historyText = messages
            .map((msg) => `${msg.role}: ${msg.content}`)
            .join("\n\n")

        const prompt = `Resuma este histórico de conversas sobre maternidade, destacando:
1. Principais temas discutidos
2. Evolução emocional e comportamental
3. Padrões importantes
4. Pontos-chave para acompanhamento

Histórico:
${historyText}`

        const response = await this.chat(
            [
                {
                    role: "user" as const,
                    content: prompt,
                },
            ],
            {
                maxOutputTokens: maxTokens,
                temperature: 0.5,
            }
        )

        return response.text
    }

    /**
     * Estima o custo de uma chamada baseado em tokens
     */
    estimateCost(tokens: number): number {
        // Gemini 2.5 Pro: ~$0.075 por 1M tokens input, ~$0.30 por 1M tokens output
        // Média: ~$0.10 por 1K tokens (preço aproximado)
        // Ajustar conforme preço real da API
        const costPer1KTokens = 0.10
        return (tokens / 1000) * costPer1KTokens
    }
}

/**
 * Instância singleton do cliente Gemini Pro
 */
export const geminiProClient = new GeminiProClient()
