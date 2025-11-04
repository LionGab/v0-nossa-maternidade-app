# 🧪 Esquema de Testes E2E - Nossa Maternidade

## 📋 Visão Geral

Esquema completo de testes end-to-end usando Playwright para garantir qualidade e funcionalidade do aplicativo.

## 🎯 Cobertura de Testes

### 1. Testes de Navegação e Estrutura (`browser-complete.spec.ts`)
- ✅ Carregamento de páginas
- ✅ PWA manifest
- ✅ Responsividade (mobile, tablet, desktop)
- ✅ Estrutura HTML

### 2. Testes de Autenticação (`browser-auth.spec.ts`)
- ✅ Login
- ✅ Signup
- ✅ Validação de formulários
- ✅ Proteção de rotas
- ✅ Logout

### 3. Testes de Fluxos de Usuário (`browser-flows.spec.ts`)
- ✅ Onboarding
- ✅ Chat com IA
- ✅ Perfil do Bebê
- ✅ Receitas
- ✅ Navegação completa

### 4. Testes de Performance
- ✅ Tempo de carregamento
- ✅ Otimização de imagens
- ✅ Lazy loading

### 5. Testes de Acessibilidade
- ✅ Headings
- ✅ Labels em formulários
- ✅ Contraste de cores

### 6. Testes de API
- ✅ Integração com APIs
- ✅ Tratamento de erros

### 7. Testes de PWA
- ✅ Service Worker
- ✅ Manifest
- ✅ Ícones

### 8. Testes de Segurança
- ✅ Headers de segurança
- ✅ Informações sensíveis
- ✅ HTTPS

## 🚀 Como Executar

### Executar Todos os Testes

```bash
npm run test:e2e
```

### Executar Testes Específicos

```bash
# Testes completos
npx playwright test e2e/browser-complete.spec.ts

# Testes de autenticação
npx playwright test e2e/browser-auth.spec.ts

# Testes de fluxos
npx playwright test e2e/browser-flows.spec.ts
```

### Executar com UI

```bash
npm run test:e2e:ui
```

### Executar em Modo Debug

```bash
npx playwright test --debug
```

## 📊 Estrutura dos Testes

```
e2e/
├── browser-complete.spec.ts    # Testes gerais e estrutura
├── browser-auth.spec.ts         # Testes de autenticação
├── browser-flows.spec.ts        # Testes de fluxos de usuário
├── app.spec.ts                  # Testes básicos (existente)
├── api.spec.ts                  # Testes de API (existente)
├── performance.spec.ts          # Testes de performance (existente)
└── security.spec.ts             # Testes de segurança (existente)
```

## 🎨 Categorias de Testes

### 1. Testes de Navegação
- Carregamento de páginas
- Navegação entre páginas
- Breadcrumbs
- Links internos/externos

### 2. Testes de Formulários
- Validação de campos
- Submissão de formulários
- Mensagens de erro
- Feedback visual

### 3. Testes de Interatividade
- Cliques em botões
- Hover states
- Animações
- Transições

### 4. Testes de Conteúdo
- Renderização de conteúdo
- Imagens
- Textos
- Layout

### 5. Testes de Integração
- APIs
- Supabase
- Autenticação
- Dados

## 🔧 Configuração

### Playwright Config

O arquivo `playwright.config.ts` está configurado para:
- ✅ Executar em paralelo
- ✅ Retry automático em CI
- ✅ Reporter HTML
- ✅ Web server automático
- ✅ Trace on first retry

### Variáveis de Ambiente

Criar arquivo `.env.test` para testes:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service
```

## 📝 Checklist de Testes

### Testes Críticos (Sempre Passar)
- [ ] Página inicial carrega
- [ ] Login funciona
- [ ] Signup funciona
- [ ] Proteção de rotas funciona
- [ ] Navegação funciona

### Testes Importantes (Maioria Deve Passar)
- [ ] Formulários validam corretamente
- [ ] APIs respondem corretamente
- [ ] Responsividade funciona
- [ ] PWA funciona

### Testes Desejáveis (Alguns Podem Falhar)
- [ ] Performance otimizada
- [ ] Acessibilidade completa
- [ ] Todas as páginas funcionam

## 🐛 Troubleshooting

### Problema: Testes falham por timeout

**Solução:**
```typescript
// Aumentar timeout no teste específico
test('meu teste', async ({ page }) => {
  test.setTimeout(60000) // 60 segundos
  // ...
})
```

### Problema: Elemento não encontrado

**Solução:**
```typescript
// Usar waitFor antes de interagir
await page.waitForSelector('button')
await page.click('button')
```

### Problema: Autenticação requerida

**Solução:**
```typescript
// Fazer login antes dos testes
test.beforeEach(async ({ page }) => {
  await page.goto('/login')
  // Preencher credenciais de teste
  // ...
})
```

## 📈 Relatórios

### HTML Report

Após executar os testes:
```bash
npx playwright show-report
```

### Coverage Report

```bash
npm run test:coverage
```

## 🚀 CI/CD

### GitHub Actions

Os testes podem ser executados em CI:

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e
```

## 📚 Recursos

- [Playwright Documentation](https://playwright.dev)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [API Testing](https://playwright.dev/docs/test-api-testing)

---

**Pronto para testar! Execute `npm run test:e2e` 🚀**
