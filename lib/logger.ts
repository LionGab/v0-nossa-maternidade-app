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

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` | ${JSON.stringify(context)}` : ""
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
  }

  info(message: string, context?: LogContext) {
    const formatted = this.formatMessage("info", message, context)
    // Em produção, pode enviar para serviço de logging (ex: Sentry, LogRocket)
    if (this.isDevelopment) {
      console.info(formatted)
    }
    // TODO: Enviar para serviço de logging em produção
  }

  warn(message: string, context?: LogContext) {
    const formatted = this.formatMessage("warn", message, context)
    if (this.isDevelopment) {
      console.warn(formatted)
    }
    // TODO: Enviar para serviço de logging em produção
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

    // TODO: Enviar para Sentry ou serviço de error tracking em produção
    // if (process.env.SENTRY_DSN) {
    //   Sentry.captureException(error, { extra: context })
    // }
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
