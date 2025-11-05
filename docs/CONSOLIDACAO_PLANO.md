# Plano de Consolidação - Nossa Maternidade

## Decisões Estratégicas (Travar Agora)

### 1. Arquitetura: Monorepo Leve ✅
**Decisão:** Monorepo com workspaces (pnpm + turborepo)

**Estrutura:**
```
nossa-maternidade/
├── apps/
│   └── mobile/          # Expo React Native (LionNath)
├── packages/
│   └── shared/          # Tipos, prompts, UI tokens, validações
├── infra/
│   └── supabase/        # Edge Functions
├── .github/
│   └── workflows/       # CI/CD unificado
└── docs/                # Documentação única
```

**Justificativa:**
- Shared code centralizado
- Pipeline único
- Versionamento coerente
- Escalável para time

### 2. PWA Web: ❌ Não (MVP)
**Decisão:** Focar 100% mobile. Expo Web apenas se necessário depois.

**Ações:**
- Eliminar Playwright (web)
- Manter apenas Detox/Maestro (mobile)
- Netlify apenas para marketing (se houver)

### 3. E2E: Maestro ✅
**Decisão:** Maestro (mais simples e estável em CI)

**Justificativa:**
- Menos setup
- Melhor em CI headless
- Cross-platform nativo

### 4. Roteamento IA (padronizar em shared)
```typescript
// packages/shared/nat-ai/routing.ts
- Empatia/Moderação → Claude
- Long-context/Análise → Gemini
- Pesquisa/Citações → Perplexity
- Execução/Tarefas → Manus
- Fallbacks: apenas conteúdo não sensível
```

---

## Fases de Consolidação

### Fase 1: Base (3-5 dias) 🔴 AGORA

**Entregáveis:**
1. ✅ Repo unificado (monorepo)
2. ✅ CI passa-verde (lint + typecheck + Vitest + security)
3. ✅ Secrets unificados (nomenclatura única)
4. ✅ Docs consolidados (INDEX.md)

**Critérios de Aceite:**
- Push em PR roda lint + typecheck + unit + audit → ✅ OK
- `docs/INDEX.md` tem links para local/test/deploy

**Riscos:**
- ⚠️ Conflitos de dependências entre apps
- ⚠️ Secrets duplicados/inconsistentes

**Mitigação:**
- Resolver dependências antes de merge
- Auditoria de secrets antes de consolidar

---

### Fase 2: Infra (3-5 dias) 🟡 PRÓXIMA

**Entregáveis:**
1. ✅ GitHub Actions mobile (EAS Build/Submit)
2. ✅ E2E mobile (Maestro) - 1 fluxo crítico
3. ✅ Ambientes (.env.example + matriz dev/staging/prod)
4. ✅ Security scan (npm audit + Snyk)

**Critérios de Aceite:**
- PR em `main` → preview Expo (QR)
- Tag `vX.Y.Z` → release stores (track internal/beta)
- E2E roda em Android headless (login → dashboard)

**Riscos:**
- ⚠️ Credenciais iOS/Android (EAS) bloqueadoras
- ⚠️ Custos de build EAS

**Mitigação:**
- Configurar contas EAS + 2FA no início
- Caches e limites de matrix builds

---

### Fase 3: Código & IA (5-7 dias) 🟡 PRÓXIMA

**Entregáveis:**
1. ✅ Edge Functions migradas + testes (Deno/Vitest)
2. ✅ NatIA consolidada (`packages/shared/nat-ai/`)
3. ✅ Guardrails + risk analyzer + Zod schemas
4. ✅ SLO performance mobile (TTI, cold start, bundle)

**Critérios de Aceite:**
- Functions: testes cobrem moderação + risco
- NatIA: JSON validado (Zod) + flags (risk_level, requires_human_review)
- Bundle mobile otimizado (deps mortas removidas)

**Riscos:**
- ⚠️ Rate limits IA
- ⚠️ Lógica de moderação complexa

**Mitigação:**
- Circuit breaker por provedor
- Fallbacks + logs
- Revisão humana obrigatória para regras sensíveis

---

### Fase 4: Produção (2-3 dias) 🟢 POLIMENTO

**Entregáveis:**
1. ✅ EAS Build + Submit (canais preview → staging → production)
2. ✅ Sentry (app + functions) + Analytics
3. ✅ Release train definido

**Critérios de Aceite:**
- Play Store / App Store: internal → closed beta → production
- Sentry: erros rastreados
- Analytics: eventos-chave (sign-up, MAU, retenção D7)

**Riscos:**
- ⚠️ Processo de review das stores
- ⚠️ Compliance LGPD

**Mitigação:**
- Documentar processo de release
- Revisar políticas de privacidade

---

## Priorização (Impacto × Esforço)

### 🔴 Crítico (Agora)
1. Unificar repo + pipelines
2. Secrets e ambientes
3. E2E 1 fluxo crítico

### 🟡 Importante (2 semanas)
4. Edge Functions + testes
5. NatIA consolidada
6. Telemetria (Sentry + eventos)

### 🟢 Polimento
7. PWA Expo Web (se decidido)
8. Coverage ≥70%
9. RLS contract tests
10. A11y baseline

---

## Redundâncias a Eliminar

### ❌ Duplicidade
- **Tipagem**: Dois schemas → `packages/shared`
- **Regras segurança**: Espalhadas → `docs/SECURITY.md` + contract tests
- **UI tokens**: Strings/tema duplicados → `packages/shared/ui-tokens`
- **Variáveis ambiente**: Divergentes → `.env.example` único

### ✅ Ações
- [ ] Audit de tipos duplicados
- [ ] Consolidar RLS em doc único
- [ ] Extrair tokens UI para shared
- [ ] Unificar .env.example

---

## Checklist de Aceite Final

Antes do merge de consolidação:

- [ ] `main` builda e testa em **<10 min** (lint, types, unit, e2e-smoke, audit)
- [ ] `docs/` único com **INDEX**; nenhum doc duplicado nos apps
- [ ] **Secrets** e **.env.example** revisados e limpos
- [ ] **1 fluxo E2E** passando em CI (Android headless)
- [ ] **Supabase functions** com testes e logs
- [ ] **Sentry** enviando eventos de app e functions
- [ ] **Release train** definido + **canais EAS** criados

---

## Próximos Passos Imediatos

1. ✅ Criar branch `consolidation/monorepo`
2. ✅ Mover workflows do `v0-nossa-maternidade-app/.github` → ajustar para Expo/EAS
3. ✅ Criar `packages/shared` (tipos Zod, prompts, scores EPDS, tokens UI)
4. ✅ Configurar Maestro + 1 cenário E2E
5. ✅ Subir secrets (GitHub/Expo) → documentar em `docs/DEPLOY_PRODUCTION.md`
6. ✅ Rodar pipeline completo em PR teste → corrigir flakes

---

**Status:** 🟡 Em Planejamento
**Última atualização:** 2025-01-27
