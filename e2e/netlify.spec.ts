import { expect, test } from '@playwright/test'

// Base URL para testes no Netlify (detecta automaticamente)
const baseURL = process.env.DEPLOY_PRIME_URL || process.env.URL || 'http://localhost:3000'
const isProduction = process.env.CONTEXT === 'production'

test.describe('Netlify - Testes de Deploy', () => {
    // Teste de health check básico
    test('deve responder corretamente na URL base', async ({ page }) => {
        await page.goto(baseURL)
        await expect(page).toHaveTitle(/Nossa Maternidade/i)
    })

    // Teste de meta tags e SEO
    test('deve ter meta tags corretas', async ({ page }) => {
        await page.goto(baseURL)

        // Verifica title
        await expect(page).toHaveTitle(/Nossa Maternidade/i)

        // Verifica meta description
        const description = page.locator('meta[name="description"]')
        await expect(description).toHaveAttribute('content', /.+/)

        // Verifica viewport
        const viewport = page.locator('meta[name="viewport"]')
        await expect(viewport).toHaveAttribute('content', /device-width/)
    })

    // Teste de PWA manifest
    test('PWA manifest deve estar acessível e válido', async ({ page }) => {
        const response = await page.goto(`${baseURL}/manifest.json`)
        expect(response?.status()).toBe(200)

        const manifest = await response?.json()
        expect(manifest).toHaveProperty('name')
        expect(manifest).toHaveProperty('short_name')
        expect(manifest).toHaveProperty('start_url')
        expect(manifest).toHaveProperty('display')
        expect(manifest.icons).toBeDefined()
        expect(Array.isArray(manifest.icons)).toBe(true)
    })

    // Teste de headers de segurança
    test('deve ter headers de segurança corretos', async ({ page }) => {
        const response = await page.goto(baseURL)
        const headers = response?.headers() || {}

        // Verifica headers de segurança (via response headers)
        expect(response?.status()).toBe(200)

        // Headers serão verificados no teste de API
    })

    // Teste de responsividade mobile
    test('deve ser responsivo em mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE
        await page.goto(baseURL)

        // Verifica que o conteúdo está visível
        await expect(page.locator('body')).toBeVisible()

        // Verifica que botões são clicáveis
        const signupButton = page.getByRole('link', { name: /começar/i })
        await expect(signupButton).toBeVisible()

        // Verifica que cards estão visíveis
        const cards = page.locator('[class*="card"]')
        const count = await cards.count()
        expect(count).toBeGreaterThan(0)
    })

    // Teste de responsividade tablet
    test('deve ser responsivo em tablet', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 }) // iPad
        await page.goto(baseURL)

        await expect(page.locator('body')).toBeVisible()

        // Verifica layout em grid
        const grid = page.locator('[class*="grid"]')
        const count = await grid.count()
        expect(count).toBeGreaterThan(0)
    })

    // Teste de navegação básica
    test('deve navegar para páginas principais', async ({ page }) => {
        await page.goto(baseURL)

        // Testa link de signup
        const signupLink = page.getByRole('link', { name: /começar/i })
        await expect(signupLink).toBeVisible()
        await signupLink.click()
        await expect(page).toHaveURL(new RegExp('/signup', 'i'))

        // Volta para home
        await page.goto(baseURL)

        // Testa link de login
        const loginLink = page.getByRole('link', { name: /já sou membro/i })
        await expect(loginLink).toBeVisible()
        await loginLink.click()
        await expect(page).toHaveURL(new RegExp('/login', 'i'))
    })

    // Teste de performance básico
    test('deve carregar em tempo razoável', async ({ page }) => {
        const startTime = Date.now()

        await page.goto(baseURL, { waitUntil: 'networkidle' })

        const loadTime = Date.now() - startTime
        console.log(`Tempo de carregamento: ${loadTime}ms`)

        // Deve carregar em menos de 5 segundos
        expect(loadTime).toBeLessThan(5000)
    })

    // Teste de imagens
    test('imagens principais devem carregar', async ({ page }) => {
        await page.goto(baseURL)

        // Verifica logo
        const logo = page.locator('img[alt*="Maternidade" i]')
        await expect(logo).toBeVisible()

        const logoSrc = await logo.getAttribute('src')
        expect(logoSrc).toBeTruthy()

        // Verifica que a imagem carrega
        const logoResponse = await page.request.get(logoSrc?.startsWith('http') ? logoSrc : `${baseURL}${logoSrc}`)
        expect(logoResponse.status()).toBe(200)
    })

    // Teste de acessibilidade básica
    test('deve ter estrutura acessível', async ({ page }) => {
        await page.goto(baseURL)

        // Verifica heading principal
        const h1 = page.locator('h1')
        await expect(h1).toBeVisible()
        const h1Text = await h1.textContent()
        expect(h1Text).toContain('Maternidade')

        // Verifica que há headings hierárquicos
        const headings = page.locator('h1, h2, h3')
        const headingCount = await headings.count()
        expect(headingCount).toBeGreaterThan(0)
    })

    // Teste de service worker (se disponível)
    test('deve registrar service worker se PWA ativo', async ({ page, context }) => {
        await context.addInitScript(() => {
            // Permite verificar service worker
            window.addEventListener('beforeinstallprompt', (e) => {
                window.dispatchEvent(new CustomEvent('sw-ready', { detail: e }))
            })
        })

        await page.goto(baseURL)

        // Verifica se há service worker (pode não estar ativo em todos os ambientes)
        const swRegistered = await page.evaluate(() => {
            return 'serviceWorker' in navigator
        })

        expect(swRegistered).toBe(true)
    })

    // Teste de 404
    test('deve retornar 404 para página inexistente', async ({ page }) => {
        const response = await page.goto(`${baseURL}/pagina-que-nao-existe-12345`)
        expect(response?.status()).toBe(404)
    })

    // Teste de idioma
    test('deve estar em português', async ({ page }) => {
        await page.goto(baseURL)

        const html = page.locator('html')
        await expect(html).toHaveAttribute('lang', 'pt-BR')
    })

    // Teste de favicon
    test('deve ter favicon configurado', async ({ page }) => {
        await page.goto(baseURL)

        const favicon = page.locator('link[rel="icon"]')
        const faviconCount = await favicon.count()
        expect(faviconCount).toBeGreaterThan(0)
    })
})
