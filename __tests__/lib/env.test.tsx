import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'

// Configurar variáveis de ambiente ANTES de importar o módulo
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key-123456789'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.NODE_ENV = 'test'

// Importar DEPOIS de configurar variáveis de ambiente
import { hasApiKey, getEnvConfig } from '@/lib/env'

// Mock variáveis de ambiente para testes
beforeEach(() => {
  // Garantir que as variáveis estão configuradas em cada teste
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key-123456789'
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
  process.env.NODE_ENV = 'test'
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
}))

describe('Environment Configuration', () => {
  it('should load environment config', () => {
    const config = getEnvConfig()
    expect(config).toBeDefined()
    expect(config.supabase).toBeDefined()
    expect(config.ai).toBeDefined()
    expect(config.app).toBeDefined()
    expect(config.features).toBeDefined()
  })

  it('should have required Supabase config', () => {
    const config = getEnvConfig()
    expect(config.supabase.url).toBeTruthy()
    expect(config.supabase.anonKey).toBeTruthy()
  })

  it('should handle missing optional configs', () => {
    // Estas podem ser undefined no ambiente de teste
    expect(typeof hasApiKey('anthropic')).toBe('boolean')
    expect(typeof hasApiKey('openai')).toBe('boolean')
    expect(typeof hasApiKey('google')).toBe('boolean')
  })
})

describe('Feature Flags', () => {
  it('should have feature flags configured', () => {
    const config = getEnvConfig()
    expect(typeof config.features.aiEnabled).toBe('boolean')
    expect(typeof config.features.gamificationEnabled).toBe('boolean')
    expect(typeof config.features.analyticsEnabled).toBe('boolean')
  })
})
