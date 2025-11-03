# 🧪 Guia Completo de Testes - Nossa Maternidade

Este documento fornece uma visão geral completa do ambiente de testes do projeto.

---

## 📋 Visão Geral

O projeto utiliza duas ferramentas principais de teste:

- **Vitest**: Testes unitários e de integração
- **Playwright**: Testes end-to-end (E2E)

---

## 🚀 Configuração Rápida

### Instalar Dependências

```bash
pnpm install
```

### Executar Todos os Testes

```bash
pnpm test:all
```

---

## 🧪 Testes Unitários (Vitest)

### Executar Testes

```bash
# Rodar uma vez
pnpm test

# Modo watch (recarrega automaticamente)
pnpm test:watch

# Interface visual
pnpm test:ui

# Com cobertura de código
pnpm test:coverage

# Abrir relatório de cobertura no navegador
pnpm test:coverage:open
```

### Estrutura de Testes

```
__tests__/
├── lib/
│   ├── utils.test.ts              # Testes de utilitários
│   └── validations/
│       └── schemas.test.ts         # Testes de validação Zod
├── hooks/
│   ├── use-mobile.test.ts          # Testes de hooks
│   ├── use-toast.test.ts
│   └── use-data.test.ts
├── mocks/
│   └── supabase.ts                 # Mocks do Supabase
└── test-utils.tsx                  # Utilitários de teste
```

### Configuração

Arquivo `vitest.config.ts`:
- Ambiente: jsdom (para testes React)
- Coverage: v8
- Aliases: `@/*` configurado
- Setup automático: `vitest.setup.ts`

### Metas de Cobertura

- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

---

## 🎭 Testes E2E (Playwright)

### Executar Testes

```bash
# Rodar todos os testes
pnpm test:e2e

# Interface visual
pnpm test:e2e:ui

# Modo headed (com navegador visível)
pnpm test:e2e:headed

# Modo debug
pnpm test:e2e:debug
```

### Estrutura de Testes E2E

```
e2e/
└── auth.spec.ts                   # Testes de autenticação
```

### Configuração

Arquivo `playwright.config.ts`:
- Browsers: Chrome, Firefox, Safari, Mobile
- Web server automático
- Trace, screenshots e vídeos em falhas
- Timeouts configurados

---

## 📝 Escrevendo Testes

### Testes Unitários - Exemplo

```typescript
import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('lib/utils', () => {
  describe('cn', () => {
    it('deve mesclar classes', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })
  })
})
```

### Testes de Componentes - Exemplo

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/__tests__/test-utils'
import { MyComponent } from '@/components/my-component'

describe('MyComponent', () => {
  it('deve renderizar corretamente', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Testes de Hooks - Exemplo

```typescript
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIsMobile } from '@/hooks/use-mobile'

describe('useIsMobile', () => {
  it('deve retornar true para mobile', () => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', { value: 375 })

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })
})
```

### Testes E2E - Exemplo

```typescript
import { test, expect } from '@playwright/test'

test.describe('Autenticação', () => {
  test('deve fazer login', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/dashboard/)
  })
})
```

---

## 🔧 Utilitários e Mocks

### test-utils.tsx

Contém:
- `render`: Render customizado com providers
- Mocks de dados (users, profiles, etc.)
- Helpers úteis

### Mocks do Supabase

```typescript
import { createMockSupabaseClient } from '@/__tests__/mocks/supabase'

const mockClient = createMockSupabaseClient()
```

---

## 📊 Cobertura de Testes

### Verificar Cobertura

```bash
pnpm test:coverage
```

Isso gera:
- `coverage/` - Relatórios HTML
- `coverage/lcov.info` - Para CI/CD
- `test-results.json` - Resultados em JSON

### Relatório HTML

Após executar `pnpm test:coverage`, abra:

```
coverage/index.html
```

---

## 🔄 CI/CD

### Script para CI

```bash
pnpm test:ci
```

Executa:
1. Testes unitários com coverage
2. Testes E2E com reporter de lista

### GitHub Actions

O projeto inclui configuração para CI/CD (ver `.github/workflows/ci.yml`)

---

## 🐛 Debugging

### Debug de Testes Unitários

```bash
# Usar debugger
pnpm test:watch
# Adicionar `debugger` no código
```

### Debug de Testes E2E

```bash
# Modo debug com UI
pnpm test:e2e:debug

# Ou com headed mode
pnpm test:e2e:headed
```

---

## 📚 Boas Práticas

### 1. Nomear Testes

Use descrições claras:

```typescript
// ✅ Bom
it('deve validar email inválido', () => { ... })

// ❌ Ruim
it('test email', () => { ... })
```

### 2. AAA Pattern

Arrange, Act, Assert:

```typescript
it('deve somar números', () => {
  // Arrange
  const a = 2
  const b = 3

  // Act
  const result = sum(a, b)

  // Assert
  expect(result).toBe(5)
})
```

### 3. Isolamento

Cada teste deve ser independente:

```typescript
beforeEach(() => {
  // Limpar state antes de cada teste
  vi.clearAllMocks()
})
```

### 4. Mocking

Use mocks para dependências externas:

```typescript
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => mockClient),
}))
```

---

## 🎯 Tarefas de Teste

### Prioridade Alta

- [x] Configurar Vitest
- [x] Criar testes de validação
- [x] Criar testes de hooks
- [x] Criar testes de utilitários
- [ ] Criar testes de componentes principais
- [ ] Expandir testes E2E

### Prioridade Média

- [ ] Testes de integração
- [ ] Testes de performance
- [ ] Visual regression testing
- [ ] Testes de acessibilidade

---

## 📖 Recursos

- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## ❓ FAQ

### Como adicionar um novo teste?

1. Crie o arquivo `*.test.ts` ou `*.spec.ts` em `__tests__/`
2. Escreva os testes
3. Execute `pnpm test:watch` para ver os resultados

### Como mockar uma API?

Use `vi.mock()`:

```typescript
vi.mock('@/lib/api', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'test' }),
}))
```

### Como testar componentes que usam hooks do Next.js?

Mocke os hooks no `vitest.setup.ts` ou no arquivo de teste:

```typescript
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))
```

---

**Última Atualização:** 2025-11-02
**Versão:** 1.0
