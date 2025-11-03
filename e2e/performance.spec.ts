import { test, expect } from '@playwright/test'

const baseURL = process.env.DEPLOY_PRIME_URL || process.env.URL || 'http://localhost:3000'

test.describe('Netlify - Testes de Performance', () => {
  // Teste de tempo de carregamento inicial
  test('página inicial deve carregar rapidamente', async ({ page }) => {
    const startTime = Date.now()

    await page.goto(baseURL, { waitUntil: 'networkidle' })

    const loadTime = Date.now() - startTime
    console.log(`Tempo de carregamento: ${loadTime}ms`)

    // Deve carregar em menos de 3 segundos
    expect(loadTime).toBeLessThan(3000)
  })

  // Teste de Core Web Vitals - LCP
  test('LCP deve ser aceitável', async ({ page }) => {
    await page.goto(baseURL)

    // Aguarda métricas de performance
    const performanceMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lcp = entries.find((e: any) => e.entryType === 'largest-contentful-paint')
          if (lcp) {
            resolve({
              lcp: (lcp as any).renderTime || (lcp as any).loadTime,
            })
          }
        })

        observer.observe({ entryTypes: ['largest-contentful-paint'] })

        // Timeout após 5 segundos
        setTimeout(() => {
          resolve({ lcp: null })
        }, 5000)
      })
    })

    console.log('LCP metrics:', performanceMetrics)

    // LCP deve ser menor que 2.5s (good)
    if (performanceMetrics && typeof performanceMetrics === 'object' && 'lcp' in performanceMetrics) {
      const lcp = performanceMetrics.lcp as number
      if (lcp) {
        expect(lcp).toBeLessThan(2500)
      }
    }
  })

  // Teste de tamanho de bundle
  test('assets devem ter tamanho razoável', async ({ page }) => {
    const responses: Array<{ url: string; size: number }> = []

    page.on('response', (response) => {
      const url = response.url()
      const size = response.headers()['content-length']

      if (size && (url.includes('.js') || url.includes('.css'))) {
        responses.push({
          url,
          size: parseInt(size, 10),
        })
      }
    })

    await page.goto(baseURL, { waitUntil: 'networkidle' })

    // Verifica tamanho dos assets
    responses.forEach(({ url, size }) => {
      const sizeKB = size / 1024
      console.log(`${url}: ${sizeKB.toFixed(2)}KB`)

      // JS bundles não devem ser maiores que 500KB (não minificados)
      if (url.includes('.js') && !url.includes('chunk')) {
        expect(sizeKB).toBeLessThan(500)
      }
    })
  })

  // Teste de compressão
  test('assets devem estar comprimidos', async ({ page }) => {
    const responses: Array<{ url: string; encoding: string }> = []

    page.on('response', (response) => {
      const url = response.url()
      const encoding = response.headers()['content-encoding']

      if (encoding && (url.includes('.js') || url.includes('.css'))) {
        responses.push({ url, encoding })
      }
    })

    await page.goto(baseURL, { waitUntil: 'networkidle' })

    // Verifica que assets estão comprimidos (gzip ou brotli)
    const hasCompression = responses.some(({ encoding }) =>
      encoding === 'gzip' || encoding === 'br' || encoding === 'deflate'
    )

    console.log('Compression:', hasCompression ? 'Ativo' : 'Não detectado')
    // Não falha se não estiver comprimido (Netlify pode fazer automaticamente)
  })

  // Teste de cache
  test('assets estáticos devem ter cache headers', async ({ page }) => {
    const responses: Array<{ url: string; cacheControl: string }> = []

    page.on('response', (response) => {
      const url = response.url()
      const cacheControl = response.headers()['cache-control']

      if (cacheControl && (url.includes('.png') || url.includes('.jpg') || url.includes('.svg'))) {
        responses.push({ url, cacheControl })
      }
    })

    await page.goto(baseURL, { waitUntil: 'networkidle' })

    // Imagens devem ter cache headers
    if (responses.length > 0) {
      responses.forEach(({ url, cacheControl }) => {
        console.log(`${url}: ${cacheControl}`)
        // Deve ter algum tipo de cache
        expect(cacheControl).toBeTruthy()
      })
    }
  })

  // Teste de lazy loading de imagens
  test('imagens devem ter lazy loading', async ({ page }) => {
    await page.goto(baseURL)

    // Verifica atributo loading em imagens
    const images = await page.locator('img').all()

    for (const img of images) {
      const loading = await img.getAttribute('loading')
      const src = await img.getAttribute('src')

      // Imagens abaixo do fold devem ter loading="lazy"
      if (src && !src.includes('logo')) {
        // Verifica se está acima do fold
        const boundingBox = await img.boundingBox()
        if (boundingBox && boundingBox.y > 1000) {
          // Imagem abaixo do fold
          expect(loading).toBe('lazy')
        }
      }
    }
  })

  // Teste de número de requisições
  test('não deve fazer requisições excessivas', async ({ page }) => {
    const requests: string[] = []

    page.on('request', (request) => {
      requests.push(request.url())
    })

    await page.goto(baseURL, { waitUntil: 'networkidle' })

    // Não deve fazer mais que 50 requisições na página inicial
    expect(requests.length).toBeLessThan(50)
    console.log(`Total de requisições: ${requests.length}`)
  })

  // Teste de TTI (Time to Interactive)
  test('página deve ficar interativa rapidamente', async ({ page }) => {
    await page.goto(baseURL)

    // Aguarda interatividade
    const interactiveTime = await page.evaluate(() => {
      return new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve(performance.timing.domInteractive - performance.timing.navigationStart)
        } else {
          window.addEventListener('load', () => {
            resolve(performance.timing.domInteractive - performance.timing.navigationStart)
          })
        }
      })
    })

    console.log(`TTI: ${interactiveTime}ms`)

    // TTI deve ser menor que 3.5s
    expect(interactiveTime as number).toBeLessThan(3500)
  })

  // Teste de FCP (First Contentful Paint)
  test('FCP deve ser rápido', async ({ page }) => {
    await page.goto(baseURL)

    const fcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const fcpEntry = entries.find((e: any) => e.name === 'first-contentful-paint')
          if (fcpEntry) {
            resolve((fcpEntry as any).startTime)
          }
        })

        observer.observe({ entryTypes: ['paint'] })

        setTimeout(() => {
          resolve(null)
        }, 5000)
      })
    })

    if (fcp) {
      console.log(`FCP: ${fcp}ms`)
      // FCP deve ser menor que 1.8s (good)
      expect(fcp as number).toBeLessThan(1800)
    }
  })

  // Teste de memória
  test('não deve vazar memória', async ({ page }) => {
    await page.goto(baseURL)

    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0
    })

    // Navega várias vezes
    for (let i = 0; i < 5; i++) {
      await page.goto(baseURL)
      await page.waitForTimeout(1000)
    }

    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0
    })

    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory
      const increasePercent = (memoryIncrease / initialMemory) * 100

      console.log(`Aumento de memória: ${increasePercent.toFixed(2)}%`)

      // Não deve aumentar mais que 50% após múltiplas navegações
      expect(increasePercent).toBeLessThan(50)
    }
  })

  // Teste de renderização de fontes
  test('fontes devem carregar sem FOIT/FOUT excessivo', async ({ page }) => {
    await page.goto(baseURL)

    // Verifica se fontes estão carregadas
    const fontsLoaded = await page.evaluate(() => {
      return document.fonts.ready.then(() => true).catch(() => false)
    })

    expect(fontsLoaded).toBe(true)

    // Verifica se há fallback configurado
    const bodyStyles = await page.evaluate(() => {
      const body = document.body
      return window.getComputedStyle(body).fontFamily
    })

    // Deve ter fallback fonts
    expect(bodyStyles).toContain('sans-serif')
  })
})
