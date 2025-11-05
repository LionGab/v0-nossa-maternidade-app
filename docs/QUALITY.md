# Guia de Qualidade - Nossa Maternidade

## Visão Geral

Este guia documenta os processos e ferramentas de garantia de qualidade do projeto.

## Scripts de Qualidade

### Scripts Principais

#### `npm run quality`
Executa validação completa de qualidade (type-check, lint, tests).

**Modo padrão:**
- Type-check (TypeScript)
- Lint (ESLint)
- Testes unitários (Vitest)
- Validação de env vars
- Validação de build

**Uso:**
```bash
npm run quality
```

#### `npm run quality:fast`
Executa validação rápida (pula E2E tests).

**Uso:**
```bash
npm run quality:fast
```

#### `npm run quality:all`
Executa validação completa incluindo E2E tests.

**Uso:**
```bash
npm run quality:all
```

---

### Scripts Individuais

#### `npm run type-check`
Verifica tipos TypeScript sem gerar arquivos.

**Uso:**
```bash
npm run type-check
```

#### `npm run lint`
Executa ESLint em todos os arquivos `.ts` e `.tsx`.

**Uso:**
```bash
npm run lint
```

#### `npm run lint:fix`
Executa ESLint e corrige problemas automaticamente.

**Uso:**
```bash
npm run lint:fix
```

#### `npm run test`
Executa testes unitários (Vitest).

**Uso:**
```bash
npm run test
```

#### `npm run test:coverage`
Executa testes unitários com relatório de cobertura.

**Uso:**
```bash
npm run test:coverage
```

#### `npm run test:e2e`
Executa testes E2E (Playwright).

**Uso:**
```bash
npm run test:e2e
```

#### `npm run validate`
Executa validações críticas (type-check + lint + tests).

**Uso:**
```bash
npm run validate
```

#### `npm run validate:e2e`
Executa validações críticas + E2E tests.

**Uso:**
```bash
npm run validate:e2e
```

---

## Processo de Validação

### Antes do Commit

1. **Pre-commit hooks (Husky):**
   - Type-check (fast)
   - Lint-staged (apenas arquivos staged)
   - Bloqueia commit se houver erros

2. **Manual:**
   ```bash
   npm run quality:fast
   ```

### Antes do Merge

1. **Validação completa:**
   ```bash
   npm run quality:all
   ```

2. **Checklist:**
   - [ ] Type-check passou
   - [ ] Lint passou (sem erros)
   - [ ] Testes unitários passaram (≥ 70% coverage)
   - [ ] E2E tests passaram (se aplicável)
   - [ ] Build passou sem erros
   - [ ] Env vars validadas

### No CI/CD

1. **GitHub Actions:**
   - Quality Check (type-check, lint, tests)
   - Build Check
   - E2E Tests
   - Security Scan
   - Coverage Report

---

## Ferramentas de Qualidade

### TypeScript

**Configuração:** `tsconfig.json`

**Regras:**
- Strict mode habilitado
- Type checking em todos os arquivos
- Sem `any` explícito (warn)

**Como verificar:**
```bash
npm run type-check
```

---

### ESLint

**Configuração:** `eslint.config.mjs`

**Regras principais:**
- `no-console`: warn (exceto `console.warn` e `console.error`)
- `no-debugger`: error
- `@typescript-eslint/no-explicit-any`: warn
- `@typescript-eslint/no-unused-vars`: warn
- `react-hooks/rules-of-hooks`: error
- `react-hooks/exhaustive-deps`: warn

**Como verificar:**
```bash
npm run lint
```

**Como corrigir:**
```bash
npm run lint:fix
```

---

### Vitest

**Configuração:** `vitest.config.ts`

**Coverage mínimo:** 70%
- Lines: 70%
- Functions: 70%
- Branches: 70%
- Statements: 70%

**Como executar:**
```bash
npm run test
```

**Com coverage:**
```bash
npm run test:coverage
```

---

### Playwright

**Configuração:** `playwright.config.ts`

**Plataformas testadas:**
- Desktop: Chrome, Firefox, Safari
- Mobile: Chrome (Android), Safari (iOS)

**Como executar:**
```bash
npm run test:e2e
```

---

## Validação de Env Vars

**Script:** `scripts/validate-env.mjs`

**Variáveis obrigatórias:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Variáveis opcionais:**
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `GOOGLE_AI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Como validar:**
```bash
node scripts/validate-env.mjs
```

---

## Validação de Build

**Script:** `scripts/validate-build.mjs`

**Validações:**
- Build sem erros
- Bundle size dentro do limite
- Assets otimizados
- PWA manifest válido

**Como validar:**
```bash
node scripts/validate-build.mjs
```

---

## Pre-Commit Hooks

**Ferramenta:** Husky + lint-staged

**Configuração:** `.husky/pre-commit`

**Validações:**
- Type-check (fast)
- Lint-staged (apenas arquivos staged)

**Como instalar:**
```bash
npm install
npx husky install
```

---

## CI/CD

**Workflow:** `.github/workflows/ci-cd.yml`

**Jobs:**
1. **Quality Check:** Type-check, lint, tests
2. **Build Check:** Next.js build
3. **E2E Tests:** Playwright tests
4. **Security Scan:** npm audit, Snyk
5. **Coverage Report:** Upload para artifacts

**Como verificar:**
- Abrir PR no GitHub
- Verificar status dos jobs no Actions tab

---

## Checklist de Qualidade

### Antes do Commit

- [ ] `npm run quality:fast` passou
- [ ] Pre-commit hooks executaram sem erros
- [ ] Código formatado (Prettier)

### Antes do Merge

- [ ] `npm run quality:all` passou
- [ ] Type-check sem erros
- [ ] Lint sem erros
- [ ] Testes unitários passaram (≥ 70% coverage)
- [ ] E2E tests passaram (se aplicável)
- [ ] Build passou sem erros
- [ ] Env vars validadas
- [ ] Documentação atualizada (se necessário)

### No CI/CD

- [ ] Todos os jobs passaram
- [ ] Coverage report gerado
- [ ] Security scan sem vulnerabilidades críticas

---

## Troubleshooting

### ESLint não funciona

**Problema:** `npm run lint` falha

**Solução:**
1. Verificar se `eslint.config.mjs` está correto
2. Verificar se dependências estão instaladas: `npm install`
3. Executar: `npm run lint:fix`

---

### Type-check falha

**Problema:** `npm run type-check` retorna erros

**Solução:**
1. Verificar `tsconfig.json`
2. Verificar tipos nos arquivos `.ts` e `.tsx`
3. Corrigir erros de tipo

---

### Testes falham

**Problema:** `npm run test` retorna falhas

**Solução:**
1. Verificar se testes estão atualizados
2. Verificar se mocks estão corretos
3. Executar: `npm run test:watch` para debug

---

### Coverage baixo

**Problema:** Coverage < 70%

**Solução:**
1. Adicionar testes para arquivos não cobertos
2. Verificar `vitest.config.ts` (thresholds)
3. Executar: `npm run test:coverage` para ver detalhes

---

## Próximos Passos

1. Aumentar coverage mínimo gradualmente (70% → 80%)
2. Adicionar mais regras ESLint conforme necessário
3. Configurar mais testes E2E
4. Adicionar validações adicionais no CI/CD

---

**Última atualização:** 2025-01-27
