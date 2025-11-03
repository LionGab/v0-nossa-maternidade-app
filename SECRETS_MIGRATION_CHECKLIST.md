# ✅ CHECKLIST DE MIGRAÇÃO DE SECRETS

Este checklist guia a migração segura de secrets expostos para ambientes protegidos.

---

## 🚨 FASE 1: REVOGAÇÃO URGENTE (Fazer AGORA)

### Supabase
- [ ] Acessar https://supabase.com/dashboard
- [ ] Selecionar projeto no Supabase Dashboard
- [ ] Settings → API → Rotate `service_role` key
- [ ] Settings → API → Rotate `anon` key
- [ ] **ANOTAR** as novas chaves (você só verá uma vez!)

### Sentry
- [ ] Acessar https://sentry.io/settings/
- [ ] Project Settings → Client Keys
- [ ] Revogar DSN: `5f090bd5a472ece70d4fb583bd01f3d1`
- [ ] Gerar novo DSN
- [ ] **ANOTAR** novo DSN

### Verificar Logs
- [ ] Supabase Dashboard → Logs → Verificar acessos suspeitos
- [ ] Sentry Dashboard → Verificar eventos anômalos
- [ ] OpenAI/Anthropic Dashboards → Verificar uso não autorizado

---

## 📝 FASE 2: PREPARAÇÃO DE AMBIENTES

### Local (Desenvolvimento)
- [ ] Criar/atualizar `.env.local` com novas chaves
- [ ] Verificar que `.env.local` está no `.gitignore`
- [ ] Copiar `.env.example` como base
- [ ] Preencher com valores reais (não commitar!)

### Netlify (Produção)
- [ ] Acessar Netlify Dashboard → Site settings → Environment variables
- [ ] Configurar variáveis obrigatórias:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `SENTRY_DSN` (novo)
- [ ] Configurar variáveis opcionais:
  - [ ] `ANTHROPIC_API_KEY`
  - [ ] `OPENAI_API_KEY`
  - [ ] `GOOGLE_AI_API_KEY`

### Contextos Netlify
- [ ] Configurar variáveis para `production`
- [ ] Configurar variáveis para `deploy-preview` (se diferente)
- [ ] Configurar variáveis para `branch-deploy` (se diferente)

---

## 🔧 FASE 3: ATUALIZAÇÃO DO CÓDIGO

### Arquivos Corrigidos (Já aplicado)
- [x] `cursor-mcp-config.json` → Usa variáveis de ambiente
- [x] `mcp-config-example.json` → Placeholders seguros
- [x] `sentry.*.config.ts` → Usa `process.env.SENTRY_DSN`
- [x] `.env.example` → Template seguro criado

### Validação
- [ ] Testar build local: `npm run build`
- [ ] Testar servidor local: `npm run dev`
- [ ] Verificar que Sentry está funcionando (novo DSN)
- [ ] Verificar que Supabase está conectando (novas chaves)

---

## 🚀 FASE 4: DEPLOY E VALIDAÇÃO

### Deploy no Netlify
- [ ] Fazer commit das correções (sem secrets!)
- [ ] Push para `main` branch
- [ ] Aguardar build automático
- [ ] Verificar logs de build no Netlify

### Validação em Produção
- [ ] Acessar site em produção
- [ ] Testar login/signup (Supabase)
- [ ] Verificar erros no Sentry (deve estar funcionando)
- [ ] Testar funcionalidades que usam AI (OpenAI/Anthropic)
- [ ] Verificar logs do Netlify para erros

---

## 🛡️ FASE 5: SEGURANÇA FUTURA

### Pre-commit Hook (Já implementado)
- [x] Hook criado em `.husky/pre-commit`
- [ ] Testar hook localmente (tentar commitar `.env` deve falhar)
- [ ] Documentar para equipe sobre o hook

### Secrets Manager (Recomendado)
- [ ] Avaliar uso de Doppler (https://www.doppler.com)
- [ ] Avaliar uso de AWS Secrets Manager
- [ ] Configurar integração com Netlify (se implementar)

### Monitoramento
- [ ] Configurar alertas no Supabase para uso anômalo
- [ ] Configurar alertas no Sentry para eventos críticos
- [ ] Configurar alertas de custo no OpenAI/Anthropic

---

## 📋 VARIÁVEIS DE AMBIENTE NECESSÁRIAS

### Obrigatórias
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...nova-chave
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...nova-chave
SENTRY_DSN=https://novo-dsn@sentry.io/projeto
```

### Opcionais (pelo menos uma AI)
```env
ANTHROPIC_API_KEY=sk-ant-...nova-chave
OPENAI_API_KEY=sk-proj-...nova-chave
GOOGLE_AI_API_KEY=AIza...nova-chave
```

### URLs e Configurações
```env
NEXT_PUBLIC_APP_URL=https://seu-site.netlify.app
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://seu-site.netlify.app/onboarding
NODE_ENV=production
```

---

## ⚠️ NOTAS IMPORTANTES

1. **NUNCA** commitar arquivos `.env*` com valores reais
2. **SEMPRE** usar `.env.example` como template
3. **REVOGAR** chaves antigas após gerar novas
4. **TESTAR** localmente antes de fazer deploy
5. **DOCUMENTAR** qualquer mudança de configuração

---

**Status:** Em progresso
**Última atualização:** $(date)
