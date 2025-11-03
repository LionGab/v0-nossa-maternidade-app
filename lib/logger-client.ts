/**
 * Sistema de logging client-side
 * Versão simplificada do logger para uso em componentes React
 */

type LogLevel = "info" | "warn" | "error" | "debug"

// Declaração de tipo para Sentry no window (se instalado)
declare global {
  interface Window {
    Sentry?: {
      captureException: (error: Error, options?: { extra?: any }) => void
      captureMessage: (message: string, options?: { level?: string; extra?: any }) => void
    }
  }
}

interface LogContext {
  [key: string]: any
}

class ClientLogger {
  private isDevelopment = typeof window !== "undefined" && process.env.NODE_ENV === "development"

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` | ${JSON.stringify(context)}` : ""
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
  }

  info(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      const formatted = this.formatMessage("info", message, context)
      console.info(formatted)
    }
  }

  warn(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      const formatted = this.formatMessage("warn", message, context)
      console.warn(formatted)
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : error,
    }
    const formatted = this.formatMessage("error", message, errorContext)

    // Sempre logar erros (mesmo em produção) para debugging no browser
    console.error(formatted)

    // Em produção, enviar para Sentry se configurado
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "production" &&
      (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN)
    ) {
      try {
        // Sentry pode não estar instalado, verificar se existe
        if (window.Sentry) {
          if (error instanceof Error) {
            window.Sentry.captureException(error, { extra: context })
          } else {
            window.Sentry.captureMessage(message, {
              level: "error",
              extra: errorContext,
            })
          }
        }
      } catch (e) {
        // Sentry não disponível - ignorar silenciosamente
      }
    }
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      const formatted = this.formatMessage("debug", message, context)
      console.debug(formatted)
    }
  }
}

// Singleton instance para client-side
export const clientLogger = new ClientLogger()
