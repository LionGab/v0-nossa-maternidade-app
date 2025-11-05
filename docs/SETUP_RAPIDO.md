# Setup Rápido - Nossa Maternidade MVP

> Guia rápido para colocar o MVP em funcionamento em 5 minutos.

---

## 🚀 Passo a Passo

### 1. Instalar Dependências

```bash
npm install
```

**Nota:** O projeto já tem `.npmrc` configurado com `legacy-peer-deps=true` para resolver conflitos.

---

### 2. Criar Arquivo .env.local

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# ============================================
# SUPABASE (Obrigatório)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui

# ============================================
# URLs da Aplicação
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/onboarding

# ============================================
# APIs de IA (Opcional)
# ============================================
ANTHROPIC_API_KEY=sk-ant-sua-chave-aqui
OPENAI_API_KEY=sk-sua-chave-aqui
GOOGLE_AI_API_KEY=sua-chave-gemini-aqui
PERPLEXITY_API_KEY=sua-chave-perplexity-aqui

# ============================================
# Feature Flags
# ============================================
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_GAMIFICATION=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# ============================================
# Ambiente
# ============================================
NODE_ENV=development
```

**⚠️ IMPORTANTE:**
- Substitua `seu-projeto.supabase.co` pela URL real do seu projeto Supabase
- Substitua as chaves pelas suas credenciais reais
- **NUNCA** commite o arquivo `.env.local` no Git!

---

### 3. Obter Credenciais do Supabase

**Se você JÁ tem um projeto:**
1. Acesse: https://supabase.com/dashboard
2. Clique no seu projeto
3. Vá em: **Settings** → **API**
4. Copie:
   - **Project URL** (ex: `https://abc123xyz.supabase.co`)
   - **anon public** key (JWT grande começando com `eyJ...`)
   - **service_role** key (⚠️ SEGREDO - nunca exponha)

**Se você NÃO tem projeto:**
1. Acesse: https://supabase.com/dashboard
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: nossa-maternidade
   - **Database Password**: Crie uma senha forte e **ANOTE**
   - **Region**: South America (São Paulo)
   - **Plan**: Free
4. Aguarde ~2 minutos
5. Quando pronto, vá em **Settings** → **API** e copie as credenciais

---

### 4. Executar Localmente

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000)

---

### 5. Testar o MVP

**Páginas principais:**
- ✅ `/` - Página inicial (landing page)
- ✅ `/signup` - Criar conta
- ✅ `/login` - Fazer login
- ✅ `/dashboard` - Dashboard principal (requer login)

**Fluxo básico:**
1. Acesse `/signup`
2. Crie uma conta com email e senha
3. Faça login em `/login`
4. Acesse `/dashboard`

---

## 🐛 Troubleshooting

### Erro: "Missing Supabase environment variables"

**Solução:** Verifique se o arquivo `.env.local` existe e tem as variáveis corretas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Erro: "ERR_NAME_NOT_RESOLVED"

**Solução:** A URL do Supabase está incorreta. Verifique:
1. A URL está completa (começa com `https://`)
2. O domínio está correto (ex: `abc123xyz.supabase.co`)
3. Não há espaços antes/depois da URL

### Erro ao fazer build

**Solução:**
```bash
# Limpar cache
rm -rf .next
npm run build
```

---

## ✅ Checklist de Verificação

- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env.local` criado
- [ ] Credenciais Supabase configuradas
- [ ] Servidor rodando (`npm run dev`)
- [ ] Página inicial carrega (http://localhost:3000)
- [ ] Signup funciona (criar conta)
- [ ] Login funciona (fazer login)
- [ ] Dashboard carrega (após login)

---

## 📚 Próximos Passos

Após o MVP funcionando:
1. Configure APIs de IA (opcional)
2. Configure Sentry (opcional)
3. Veja [DEPLOY_PRODUCTION.md](./DEPLOY_PRODUCTION.md) para deploy

---

**Última atualização:** 2025-01-27

