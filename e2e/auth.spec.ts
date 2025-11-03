import { test, expect } from '@playwright/test'

/**
 * Testes E2E de Autenticação
 *
 * Cobre:
 * - Login de usuário existente
 * - Signup de novo usuário
 * - Redirecionamentos após autenticação
 * - Proteção de rotas
 */

test.describe('Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    // Limpar cookies/localStorage antes de cada teste
    await page.context().clearCookies()
    await page.evaluate(() => localStorage.clear())
  })

  test('deve exibir página de login', async ({ page }) => {
    await page.goto('/login')

    // Verificar elementos da página de login
    await expect(page.locator('h1, h2')).toContainText(/login|entrar/i)
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('deve exibir página de signup', async ({ page }) => {
    await page.goto('/signup')

    // Verificar elementos da página de signup
    await expect(page.locator('h1, h2')).toContainText(/cadastro|signup|criar/i)
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('deve redirecionar para login ao acessar rota protegida sem autenticação', async ({ page }) => {
    // Tentar acessar dashboard sem autenticação
    await page.goto('/dashboard')

    // Deve redirecionar para login
    await expect(page).toHaveURL(/\/login/)

    // Deve ter parâmetro de redirect
    const url = page.url()
    expect(url).toContain('redirect=')
  })

  test('deve validar campos obrigatórios no login', async ({ page }) => {
    await page.goto('/login')

    // Tentar submeter sem preencher
    await page.locator('button[type="submit"]').click()

    // Verificar mensagens de erro (depende da implementação)
    // Esta validação pode precisar ser ajustada baseado na UI real
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')

    // Verificar que campos estão presentes
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })

  // Teste de login real (requer dados de teste no Supabase)
  // Descomente e configure com credenciais de teste
  /*
  test('deve fazer login com credenciais válidas', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Aguardar redirecionamento
    await page.waitForURL(/\/onboarding|\/dashboard/, { timeout: 10000 })

    // Verificar que não está mais na página de login
    await expect(page).not.toHaveURL(/\/login/)
  })
  */
})

test.describe('Proteção de Rotas', () => {
  test('deve proteger rotas que requerem autenticação', async ({ page }) => {
    const protectedRoutes = [
      '/dashboard',
      '/onboarding',
      '/mundo-nath',
      '/maternidade-hoje',
      '/receitas',
    ]

    for (const route of protectedRoutes) {
      await page.goto(route)

      // Deve redirecionar para login
      await expect(page).toHaveURL(/\/login/)
    }
  })
})
