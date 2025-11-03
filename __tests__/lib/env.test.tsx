import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

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
    const { env } = require('@/lib/env')
    
    expect(env).toBeDefined()
    expect(env.supabase).toBeDefined()
    expect(env.ai).toBeDefined()
    expect(env.app).toBeDefined()
    expect(env.features).toBeDefined()
  })

  it('should have required Supabase config', () => {
    const { env } = require('@/lib/env')
    
    expect(env.supabase.url).toBeTruthy()
    expect(env.supabase.anonKey).toBeTruthy()
  })

  it('should handle missing optional configs', () => {
    const { hasApiKey } = require('@/lib/env')
    
    // These might be undefined in test env
    expect(typeof hasApiKey('anthropic')).toBe('boolean')
    expect(typeof hasApiKey('openai')).toBe('boolean')
    expect(typeof hasApiKey('google')).toBe('boolean')
  })
})

describe('Feature Flags', () => {
  it('should have feature flags configured', () => {
    const { env } = require('@/lib/env')
    
    expect(typeof env.features.aiEnabled).toBe('boolean')
    expect(typeof env.features.gamificationEnabled).toBe('boolean')
    expect(typeof env.features.analyticsEnabled).toBe('boolean')
  })
})
