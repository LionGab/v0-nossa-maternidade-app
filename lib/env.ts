/**
 * Environment Variables Validation
 * Valida e exporta variáveis de ambiente com tipos seguros
 */

import { logger } from './logger'

// Tipo para o ambiente validado
export type EnvConfig = {
  supabase: {
    url: string
    anonKey: string
    serviceRoleKey?: string
  }
  ai: {
    anthropic?: string
    openai?: string
    google?: string
  }
  app: {
    url: string
    nodeEnv: string
  }
  features: {
    aiEnabled: boolean
    gamificationEnabled: boolean
    analyticsEnabled: boolean
  }
}

// Variáveis obrigatórias
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const

// Variáveis opcionais (para funcionalidades específicas)
const OPTIONAL_ENV_VARS = [
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY',
  'GOOGLE_AI_API_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const

/**
 * Valida se todas as variáveis obrigatórias estão presentes
 */
function validateRequiredEnvVars(): string[] {
  const missing: string[] = []

  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      missing.push(varName)
    }
  }

  return missing
}

/**
 * Verifica quais variáveis opcionais estão faltando
 */
function checkOptionalEnvVars(): string[] {
  const missing: string[] = []

  for (const varName of OPTIONAL_ENV_VARS) {
    if (!process.env[varName]) {
      missing.push(varName)
    }
  }

  return missing
}

/**
 * Obtém a configuração do ambiente com validação
 */
export function getEnvConfig(): EnvConfig {
  const missingRequired = validateRequiredEnvVars()

  if (missingRequired.length > 0) {
    logger.warn('Missing required environment variables', {
      missing: missingRequired,
    })
    logger.warn('Some features may not work correctly')
  }

  const missingOptional = checkOptionalEnvVars()
  if (missingOptional.length > 0 && process.env.NODE_ENV === 'development') {
    logger.info('Optional environment variables not configured', {
      missing: missingOptional,
    })
  }

  return {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    ai: {
      anthropic: process.env.ANTHROPIC_API_KEY,
      openai: process.env.OPENAI_API_KEY,
      google: process.env.GOOGLE_AI_API_KEY,
    },
    app: {
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      nodeEnv: process.env.NODE_ENV || 'development',
    },
    features: {
      aiEnabled: process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES !== 'false',
      gamificationEnabled: process.env.NEXT_PUBLIC_ENABLE_GAMIFICATION !== 'false',
      analyticsEnabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    },
  }
}

/**
 * Verifica se uma API key específica está disponível
 */
export function hasApiKey(service: 'anthropic' | 'openai' | 'google'): boolean {
  const config = getEnvConfig()
  return !!config.ai[service]
}

/**
 * Obtém uma API key com fallback seguro
 */
export function getApiKey(service: 'anthropic' | 'openai' | 'google'): string | null {
  const config = getEnvConfig()
  return config.ai[service] || null
}

/**
 * Verifica se o ambiente está configurado para produção
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Verifica se o ambiente está configurado para desenvolvimento
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

// Exporta a configuração carregada
export const env = getEnvConfig()

// Log de inicialização apenas em desenvolvimento
if (isDevelopment()) {
  logger.info('Environment configuration loaded', {
    supabase: env.supabase.url ? 'configured' : 'missing',
    anthropic: env.ai.anthropic ? 'configured' : 'missing',
    openai: env.ai.openai ? 'configured' : 'missing',
    features: {
      ai: env.features.aiEnabled,
      gamification: env.features.gamificationEnabled,
      analytics: env.features.analyticsEnabled,
    },
  })
}
