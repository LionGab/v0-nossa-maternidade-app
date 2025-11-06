/**
 * Providers AI Centralizados
 * Inicialização única e centralizada de todos os providers de IA
 */

import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getApiKey, hasApiKey } from "@/lib/env"
import { logger } from "@/lib/logger"

// Singleton instances
let anthropicInstance: Anthropic | null = null
let openaiInstance: OpenAI | null = null
let geminiInstance: GoogleGenerativeAI | null = null

/**
 * Obtém instância do Anthropic Claude (singleton)
 */
export function getAnthropicClient(): Anthropic | null {
  if (anthropicInstance) {
    return anthropicInstance
  }

  if (hasApiKey("anthropic")) {
    try {
      anthropicInstance = new Anthropic({
        apiKey: getApiKey("anthropic")!,
      })
      logger.info("Anthropic Claude client initialized")
      return anthropicInstance
    } catch (error) {
      logger.error(
        "Failed to initialize Anthropic client",
        error instanceof Error ? error : new Error(String(error))
      )
      return null
    }
  }

  return null
}

/**
 * Obtém instância do OpenAI GPT-4 (singleton)
 */
export function getOpenAIClient(): OpenAI | null {
  if (openaiInstance) {
    return openaiInstance
  }

  if (hasApiKey("openai")) {
    try {
      openaiInstance = new OpenAI({
        apiKey: getApiKey("openai")!,
        timeout: 20000, // Timeout de 20 segundos
      })
      logger.info("OpenAI client initialized")
      return openaiInstance
    } catch (error) {
      logger.error(
        "Failed to initialize OpenAI client",
        error instanceof Error ? error : new Error(String(error))
      )
      return null
    }
  }

  return null
}

/**
 * Obtém instância do Google Gemini (singleton)
 */
export function getGeminiClient(): GoogleGenerativeAI | null {
  if (geminiInstance) {
    return geminiInstance
  }

  if (hasApiKey("google")) {
    try {
      geminiInstance = new GoogleGenerativeAI(getApiKey("google")!)
      logger.info("Google Gemini client initialized")
      return geminiInstance
    } catch (error) {
      logger.error(
        "Failed to initialize Gemini client",
        error instanceof Error ? error : new Error(String(error))
      )
      return null
    }
  }

  return null
}

/**
 * Verifica quais providers estão disponíveis
 */
export function getAvailableProviders(): {
  anthropic: boolean
  openai: boolean
  google: boolean
} {
  return {
    anthropic: hasApiKey("anthropic"),
    openai: hasApiKey("openai"),
    google: hasApiKey("google"),
  }
}

/**
 * Reinicializa todos os providers (útil para testes)
 */
export function resetProviders(): void {
  anthropicInstance = null
  openaiInstance = null
  geminiInstance = null
  logger.info("All AI providers reset")
}
