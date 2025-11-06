# 📊 Configuração de Monitoramento

## ✅ Status Atual

### 1. Logging Estruturado
- ✅ **Sistema de logging implementado** em `lib/logger.ts`
- ✅ **Logs estruturados** com contexto e metadados
- ✅ **Níveis de log:** debug, info, warn, error
- ✅ **Integração com Sentry** (se configurado)

### 2. Logging no Cliente
- ✅ **Client logger** em `lib/logger-client.ts`
- ✅ **Logs de erro** capturados no browser
- ✅ **Console logs** para desenvolvimento

### 3. Sentry Integration
- ✅ **Sentry configurado** (se variáveis de ambiente configuradas)
- ✅ **Arquivos de configuração:**
  - `sentry.client.config.ts` (browser)
  - `sentry.server.config.ts` (server)
  - `sentry.edge.config.ts` (edge)

### 4. API Analytics
- ✅ **Performance metrics** em `lib/ai/analytics.ts`
- ✅ **Cost tracking** para chamadas de IA
- ✅ **User feedback** tracking

---

## 🔧 Como Verificar Logs

### No Browser (Desenvolvimento)
1. Abra o **Console do navegador** (F12)
2. Veja logs estruturados com contexto
3. Erros aparecem em vermelho

### No Supabase (Produção)
1. Acesse **Supabase Dashboard**
2. Vá em **Logs** → **API Logs**
3. Veja requisições e erros

### No Sentry (Se configurado)
1. Acesse **Sentry Dashboard**
2. Veja erros e performance
3. Configure alertas se necessário

---

## 📊 Verificar Quotas de API

### Anthropic (Claude)
1. Acesse: https://console.anthropic.com/
2. Vá em **Usage & Billing**
3. Verifique quota disponível

### OpenAI (GPT-4)
1. Acesse: https://platform.openai.com/
2. Vá em **Usage**
3. Verifique quota disponível

### Supabase
1. Acesse **Supabase Dashboard**
2. Vá em **Settings** → **Usage**
3. Verifique:
   - Database size (gratuito: 500MB)
   - API requests
   - Storage

---

## ✅ Checklist de Monitoramento

- [x] Logging estruturado implementado
- [x] Error tracking configurado
- [x] Performance metrics implementados
- [x] Cost tracking implementado
- [ ] Alertas configurados (Sentry - opcional)
- [ ] Dashboard de métricas (opcional)

---

## 🎯 Próximos Passos (Opcional)

### 1. Configurar Alertas Sentry
- Configurar alertas para erros críticos
- Configurar alertas para performance degradada

### 2. Dashboard de Métricas
- Criar dashboard de uso
- Visualizar custos de IA
- Monitorar performance

### 3. Logs Centralizados
- Integrar com serviço de logs (Datadog, LogRocket, etc.)
- Configurar retenção de logs

---

**Monitoramento básico está configurado e funcionando!** ✅
