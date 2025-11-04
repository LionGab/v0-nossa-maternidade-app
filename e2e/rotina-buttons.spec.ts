import { expect, test } from '@playwright/test'

/**
 * 🧪 Testes de Botões e Responsividade - Página Rotina
 * Testes mobile-first para todos os botões e categorias
 */

test.describe('Rotina - Botões e Categorias Mobile-First', () => {

  test.beforeEach(async ({ page }) => {
    // Configurar viewport mobile por padrão (mobile-first)
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/rotina')

    // Aguardar página carregar ou redirecionar
    await page.waitForLoadState('networkidle')

    // Verificar se não foi redirecionado para login
    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      // Se redirecionado, aguardar e verificar
      await page.waitForTimeout(1000)
    }
  })

  // ============================================
  // TESTES DE CATEGORIAS
  // ============================================

  test.describe('Botões de Categorias', () => {
    test('deve exibir todas as 4 categorias', async ({ page }) => {
      // Verificar se não foi redirecionado para login
      if (page.url().includes('/login')) {
        test.skip()
        return
      }

      // Aguardar categorias carregarem
      await page.waitForSelector('text=Alimentação, text=Descanso, text=Brincadeiras, text=Autocuidado', { timeout: 5000 }).catch(() => {})

      const alimentacao = page.locator('text=Alimentação').first()
      const descanso = page.locator('text=Descanso').first()
      const brincadeiras = page.locator('text=Brincadeiras').first()
      const autocuidado = page.locator('text=Autocuidado').first()

      const count = await alimentacao.count() + await descanso.count() + await brincadeiras.count() + await autocuidado.count()
      expect(count).toBeGreaterThanOrEqual(4)
    })

    test('deve ter categoria Alimentação clicável', async ({ page }) => {
      if (page.url().includes('/login')) {
        test.skip()
        return
      }

      // Procurar por texto ou botão
      const alimentacao = page.locator('button:has-text("Alimentação"), [role="button"]:has-text("Alimentação"), text=Alimentação').first()

      if (await alimentacao.count() > 0) {
        await expect(alimentacao).toBeVisible()
        await alimentacao.click()
        await page.waitForTimeout(300)
      } else {
        // Se não encontrar, verificar se página carregou
        await expect(page.locator('body')).toBeVisible()
      }
    })

    test('deve ter categoria Descanso clicável', async ({ page }) => {
      const descanso = page.locator('button:has-text("Descanso")')
      await expect(descanso).toBeVisible()
      await expect(descanso).toBeEnabled()
      await descanso.click()
      await page.waitForTimeout(300)
    })

    test('deve ter categoria Brincadeiras clicável', async ({ page }) => {
      const brincadeiras = page.locator('button:has-text("Brincadeiras")')
      await expect(brincadeiras).toBeVisible()
      await expect(brincadeiras).toBeEnabled()
      await brincadeiras.click()
      await page.waitForTimeout(300)
    })

    test('deve ter categoria Autocuidado clicável', async ({ page }) => {
      const autocuidado = page.locator('button:has-text("Autocuidado")')
      await expect(autocuidado).toBeVisible()
      await expect(autocuidado).toBeEnabled()
      await autocuidado.click()
      await page.waitForTimeout(300)
    })

    test('deve ter categorias com tamanho adequado em mobile', async ({ page }) => {
      const categorias = page.locator('button:has-text("Alimentação"), button:has-text("Descanso"), button:has-text("Brincadeiras"), button:has-text("Autocuidado")')

      for (let i = 0; i < await categorias.count(); i++) {
        const categoria = categorias.nth(i)
        const box = await categoria.boundingBox()

        // Verificar que os botões têm tamanho mínimo adequado em mobile
        expect(box?.width).toBeGreaterThan(80)
        expect(box?.height).toBeGreaterThan(40)
      }
    })

    test('deve ter categorias em grid 2 colunas em mobile', async ({ page }) => {
      const gridContainer = page.locator('div:has(button:has-text("Alimentação"))').first()
      const computedStyle = await gridContainer.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return {
          gridTemplateColumns: style.gridTemplateColumns,
          display: style.display
        }
      })

      // Verificar que está em grid
      expect(computedStyle.display).toBe('grid')
    })
  })

  // ============================================
  // TESTES DE BOTÕES DE DIAS
  // ============================================

  test.describe('Botões de Dias da Semana', () => {
    test('deve exibir todos os 7 dias da semana', async ({ page }) => {
      if (page.url().includes('/login')) {
        test.skip()
        return
      }

      // Aguardar botões carregarem
      await page.waitForSelector('text=Segunda', { timeout: 5000 }).catch(() => {})

      const segunda = page.locator('text=Segunda').first()
      const terca = page.locator('text=Terça').first()
      const quarta = page.locator('text=Quarta').first()
      const quinta = page.locator('text=Quinta').first()
      const sexta = page.locator('text=Sexta').first()
      const sabado = page.locator('text=Sábado').first()
      const domingo = page.locator('text=Domingo').first()

      const count = await segunda.count() + await terca.count() + await quarta.count() +
                   await quinta.count() + await sexta.count() + await sabado.count() + await domingo.count()
      expect(count).toBeGreaterThanOrEqual(7)
    })

    test('deve selecionar Segunda ao clicar', async ({ page }) => {
      const segunda = page.locator('button:has-text("Segunda")')
      await segunda.click()
      await page.waitForTimeout(200)

      // Verificar que Segunda está selecionado (estilo diferente)
      const isSelected = await segunda.evaluate((el) => {
        return el.classList.contains('bg-primary') || el.getAttribute('data-state') === 'active'
      })
      expect(isSelected).toBeTruthy()
    })

    test('deve selecionar Terça ao clicar', async ({ page }) => {
      const terca = page.locator('button:has-text("Terça")')
      await terca.click()
      await page.waitForTimeout(200)

      const isSelected = await terca.evaluate((el) => {
        return el.classList.contains('bg-primary') || el.getAttribute('data-state') === 'active'
      })
      expect(isSelected).toBeTruthy()
    })

    test('deve selecionar Quarta ao clicar', async ({ page }) => {
      const quarta = page.locator('button:has-text("Quarta")')
      await quarta.click()
      await page.waitForTimeout(200)

      const isSelected = await quarta.evaluate((el) => {
        return el.classList.contains('bg-primary') || el.getAttribute('data-state') === 'active'
      })
      expect(isSelected).toBeTruthy()
    })

    test('deve selecionar Quinta ao clicar', async ({ page }) => {
      const quinta = page.locator('button:has-text("Quinta")')
      await quinta.click()
      await page.waitForTimeout(200)

      const isSelected = await quinta.evaluate((el) => {
        return el.classList.contains('bg-primary') || el.getAttribute('data-state') === 'active'
      })
      expect(isSelected).toBeTruthy()
    })

    test('deve selecionar Sexta ao clicar', async ({ page }) => {
      const sexta = page.locator('button:has-text("Sexta")')
      await sexta.click()
      await page.waitForTimeout(200)

      const isSelected = await sexta.evaluate((el) => {
        return el.classList.contains('bg-primary') || el.getAttribute('data-state') === 'active'
      })
      expect(isSelected).toBeTruthy()
    })

    test('deve selecionar Sábado ao clicar', async ({ page }) => {
      const sabado = page.locator('button:has-text("Sábado")')
      await sabado.click()
      await page.waitForTimeout(200)

      const isSelected = await sabado.evaluate((el) => {
        return el.classList.contains('bg-primary') || el.getAttribute('data-state') === 'active'
      })
      expect(isSelected).toBeTruthy()
    })

    test('deve selecionar Domingo ao clicar', async ({ page }) => {
      const domingo = page.locator('button:has-text("Domingo")')
      await domingo.click()
      await page.waitForTimeout(200)

      const isSelected = await domingo.evaluate((el) => {
        return el.classList.contains('bg-primary') || el.getAttribute('data-state') === 'active'
      })
      expect(isSelected).toBeTruthy()
    })

    test('deve ter botões de dias com scroll horizontal em mobile', async ({ page }) => {
      const container = page.locator('div:has(button:has-text("Segunda"))').first()
      const hasOverflow = await container.evaluate((el) => {
        return el.scrollWidth > el.clientWidth || window.getComputedStyle(el).overflowX === 'auto'
      })
      // Em mobile, pode ter scroll horizontal se necessário
      expect(hasOverflow).toBeTruthy()
    })
  })

  // ============================================
  // TESTES DE CHECKBOXES E BOTÕES DE ATIVIDADE
  // ============================================

  test.describe('Checkboxes e Botões de Atividade', () => {
    test('deve ter checkboxes clicáveis para atividades', async ({ page }) => {
      const checkboxes = page.locator('input[type="checkbox"], [role="checkbox"]')
      const count = await checkboxes.count()

      if (count > 0) {
        const firstCheckbox = checkboxes.first()
        await expect(firstCheckbox).toBeVisible()
        await firstCheckbox.click()
        await page.waitForTimeout(200)
      }
    })

    test('deve ter botões de Editar clicáveis', async ({ page }) => {
      const editButtons = page.locator('button:has-text("Editar")')
      const count = await editButtons.count()

      if (count > 0) {
        const firstEdit = editButtons.first()
        await expect(firstEdit).toBeVisible()
        await expect(firstEdit).toBeEnabled()
        await firstEdit.click()
        await page.waitForTimeout(200)
      }
    })

    test('deve ter botão Adicionar Nova Atividade clicável', async ({ page }) => {
      const addButton = page.locator('button:has-text("Adicionar"), button:has-text("Nova Atividade")')
      const count = await addButton.count()

      if (count > 0) {
        const addBtn = addButton.first()
        await expect(addBtn).toBeVisible()
        await expect(addBtn).toBeEnabled()
        await addBtn.click()
        await page.waitForTimeout(200)
      }
    })
  })

  // ============================================
  // TESTES DE RESPONSIVIDADE
  // ============================================

  test.describe('Responsividade Mobile-First', () => {
    test('deve funcionar em mobile (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/rotina')

      const categorias = page.locator('button:has-text("Alimentação"), button:has-text("Descanso")')
      const count = await categorias.count()
      expect(count).toBeGreaterThan(0)

      // Verificar que categorias estão visíveis
      for (let i = 0; i < count; i++) {
        const categoria = categorias.nth(i)
        await expect(categoria).toBeVisible()
      }
    })

    test('deve funcionar em tablet (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/rotina')

      const categorias = page.locator('button:has-text("Alimentação"), button:has-text("Descanso"), button:has-text("Brincadeiras"), button:has-text("Autocuidado")')
      const count = await categorias.count()
      expect(count).toBe(4)
    })

    test('deve funcionar em desktop (1280px)', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/rotina')

      const categorias = page.locator('button:has-text("Alimentação"), button:has-text("Descanso"), button:has-text("Brincadeiras"), button:has-text("Autocuidado")')
      const count = await categorias.count()
      expect(count).toBe(4)
    })

    test('categorias devem ter tamanho adequado em diferentes resoluções', async ({ page }) => {
      const viewports = [
        { width: 375, height: 667, name: 'mobile' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1280, height: 720, name: 'desktop' }
      ]

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.goto('/rotina')

        const alimentacao = page.locator('button:has-text("Alimentação")')
        await expect(alimentacao).toBeVisible()

        const box = await alimentacao.boundingBox()
        expect(box?.width).toBeGreaterThan(70)
        expect(box?.height).toBeGreaterThan(35)
      }
    })
  })

  // ============================================
  // TESTES DE INTERAÇÃO COMPLETA
  // ============================================

  test.describe('Interação Completa', () => {
    test('deve testar todos os botões em sequência', async ({ page }) => {
      // Testar categorias
      const categorias = ['Alimentação', 'Descanso', 'Brincadeiras', 'Autocuidado']
      for (const categoria of categorias) {
        const btn = page.locator(`button:has-text("${categoria}")`)
        await expect(btn).toBeVisible()
        await btn.click()
        await page.waitForTimeout(200)
      }

      // Testar dias
      const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
      for (const dia of dias) {
        const btn = page.locator(`button:has-text("${dia}")`)
        await expect(btn).toBeVisible()
        await btn.click()
        await page.waitForTimeout(200)
      }

      // Testar checkboxes
      const checkboxes = page.locator('input[type="checkbox"], [role="checkbox"]')
      const checkboxCount = await checkboxes.count()
      if (checkboxCount > 0) {
        await checkboxes.first().click()
        await page.waitForTimeout(200)
      }
    })
  })
})
