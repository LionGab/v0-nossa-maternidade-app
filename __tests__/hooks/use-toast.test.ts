import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useToast, toast } from '@/hooks/use-toast'

describe('hooks/use-toast', () => {
  beforeEach(() => {
    // Limpar state antes de cada teste
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllTimers()
  })

  describe('useToast', () => {
    it('deve retornar state inicial vazio', () => {
      const { result } = renderHook(() => useToast())

      expect(result.current.toasts).toEqual([])
    })

    it('deve atualizar state quando toast é adicionado', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        toast({
          title: 'Teste',
          description: 'Descrição do teste',
        })
      })

      expect(result.current.toasts.length).toBe(1)
      expect(result.current.toasts[0].title).toBe('Teste')
    })

    it('deve permitir dismiss de toast', () => {
      const { result } = renderHook(() => useToast())

      let toastId: string

      act(() => {
        const toastResult = toast({
          title: 'Teste',
        })
        toastId = toastResult.id
      })

      expect(result.current.toasts.length).toBe(1)

      act(() => {
        result.current.dismiss(toastId)
      })

      // Toast deve estar marcado como não aberto
      const dismissedToast = result.current.toasts.find((t) => t.id === toastId)
      expect(dismissedToast?.open).toBe(false)
    })

    it('deve permitir dismiss de todos os toasts', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        toast({ title: 'Toast 1' })
        toast({ title: 'Toast 2' })
      })

      expect(result.current.toasts.length).toBe(2)

      act(() => {
        result.current.dismiss()
      })

      // Todos os toasts devem estar fechados
      result.current.toasts.forEach((t) => {
        expect(t.open).toBe(false)
      })
    })
  })

  describe('toast function', () => {
    it('deve criar toast com id único', () => {
      const toast1 = toast({ title: 'Teste 1' })
      const toast2 = toast({ title: 'Teste 2' })

      expect(toast1.id).not.toBe(toast2.id)
    })

    it('deve criar toast aberto por padrão', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        toast({ title: 'Teste' })
      })

      expect(result.current.toasts[0].open).toBe(true)
    })

    it('deve permitir atualizar toast', () => {
      const { result } = renderHook(() => useToast())

      let toastResult: ReturnType<typeof toast>

      act(() => {
        toastResult = toast({
          title: 'Título original',
        })
      })

      act(() => {
        toastResult.update({
          title: 'Título atualizado',
        })
      })

      const updatedToast = result.current.toasts.find(
        (t) => t.id === toastResult.id,
      )
      expect(updatedToast?.title).toBe('Título atualizado')
    })

    it('deve limitar número de toasts', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        // Criar mais toasts que o limite (1)
        for (let i = 0; i < 5; i++) {
          toast({ title: `Toast ${i}` })
        }
      })

      // Deve ter apenas 1 toast (limite)
      expect(result.current.toasts.length).toBe(1)
    })

    it('deve permitir dismiss via função retornada', () => {
      const { result } = renderHook(() => useToast())

      let toastResult: ReturnType<typeof toast>

      act(() => {
        toastResult = toast({ title: 'Teste' })
      })

      expect(result.current.toasts[0].open).toBe(true)

      act(() => {
        toastResult.dismiss()
      })

      const dismissedToast = result.current.toasts.find(
        (t) => t.id === toastResult.id,
      )
      expect(dismissedToast?.open).toBe(false)
    })

    it('deve chamar onOpenChange quando toast é fechado', () => {
      const onOpenChangeSpy = vi.fn()

      act(() => {
        toast({
          title: 'Teste',
          onOpenChange: onOpenChangeSpy,
        })
      })

      // Simular fechamento
      act(() => {
        const { result } = renderHook(() => useToast())
        result.current.dismiss()
      })

      // onOpenChange deve ser chamado com false
      expect(onOpenChangeSpy).toHaveBeenCalledWith(false)
    })
  })
})
