import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Configuração do Vitest para testes unitários
 *
 * Características:
 * - Suporte a React Testing Library
 * - Coverage com v8
 * - Path aliases (@/*)
 * - Setup automático
 */
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  test: {
    // Ambiente de teste
    environment: 'jsdom',

    // Arquivo de setup
    setupFiles: ['./vitest.setup.ts'],

    // Glob patterns para testes
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/e2e/**',
      '**/.next/**',
    ],

    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
        '**/e2e/**',
        '**/*.config.{js,ts,mjs}',
        '**/vitest.setup.ts',
        '**/__tests__/**',
        '**/*.d.ts',
        '**/components/ui/**', // Componentes shadcn/ui
      ],
      // Metas de cobertura
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },

    // Globals
    globals: true,

    // Timeout
    testTimeout: 10000,
    hookTimeout: 10000,

    // Reporters
    reporters: ['verbose', 'json'],
    outputFile: {
      json: './test-results.json',
    },

    // Cache (deprecated - removido para evitar warning)

    // Worker threads
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
