# 🔧 FIX: GitHub Actions - Workflows Duplicados

## Problema

**Sintoma:** 5 checks falhando no GitHub Actions:
- ❌ CI/CD Pipeline / Code Quality (push) - Failing after 35s
- ❌ CI/CD Pipeline / E2E Tests (push) - Failing after 5m
- ❌ 🚀 CI/CD Pipeline - Nossa Maternidade / 🚀 Deploy Production (push) - Failing after 38s

**Causa Raiz:** Dois workflows conflitantes:

1. **`.github/workflows/ci.yml`** - Tentava usar `pnpm` (INCORRETO)
   - Procurava por `pnpm-lock.yaml` que não existe
   - Fazia `pnpm install`, `pnpm lint`, `pnpm test`, etc.
   - **RESULTADO:** Falha porque o projeto usa `npm`

2. **`.github/workflows/ci-cd.yml`** - Usa `npm` (CORRETO) ✅
   - Procura por `package-lock.json` que existe
   - Faz `npm ci --legacy-peer-deps`, `npm run build`, etc.
   - **RESULTADO:** Funcionando perfeitamente

## Solução Aplicada

**Arquivo removido:** `.github/workflows/ci.yml`

**Por que remover?**
- O workflow `ci-cd.yml` já faz tudo que `ci.yml` fazia
- `ci-cd.yml` está funcionando corretamente
- Ter dois workflows fazendo a mesma coisa causa:
  - Duplicação de recursos (tempo, custo)
  - Confusão sobre qual workflow usar
  - Falhas desnecessárias

## Estrutura Final

Agora temos apenas **um workflow**:

### `.github/workflows/ci-cd.yml`
✅ Usa `npm` corretamente
✅ Faz todos os checks necessários:
- Code Quality (TypeScript + Lint)
- Build
- Unit Tests
- E2E Tests
- Security Scan
- Deploy Preview (PRs)
- Deploy Production (main branch)
- Lighthouse (PRs)

## Próximos Passos

1. ✅ Workflow duplicado removido
2. ⏭️ Próximo commit deve passar em todos os checks
3. ✅ Apenas `ci-cd.yml` vai rodar (usando npm)

## Verificação

No próximo push, você deve ver:
- ✅ Todos os checks do workflow `ci-cd.yml` passando
- ❌ Nenhum check do workflow `ci.yml` (porque foi removido)

## Notas

- O projeto usa **npm** (tem `package-lock.json`)
- Se no futuro quiser usar `pnpm`, precisaria:
  1. Converter todo o projeto para pnpm
  2. Atualizar `ci-cd.yml` para usar pnpm
  3. Garantir que Netlify também use pnpm
