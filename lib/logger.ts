/**
 * Sistema de logging estruturado para produção
 * Evita console.log e fornece níveis de log apropriados
 */

type LogLevel = "info" | "warn" | "error" | "debug"

interface LogContext {
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"

  /**
   * Serializa um objeto de forma segura, evitando referências circulares
   * e objetos não serializáveis
   */
  private safeStringify(obj: any): string {
    const seen = new WeakSet()
    return JSON.stringify(
      obj,
      (key, value) => {
        // Ignorar funções e símbolos
        if (typeof value === "function" || typeof value === "symbol") {
          return "[Function]"
        }
        // Detectar referências circulares
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return "[Circular]"
          }
          seen.add(value)
        }
        // Se for um Error, serializar apenas propriedades importantes
        if (value instanceof Error) {
          return {
            name: value.name,
            message: value.message,
            stack: value.stack,
          }
        }
        return value
      },
      2
    )
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    let contextStr = ""
    if (context) {
      try {
        contextStr = ` | ${this.safeStringify(context)}`
      } catch (error) {
        // Se ainda assim falhar, usar apenas a mensagem
        contextStr = ` | [Context serialization failed]`
      }
    }
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
  }

  info(message: string, context?: LogContext) {
    const formatted = this.formatMessage("info", message, context)
    if (this.isDevelopment) {
      console.info(formatted)
    }
    // Em produção, enviar para Sentry se configurado
    if (!this.isDevelopment && process.env.SENTRY_DSN) {
      try {
        // @ts-ignore - Sentry pode não estar instalado
        const Sentry = require("@sentry/nextjs")
        Sentry.captureMessage(message, {
          level: "info",
          extra: context,
        })
      } catch (e) {
        // Sentry não instalado ou erro - ignorar silenciosamente
      }
    }
  }

  warn(message: string, context?: LogContext) {
    const formatted = this.formatMessage("warn", message, context)
    if (this.isDevelopment) {
      console.warn(formatted)
    }
    // Em produção, enviar para Sentry se configurado
    if (!this.isDevelopment && process.env.SENTRY_DSN) {
      try {
        // @ts-ignore - Sentry pode não estar instalado
        const Sentry = require("@sentry/nextjs")
        Sentry.captureMessage(message, {
          level: "warning",
          extra: context,
        })
      } catch (e) {
        // Sentry não instalado ou erro - ignorar silenciosamente
      }
    }
  }

  error(message: string, error?: Error, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : undefined,
    }
    const formatted = this.formatMessage("error", message, errorContext)

    if (this.isDevelopment) {
      console.error(formatted)
    }

    // Em produção, enviar para Sentry se configurado
    if (!this.isDevelopment && process.env.SENTRY_DSN) {
      try {
        // @ts-ignore - Sentry pode não estar instalado
        const Sentry = require("@sentry/nextjs")
        if (error) {
          Sentry.captureException(error, {
            extra: { message, ...context },
          })
        } else {
          Sentry.captureMessage(message, {
            level: "error",
            extra: context,
          })
        }
      } catch (e) {
        // Sentry não instalado ou erro - ignorar silenciosamente
      }
    }
  }

  debug(message: string, context?: LogContext) {
    if (!this.isDevelopment) return

    const formatted = this.formatMessage("debug", message, context)
    console.debug(formatted)
  }

  /**
   * Helper para logar requisições de API
   */
  apiRequest(
    method: string,
    path: string,
    context?: LogContext & {
      userId?: string
      duration?: number
      statusCode?: number
    }
  ) {
    this.info(`API Request: ${method} ${path}`, context)
  }

  /**
   * Helper para logar erros de API
   */
  apiError(
    method: string,
    path: string,
    error: Error,
    context?: LogContext & {
      userId?: string
      statusCode?: number
    }
  ) {
    this.error(`API Error: ${method} ${path}`, error, context)
  }
}

// Singleton instance
export const logger = new Logger()

/**
 * Exemplo de uso:
 *
 * import { logger } from '@/lib/logger'
 *
 * // Info
 * logger.info('User logged in', { userId: '123' })
 *
 * // Error
 * try {
 *   // código
 * } catch (error) {
 *   logger.error('Failed to process request', error as Error, { userId: '123' })
 * }
 *
 * // API Request
 * logger.apiRequest('POST', '/api/chat', { userId: '123', duration: 245 })
 *
 * // API Error
 * logger.apiError('POST', '/api/chat', error as Error, { userId: '123', statusCode: 500 })
 */
