# ✅ Checklist de Correções - Nossa Maternidade

Este documento contém um checklist detalhado de todas as correções e melhorias que precisam ser implementadas.

---

## 🔴 CRÍTICO - Fazer Primeiro

### Autenticação
- [ ] Remover `lib/supabase/browser-client.ts` customizado
- [ ] Criar `lib/supabase/client.ts` usando padrão oficial
- [ ] Criar `lib/supabase/server.ts` para server-side
- [ ] Criar `middleware.ts` para proteção de rotas
- [ ] Atualizar `app/login/page.tsx` para usar novo client
- [ ] Atualizar `app/signup/page.tsx` para usar novo client
- [ ] Atualizar todas as páginas protegidas
- [ ] Testar fluxo completo de login/signup/logout

### Banco de Dados
- [ ] Executar script para corrigir trigger `handle_new_user()`
- [ ] Testar signup de novo usuário
- [ ] Verificar se profile é criado corretamente
- [ ] Verificar se gamificação é inicializada

### Limpeza de Código
- [ ] Remover TODOS os `console.log("[v0]")`
- [ ] Manter apenas `console.error` para erros críticos
- [ ] Adicionar logging estruturado onde necessário

---

## ⚠️ ALTA PRIORIDADE

### Validação de Dados
- [ ] Criar `lib/validations/onboarding.ts` com Zod
- [ ] Criar `lib/validations/chat.ts` com Zod
- [ ] Criar `lib/validations/diary.ts` com Zod
- [ ] Criar `lib/validations/community.ts` com Zod
- [ ] Atualizar API de onboarding para validar
- [ ] Atualizar API de chat para validar
- [ ] Atualizar API de diary para validar
- [ ] Atualizar API de community para validar

### Tratamento de Erros
- [ ] Adicionar try-catch em todas as APIs
- [ ] Retornar mensagens de erro apropriadas
- [ ] Adicionar logging de erros
- [ ] Criar componente de ErrorBoundary
- [ ] Adicionar error tracking (Sentry)

### Segurança
- [ ] Testar todas as RLS policies
- [ ] Adicionar rate limiting nas APIs
- [ ] Adicionar proteção CSRF
- [ ] Sanitizar inputs do usuário
- [ ] Verificar permissões em todas as operações

---

## 📊 MÉDIA PRIORIDADE

### Testes
- [ ] Configurar Vitest
- [ ] Criar testes para validações
- [ ] Criar testes para componentes principais
- [ ] Criar testes para hooks
- [ ] Configurar Playwright
- [ ] Criar testes E2E para autenticação
- [ ] Criar testes E2E para onboarding
- [ ] Criar testes E2E para funcionalidades principais
- [ ] Atingir 60%+ de cobertura

### Performance
- [ ] Adicionar indexes no banco
- [ ] Implementar caching com SWR
- [ ] Adicionar lazy loading de componentes
- [ ] Otimizar imagens com next/image
- [ ] Analisar e reduzir bundle size
- [ ] Implementar code splitting

### Documentação
- [ ] Atualizar README.md
- [ ] Criar ARCHITECTURE.md
- [ ] Criar API_DOCS.md
- [ ] Criar TROUBLESHOOTING.md
- [ ] Adicionar comentários no código
- [ ] Documentar decisões de arquitetura

---

## 🔧 BAIXA PRIORIDADE

### CI/CD
- [ ] Configurar GitHub Actions
- [ ] Adicionar job de lint
- [ ] Adicionar job de type check
- [ ] Adicionar job de testes
- [ ] Adicionar job de build
- [ ] Configurar deploy automático

### Monitoramento
- [ ] Configurar Sentry
- [ ] Configurar Vercel Analytics
- [ ] Adicionar logging estruturado
- [ ] Configurar alertas de erro
- [ ] Criar dashboard de métricas

### UX/UI
- [ ] Melhorar loading states
- [ ] Adicionar skeleton loaders
- [ ] Melhorar mensagens de erro
- [ ] Adicionar animações suaves
- [ ] Testar acessibilidade
- [ ] Testar em diferentes dispositivos

---

## 📝 Detalhamento por Arquivo

### Arquivos para REMOVER
- [ ] `lib/supabase/browser-client.ts` (substituir por padrão oficial)
- [ ] `lib/supabase/middleware.ts` (se existir, mover para raiz)

### Arquivos para CRIAR
- [ ] `lib/supabase/client.ts` (padrão oficial)
- [ ] `lib/supabase/server.ts` (padrão oficial)
- [ ] `middleware.ts` (proteção de rotas)
- [ ] `lib/validations/onboarding.ts`
- [ ] `lib/validations/chat.ts`
- [ ] `lib/validations/diary.ts`
- [ ] `lib/validations/community.ts`
- [ ] `lib/rate-limit.ts`
- [ ] `lib/hooks/use-gamification.ts`
- [ ] `lib/hooks/use-profile.ts`
- [ ] `vitest.config.ts`
- [ ] `vitest.setup.ts`
- [ ] `playwright.config.ts`
- [ ] `sentry.client.config.ts`
- [ ] `sentry.server.config.ts`
- [ ] `.github/workflows/ci.yml`
- [ ] `ARCHITECTURE.md`
- [ ] `API_DOCS.md`
- [ ] `TROUBLESHOOTING.md`

### Arquivos para ATUALIZAR
- [ ] `app/login/page.tsx` (usar novo client)
- [ ] `app/signup/page.tsx` (usar novo client)
- [ ] `app/dashboard/page.tsx` (adicionar proteção)
- [ ] `app/onboarding/page.tsx` (adicionar validação)
- [ ] `app/api/onboarding/route.ts` (adicionar validação)
- [ ] `app/api/multi-ai/chat/route.ts` (adicionar validação e rate limiting)
- [ ] `app/api/gamification/stats/route.ts` (adicionar validação)
- [ ] `components/gamification-widget.tsx` (usar SWR, remover logs)
- [ ] `package.json` (adicionar scripts de teste)
- [ ] `README.md` (atualizar documentação)

---

## 🗄️ Scripts SQL para Executar

### 1. Corrigir Trigger
\`\`\`sql
-- Ver seção 1.3 do CURSOR_MIGRATION_PLAN.md
-- Arquivo: scripts/fix_handle_new_user.sql
\`\`\`

### 2. Adicionar Indexes
\`\`\`sql
-- Ver seção 3.1 do CURSOR_MIGRATION_PLAN.md
-- Arquivo: scripts/add_indexes.sql
\`\`\`

### 3. Testar RLS Policies
\`\`\`sql
-- Criar testes para cada policy
-- Arquivo: scripts/test_rls_policies.sql
\`\`\`

---

## 🧪 Testes para Criar

### Testes Unitários
- [ ] `__tests__/lib/validations/onboarding.test.ts`
- [ ] `__tests__/lib/validations/chat.test.ts`
- [ ] `__tests__/lib/validations/diary.test.ts`
- [ ] `__tests__/lib/validations/community.test.ts`
- [ ] `__tests__/components/gamification-widget.test.tsx`
- [ ] `__tests__/components/dark-mode-toggle.test.tsx`
- [ ] `__tests__/lib/hooks/use-gamification.test.ts`

### Testes E2E
- [ ] `e2e/auth.spec.ts` (login, signup, logout)
- [ ] `e2e/onboarding.spec.ts` (fluxo completo)
- [ ] `e2e/gamification.spec.ts` (pontos, níveis, achievements)
- [ ] `e2e/chat.spec.ts` (conversa com IA)
- [ ] `e2e/diary.spec.ts` (criar entrada)
- [ ] `e2e/community.spec.ts` (criar post, comentar)

---

## 📦 Dependências para Adicionar

### Desenvolvimento
\`\`\`bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm install -D @playwright/test
npm install -D @vitejs/plugin-react
\`\`\`

### Produção
\`\`\`bash
npm install zod
npm install @upstash/ratelimit @upstash/redis
npm install @sentry/nextjs
npm install swr
\`\`\`

---

## ✅ Critérios de Conclusão

### Fase 1 Completa Quando:
- [ ] Login/signup funcionando perfeitamente
- [ ] Middleware protegendo rotas
- [ ] Trigger do banco corrigida
- [ ] Zero logs de debug
- [ ] Validação em todas as APIs

### Fase 2 Completa Quando:
- [ ] Vitest configurado e funcionando
- [ ] 60%+ cobertura de testes unitários
- [ ] Playwright configurado
- [ ] Testes E2E para fluxos críticos
- [ ] Todos os testes passando

### Fase 3 Completa Quando:
- [ ] Indexes adicionados no banco
- [ ] Caching implementado com SWR
- [ ] Rate limiting em todas as APIs
- [ ] Performance otimizada
- [ ] Auditoria de segurança completa

### Fase 4 Completa Quando:
- [ ] Documentação completa
- [ ] CI/CD configurado
- [ ] Monitoramento configurado
- [ ] Deploy em produção
- [ ] Smoke tests passando

---

## 🎯 Meta Final

**App de produção robusto, seguro e manutenível que o cliente consegue manter sozinho.**

Critérios:
- ✅ Zero erros críticos
- ✅ 60%+ cobertura de testes
- ✅ Documentação completa
- ✅ Performance otimizada
- ✅ Segurança auditada
- ✅ Monitoramento configurado
- ✅ Cliente treinado

---

**Use este checklist para acompanhar o progresso da migração! ✅**
