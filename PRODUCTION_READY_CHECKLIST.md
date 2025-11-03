# ✅ CHECKLIST FINAL DE PRODUÇÃO

**Data:** $(date)
**Status:** 🟡 **PRÉ-PRODUÇÃO** - Aguardando validações finais

---

## 🔒 FASE 1: SEGURANÇA

### Variáveis de Ambiente
- [x] `.env.example` criado com todos os placeholders
- [x] Nenhuma chave hardcoded no código
- [x] `cursor-mcp-config.json` usa variáveis de ambiente
- [x] `mcp-config-example.json` usa placeholders seguros
- [ ] **AÇÃO:** Revogar chaves antigas (se expostas) - Ver `SECRETS_ROTATION_GUIDE.md`
- [ ] **AÇÃO:** Configurar variáveis no Netlify Dashboard
- [ ] **AÇÃO:** Criar `.env.local` local (não commitar!)

### Histórico Git
- [x] Script de limpeza criado: `scripts/clean-git-history.sh`
- [ ] **AÇÃO:** Verificar histórico: `git log --all --full-history --source --remotes -p -- ".env*"`
- [ ] **AÇÃO:** Executar script se necessário (force push requerido)

---

## 🔧 FASE 2: BUILD E DEPENDÊNCIAS

### Sentry
- [x] Arquivos de configuração criados
- [x] Integração com loggers implementada
- [x] Configuração opcional (não quebra build)
- [ ] **AÇÃO:** Instalar Sentry: `npm install --save @sentry/nextjs`
- [ ] **AÇÃO:** Configurar `SENTRY_DSN` no Netlify

### Build
- [x] Arquivos preparados para build
- [x] `next.config.mjs` atualizado
- [ ] **AÇÃO:** Rodar `npm run build` e corrigir erros TypeScript
- [ ] **AÇÃO:** Verificar bundle size (não deve exceder limites)
- [ ] **AÇÃO:** Testar `npm run dev` e verificar startup

---

## 🖼️ FASE 3: PERFORMANCE DE IMAGENS

### Script de Otimização
- [x] `scripts/optimize-images.mjs` criado
- [x] Adicionado ao `package.json`: `npm run optimize:images`
- [ ] **AÇÃO:** Instalar sharp-cli: `npm install -g sharp-cli`
- [ ] **AÇÃO:** Executar: `npm run optimize:images`
- [ ] **AÇÃO:** Verificar `IMAGE_OPTIMIZATION_REPORT.md` gerado

### Manifest.json
- [x] Manifest verificado
- [ ] **AÇÃO:** Após otimização, atualizar para usar WebP quando disponível

### Métricas
- [ ] Tamanho original total: ___ KB
- [ ] Tamanho otimizado total: ___ KB
- [ ] Economia: ___ KB (___%)
- [ ] Meta: Redução de 30-50%

---

## 🧹 FASE 4: LIMPEZA DE CÓDIGO

### Console.log
- [x] Verificado - Todos migrados para logger/clientLogger
- [x] Nenhum console.log direto em código de produção
- [x] Apenas logger interno usa console (aceitável)

### TODOs
- [x] `lib/logger.ts` - TODOs resolvidos
- [x] `lib/logger-client.ts` - TODOs resolvidos
- [x] Integração com Sentry implementada

---

## ✅ FASE 5: VALIDAÇÃO FINAL

### Testes
- [ ] **AÇÃO:** Rodar `npm test` (Vitest)
- [ ] **AÇÃO:** Rodar `npm run test:coverage` (mínimo 70%)
- [ ] **AÇÃO:** Rodar `npm run test:e2e` (Playwright)
- [ ] **AÇÃO:** Verificar que todos os testes passam

### PWA
- [ ] **AÇÃO:** Verificar `public/manifest.json` completo
- [ ] **AÇÃO:** Testar service worker: `public/sw.js`
- [ ] **AÇÃO:** Testar instalação iOS (Safari)
- [ ] **AÇÃO:** Testar instalação Android (Chrome)
- [ ] **AÇÃO:** Verificar que funciona offline

### Build Final
- [ ] **AÇÃO:** `npm run build` sem erros
- [ ] **AÇÃO:** Verificar bundle size
- [ ] **AÇÃO:** Testar todas as 19 rotas manualmente:
  - [ ] `/` (home)
  - [ ] `/dashboard`
  - [ ] `/chat`
  - [ ] `/mundo-nath`
  - [ ] `/receitas`
  - [ ] `/maternidade-hoje`
  - [ ] `/rotina`
  - [ ] `/autocuidado`
  - [ ] `/brincadeiras`
  - [ ] `/historias-sono`
  - [ ] `/birras`
  - [ ] `/perfil-bebe`
  - [ ] `/login`
  - [ ] `/signup`
  - [ ] `/onboarding`
  - [ ] Outras rotas específicas

### Verificação de Secrets
- [ ] **AÇÃO:** Inspecionar `.next/static/chunks/` após build
- [ ] **AÇÃO:** Buscar por padrões: `sk-`, `eyJ`, `AIza`
- [ ] **AÇÃO:** Confirmar que nenhum secret está no bundle

---

## 📊 MÉTRICAS FINAIS

### Performance
- [ ] Bundle size total: ___ KB
- [ ] First Contentful Paint (FCP): ___ s (meta: < 1.8s)
- [ ] Largest Contentful Paint (LCP): ___ s (meta: < 2.5s)
- [ ] Time to Interactive (TTI): ___ s (meta: < 3.8s)
- [ ] Lighthouse Score: ___ /100 (meta: 90+)

### Segurança
- [ ] Secrets no código: ✅ **Nenhum**
- [ ] Secrets no histórico Git: ⚠️ **Verificar manualmente**
- [ ] Secrets no bundle: ⏳ **Aguardando build**

### Código
- [ ] Console.log em produção: ✅ **Zero**
- [ ] TODOs críticos: ✅ **Zero**
- [ ] Erros TypeScript: ⏳ **Aguardando build**
- [ ] Testes passando: ⏳ **Aguardando execução**
- [ ] Coverage: ⏳ **Aguardando execução**

---

## 🚀 DEPLOY

### Pré-Deploy
- [ ] Todas as fases acima validadas
- [ ] Variáveis de ambiente configuradas no Netlify
- [ ] Build local passando sem erros
- [ ] Testes passando

### Netlify
- [ ] Variáveis de ambiente configuradas:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `SENTRY_DSN` (se usando Sentry)
  - [ ] `ANTHROPIC_API_KEY` (opcional)
  - [ ] `OPENAI_API_KEY` (opcional)
  - [ ] `GOOGLE_AI_API_KEY` (opcional)
  - [ ] `NEXT_PUBLIC_APP_URL`
  - [ ] `NODE_ENV=production`

### Pós-Deploy
- [ ] Site acessível em produção
- [ ] Login/Signup funcionando (Supabase)
- [ ] Rotas protegidas redirecionando corretamente
- [ ] APIs respondendo corretamente
- [ ] PWA instalável e funcionando offline
- [ ] Sentry reportando erros (se configurado)
- [ ] Analytics funcionando (se configurado)

---

## 📋 VALIDAÇÃO FINAL

### Checklist de Aprovação
- [ ] Todas as fases de segurança validadas
- [ ] Build passando sem erros
- [ ] Todos os testes passando
- [ ] PWA funcionando completamente
- [ ] Performance dentro das metas
- [ ] Sem secrets expostos
- [ ] Documentação atualizada
- [ ] Deploy bem-sucedido
- [ ] Site funcionando em produção

---

## 🎯 APROVAÇÃO PARA PRODUÇÃO

**Status Atual:** ✅ **ESTRUTURALMENTE PRONTO**

**Todas as tarefas estruturais foram concluídas:**
- ✅ Segurança implementada
- ✅ Build preparado
- ✅ Performance preparada
- ✅ Código limpo
- ✅ Documentação completa

**Aguardando validação das seguintes ações (execução manual):**
1. ⏳ Build sem erros (`npm run build`)
2. ⏳ Testes passando (`npm test`)
3. ⏳ PWA validado (teste manual)
4. ⏳ Secrets verificados no bundle (inspeção manual)
5. ⏳ Deploy bem-sucedido (Netlify)

**Quando todos os itens acima estiverem marcados:** ✅ **100% PRONTO PARA PRODUÇÃO**

---

## 📝 NOTAS IMPORTANTES

1. **Secrets:** Sempre revogar chaves antigas após gerar novas (ver `SECRETS_ROTATION_GUIDE.md`)
2. **Build:** Testar build local antes de fazer deploy
3. **Testes:** Manter coverage mínimo de 70%
4. **PWA:** Validar em dispositivos reais (iOS e Android)
5. **Monitoramento:** Configurar alertas no Sentry após deploy

---

**Última atualização:** $(date)
**Próxima revisão:** Após validações finais
