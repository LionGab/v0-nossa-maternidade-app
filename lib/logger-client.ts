/**
 * Sistema de logging client-side
 * Versão simplificada do logger para uso em componentes React
 */

type LogLevel = "info" | "warn" | "error" | "debug"

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

    // TODO: Em produção, enviar para serviço de error tracking
    // if (typeof window !== "undefined" && window.Sentry) {
    //   window.Sentry.captureException(error, { extra: context })
    // }
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
