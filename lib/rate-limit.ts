import { NextRequest, NextResponse } from "next/server"

interface RateLimitConfig {
  windowMs: number // Janela de tempo em milissegundos
  maxRequests: number // Número máximo de requisições na janela
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60000, // 1 minuto
  maxRequests: 100, // 100 requisições por minuto
}

// Armazena requisições em memória (usar Redis ou Upstash em produção)
const requestStore = new Map<string, { count: number; resetTime: number }>()

// Limpa entradas expiradas a cada 5 minutos
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of requestStore.entries()) {
    if (now > value.resetTime) {
      requestStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Rate limiter simples em memória
 * Para produção, use Upstash Redis ou similar
 */
export function rateLimit(request: NextRequest, config = DEFAULT_CONFIG): {
  allowed: boolean
  remaining: number
  resetTime: number
} {
  const identifier = getIdentifier(request)
  const now = Date.now()

  const current = requestStore.get(identifier)

  // Se não há registro ou a janela expirou, criar novo
  if (!current || now > current.resetTime) {
    requestStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    })

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    }
  }

  // Verificar se excedeu o limite
  if (current.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime,
    }
  }

  // Incrementar contador
  current.count++
  requestStore.set(identifier, current)

  return {
    allowed: true,
    remaining: config.maxRequests - current.count,
    resetTime: current.resetTime,
  }
}

/**
 * Middleware de rate limiting para usar em rotas de API
 */
export function createRateLimiter(config = DEFAULT_CONFIG) {
  return async (request: NextRequest) => {
    const result = rateLimit(request, config)

    const response = result.allowed
      ? NextResponse.next()
      : new NextResponse(
          JSON.stringify({
            error: "Too many requests",
            message: "Você fez muitas requisições. Tente novamente em breve.",
          }),
          { status: 429 },
        )

    // Adicionar headers de rate limit
    response.headers.set("X-RateLimit-Limit", config.maxRequests.toString())
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString())
    response.headers.set("X-RateLimit-Reset", new Date(result.resetTime).toISOString())

    return response
  }
}

/**
 * Função auxiliar para obter identificador único da requisição
 */
function getIdentifier(request: NextRequest): string {
  // Tentar obter IP do usuário
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"

  // Para autenticados, usar user_id (melhor granularidade)
  const authHeader = request.headers.get("authorization")
  if (authHeader) {
    // Em produção, extrair user_id do token JWT
    return `user:${ip}`
  }

  return `ip:${ip}`
}

/**
 * Configurações de rate limit específicas por tipo de rota
 */
export const RATE_LIMITS = {
  // APIs públicas (mais restritivas)
  PUBLIC: {
    windowMs: 60000, // 1 minuto
    maxRequests: 30, // 30 requisições por minuto
  },
  // APIs autenticadas (mais permissivas)
  AUTHENTICATED: {
    windowMs: 60000, // 1 minuto
    maxRequests: 200, // 200 requisições por minuto
  },
  // APIs pesadas (IA, processamento)
  HEAVY: {
    windowMs: 60000, // 1 minuto
    maxRequests: 10, // 10 requisições por minuto
  },
  // Busca e listagens
  SEARCH: {
    windowMs: 60000, // 1 minuto
    maxRequests: 100, // 100 requisições por minuto
  },
}

/**
 * Exemplo de uso em uma rota de API:
 * 
 * export async function POST(request: NextRequest) {
 *   const rateLimiter = createRateLimiter(RATE_LIMITS.AUTHENTICATED)
 *   const response = await rateLimiter(request)
 *   if (response.status === 429) return response
 *   
 *   // ... resto do código da API
 * }
 */

