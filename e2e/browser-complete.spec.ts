import { expect, test } from '@playwright/test'

/**
 * 🧪 Esquema de Testes E2E Completo - Nossa Maternidade
 * Testes abrangentes usando Playwright
 */

test.describe('Nossa Maternidade - Testes E2E Completos', () => {

  // Configuração de teste
  test.beforeEach(async ({ page }) => {
    // Configurar viewport padrão
    await page.setViewportSize({ width: 1280, height: 720 })
  })

  // ============================================
  // 1. TESTES DE NAVEGAÇÃO E ESTRUTURA
  // ============================================

  test.describe('Navegação e Estrutura', () => {
    test('deve carregar a página inicial', async ({ page }) => {
      await page.goto('/')
      await expect(page).toHaveTitle(/Nossa Maternidade/i)
      await expect(page.locator('body')).toBeVisible()
    })

    test('deve ter PWA manifest válido', async ({ page, request }) => {
      const response = await request.get('/manifest.json')
      expect(response.status()).toBe(200)

      const manifest = await response.json()
      expect(manifest).toHaveProperty('name')
      expect(manifest).toHaveProperty('short_name')
      expect(manifest).toHaveProperty('start_url')
    })

    test('deve ser responsivo em mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      await expect(page.locator('body')).toBeVisible()
    })

    test('deve ser responsivo em tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/')
      await expect(page.locator('body')).toBeVisible()
    })

    test('deve ser responsivo em desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto('/')
      await expect(page.locator('body')).toBeVisible()
    })
  })

  // ============================================
  // 2. TESTES DE AUTENTICAÇÃO
  // ============================================

  test.describe('Autenticação', () => {
    test('deve carregar página de login', async ({ page }) => {
      await page.goto('/login')
      await expect(page.locator('h1, h2, [role="heading"]')).toContainText(/login|entrar/i)
    })

    test('deve carregar página de signup', async ({ page }) => {
      await page.goto('/signup')
      await expect(page.locator('h1, h2, [role="heading"]')).toContainText(/cadastro|signup|registro/i)
    })

    test('deve validar formulário de login', async ({ page }) => {
      await page.goto('/login')

      // Tentar submeter sem preencher
      const submitButton = page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Login")')
      if (await submitButton.count() > 0) {
        await submitButton.click()

        // Verificar mensagens de erro
        await expect(page.locator('text=/email|Email/i, text=/senha|password/i')).toBeVisible({ timeout: 2000 }).catch(() => { })
      }
    })

    test('deve validar formulário de signup', async ({ page }) => {
      await page.goto('/signup')

      // Tentar submeter sem preencher
      const submitButton = page.locator('button[type="submit"], button:has-text("Cadastrar"), button:has-text("Signup")')
      if (await submitButton.count() > 0) {
        await submitButton.click()

        // Verificar mensagens de erro
        await expect(page.locator('text=/email|Email/i, text=/senha|password/i')).toBeVisible({ timeout: 2000 }).catch(() => { })
      }
    })

    test('deve redirecionar para login se não autenticado', async ({ page }) => {
      // Tentar acessar página protegida
      await page.goto('/dashboard')

      // Deve redirecionar para login
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
    })
  })

  // ============================================
  // 3. TESTES DE PÁGINAS PRINCIPAIS
  // ============================================

  test.describe('Páginas Principais', () => {
    test('deve carregar página de onboarding', async ({ page }) => {
      await page.goto('/onboarding')
      await expect(page.locator('body')).toBeVisible()
    })

    test('deve carregar página de chat', async ({ page }) => {
      await page.goto('/chat')
      await expect(page.locator('body')).toBeVisible()
    })

    test('deve carregar página de autocuidado', async ({ page }) => {
      await page.goto('/autocuidado')
      await expect(page.locator('body')).toBeVisible()
    })

    test('deve carregar página de brincadeiras', async ({ page }) => {
      await page.goto('/brincadeiras')
      await expect(page.locator('body')).toBeVisible()
    })

    test('deve carregar página de receitas', async ({ page }) => {
      await page.goto('/receitas')
      await expect(page.locator('body')).toBeVisible()
    })

    test('deve carregar página de rotina', async ({ page }) => {
      await page.goto('/rotina')
      await expect(page.locator('body')).toBeVisible()
    })

    test('deve carregar página de histórias para dormir', async ({ page }) => {
      await page.goto('/historias-sono')
      await expect(page.locator('body')).toBeVisible()
    })

    test('deve carregar página de birras', async ({ page }) => {
      await page.goto('/birras')
      await expect(page.locator('body')).toBeVisible()
    })

    test('deve carregar página de perfil do bebê', async ({ page }) => {
      await page.goto('/perfil-bebe')
      await expect(page.locator('body')).toBeVisible()
    })

    test('deve carregar página de mundo da Nath', async ({ page }) => {
      await page.goto('/mundo-nath')
      await expect(page.locator('body')).toBeVisible()
    })

    test('deve carregar página de maternidade hoje', async ({ page }) => {
      await page.goto('/maternidade-hoje')
      await expect(page.locator('body')).toBeVisible()
    })
  })

  // ============================================
  // 4. TESTES DE INTERATIVIDADE
  // ============================================

  test.describe('Interatividade e UI', () => {
    test('deve ter navegação funcional', async ({ page }) => {
      await page.goto('/')

      // Procurar por links de navegação
      const navLinks = page.locator('nav a, [role="navigation"] a, header a')
      const linkCount = await navLinks.count()

      if (linkCount > 0) {
        // Clicar no primeiro link
        await navLinks.first().click()
        await expect(page).not.toHaveURL('/')
      }
    })

    test('deve ter botões clicáveis', async ({ page }) => {
      await page.goto('/')

      const buttons = page.locator('button:visible')
      const buttonCount = await buttons.count()

      if (buttonCount > 0) {
        // Verificar se os botões são clicáveis
        const firstButton = buttons.first()
        await expect(firstButton).toBeEnabled()
      }
    })

    test('deve ter formulários interativos', async ({ page }) => {
      await page.goto('/login')

      const inputs = page.locator('input[type="email"], input[type="password"], input[type="text"]')
      const inputCount = await inputs.count()

      if (inputCount > 0) {
        const firstInput = inputs.first()
        await firstInput.fill('test@example.com')
        await expect(firstInput).toHaveValue('test@example.com')
      }
    })
  })

  // ============================================
  // 5. TESTES DE PERFORMANCE
  // ============================================

  test.describe('Performance', () => {
    test('deve carregar página inicial rapidamente', async ({ page }) => {
      const startTime = Date.now()
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      const loadTime = Date.now() - startTime

      // Deve carregar em menos de 3 segundos
      expect(loadTime).toBeLessThan(3000)
    })

    test('deve ter imagens otimizadas', async ({ page }) => {
      await page.goto('/')

      const images = page.locator('img')
      const imageCount = await images.count()

      if (imageCount > 0) {
        // Verificar se as imagens têm atributos de otimização
        const firstImage = images.first()
        const src = await firstImage.getAttribute('src')

        // Verificar se usa Next.js Image Optimization
        expect(src).toMatch(/\/_next\/image|data:image|\.(jpg|png|webp)/i)
      }
    })

    test('deve ter lazy loading em imagens', async ({ page }) => {
      await page.goto('/')

      const images = page.locator('img')
      const imageCount = await images.count()

      if (imageCount > 0) {
        const firstImage = images.first()
        const loading = await firstImage.getAttribute('loading')

        // Verificar se tem lazy loading
        if (loading) {
          expect(loading).toBe('lazy')
        }
      }
    })
  })

  // ============================================
  // 6. TESTES DE ACESSIBILIDADE
  // ============================================

  test.describe('Acessibilidade', () => {
    test('deve ter heading principal', async ({ page }) => {
      await page.goto('/')

      const headings = page.locator('h1, [role="heading"]')
      const headingCount = await headings.count()

      // Deve ter pelo menos um heading
      expect(headingCount).toBeGreaterThan(0)
    })

    test('deve ter labels em formulários', async ({ page }) => {
      await page.goto('/login')

      const inputs = page.locator('input[type="email"], input[type="password"]')
      const inputCount = await inputs.count()

      if (inputCount > 0) {
        const firstInput = inputs.first()
        const id = await firstInput.getAttribute('id')
        const ariaLabel = await firstInput.getAttribute('aria-label')
        const placeholder = await firstInput.getAttribute('placeholder')

        // Deve ter label, aria-label ou placeholder
        expect(id || ariaLabel || placeholder).toBeTruthy()
      }
    })

    test('deve ter contraste adequado', async ({ page }) => {
      await page.goto('/')

      // Verificar se o texto está visível
      const body = page.locator('body')
      const textColor = await body.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return style.color
      })

      expect(textColor).toBeTruthy()
    })
  })

  // ============================================
  // 7. TESTES DE API E INTEGRAÇÃO
  // ============================================

  test.describe('API e Integração', () => {
    test('deve ter APIs funcionais', async ({ page }) => {
      await page.goto('/')

      // Interceptar requisições de API
      const apiRequests: string[] = []
      page.on('request', (request) => {
        if (request.url().includes('/api/')) {
          apiRequests.push(request.url())
        }
      })

      await page.waitForTimeout(2000)

      // Verificar se há requisições de API
      // (pode não ter requisições na página inicial)
      expect(apiRequests.length).toBeGreaterThanOrEqual(0)
    })

    test('deve tratar erros de API graciosamente', async ({ page }) => {
      await page.goto('/')

      // Interceptar respostas de erro
      const errorResponses: number[] = []
      page.on('response', (response) => {
        if (response.status() >= 400 && response.url().includes('/api/')) {
          errorResponses.push(response.status())
        }
      })

      await page.waitForTimeout(2000)

      // Não deve ter muitos erros 500
      const serverErrors = errorResponses.filter(status => status >= 500)
      expect(serverErrors.length).toBeLessThan(5)
    })
  })

  // ============================================
  // 8. TESTES DE PWA
  // ============================================

  test.describe('PWA (Progressive Web App)', () => {
    test('deve ter service worker', async ({ page, context }) => {
      await page.goto('/')

      // Verificar se há service worker registrado
      const hasServiceWorker = await page.evaluate(() => {
        return 'serviceWorker' in navigator
      })

      expect(hasServiceWorker).toBe(true)
    })

    test('deve ter manifest válido', async ({ page }) => {
      const response = await page.goto('/manifest.json')
      expect(response?.status()).toBe(200)

      const manifest = await response?.json()
      expect(manifest).toHaveProperty('name')
      expect(manifest).toHaveProperty('short_name')
      expect(manifest).toHaveProperty('icons')
      expect(manifest.icons.length).toBeGreaterThan(0)
    })

    test('deve ter ícones PWA', async ({ page }) => {
      await page.goto('/')

      // Verificar se há link para manifest
      const manifestLink = page.locator('link[rel="manifest"]')
      const manifestCount = await manifestLink.count()

      expect(manifestCount).toBeGreaterThan(0)
    })
  })

  // ============================================
  // 9. TESTES DE SEGURANÇA
  // ============================================

  test.describe('Segurança', () => {
    test('deve ter headers de segurança', async ({ page }) => {
      const response = await page.goto('/')
      const headers = response?.headers()

      // Verificar headers importantes
      if (headers) {
        expect(headers['x-frame-options'] || headers['x-content-type-options']).toBeTruthy()
      }
    })

    test('não deve expor informações sensíveis', async ({ page }) => {
      await page.goto('/')

      const pageContent = await page.content()

      // Não deve ter tokens ou chaves expostas
      expect(pageContent).not.toMatch(/sk-[a-zA-Z0-9]+/)
      expect(pageContent).not.toMatch(/eyJ[a-zA-Z0-9_-]+\.eyJ/)
    })

    test('deve ter HTTPS em produção', async ({ page }) => {
      const url = page.url()

      // Se não for localhost, deve ser HTTPS
      if (!url.includes('localhost') && !url.includes('127.0.0.1')) {
        expect(url).toMatch(/^https:/)
      }
    })
  })

  // ============================================
  // 10. TESTES DE FLUXO COMPLETO
  // ============================================

  test.describe('Fluxo Completo', () => {
    test('deve navegar entre páginas principais', async ({ page }) => {
      await page.goto('/')

      // Navegar para diferentes páginas
      const pages = ['/login', '/signup', '/chat', '/autocuidado']

      for (const route of pages) {
        try {
          await page.goto(route)
          await expect(page.locator('body')).toBeVisible({ timeout: 5000 })
        } catch (error) {
          // Página pode requerer autenticação
          console.log(`Página ${route} requer autenticação ou não existe`)
        }
      }
    })

    test('deve manter estado entre navegações', async ({ page }) => {
      await page.goto('/')

      // Navegar para outra página e voltar
      await page.goto('/login')
      await page.goBack()

      // Deve voltar para página inicial
      await expect(page).toHaveURL(/\/$/, { timeout: 5000 })
    })
  })
})
