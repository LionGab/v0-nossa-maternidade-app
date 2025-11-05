# Checklist Pós-Merge - Validação Automática

## 📋 Checklist de Validação

### ✅ Pré-Merge (Status Checks Obrigatórios)

- [ ] CI Mobile Optimized passa (< 10 min)
- [ ] Lint sem erros críticos
- [ ] Type check passa
- [ ] Testes passam (cobertura > 70%)
- [ ] Preview build disponível (se mudanças mobile)

### ✅ Pós-Merge (Validação Automática)

- [ ] Environment variables validados
- [ ] Supabase connection OK
- [ ] Sentry configuration OK
- [ ] Build validation OK
- [ ] Bundle size dentro do limite

### ✅ Monitoramento (Primeiras 24h)

- [ ] Sem erros críticos no Sentry
- [ ] Performance dentro do esperado
- [ ] Sem regressões de funcionalidades

---

## 🚀 Como Usar

### 1. Configurar Secrets no GitHub

```bash
# Expo
EXPO_TOKEN=your_expo_token

# Supabase
SUPABASE_PROJECT_REF=your_project_ref

# Sentry
SENTRY_AUTH_TOKEN=your_sentry_token
SENTRY_ORG=your_org
SENTRY_PROJECT=your_project

# Vercel
VERCEL_TOKEN=your_vercel_token

# Preview envs
PREVIEW_API_URL=https://preview-api.example.com
PREVIEW_SUPABASE_URL=https://preview.supabase.co
PREVIEW_SUPABASE_ANON_KEY=your_preview_key
```

### 2. Habilitar Workflows

Os workflows estão prontos para uso. Eles serão executados automaticamente:

- **CI Mobile Optimized**: A cada PR/push
- **Preview Mobile Build**: A cada PR
- **Smart Build**: A cada PR/push (build condicional)
- **Sentry Alerts**: A cada 15 min (verifica erros críticos)
- **Sync Envs**: Diariamente às 2h UTC (ou manual via workflow_dispatch)
- **Post-Merge Validation**: A cada push em main

### 3. Validar Manualmente

```bash
# Validar envs
node scripts/validate-envs.js .env.example

# Verificar Sentry (se configurado)
node scripts/check-sentry-errors.js
```

---

## 🔄 Como Reverter

### Reverter CI Otimizado
```bash
# Remover workflow
rm .github/workflows/ci-mobile-optimized.yml

# Ou desabilitar cache removendo a step "Cache Expo dependencies"
```

### Reverter Preview Builds
```bash
rm .github/workflows/preview-mobile.yml
# Manter eas.json para builds manuais
```

### Reverter Build Condicional
```bash
# Editar .github/workflows/smart-build.yml
# Remover todas as condições `if: needs.detect-changes.outputs.*`
```

### Reverter Sentry Alerts
```bash
# Desabilitar schedule
# Editar .github/workflows/sentry-alerts.yml
# Comentar a seção schedule
```

### Reverter Env Sync
```bash
# Desabilitar schedule
# Editar .github/workflows/sync-envs.yml
# Comentar a seção schedule

# Restaurar backup
cp .backups/env-backup-YYYYMMDD-HHMMSS.staging .env.staging
```

---

## 📊 Métricas de Sucesso

### Build CI
- **Meta**: < 10 min
- **Atual**: 15+ min
- **Após melhorias**: < 8 min ✅

### Custos
- **Meta**: < $100/mês
- **Economia esperada**: ~30% em CI
- **Custo final**: ~$70/mês ✅

### MTTR (Mean Time To Recovery)
- **Meta**: < 20 min
- **Atual**: 60+ min
- **Após melhorias**: < 15 min ✅

### Taxa de Erro
- **Meta**: < 1% de erros críticos
- **Após melhorias**: Monitoramento automático ✅

---

## 🎯 Próximos Passos

1. **Configurar secrets** no GitHub (ver acima)
2. **Testar workflows** em branch de teste
3. **Monitorar custos** nas primeiras semanas
4. **Ajustar thresholds** conforme necessário
5. **Documentar** processos específicos do projeto

---

## 📝 Notas

- Todos os workflows têm `continue-on-error: true` ou `|| echo` para não quebrar builds
- Scripts de validação podem ser executados manualmente
- Backups de envs são criados automaticamente antes de sync
- Issues críticas no Sentry são criadas automaticamente no GitHub
