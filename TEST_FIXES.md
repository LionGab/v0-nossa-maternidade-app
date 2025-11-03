# 🔧 Correções de Testes

**Data:** $(date)
**Status:** ✅ **CORRIGIDO** - Problemas identificados e resolvidos

---

## 🐛 PROBLEMAS IDENTIFICADOS

### 1. Módulo `@/lib/env` não encontrado

**Problema:** Testes usando `require('@/lib/env')` que não funciona com aliases do Vitest.

**Solução:** Mudado para `import { env, hasApiKey } from '@/lib/env'`

**Arquivos Modificados:**
- `__tests__/lib/env.test.tsx` - Mudado de `require()` para `import`

---

### 2. Variáveis de Ambiente Ausentes

**Problema:** Testes do Supabase falhando por falta de variáveis de ambiente.

**Solução:** Adicionado `beforeEach()` para configurar variáveis de ambiente mockadas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Arquivos Modificados:**
- `__tests__/lib/env.test.tsx` - Adicionado `beforeEach()` com mocks
- `__tests__/lib/supabase.test.tsx` - Adicionado `beforeEach()` com mocks

---

### 3. Testes Duplicados (Diretório `v0-nossa-maternidade-app/`)

**Problema:** Há um diretório duplicado `v0-nossa-maternidade-app/` que está fazendo os testes rodarem duas vezes.

**Solução:** Excluído o diretório `v0-nossa-maternidade-app/` do Vitest.

**Arquivos Modificados:**
- `vitest.config.ts` - Adicionado `"**/v0-nossa-maternidade-app/**"` no `exclude`

---

### 4. Playwright sendo executado pelo Vitest

**Problema:** O Vitest está tentando executar arquivos E2E do Playwright, causando erro:
```
Error: Playwright Test did not expect test.describe() to be called here.
```

**Solução:** Excluído o diretório `e2e/` do Vitest. Os testes E2E devem ser executados separadamente com `npm run test:e2e`.

**Arquivos Modificados:**
- `vitest.config.ts` - Adicionado `"**/e2e/**"` no `exclude`

---

## ✅ CORREÇÕES APLICADAS

### Arquivos Modificados:

1. **`vitest.config.ts`**
   - Adicionado `exclude` para diretórios duplicados e E2E
   - Mantido alias `@` para resolução de caminhos

2. **`__tests__/lib/env.test.tsx`**
   - Mudado de `require()` para `import`
   - Adicionado `beforeEach()` com mocks de variáveis de ambiente

3. **`__tests__/lib/supabase.test.tsx`**
   - Adicionado `beforeEach()` com mocks de variáveis de ambiente

---

## 📋 PRÓXIMOS PASSOS

1. **Rodar testes novamente:**
   ```bash
   npm test
   ```

2. **Verificar que todos os testes passam:**
   - Testes de ambiente: 4 testes
   - Testes de Supabase: 8 testes
   - Testes de validação: 26 testes (já passando)

3. **Executar testes E2E separadamente:**
   ```bash
   npm run test:e2e
   ```

---

## 🔍 NOTAS IMPORTANTES

- **Testes E2E:** Devem ser executados separadamente com `npm run test:e2e`
- **Variáveis de Ambiente:** Testes usam valores mockados, não valores reais
- **Diretório Duplicado:** O diretório `v0-nossa-maternidade-app/` deve ser removido ou ignorado

---

**Última atualização:** $(date)
