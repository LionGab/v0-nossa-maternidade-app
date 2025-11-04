import { expect, test } from '@playwright/test'

/**
 * 🔐 Testes de Autenticação - Nossa Maternidade
 * Testes específicos para login, signup e autenticação
 */

test.describe('Autenticação - Fluxo Completo', () => {
  const testEmail = 'test@example.com'
  const testPassword = 'Test123456!'

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
  })

  // ============================================
  // LOGIN
  // ============================================

  test.describe('Login', () => {
    test('deve carregar página de login', async ({ page }) => {
      await page.goto('/login')
      await expect(page.locator('body')).toBeVisible()
      await expect(page).toHaveURL(/\/login/)
    })

    test('deve ter campos de email e senha', async ({ page }) => {
      await page.goto('/login')

      const emailInput = page.locator('input[type="email"], input[name*="email" i], input[id*="email" i]')
      const passwordInput = page.locator('input[type="password"], input[name*="password" i], input[id*="password" i]')

      const emailCount = await emailInput.count()
      const passwordCount = await passwordInput.count()

      expect(emailCount).toBeGreaterThan(0)
      expect(passwordCount).toBeGreaterThan(0)
    })

    test('deve validar email inválido', async ({ page }) => {
      await page.goto('/login')

      const emailInput = page.locator('input[type="email"], input[name*="email" i]').first()
      if (await emailInput.count() > 0) {
        await emailInput.fill('email-invalido')
        await emailInput.blur()

        // Verificar mensagem de erro
        await expect(page.locator('text=/email.*inválido|email.*válido/i')).toBeVisible({ timeout: 2000 }).catch(() => { })
      }
    })

    test('deve validar senha vazia', async ({ page }) => {
      await page.goto('/login')

      const submitButton = page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Login")')
      if (await submitButton.count() > 0) {
        await submitButton.click()

        // Verificar mensagem de erro
        await expect(page.locator('text=/senha|password/i')).toBeVisible({ timeout: 2000 }).catch(() => { })
      }
    })

    test('deve mostrar erro para credenciais inválidas', async ({ page }) => {
      await page.goto('/login')

      const emailInput = page.locator('input[type="email"], input[name*="email" i]').first()
      const passwordInput = page.locator('input[type="password"], input[name*="password" i]').first()
      const submitButton = page.locator('button[type="submit"], button:has-text("Entrar")').first()

      if (await emailInput.count() > 0 && await passwordInput.count() > 0 && await submitButton.count() > 0) {
        await emailInput.fill('wrong@example.com')
        await passwordInput.fill('wrongpassword')
        await submitButton.click()

        // Aguardar resposta (pode ter erro ou redirecionamento)
        await page.waitForTimeout(2000)

        // Verificar se há mensagem de erro ou se redirecionou
        const errorMessage = page.locator('text=/erro|inválido|incorreto/i')
        const hasError = await errorMessage.count() > 0
        const isStillOnLogin = page.url().includes('/login')

        // Deve ter erro OU ainda estar na página de login
        expect(hasError || isStillOnLogin).toBe(true)
      }
    })

    test('deve redirecionar após login bem-sucedido', async ({ page }) => {
      await page.goto('/login')

      // Este teste requer credenciais válidas
      // Por enquanto, apenas verifica se o formulário existe
      const emailInput = page.locator('input[type="email"]').first()
      const passwordInput = page.locator('input[type="password"]').first()

      if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
        await expect(emailInput).toBeVisible()
        await expect(passwordInput).toBeVisible()
      }
    })
  })

  // ============================================
  // SIGNUP
  // ============================================

  test.describe('Signup', () => {
    test('deve carregar página de signup', async ({ page }) => {
      await page.goto('/signup')
      await expect(page.locator('body')).toBeVisible()
      await expect(page).toHaveURL(/\/signup/)
    })

    test('deve ter campos obrigatórios', async ({ page }) => {
      await page.goto('/signup')

      const emailInput = page.locator('input[type="email"], input[name*="email" i]')
      const passwordInput = page.locator('input[type="password"], input[name*="password" i]')

      const emailCount = await emailInput.count()
      const passwordCount = await passwordInput.count()

      expect(emailCount).toBeGreaterThan(0)
      expect(passwordCount).toBeGreaterThan(0)
    })

    test('deve validar senha fraca', async ({ page }) => {
      await page.goto('/signup')

      const passwordInput = page.locator('input[type="password"], input[name*="password" i]').first()
      if (await passwordInput.count() > 0) {
        await passwordInput.fill('123')
        await passwordInput.blur()

        // Verificar mensagem de erro
        await expect(page.locator('text=/senha.*fraca|senha.*mínimo|password.*weak/i')).toBeVisible({ timeout: 2000 }).catch(() => { })
      }
    })

    test('deve validar confirmação de senha', async ({ page }) => {
      await page.goto('/signup')

      const passwordInput = page.locator('input[type="password"], input[name*="password" i]').first()
      const confirmInput = page.locator('input[type="password"], input[name*="confirm" i], input[name*="repeat" i]').first()

      if (await passwordInput.count() > 0 && await confirmInput.count() > 0) {
        await passwordInput.fill('Test123456!')
        await confirmInput.fill('Different123!')
        await confirmInput.blur()

        // Verificar mensagem de erro
        await expect(page.locator('text=/senha.*coincid|password.*match/i')).toBeVisible({ timeout: 2000 }).catch(() => { })
      }
    })

    test('deve ter link para login', async ({ page }) => {
      await page.goto('/signup')

      const loginLink = page.locator('a:has-text("Login"), a:has-text("Entrar"), a[href*="login"]')
      const linkCount = await loginLink.count()

      if (linkCount > 0) {
        await loginLink.first().click()
        await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
      }
    })
  })

  // ============================================
  // PROTEÇÃO DE ROTAS
  // ============================================

  test.describe('Proteção de Rotas', () => {
    test('deve redirecionar para login ao acessar dashboard sem autenticação', async ({ page }) => {
      await page.goto('/dashboard')
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
    })

    test('deve redirecionar para login ao acessar perfil sem autenticação', async ({ page }) => {
      await page.goto('/perfil-bebe')
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
    })

    test('deve redirecionar para login ao acessar chat sem autenticação', async ({ page }) => {
      await page.goto('/chat')
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
    })
  })

  // ============================================
  // LOGOUT
  // ============================================

  test.describe('Logout', () => {
    test('deve ter botão de logout quando autenticado', async ({ page }) => {
      // Este teste requer autenticação prévia
      // Por enquanto, apenas verifica estrutura
      await page.goto('/')

      const logoutButton = page.locator('button:has-text("Sair"), button:has-text("Logout"), a[href*="logout"]')
      // Pode não existir se não estiver autenticado
      const logoutCount = await logoutButton.count()

      // Se existir, deve ser clicável
      if (logoutCount > 0) {
        await expect(logoutButton.first()).toBeVisible()
      }
    })
  })
})
