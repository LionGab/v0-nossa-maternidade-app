import { NextRequest, NextResponse } from "next/server"
import { rateLimit, RATE_LIMITS } from "./rate-limit"

// Re-export RATE_LIMITS for convenience
export { RATE_LIMITS }

/**
 * Wrapper para APIs com rate limiting e headers de segurança
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse | Response>,
  config = RATE_LIMITS.AUTHENTICATED
) {
  return async (request: NextRequest): Promise<NextResponse | Response> => {
    // Rate limiting
    const limiter = rateLimit(request, config)

    if (!limiter.allowed) {
      const response = NextResponse.json(
        {
          error: "Too Many Requests",
          message: "Você fez muitas requisições. Tente novamente em breve.",
          retryAfter: new Date(limiter.resetTime).toISOString(),
        },
        { status: 429 }
      )

      response.headers.set("X-RateLimit-Limit", config.maxRequests.toString())
      response.headers.set("X-RateLimit-Remaining", "0")
      response.headers.set("X-RateLimit-Reset", new Date(limiter.resetTime).toISOString())
      response.headers.set("Retry-After", Math.ceil((limiter.resetTime - Date.now()) / 1000).toString())

      return response
    }

    // Executar handler
    const response = await handler(request)

    // Adicionar headers de rate limit (apenas se for NextResponse)
    if (response instanceof NextResponse) {
      response.headers.set("X-RateLimit-Limit", config.maxRequests.toString())
      response.headers.set("X-RateLimit-Remaining", limiter.remaining.toString())
      response.headers.set("X-RateLimit-Reset", new Date(limiter.resetTime).toISOString())

      // Headers de segurança e CORS
      addSecurityHeaders(response)
    }

    return response
  }
}

/**
 * Adiciona headers de segurança e CORS
 */
function addSecurityHeaders(response: NextResponse) {
  // CORS
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  response.headers.set("Access-Control-Max-Age", "86400")

  // Segurança
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

/**
 * Handler para OPTIONS (CORS preflight)
 */
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 })
  addSecurityHeaders(response)
  return response
}

/**
 * Exemplo de uso:
 *
 * import { withRateLimit, OPTIONS, RATE_LIMITS } from '@/lib/api-utils'
 *
 * export { OPTIONS } // Para CORS preflight
 *
 * export const POST = withRateLimit(
 *   async (request) => {
 *     // Sua lógica aqui
 *     return NextResponse.json({ success: true })
 *   },
 *   RATE_LIMITS.HEAVY // Para APIs de IA
 * )
 */
