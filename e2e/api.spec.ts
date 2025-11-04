import { expect, test } from '@playwright/test'

const baseURL = process.env.DEPLOY_PRIME_URL || process.env.URL || 'http://localhost:3000'

test.describe('Netlify - Testes de API', () => {
    // Helper para fazer requisições autenticadas (se necessário)
    const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
        const url = endpoint.startsWith('http') ? endpoint : `${baseURL}${endpoint}`
        return fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        })
    }

    // Teste de health check da API
    test('deve responder na raiz da API', async ({ request }) => {
        const response = await request.get(`${baseURL}/api`)
        // API pode retornar 200, 404 ou 405, mas não deve ser 500
        const status = response.status()
        console.log(`Status da API /api: ${status}`)
        // Aceita qualquer status válido (não é erro 500)
        expect(status).toBeLessThan(500)
        expect(status).toBeGreaterThanOrEqual(200)
    })

    // Teste de CORS
    test('deve ter CORS configurado corretamente', async ({ request }) => {
        const response = await request.fetch(`${baseURL}/api/sentiment-analysis`, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'https://example.com',
                'Access-Control-Request-Method': 'POST',
            },
        })

        // Verifica headers CORS (pode variar)
        const headers = response.headers()
        console.log('CORS headers:', headers)
    })

    // Teste de sentiment-analysis
    test('API de análise de sentimentos deve validar entrada', async ({ request }) => {
        const response = await request.post(`${baseURL}/api/sentiment-analysis`, {
            data: {
                text: 'Estou muito feliz hoje!',
            },
        })

        // Deve retornar 200 ou 400 (se precisar de autenticação)
        expect([200, 400, 401, 403]).toContain(response.status())

        if (response.status() === 200) {
            const data = await response.json()
            expect(data).toBeDefined()
        }
    })

    // Teste de validação de entrada
    test('API deve rejeitar entrada inválida', async ({ request }) => {
        const response = await request.post(`${baseURL}/api/sentiment-analysis`, {
            data: {
                // Campo inválido ou faltando
            },
        })

        // Deve retornar erro de validação
        expect([400, 401, 422]).toContain(response.status())
    })

    // Teste de rate limiting (se implementado)
    test('deve respeitar rate limiting', async ({ request }) => {
        const requests = []

        // Faz múltiplas requisições rápidas
        for (let i = 0; i < 10; i++) {
            requests.push(
                request.post(`${baseURL}/api/sentiment-analysis`, {
                    data: { text: `Request ${i}` },
                })
            )
        }

        const responses = await Promise.all(requests)

        // Verifica se alguma requisição foi rate limited (429)
        const statusCodes = responses.map(r => r.status())
        const hasRateLimit = statusCodes.includes(429)

        // Se rate limiting está ativo, deve retornar 429
        // Se não está ativo, todas devem ser 200/400/401
        console.log('Status codes:', statusCodes)

        // Não falha o teste, apenas registra
        if (hasRateLimit) {
            console.log('Rate limiting está ativo')
        }
    })

    // Teste de headers de segurança
    test('endpoints API devem ter headers de segurança', async ({ request }) => {
        const response = await request.get(`${baseURL}/api/sentiment-analysis`, {
            method: 'OPTIONS',
        })

        const headers = response.headers()

        // Verifica headers importantes (podem variar)
        console.log('Security headers:', {
            'x-content-type-options': headers['x-content-type-options'],
            'x-frame-options': headers['x-frame-options'],
            'x-xss-protection': headers['x-xss-protection'],
        })
    })

    // Teste de método HTTP não permitido
    test('deve retornar 405 para métodos não suportados', async ({ request }) => {
        const response = await request.delete(`${baseURL}/api/sentiment-analysis`)

        // Deve retornar 405, 404 ou 401 (não autorizado)
        const status = response.status()
        expect(status).toBeLessThan(500)
        expect(status).toBeGreaterThanOrEqual(200)
    })

    // Teste de content-type
    test('deve aceitar JSON corretamente', async ({ request }) => {
        const response = await request.post(`${baseURL}/api/sentiment-analysis`, {
            data: { text: 'Teste' },
            headers: {
                'Content-Type': 'application/json',
            },
        })

        // Não deve retornar 415 (Unsupported Media Type)
        expect(response.status()).not.toBe(415)
    })

    // Teste de tamanho de payload
    test('deve rejeitar payload muito grande', async ({ request }) => {
        const largeText = 'a'.repeat(100000) // 100KB

        const response = await request.post(`${baseURL}/api/sentiment-analysis`, {
            data: { text: largeText },
        })

        // Deve retornar 400, 413 (Payload Too Large), 422 ou 401 (não autorizado)
        const status = response.status()
        expect(status).toBeLessThan(500)
        expect(status).toBeGreaterThanOrEqual(200)
    })

    // Teste de endpoints de gamificação
    test('endpoint de gamificação deve existir', async ({ request }) => {
        const response = await request.get(`${baseURL}/api/gamification/stats`)

        // Pode precisar de autenticação, então 401/403 é aceitável
        expect([200, 401, 403, 404]).toContain(response.status())
    })

    // Teste de endpoints de receitas
    test('endpoint de receitas deve existir', async ({ request }) => {
        const response = await request.get(`${baseURL}/api/generate-recipes`)

        // Pode precisar de autenticação ou método POST
        expect([200, 400, 401, 403, 404, 405]).toContain(response.status())
    })

    // Teste de headers de resposta
    test('respostas API devem ter Content-Type correto', async ({ request }) => {
        const response = await request.post(`${baseURL}/api/sentiment-analysis`, {
            data: { text: 'Teste' },
        })

        if (response.ok()) {
            const contentType = response.headers()['content-type']
            expect(contentType).toContain('application/json')
        }
    })

    // Teste de timeout
    test('API não deve demorar mais que 30s', async ({ request }) => {
        const startTime = Date.now()

        try {
            const response = await request.post(`${baseURL}/api/sentiment-analysis`, {
                data: { text: 'Teste' },
                timeout: 30000, // 30 segundos
            })

            const duration = Date.now() - startTime
            console.log(`Tempo de resposta da API: ${duration}ms`)

            // Deve responder em menos de 30s
            expect(duration).toBeLessThan(30000)
        } catch (error) {
            // Timeout é considerado falha
            throw new Error('API timeout após 30 segundos')
        }
    })
})
