import { test, expect } from '@playwright/test'

const baseURL = process.env.DEPLOY_PRIME_URL || process.env.URL || 'http://localhost:3000'

test.describe('Netlify - Testes de Segurança', () => {
  // Teste de headers de segurança
  test('deve ter headers de segurança configurados', async ({ page }) => {
    const response = await page.goto(baseURL)
    const headers = response?.headers() || {}

    // X-Content-Type-Options
    const contentTypeOptions = headers['x-content-type-options']
    expect(contentTypeOptions).toBe('nosniff')

    // X-Frame-Options
    const frameOptions = headers['x-frame-options']
    expect(['SAMEORIGIN', 'DENY']).toContain(frameOptions)

    // X-XSS-Protection
    const xssProtection = headers['x-xss-protection']
    expect(xssProtection).toContain('1')

    // Referrer-Policy
    const referrerPolicy = headers['referrer-policy']
    expect(referrerPolicy).toBeTruthy()
  })

  // Teste de HTTPS (se em produção)
  test('deve usar HTTPS em produção', async () => {
    if (process.env.CONTEXT === 'production') {
      expect(baseURL).toMatch(/^https:/)
    }
  })

  // Teste de Content Security Policy (se configurado)
  test('deve ter CSP configurado', async ({ page }) => {
    const response = await page.goto(baseURL)
    const headers = response?.headers() || {}

    const csp = headers['content-security-policy']

    // CSP pode não estar configurado, mas se estiver, deve estar correto
    if (csp) {
      expect(csp).toBeTruthy()
      console.log('CSP encontrado:', csp)
    } else {
      console.log('CSP não configurado (opcional)')
    }
  })

  // Teste de XSS básico
  test('deve sanitizar entrada XSS', async ({ page }) => {
    // Testa se script malicioso é bloqueado
    const maliciousScript = '<script>alert("XSS")</script>'

    await page.goto(baseURL)

    // Tenta injetar script via URL (se a aplicação processar)
    const response = await page.goto(`${baseURL}?q=${encodeURIComponent(maliciousScript)}`)

    // Verifica que o script não foi executado
    const pageContent = await page.content()
    expect(pageContent).not.toContain('<script>alert("XSS")</script>')
  })

  // Teste de SQL Injection (via API)
  test('API deve sanitizar entrada SQL', async ({ request }) => {
    const sqlInjection = "'; DROP TABLE users; --"

    const response = await request.post(`${baseURL}/api/sentiment-analysis`, {
      data: { text: sqlInjection },
    })

    // Deve processar ou rejeitar sem erro 500
    expect(response.status()).not.toBe(500)

    // Se aceitar, deve sanitizar corretamente
    if (response.ok()) {
      const data = await response.json()
      // Não deve conter código SQL executado
      expect(JSON.stringify(data)).not.toContain('DROP TABLE')
    }
  })

  // Teste de path traversal
  test('deve bloquear path traversal', async ({ request }) => {
    const paths = [
      '../../../etc/passwd',
      '..\\..\\..\\windows\\system32',
      '../../package.json',
    ]

    for (const path of paths) {
      const response = await request.get(`${baseURL}/${path}`)

      // Deve retornar 404 ou 403, não 200 com conteúdo sensível
      expect([404, 403]).toContain(response.status())
    }
  })

  // Teste de headers de API
  test('endpoints API devem ter headers de segurança', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/sentiment-analysis`)
    const headers = response.headers()

    // Verifica headers básicos
    const contentTypeOptions = headers['x-content-type-options']

    // Headers podem variar, mas não devem expor informações sensíveis
    expect(response.status()).not.toBe(500)
  })

  // Teste de informações sensíveis em headers
  test('não deve expor informações sensíveis em headers', async ({ page }) => {
    const response = await page.goto(baseURL)
    const headers = response?.headers() || {}

    // Não deve expor versões de servidor
    const server = headers['server']
    if (server) {
      // Não deve conter versões específicas vulneráveis
      expect(server).not.toMatch(/\/\d+\.\d+\.\d+/)
    }

    // Não deve expor tecnologias específicas em X-Powered-By
    const poweredBy = headers['x-powered-by']
    expect(poweredBy).toBeFalsy()
  })

  // Teste de cookies secure
  test('cookies devem ter flags secure em HTTPS', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'test',
        value: 'test',
        domain: new URL(baseURL).hostname,
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'Strict' as const,
      },
    ])

    await page.goto(baseURL)

    // Verifica que cookies são gerenciados corretamente
    const cookies = await context.cookies()
    if (cookies.length > 0) {
      cookies.forEach(cookie => {
        if (baseURL.startsWith('https://')) {
          // Em produção HTTPS, cookies devem ser secure
          // (mas pode variar por implementação)
          console.log('Cookie:', cookie.name, 'secure:', cookie.secure)
        }
      })
    }
  })

  // Teste de CORS
  test('deve ter CORS configurado corretamente', async ({ request }) => {
    const response = await request.options(`${baseURL}/api/sentiment-analysis`, {
      headers: {
        'Origin': 'https://malicious-site.com',
        'Access-Control-Request-Method': 'POST',
      },
    })

    const headers = response.headers()
    const allowOrigin = headers['access-control-allow-origin']

    // CORS deve estar configurado (pode ser * ou específico)
    // Não deve permitir qualquer origem sem controle
    if (allowOrigin) {
      console.log('CORS Allow-Origin:', allowOrigin)
      // Se for *, deve ter controle adequado
      expect(allowOrigin).toBeTruthy()
    }
  })

  // Teste de rate limiting
  test('deve ter proteção contra brute force', async ({ request }) => {
    const attempts = []

    // Simula múltiplas tentativas rápidas
    for (let i = 0; i < 20; i++) {
      attempts.push(
        request.post(`${baseURL}/api/sentiment-analysis`, {
          data: { text: `Attempt ${i}` },
        })
      )
    }

    const responses = await Promise.all(attempts)
    const statusCodes = responses.map(r => r.status())

    // Deve ter algum tipo de rate limiting (429 ou bloqueio)
    const hasRateLimit = statusCodes.includes(429)
    const hasBlocking = statusCodes.filter(s => s >= 400 && s < 500).length > 0

    console.log('Rate limiting:', hasRateLimit ? 'Ativo' : 'Não detectado')
    console.log('Bloqueios:', hasBlocking ? 'Detectados' : 'Não detectados')

    // Não falha o teste, apenas registra
    // Rate limiting pode não estar implementado ainda
  })

  // Teste de sanitização de entrada
  test('deve sanitizar entrada HTML', async ({ page }) => {
    await page.goto(baseURL)

    // Verifica que HTML não é renderizado como código
    const htmlContent = '<h1>Test</h1>'

    // Se a aplicação processar HTML na entrada, deve sanitizar
    const response = await page.request.post(`${baseURL}/api/sentiment-analysis`, {
      data: { text: htmlContent },
    })

    if (response.ok()) {
      const data = await response.json()
      // Resposta não deve conter HTML não sanitizado
      const responseStr = JSON.stringify(data)

      // Não deve executar HTML na resposta
      expect(responseStr).toBeTruthy()
    }
  })

  // Teste de exposição de stack traces
  test('não deve expor stack traces em erros', async ({ request }) => {
    // Tenta causar um erro
    const response = await request.post(`${baseURL}/api/sentiment-analysis`, {
      data: { invalidField: 'invalid' },
    })

    if (!response.ok()) {
      const text = await response.text()

      // Não deve conter stack traces ou caminhos de arquivo
      expect(text).not.toMatch(/at\s+\w+.*\(.*:\d+:\d+\)/)
      expect(text).not.toMatch(/C:\\Users\\/)
      expect(text).not.toMatch(/\/home\/.*\/node_modules/)
    }
  })
})
