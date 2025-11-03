import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('lib/utils', () => {
  describe('cn (className merge)', () => {
    it('deve mesclar classes do clsx', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('deve mesclar classes com tailwind-merge', () => {
      // tailwind-merge remove classes conflitantes
      expect(cn('p-2', 'p-4')).toBe('p-4')
    })

    it('deve lidar com valores condicionais', () => {
      expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar')
    })

    it('deve lidar com arrays', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar')
    })

    it('deve lidar com objetos condicionais', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
    })

    it('deve remover valores falsy', () => {
      expect(cn('foo', null, undefined, false, 'bar')).toBe('foo bar')
    })

    it('deve mesclar classes tailwind conflitantes', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
    })

    it('deve lidar com strings vazias', () => {
      expect(cn('', 'foo', '')).toBe('foo')
    })

    it('deve lidar com múltiplos tipos misturados', () => {
      expect(cn('foo', ['bar', 'baz'], { qux: true })).toBe('foo bar baz qux')
    })
  })
})
