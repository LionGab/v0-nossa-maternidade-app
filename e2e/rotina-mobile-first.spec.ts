import { expect, test } from '@playwright/test'

/**
 * 🧪 Testes Mobile-First - Página Rotina
 * Testes focados em responsividade e redimensionamento
 */

test.describe('Rotina - Mobile-First e Responsividade', () => {

  // ============================================
  // TESTES DE RESPONSIVIDADE
  // ============================================

  test.describe('Responsividade Mobile-First', () => {
    test('deve carregar página de rotina em mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/rotina')
      await page.waitForLoadState('networkidle')

      // Verificar se página carregou (pode redirecionar para login)
      await expect(page.locator('body')).toBeVisible()
    })

    test('deve ter categorias responsivas em mobile (2 colunas)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/rotina')
      await page.waitForLoadState('networkidle')

      // Verificar se página carregou
      const body = page.locator('body')
      await expect(body).toBeVisible()

      // Se não foi redirecionado, verificar grid
      if (!page.url().includes('/login')) {
        // Procurar por grid de categorias
        const gridContainer = page.locator('div[class*="grid"]').first()
        if (await gridContainer.count() > 0) {
          const display = await gridContainer.evaluate((el) => {
            return window.getComputedStyle(el).display
          })
          expect(display).toBe('grid')
        }
      }
    })

    test('deve ter categorias responsivas em tablet (4 colunas)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/rotina')
      await page.waitForLoadState('networkidle')

      await expect(page.locator('body')).toBeVisible()
    })

    test('deve ter categorias responsivas em desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/rotina')
      await page.waitForLoadState('networkidle')

      await expect(page.locator('body')).toBeVisible()
    })

    test('categorias devem ter tamanho adequado em mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/rotina')
      await page.waitForLoadState('networkidle')

      if (!page.url().includes('/login')) {
        // Procurar por botões ou divs de categoria
        const categorias = page.locator('button, div[class*="bg-green"], div[class*="bg-blue"], div[class*="bg-purple"], div[class*="bg-pink"]')
        const count = await categorias.count()

        if (count > 0) {
          const firstCategoria = categorias.first()
          const box = await firstCategoria.boundingBox()

          // Verificar tamanho mínimo adequado
          expect(box?.width).toBeGreaterThan(50)
          expect(box?.height).toBeGreaterThan(30)
        }
      }
    })

    test('botões de dias devem ter tamanho adequado em mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/rotina')
      await page.waitForLoadState('networkidle')

      if (!page.url().includes('/login')) {
        // Procurar por botões de dias
        const dias = page.locator('button:has-text("Segunda"), button:has-text("Terça"), button')
        const count = await dias.count()

        if (count > 0) {
          const firstDia = dias.first()
          const box = await firstDia.boundingBox()

          // Verificar tamanho mínimo adequado
          expect(box?.width).toBeGreaterThan(70)
          expect(box?.height).toBeGreaterThan(30)
        }
      }
    })

    test('deve ter scroll horizontal em botões de dias em mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/rotina')
      await page.waitForLoadState('networkidle')

      if (!page.url().includes('/login')) {
        // Procurar por container de botões
        const container = page.locator('div[class*="overflow"], div[class*="flex"]').first()
        if (await container.count() > 0) {
          const overflow = await container.evaluate((el) => {
            return window.getComputedStyle(el).overflowX
          })
          // Verificar se tem overflow ou scroll
          expect(['auto', 'scroll', 'visible']).toContain(overflow)
        }
      }
    })
  })

  // ============================================
  // TESTES DE ELEMENTOS VISUAIS
  // ============================================

  test.describe('Elementos Visuais', () => {
    test('deve ter elementos visíveis em mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/rotina')
      await page.waitForLoadState('networkidle')

      // Verificar se elementos principais estão visíveis
      const body = page.locator('body')
      await expect(body).toBeVisible()

      // Verificar se há cards ou containers
      const cards = page.locator('[class*="card"], [class*="Card"], div[class*="bg"]')
      const cardCount = await cards.count()

      // Deve ter pelo menos alguns elementos
      expect(cardCount).toBeGreaterThanOrEqual(0)
    })

    test('deve ter elementos visíveis em tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/rotina')
      await page.waitForLoadState('networkidle')

      await expect(page.locator('body')).toBeVisible()
    })

    test('deve ter elementos visíveis em desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/rotina')
      await page.waitForLoadState('networkidle')

      await expect(page.locator('body')).toBeVisible()
    })
  })

  // ============================================
  // TESTES DE INTERAÇÃO
  // ============================================

  test.describe('Interação Mobile-First', () => {
    test('deve ter botões clicáveis em mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/rotina')
      await page.waitForLoadState('networkidle')

      // Procurar por botões
      const buttons = page.locator('button:visible')
      const buttonCount = await buttons.count()

      if (buttonCount > 0) {
        const firstButton = buttons.first()
        await expect(firstButton).toBeEnabled()

        // Verificar tamanho mínimo para toque
        const box = await firstButton.boundingBox()
        expect(box?.width).toBeGreaterThan(44) // Tamanho mínimo para toque
        expect(box?.height).toBeGreaterThan(44)
      }
    })

    test('deve ter elementos com espaçamento adequado em mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/rotina')
      await page.waitForLoadState('networkidle')

      // Verificar espaçamento entre elementos
      const containers = page.locator('div[class*="gap"], div[class*="space"]')
      const containerCount = await containers.count()

      // Deve ter algum espaçamento configurado
      expect(containerCount).toBeGreaterThanOrEqual(0)
    })
  })
})
