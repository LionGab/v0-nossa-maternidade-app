import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@/lib/supabase/client'

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    getAll: vi.fn(() => []),
    setAll: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
  })),
}))

describe('Supabase Server Client', () => {
  it('should create server client successfully', async () => {
    const supabase = await createServerClient()
    
    expect(supabase).toBeDefined()
    expect(supabase.auth).toBeDefined()
    expect(supabase.from).toBeDefined()
  })

  it('should throw error if env vars missing', async () => {
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    await expect(createServerClient()).rejects.toThrow('Missing Supabase environment variables')
    
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey
  })

  it('should use @supabase/ssr package', async () => {
    const supabase = await createServerClient()
    
    // Check it's using the SSR package methods
    expect(supabase.auth.getUser).toBeDefined()
    expect(supabase.auth.getSession).toBeDefined()
  })
})

describe('Supabase Browser Client', () => {
  it('should create browser client successfully', () => {
    const supabase = createBrowserClient()
    
    expect(supabase).toBeDefined()
    expect(supabase.auth).toBeDefined()
    expect(supabase.from).toBeDefined()
  })

  it('should be a singleton', () => {
    const client1 = createBrowserClient()
    const client2 = createBrowserClient()
    
    expect(client1).toBe(client2)
  })

  it('should have auth state change listener', () => {
    const supabase = createBrowserClient()
    
    expect(supabase.auth.onAuthStateChange).toBeDefined()
  })
})

describe('Authentication Flow', () => {
  it('should handle user session', async () => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.auth.getUser()
    
    // In test env, user should be null
    expect(data.user).toBeNull()
    expect(error).toBeTruthy()
  })

  it('should handle sign in', async () => {
    const supabase = await createServerClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'test123456',
    })
    
    // Should fail in test env (no real Supabase)
    expect(error).toBeTruthy()
  })
})
