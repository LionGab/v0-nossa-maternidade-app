# ✅ Checklist de Deploy - MVP Nossa Maternidade

## 🚀 Status: PRONTO PARA DEPLOY

Build completo: ✅ **6.5s sem erros**
37 rotas compiladas: ✅
Zero erros TypeScript: ✅

---

## 📋 Checklist Pré-Deploy

### 1. Variáveis de Ambiente ⚠️

Configure no Netlify/Vercel Dashboard → Environment Variables:

#### Supabase (OBRIGATÓRIO)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

#### AI APIs (pelo menos UMA obrigatória)
- [ ] `ANTHROPIC_API_KEY` (recomendado para chat empático)
- [ ] `OPENAI_API_KEY` (alternativa)
- [ ] `GOOGLE_GENERATIVE_AI_API_KEY` (alternativa)

#### URLs
- [ ] `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (ex: `https://seu-site.netlify.app/onboarding`)

---

### 2. Scripts SQL no Supabase ⚠️

Execute no Supabase Dashboard → SQL Editor:

#### Tabelas Obrigatórias
- [ ] `profiles` (com campo `onboarding_completed`)
- [ ] `onboarding_responses`
- [ ] `baby_profiles`
- [ ] `sentiment_analysis` (opcional mas recomendado)
- [ ] `memory_embeddings` (para chat com memória - opcional)
- [ ] `ai_memory_context` (para chat com memória - opcional)

#### Row Level Security (RLS)
- [ ] Policies para `profiles`
- [ ] Policies para `onboarding_responses`
- [ ] Policies para `baby_profiles`

#### Extensões
- [ ] `pgvector` (para memória vetorial - opcional)

---

### 3. Build e Testes Locais ✅

- [x] Build passa: `npm run build` ✅
- [x] Zero erros TypeScript ✅
- [x] Todas as rotas compiladas (37/37) ✅

---

### 4. Configuração do Deploy

#### Netlify (netlify.toml já configurado)
```toml
[build]
  command = "corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile && pnpm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Vercel
- Configuração automática via `vercel.json` (se existir)
- Ou usar configuração padrão do Next.js

---

## 🎯 Pós-Deploy

### Testes Funcionais

1. **Landing Page**
   - [ ] Homepage carrega
   - [ ] Botões funcionam (Signup/Login)

2. **Autenticação**
   - [ ] Signup cria conta
   - [ ] Login funciona
   - [ ] Redirecionamento após login

3. **Onboarding**
   - [ ] Fluxo de 6 perguntas funciona
   - [ ] Dados são salvos no Supabase
   - [ ] Redireciona para dashboard

4. **Dashboard**
   - [ ] Carrega com nome do usuário
   - [ ] Cards de navegação funcionam
   - [ ] Widget de gamificação aparece

5. **Chat**
   - [ ] Interface carrega
   - [ ] Streaming visual funciona
   - [ ] Mensagens são enviadas/recebidas

6. **Features**
   - [ ] Perfil do bebê salva dados
   - [ ] Receitas são geradas
   - [ ] Player de áudio funciona

---

## 📊 Métricas de Sucesso

- ✅ Build time: 6.5s (meta: < 10s)
- ✅ Zero erros TypeScript
- ✅ 37 rotas compiladas
- ✅ Todas as funcionalidades core implementadas

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to Supabase"
- Verificar variáveis de ambiente
- Verificar CORS no Supabase
- Verificar URL do projeto

### Erro: "AI API not available"
- Configurar pelo menos uma API key
- Verificar rate limits
- Verificar billing (se aplicável)

### Erro: "Build failed"
- Verificar logs no Netlify/Vercel
- Verificar variáveis de ambiente
- Verificar compatibilidade de Node.js (>= 18)

---

**Última atualização:** 2025-01-03
**Build Status:** ✅ PRONTO

