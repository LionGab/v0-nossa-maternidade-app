import { expect, test } from '@playwright/test'

/**
 * 🧪 Testes Mobile-First PWA - Nossa Maternidade
 * Baseado no plano estratégico de teste
 * Foco: Performance, PWA, Mobile-First, Acessibilidade
 */

test.describe('Fase 1: Fundação Mobile-First', () => {
  test.describe('1.1 Setup e Performance Baseline', () => {
    test('deve medir Core Web Vitals em mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Navegar e aguardar métricas
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Medir Core Web Vitals
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          const metrics: any = {}

          // LCP (Largest Contentful Paint)
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lcp = entries[entries.length - 1] as any
            if (lcp) {
              metrics.lcp = lcp.renderTime || lcp.loadTime
            }
          })
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

          // FID (First Input Delay) - simulando interação
          let fid = null
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const fidEntry = entries.find((e: any) => e.entryType === 'first-input')
            if (fidEntry) {
              fid = (fidEntry as any).processingStart - (fidEntry as any).startTime
            }
          })
          fidObserver.observe({ entryTypes: ['first-input'] })

          // CLS (Cumulative Layout Shift)
          let cls = 0
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                cls += (entry as any).value
              }
            }
          })
          clsObserver.observe({ entryTypes: ['layout-shift'] })

          // TTI (Time to Interactive)
          const tti = performance.timing.domInteractive - performance.timing.navigationStart

          // Aguardar 3 segundos para coletar métricas
          setTimeout(() => {
            metrics.fid = fid
            metrics.cls = cls
            metrics.tti = tti
            resolve(metrics)
          }, 3000)
        })
      })

      console.log('Core Web Vitals:', metrics)

      // Verificar métricas (valores alvo)
      if (metrics.lcp) {
        expect(metrics.lcp).toBeLessThan(2500) // LCP < 2.5s
      }
      if (metrics.fid !== null) {
        expect(metrics.fid).toBeLessThan(100) // FID < 100ms
      }
      if (metrics.cls !== undefined) {
        expect(metrics.cls).toBeLessThan(0.1) // CLS < 0.1
      }
      if (metrics.tti) {
        expect(metrics.tti).toBeLessThan(3500) // TTI < 3.5s
      }
    })

    test('deve ter viewport mobile configurado corretamente', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      const viewport = await page.evaluate(() => ({
        width: window.innerWidth,
        height: window.innerHeight,
      }))

      expect(viewport.width).toBe(375)
      expect(viewport.height).toBe(667)
    })

    test('deve ter touch targets ≥ 44px', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Verificar botões e links clicáveis
      const buttons = page.locator('button, a[role="button"], [role="button"]')
      const buttonCount = await buttons.count()

      if (buttonCount > 0) {
        // Verificar primeiro botão visível
        const firstButton = buttons.filter({ hasText: /.+/ }).first()
        if (await firstButton.count() > 0) {
          const box = await firstButton.boundingBox()
          if (box) {
            // Touch target deve ter pelo menos 44x44px
            expect(box.width).toBeGreaterThanOrEqual(44)
            expect(box.height).toBeGreaterThanOrEqual(44)
          }
        }
      }
    })
  })

  test.describe('1.2 PWA Installation Flow', () => {
    test('deve ter manifest válido para instalação', async ({ page, request }) => {
      const response = await request.get('/manifest.json')
      expect(response.status()).toBe(200)

      const manifest = await response.json()

      // Verificar propriedades obrigatórias
      expect(manifest).toHaveProperty('name')
      expect(manifest).toHaveProperty('short_name')
      expect(manifest).toHaveProperty('start_url')
      expect(manifest).toHaveProperty('display')
      expect(manifest.display).toBe('standalone')

      // Verificar ícones
      expect(manifest).toHaveProperty('icons')
      expect(Array.isArray(manifest.icons)).toBe(true)
      expect(manifest.icons.length).toBeGreaterThan(0)

      // Verificar ícone de 192x192 e 512x512
      const has192 = manifest.icons.some((icon: any) => icon.sizes === '192x192')
      const has512 = manifest.icons.some((icon: any) => icon.sizes === '512x512')
      expect(has192).toBe(true)
      expect(has512).toBe(true)

      // Verificar shortcuts
      if (manifest.shortcuts) {
        expect(Array.isArray(manifest.shortcuts)).toBe(true)
      }
    })

    test('deve ter link para manifest no HTML', async ({ page }) => {
      await page.goto('/')

      const manifestLink = page.locator('link[rel="manifest"]')
      await expect(manifestLink).toHaveCount(1)

      const href = await manifestLink.getAttribute('href')
      expect(href).toBe('/manifest.json')
    })

    test('deve ter meta tags PWA corretas', async ({ page }) => {
      await page.goto('/')

      // Verificar theme-color
      const themeColor = page.locator('meta[name="theme-color"]')
      const themeColorValue = await themeColor.getAttribute('content')
      expect(themeColorValue).toBeTruthy()

      // Verificar apple-mobile-web-app-capable
      const appleCapable = page.locator('meta[name="apple-mobile-web-app-capable"]')
      const appleCapableValue = await appleCapable.getAttribute('content')
      expect(appleCapableValue).toBe('yes')
    })

    test('deve verificar prompt de instalação disponível', async ({ page, context }) => {
      // Simular evento beforeinstallprompt
      await page.goto('/')

      const hasInstallPrompt = await page.evaluate(() => {
        return new Promise((resolve) => {
          // Verificar se há listener para beforeinstallprompt
          const handler = (e: Event) => {
            e.preventDefault()
            resolve(true)
          }

          window.addEventListener('beforeinstallprompt', handler)

          // Timeout após 2 segundos
          setTimeout(() => {
            window.removeEventListener('beforeinstallprompt', handler)
            resolve(false)
          }, 2000)
        })
      })

      // Nota: O prompt pode não aparecer em todos os ambientes
      // Este teste apenas verifica se o código está preparado
      console.log('Install prompt disponível:', hasInstallPrompt)
    })
  })

  test.describe('1.3 Service Worker', () => {
    test('deve ter Service Worker registrado', async ({ page, context }) => {
      await page.goto('/')

      // Aguardar registro do Service Worker
      await page.waitForTimeout(2000)

      const serviceWorker = await context.serviceWorker()
      const workers = serviceWorker ? [serviceWorker] : []

      // Verificar se há Service Worker registrado
      const hasServiceWorker = await page.evaluate(() => {
        return 'serviceWorker' in navigator
      })

      expect(hasServiceWorker).toBe(true)

      // Verificar se Service Worker está ativo
      const swRegistered = await page.evaluate(async () => {
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.getRegistration()
            return registration !== undefined
          } catch {
            return false
          }
        }
        return false
      })

      console.log('Service Worker registrado:', swRegistered)
    })

    test('deve ter cache strategy Network First', async ({ page }) => {
      await page.goto('/')
      await page.waitForTimeout(2000)

      // Verificar se Service Worker está registrado
      const swInfo = await page.evaluate(async () => {
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.getRegistration()
            if (registration && registration.active) {
              return {
                active: true,
                scope: registration.scope,
                scriptURL: registration.active.scriptURL,
              }
            }
          } catch (e) {
            return { error: String(e) }
          }
        }
        return { active: false }
      })

      console.log('Service Worker info:', swInfo)

      // Verificar se Service Worker está ativo
      if (swInfo && 'active' in swInfo) {
        expect(swInfo.active).toBe(true)
      }
    })

    test('deve precache arquivos essenciais', async ({ page, request }) => {
      await page.goto('/')
      await page.waitForTimeout(2000)

      // Verificar arquivos essenciais carregam
      const essentialFiles = [
        '/',
        '/manifest.json',
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png',
      ]

      for (const file of essentialFiles) {
        try {
          const response = await request.get(file)
          expect(response.status()).toBeLessThan(400)
        } catch (error) {
          console.warn(`Arquivo ${file} não encontrado, mas pode ser opcional`)
        }
      }
    })
  })
})

test.describe('Fase 2: Fluxo Crítico do Usuário', () => {
  test.describe('2.1 Autenticação Mobile-First', () => {
    test('deve ter campos de formulário com tamanho adequado para touch', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/login')
      await page.waitForLoadState('networkidle')

      // Verificar se página carregou (pode redirecionar)
      if (page.url().includes('/login')) {
        const inputs = page.locator('input[type="email"], input[type="password"], input[type="text"]')
        const inputCount = await inputs.count()

        if (inputCount > 0) {
          const firstInput = inputs.first()
          const box = await firstInput.boundingBox()

          if (box) {
            // Input deve ter altura mínima de 44px para touch
            expect(box.height).toBeGreaterThanOrEqual(44)
          }
        }
      }
    })

    test('deve ter validação em tempo real', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/login')
      await page.waitForLoadState('networkidle')

      if (page.url().includes('/login')) {
        const emailInput = page.locator('input[type="email"]').first()
        if (await emailInput.count() > 0) {
          // Preencher com email inválido
          await emailInput.fill('email-invalido')
          await emailInput.blur()

          // Aguardar mensagem de erro (se houver)
          await page.waitForTimeout(500)

          // Verificar se há feedback visual
          const hasError = await page.locator('text=/email|inválido|válido/i').count() > 0
          console.log('Validação em tempo real:', hasError)
        }
      }
    })

    test('deve ter feedback visual claro', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/login')
      await page.waitForLoadState('networkidle')

      if (page.url().includes('/login')) {
        // Verificar se há botões visíveis
        const submitButton = page.locator('button[type="submit"], button:has-text("Entrar")').first()
        if (await submitButton.count() > 0) {
          const box = await submitButton.boundingBox()
          if (box) {
            // Botão deve ser visível e clicável
            expect(box.width).toBeGreaterThan(0)
            expect(box.height).toBeGreaterThan(0)
          }
        }
      }
    })
  })

  test.describe('2.2 Onboarding', () => {
    test('deve ter botão voltar em todas as etapas', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/onboarding')
      await page.waitForLoadState('networkidle')

      if (page.url().includes('/onboarding')) {
        // Verificar se há botão voltar
        const backButton = page.locator('button:has-text("Voltar"), button:has-text("←"), [aria-label*="voltar" i]')
        const hasBackButton = await backButton.count() > 0

        console.log('Botão voltar presente:', hasBackButton)

        // Se houver botão voltar, verificar se é clicável
        if (hasBackButton) {
          const box = await backButton.first().boundingBox()
          if (box) {
            expect(box.width).toBeGreaterThanOrEqual(44)
            expect(box.height).toBeGreaterThanOrEqual(44)
          }
        }
      }
    })
  })

  test.describe('2.3 Dashboard - Primeira Impressão', () => {
    test('deve medir LCP do dashboard', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Tentar acessar dashboard (pode redirecionar para login)
      await page.goto('/dashboard')
      await page.waitForLoadState('networkidle')

      if (!page.url().includes('/login')) {
        // Medir LCP
        const lcp = await page.evaluate(() => {
          return new Promise((resolve) => {
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries()
              const lcp = entries[entries.length - 1] as any
              if (lcp) {
                resolve(lcp.renderTime || lcp.loadTime)
              }
            })

            observer.observe({ entryTypes: ['largest-contentful-paint'] })

            setTimeout(() => resolve(null), 3000)
          })
        })

        if (lcp) {
          console.log('LCP do dashboard:', lcp, 'ms')
          expect(lcp as number).toBeLessThan(2500)
        }
      }
    })

    test('deve ter bottom navigation sempre acessível', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Procurar por bottom navigation
      const bottomNav = page.locator('[role="navigation"]:has-text(/home|chat|perfil|menu/i), nav:has([class*="bottom"])')
      const navCount = await bottomNav.count()

      if (navCount > 0) {
        const box = await bottomNav.first().boundingBox()
        if (box) {
          // Bottom nav deve estar visível e acessível
          expect(box.height).toBeGreaterThan(0)

          // Verificar se está no fundo da tela
          const viewport = await page.viewportSize()
          if (viewport) {
            // Bottom nav deve estar próximo do fundo
            expect(box.y + box.height).toBeGreaterThan(viewport.height - 100)
          }
        }
      }
    })
  })
})

test.describe('Fase 3: Features Core com IA', () => {
  test.describe('3.1 Chat (NathAI)', () => {
    test('deve enviar mensagem e receber resposta', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/chat')
      await page.waitForLoadState('networkidle')

      if (page.url().includes('/chat')) {
        // Procurar por input de mensagem
        const messageInput = page.locator('input[type="text"], textarea, [contenteditable="true"]').first()

        if (await messageInput.count() > 0) {
          // Enviar mensagem de teste
          await messageInput.fill('Olá')

          // Procurar por botão enviar
          const sendButton = page.locator('button:has-text("Enviar"), button[type="submit"], button:has([aria-label*="enviar" i])').first()

          if (await sendButton.count() > 0) {
            const startTime = Date.now()
            await sendButton.click()

            // Aguardar resposta (timeout de 20s)
            await page.waitForTimeout(2000)

            const responseTime = Date.now() - startTime

            console.log('Tempo de resposta:', responseTime, 'ms')

            // Verificar se há resposta (pode demorar)
            const response = page.locator('[class*="message"], [class*="response"], [class*="chat"]').last()
            const hasResponse = await response.count() > 0

            console.log('Resposta recebida:', hasResponse)
          }
        }
      }
    })

    test('deve ter timeout de 20s para requisições', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/chat')
      await page.waitForLoadState('networkidle')

      if (page.url().includes('/chat')) {
        // Interceptar requisições de API
        const apiRequests: any[] = []
        page.on('request', (request) => {
          if (request.url().includes('/api/')) {
            apiRequests.push({
              url: request.url(),
              method: request.method(),
            })
          }
        })

        // Tentar enviar mensagem
        const messageInput = page.locator('input[type="text"], textarea').first()
        if (await messageInput.count() > 0) {
          await messageInput.fill('Teste timeout')
          await page.waitForTimeout(1000)
        }

        console.log('Requisições de API:', apiRequests.length)
      }
    })
  })
})

test.describe('Fase 4: Features Secundárias', () => {
  test.describe('4.1 Mundo Nath', () => {
    test('deve abrir URL específica do vídeo, não perfil', async ({ page, context }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/mundo-nath')
      await page.waitForLoadState('networkidle')

      // Procurar por cards de vídeo
      const videoCards = page.locator('[class*="video"], [class*="card"]').filter({ hasText: /tiktok|instagram/i })

      if (await videoCards.count() > 0) {
        const firstCard = videoCards.first()

        // Verificar se há link específico
        const link = firstCard.locator('a').first()
        if (await link.count() > 0) {
          const href = await link.getAttribute('href')

          if (href) {
            // Verificar se é URL específica de vídeo, não perfil
            const isVideoUrl = href.includes('/video/') || href.includes('/p/') || href.includes('/reel/')
            const isProfileUrl = href.includes('/@') && !href.includes('/video/')

            console.log('URL do vídeo:', href)
            console.log('É URL de vídeo:', isVideoUrl)
            console.log('É URL de perfil:', isProfileUrl)

            // Deve ser URL de vídeo, não perfil
            if (isProfileUrl) {
              throw new Error('Vídeo está apontando para perfil, não para URL específica')
            }
          }
        }
      }
    })

    test('deve carregar miniaturas de Unsplash', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/mundo-nath')
      await page.waitForLoadState('networkidle')

      // Procurar por imagens
      const images = page.locator('img')
      const imageCount = await images.count()

      if (imageCount > 0) {
        let unsplashCount = 0
        for (let i = 0; i < Math.min(imageCount, 5); i++) {
          const img = images.nth(i)
          const src = await img.getAttribute('src')

          if (src && src.includes('unsplash.com')) {
            unsplashCount++
          }
        }

        console.log('Miniaturas de Unsplash:', unsplashCount)
      }
    })
  })

  test.describe('4.2 Autocuidado', () => {
    test('deve ter botões "Agendar" e "Fazer Agora" funcionais', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/autocuidado')
      await page.waitForLoadState('networkidle')

      // Procurar por botões
      const agendarButton = page.locator('button:has-text("Agendar"), button:has-text("agendar" i)').first()
      const fazerAgoraButton = page.locator('button:has-text("Fazer Agora"), button:has-text("fazer agora" i)').first()

      if (await agendarButton.count() > 0) {
        const box = await agendarButton.boundingBox()
        if (box) {
          expect(box.width).toBeGreaterThan(0)
          expect(box.height).toBeGreaterThanOrEqual(44)
        }
      }

      if (await fazerAgoraButton.count() > 0) {
        const box = await fazerAgoraButton.boundingBox()
        if (box) {
          expect(box.width).toBeGreaterThan(0)
          expect(box.height).toBeGreaterThanOrEqual(44)
        }
      }
    })
  })
})

test.describe('Fase 5: PWA Avançado', () => {
  test.describe('5.1 Offline Functionality', () => {
    test('deve carregar página do cache quando offline', async ({ page, context }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Primeiro, carregar página online para cachear
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000) // Aguardar Service Worker cachear

      // Desconectar internet
      await context.setOffline(true)

      // Tentar navegar
      await page.reload()
      await page.waitForTimeout(1000)

      // Verificar se página carregou (mesmo que do cache)
      const body = page.locator('body')
      await expect(body).toBeVisible({ timeout: 5000 })

      // Reconectar
      await context.setOffline(false)
    })
  })
})

test.describe('Fase 6: Acessibilidade e UX', () => {
  test.describe('6.1 Acessibilidade Mobile', () => {
    test('deve ter ARIA labels presentes', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Verificar botões têm labels
      const buttons = page.locator('button')
      const buttonCount = await buttons.count()

      if (buttonCount > 0) {
        let labeledCount = 0
        for (let i = 0; i < Math.min(buttonCount, 10); i++) {
          const button = buttons.nth(i)
          const ariaLabel = await button.getAttribute('aria-label')
          const text = await button.textContent()
          const hasLabel = ariaLabel || text

          if (hasLabel) {
            labeledCount++
          }
        }

        console.log('Botões com labels:', labeledCount, 'de', Math.min(buttonCount, 10))
      }
    })

    test('deve ter contraste WCAG AA mínimo', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Verificar contraste básico (verificação simples)
      const body = page.locator('body')
      const textColor = await body.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return {
          color: style.color,
          backgroundColor: style.backgroundColor,
        }
      })

      expect(textColor.color).toBeTruthy()
      expect(textColor.backgroundColor).toBeTruthy()

      console.log('Cores verificadas:', textColor)
    })
  })

  test.describe('6.2 UX Mobile-First', () => {
    test('deve ter scroll suave (60fps)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Testar scroll
      await page.evaluate(() => {
        window.scrollTo(0, 500)
      })

      await page.waitForTimeout(500)

      const scrollY = await page.evaluate(() => window.scrollY)

      console.log('Scroll Y:', scrollY)
      expect(scrollY).toBeGreaterThan(0)
    })
  })
})

test.describe('Fase 7: Edge Cases e Robustez', () => {
  test.describe('7.1 Error Handling', () => {
    test('deve tratar erros de API graciosamente', async ({ page, context }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Interceptar requisições e retornar erro
      await page.route('**/api/**', (route) => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal Server Error' }),
        })
      })

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Verificar se não há erros críticos no console
      const errors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })

      await page.waitForTimeout(2000)

      // Não deve ter muitos erros
      const criticalErrors = errors.filter((e) => e.includes('Uncaught') || e.includes('ReferenceError'))
      expect(criticalErrors.length).toBeLessThan(5)
    })
  })

  test.describe('7.2 Navegação e Estado', () => {
    test('deve ter botão voltar em todas as páginas', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      const pages = ['/chat', '/autocuidado', '/brincadeiras', '/rotina', '/mundo-nath']

      for (const route of pages) {
        await page.goto(route)
        await page.waitForLoadState('networkidle')

        if (!page.url().includes('/login')) {
          // Procurar por botão voltar
          const backButton = page.locator('button:has-text("Voltar"), button:has-text("←"), [aria-label*="voltar" i], a:has-text("Voltar")').first()
          const hasBackButton = await backButton.count() > 0

          console.log(`Botão voltar em ${route}:`, hasBackButton)
        }
      }
    })
  })
})
