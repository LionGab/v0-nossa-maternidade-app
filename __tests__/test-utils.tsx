/**
 * Utilitários de teste para React Testing Library
 */

import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'

// Você pode adicionar providers aqui se necessário
// Por exemplo, ThemeProvider, SupabaseProvider, etc.

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-exportar tudo
export * from '@testing-library/react'
export { customRender as render }

/**
 * Helpers úteis para testes
 */

/**
 * Mock de dados de usuário
 */
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
}

/**
 * Mock de perfil de usuário
 */
export const mockProfile = {
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  onboarding_completed: true,
}

/**
 * Mock de resposta de gamificação
 */
export const mockGamificationStats = {
  level: 5,
  points: 1500,
  current_streak: 7,
  total_achievements: 12,
  next_level_points: 2000,
}

/**
 * Aguardar próximo tick do event loop
 */
export const waitForNextTick = () =>
  new Promise((resolve) => setTimeout(resolve, 0))

/**
 * Mock de Supabase client
 */
export const createMockSupabaseClient = () => ({
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null,
    }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  })),
})
