import { defineConfig, devices } from '@playwright/test'

/**
 * Configuração do Playwright para testes E2E
 *
 * Problemas identificados na auditoria:
 * - Configuração estava vazia (problema #21)
 * - Falta de testes E2E adequados
 */
export default defineConfig({
  // Diretório onde estão os testes
  testDir: './e2e',

  // Executar testes em paralelo quando possível
  fullyParallel: true,

  // Proibir .only() em CI
  forbidOnly: !!process.env.CI,

  // Retries em CI para lidar com flakiness
  retries: process.env.CI ? 2 : 0,

  // Workers em CI
  workers: process.env.CI ? 1 : undefined,

  // Reporters
  reporter: [
    ['html'],
    ['list'],
    process.env.CI ? ['github'] : ['list'],
  ],

  // Configurações compartilhadas para todos os projetos
  use: {
    // URL base da aplicação
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',

    // Trace para debug (salvo apenas em falhas ou retries)
    trace: 'on-first-retry',

    // Screenshots apenas em falhas
    screenshot: 'only-on-failure',

    // Vídeos apenas em falhas
    video: 'retain-on-failure',

    // Action timeout
    actionTimeout: 15 * 1000,

    // Navigation timeout
    navigationTimeout: 30 * 1000,
  },

  // Projetos de teste (browsers)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Web server para rodar a aplicação durante os testes
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
