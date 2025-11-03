import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { useGamification, useProfile } from '@/hooks/use-data'

// Mock do fetch global
global.fetch = vi.fn()

// Mock do Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
          },
        },
        error: null,
      }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: 'test-user-id',
          email: 'test@example.com',
          full_name: 'Test User',
        },
        error: null,
      }),
    })),
  })),
}))

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
)

describe('hooks/use-data', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useGamification', () => {
    it('deve buscar stats de gamificação', async () => {
      const mockStats = {
        level: 5,
        points: 1500,
        current_streak: 7,
        total_achievements: 12,
        next_level_points: 2000,
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      })

      const { result } = renderHook(() => useGamification(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.stats).toEqual(mockStats)
      expect(result.current.isError).toBeUndefined()
    })

    it('deve lidar com erro na requisição', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useGamification(), { wrapper })

      await waitFor(() => {
        expect(result.current.isError).toBeDefined()
      })

      expect(result.current.stats).toBeUndefined()
    })

    it('deve retornar loading enquanto busca', () => {
      ;(global.fetch as any).mockImplementation(() => new Promise(() => {}))

      const { result } = renderHook(() => useGamification(), { wrapper })

      expect(result.current.isLoading).toBe(true)
    })
  })

  describe('useProfile', () => {
    it('deve buscar perfil do usuário', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.profile).toBeDefined()
      expect(result.current.profile?.email).toBe('test@example.com')
    })

    it('deve retornar null se usuário não estiver autenticado', async () => {
      const { createClient } = await import('@/lib/supabase/client')
      const mockClient = createClient as any

      mockClient.mockReturnValueOnce({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: null,
          }),
        },
      })

      const { result } = renderHook(() => useProfile(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.profile).toBeNull()
    })
  })
})
