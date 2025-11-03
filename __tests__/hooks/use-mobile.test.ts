import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIsMobile } from '@/hooks/use-mobile'

describe('hooks/use-mobile', () => {
  let originalInnerWidth: number
  let originalAddEventListener: typeof window.addEventListener
  let originalRemoveEventListener: typeof window.removeEventListener

  beforeEach(() => {
    originalInnerWidth = window.innerWidth
    originalAddEventListener = window.addEventListener
    originalRemoveEventListener = window.removeEventListener
  })

  afterEach(() => {
    window.innerWidth = originalInnerWidth
    window.addEventListener = originalAddEventListener
    window.removeEventListener = originalRemoveEventListener
    vi.clearAllMocks()
  })

  it('deve retornar false para desktop', () => {
    // Simular largura de desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('deve retornar true para mobile', () => {
    // Simular largura de mobile (< 768px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('deve atualizar quando a largura muda', () => {
    const addEventListenerSpy = vi.fn()
    const removeEventListenerSpy = vi.fn()

    window.addEventListener = addEventListenerSpy
    window.removeEventListener = removeEventListenerSpy

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    const { result, unmount } = renderHook(() => useIsMobile())

    // Verificar que listener foi adicionado
    expect(addEventListenerSpy).toHaveBeenCalled()

    // Simular mudança para mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })

    // Disparar evento de mudança
    const changeHandler = addEventListenerSpy.mock.calls.find(
      (call) => call[0] === 'change',
    )?.[1]

    if (changeHandler) {
      changeHandler()
    }

    // Verificar que listener é removido ao desmontar
    unmount()
    expect(removeEventListenerSpy).toHaveBeenCalled()
  })

  it('deve lidar com breakpoint exato (767px)', () => {
    // 767px é menor que 768px, deve ser mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 767,
    })

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('deve lidar com breakpoint exato (768px)', () => {
    // 768px não é menor que 768px, deve ser desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    })

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })
})
