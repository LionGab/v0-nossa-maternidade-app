# 🔒 GUIA DE ROTAÇÃO DE SECRETS

Este guia fornece instruções passo a passo para revogar chaves antigas expostas e gerar novas chaves para todos os serviços usados no projeto.

---

## 🚨 PROCEDIMENTO URGENTE

Se você identificou que secrets foram expostos no repositório:

1. **NÃO ENTRE EM PÂNICO** - Mas aja rapidamente
2. **REVOGUE AS CHAVES ANTIGAS IMEDIATAMENTE**
3. **GERE NOVAS CHAVES**
4. **ATUALIZE AS VARIÁVEIS DE AMBIENTE**
5. **TESTE A APLICAÇÃO**

---

## 📋 CHECKLIST GERAL

- [ ] Revogar todas as chaves expostas
- [ ] Gerar novas chaves para cada serviço
- [ ] Anotar novas chaves em local seguro
- [ ] Atualizar variáveis de ambiente locais (`.env.local`)
- [ ] Atualizar variáveis de ambiente no Netlify
- [ ] Testar aplicação após migração
- [ ] Verificar logs de acesso suspeito
- [ ] Documentar incidente (se aplicável)

---

## 1. SUPABASE

### 1.1 Acessar Dashboard

1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto: `bbcwitnbnosyfpfjtzkry` (ou seu projeto)

### 1.2 Revogar Chaves Antigas

1. Vá para: **Settings** → **API**
2. Localize a seção **API Keys**
3. Para cada chave exposta:
   - Clique em **Rotate** ao lado da chave
   - ⚠️ **IMPORTANTE**: Anote a nova chave imediatamente (só aparece uma vez!)

### 1.3 Chaves a Rotacionar

- [ ] **anon key** (chave pública)
  - Nome: `anon` ou `public`
  - Formato: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - Usada em: Cliente (browser)

- [ ] **service_role key** (chave privada) ⚠️ CRÍTICO
  - Nome: `service_role`
  - Formato: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - ⚠️ **Esta chave dá acesso total ao banco!**
  - Usada em: APIs do servidor apenas

### 1.4 Obter Novas Chaves

Após rotacionar:
1. Copie a **anon key** (chave pública)
2. Copie a **service_role key** (chave privada)
3. ⚠️ **SALVE EM LOCAL SEGURO** (password manager, por exemplo)

### 1.5 Verificar Logs de Acesso

1. Vá para: **Logs** → **API Logs**
2. Verifique acessos nas últimas 24 horas
3. Procure por:
   - Acessos de IPs desconhecidos
   - Requisições em horários incomuns
   - Volume alto de requisições suspeitas

### 1.6 Atualizar Variáveis de Ambiente

**Local (.env.local):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=nova-chave-anon-aqui
SUPABASE_SERVICE_ROLE_KEY=nova-chave-service-role-aqui
```

**Netlify:**
1. Acesse: Netlify Dashboard → Seu Site → **Site settings** → **Environment variables**
2. Atualize:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Clique em **Save**

---

## 2. SENTRY

### 2.1 Acessar Dashboard

1. Acesse: https://sentry.io/settings/
2. Faça login na sua conta
3. Selecione sua organização e projeto

### 2.2 Revogar DSN Antigo

1. Vá para: **Project Settings** → **Client Keys (DSN)**
2. Localize o DSN antigo: `5f090bd5a472ece70d4fb583bd01f3d1@o4510299490746368.ingest.us.sentry.io/4510299554578432`
3. Clique em **Revoke** ao lado do DSN antigo
4. Confirme a revogação

### 2.3 Gerar Novo DSN

1. Na mesma página, clique em **Create New Key**
2. Escolha tipo: **DSN (Public)**
3. Opcional: Defina um nome (ex: "Production DSN")
4. Clique em **Create Key**
5. ⚠️ **COPIE O DSN IMEDIATAMENTE** (formato: `https://...@sentry.io/...`)

### 2.4 Verificar Eventos Suspeitos

1. Vá para: **Issues** → **All Issues**
2. Verifique eventos das últimas 24 horas
3. Procure por:
   - Eventos de IPs desconhecidos
   - Volume anômalo de erros
   - Eventos em horários incomuns

### 2.5 Atualizar Variáveis de Ambiente

**Local (.env.local):**
```env
SENTRY_DSN=https://novo-dsn@sentry.io/projeto
```

**Netlify:**
1. Acesse: Netlify Dashboard → **Environment variables**
2. Atualize: `SENTRY_DSN`
3. Clique em **Save**

---

## 3. ANTHROPIC (CLAUDE API)

### 3.1 Acessar Dashboard

1. Acesse: https://console.anthropic.com/settings/keys
2. Faça login na sua conta

### 3.2 Revogar API Key Antiga

1. Localize a API key exposta na lista
2. ⚠️ **ATENÇÃO**: Ao revogar, a key deixa de funcionar imediatamente
3. Clique em **Delete** ou **Revoke** ao lado da key

### 3.3 Gerar Nova API Key

1. Clique em **Create Key**
2. Opcional: Defina um nome (ex: "Nossa Maternidade - Production")
3. ⚠️ **COPIE A KEY IMEDIATAMENTE** (formato: `sk-ant-api03-...`)
4. ⚠️ Você só verá a key completa uma vez!

### 3.4 Verificar Uso Suspeito

1. Vá para: **Usage** ou **Billing**
2. Verifique uso nas últimas 24 horas
3. Procure por:
   - Picos de uso anômalos
   - Custos inesperados
   - Requisições em horários incomuns

### 3.5 Atualizar Variáveis de Ambiente

**Local (.env.local):**
```env
ANTHROPIC_API_KEY=sk-ant-api03-nova-chave-aqui
```

**Netlify:**
1. Atualize: `ANTHROPIC_API_KEY`
2. Clique em **Save**

---

## 4. OPENAI

### 4.1 Acessar Dashboard

1. Acesse: https://platform.openai.com/api-keys
2. Faça login na sua conta

### 4.2 Revogar API Key Antiga

1. Localize a API key exposta
2. Clique nos três pontos (⋯) → **Delete** ou **Revoke**
3. Confirme a revogação

### 4.3 Gerar Nova API Key

1. Clique em **Create new secret key**
2. Opcional: Defina um nome (ex: "Nossa Maternidade Production")
3. ⚠️ **COPIE A KEY IMEDIATAMENTE** (formato: `sk-proj-...` ou `sk-...`)
4. ⚠️ Você só verá a key completa uma vez!

### 4.4 Verificar Uso Suspeito

1. Vá para: **Usage** ou **Billing**
2. Verifique uso e custos nas últimas 24 horas
3. Procure por:
   - Requisições em volume anômalo
   - Custos inesperados
   - Atividade de IPs desconhecidos

### 4.5 Atualizar Variáveis de Ambiente

**Local (.env.local):**
```env
OPENAI_API_KEY=sk-proj-nova-chave-aqui
```

**Netlify:**
1. Atualize: `OPENAI_API_KEY`
2. Clique em **Save**

---

## 5. GOOGLE AI (GEMINI)

### 5.1 Acessar Dashboard

1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google

### 5.2 Revogar API Key Antiga

1. Localize a API key exposta
2. Clique em **Delete** ou **Edit** → **Revoke**
3. Confirme a revogação

### 5.3 Gerar Nova API Key

1. Clique em **Create API Key**
2. Selecione o projeto (ou crie um novo)
3. Opcional: Defina restrições (HTTP referrer, IP)
4. ⚠️ **COPIE A KEY IMEDIATAMENTE** (formato: `AIza...`)
5. ⚠️ Você só verá a key completa uma vez!

### 5.4 Verificar Uso

1. Acesse: Google Cloud Console → **APIs & Services** → **Credentials**
2. Verifique uso da API nas últimas 24 horas
3. Procure por:
   - Requisições anômalas
   - Custos inesperados

### 5.5 Atualizar Variáveis de Ambiente

**Local (.env.local):**
```env
GOOGLE_AI_API_KEY=AIzaNovaChaveAqui
```

**Netlify:**
1. Atualize: `GOOGLE_AI_API_KEY`
2. Clique em **Save**

---

## 6. PERPLEXITY (SE USADO)

### 6.1 Acessar Dashboard

1. Acesse: https://www.perplexity.ai/settings/api
2. Faça login na sua conta

### 6.2 Revogar e Gerar Nova Key

1. Siga processo similar aos outros serviços
2. Formato: `pplx-...`

### 6.3 Atualizar Variáveis

**Local (.env.local):**
```env
PERPLEXITY_API_KEY=pplx-nova-chave-aqui
```

**Netlify:**
1. Atualize: `PERPLEXITY_API_KEY`
2. Clique em **Save**

---

## 7. TESTAGEM APÓS MIGRAÇÃO

### 7.1 Testar Localmente

```bash
# 1. Atualizar .env.local com novas chaves
# 2. Instalar dependências
npm install

# 3. Rodar build
npm run build

# 4. Iniciar servidor
npm run dev

# 5. Testar funcionalidades:
#    - Login/Signup (Supabase)
#    - Chat com IA (Anthropic/OpenAI)
#    - Receitas (se usa Google AI)
```

### 7.2 Testar em Produção (Netlify)

1. Faça commit das mudanças (sem secrets!)
2. Push para `main` branch
3. Aguarde build no Netlify
4. Verifique logs do build
5. Acesse o site e teste:
   - Login/Signup
   - Funcionalidades de IA
   - Service worker (PWA)

---

## 8. VERIFICAÇÃO DE SEGURANÇA

### 8.1 Verificar Logs de Acesso

Para cada serviço:
- [ ] Supabase → Logs → API Logs (últimas 24h)
- [ ] Sentry → Issues → All Issues (últimas 24h)
- [ ] Anthropic → Usage (verificar picos)
- [ ] OpenAI → Usage (verificar picos)
- [ ] Google AI → Cloud Console → Usage

### 8.2 Verificar Custos

- [ ] Supabase → Billing (verificar uso de storage/bandwidth)
- [ ] Anthropic → Billing (verificar custos de API)
- [ ] OpenAI → Billing (verificar custos)
- [ ] Google Cloud → Billing (verificar custos)

### 8.3 Verificar Bundle Final

```bash
# Rodar build e verificar bundle
npm run build

# Procurar por padrões de API keys no bundle
grep -r "sk-" .next/static/chunks/
grep -r "eyJ" .next/static/chunks/
grep -r "AIza" .next/static/chunks/
```

✅ **Resultado esperado**: Nenhum padrão encontrado (exceto placeholders)

---

## 9. PREVENÇÃO FUTURA

### 9.1 Implementado

- ✅ Pre-commit hook bloqueando `.env*`
- ✅ `.gitignore` protegendo `.env*`
- ✅ `.env.example` como template
- ✅ Documentação de segurança

### 9.2 Recomendações

1. **Rotação Regular**: Rotacione chaves a cada 90 dias
2. **Monitoramento**: Configure alertas de uso anômalo
3. **Secrets Manager**: Considere usar Doppler ou AWS Secrets Manager
4. **Code Review**: Sempre revise PRs para secrets
5. **CI/CD**: Use secrets do GitHub/Netlify, nunca hardcode

---

## 10. TEMPLATE DE COMUNICAÇÃO (SE HOUVER TIME)

Se você trabalha em equipe, comunique o incidente:

```
ASSUNTO: [URGENTE] Rotação de Chaves de API - Ação Necessária

Olá equipe,

Identificamos que algumas chaves de API foram expostas no repositório.
Todas as chaves foram REVOGADAS e NOVAS chaves foram geradas.

⚠️ AÇÃO NECESSÁRIA:
1. Atualize seu .env.local com as novas chaves (enviadas via password manager)
2. Se você fez clone recentemente, NÃO use as chaves antigas
3. Se algo não funcionar, me avise imediatamente

📅 Prazo: URGENTE - Atualize hoje mesmo

Obrigado!
```

---

## 📞 LINKS ÚTEIS

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Sentry Dashboard**: https://sentry.io/settings/
- **Anthropic Console**: https://console.anthropic.com/settings/keys
- **OpenAI Platform**: https://platform.openai.com/api-keys
- **Google AI Studio**: https://makersuite.google.com/app/apikey
- **Perplexity Settings**: https://www.perplexity.ai/settings/api
- **Netlify Dashboard**: https://app.netlify.com/

---

**Última atualização**: $(date)
**Próxima revisão recomendada**: Em 90 dias (rotação de chaves)
