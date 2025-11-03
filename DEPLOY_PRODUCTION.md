# 🚀 Guia Completo de Deploy - Nossa Maternidade

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Supabase](#configuração-supabase)
3. [Configuração APIs de IA](#configuração-apis-de-ia)
4. [Deploy no Netlify](#deploy-no-netlify)
5. [Configuração CI/CD](#configuração-cicd)
6. [Monitoramento](#monitoramento)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Pré-requisitos

### Ferramentas Necessárias
- ✅ Node.js 20+ instalado
- ✅ Conta no [Supabase](https://supabase.com)
- ✅ Conta no [Netlify](https://netlify.com)
- ✅ Chaves de API:
  - [Anthropic](https://console.anthropic.com)
  - [OpenAI](https://platform.openai.com)
  - [Google AI](https://makersuite.google.com) (opcional)

---

## 🗄️ Configuração Supabase

### 1. Criar Projeto

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Clique em "New Project"
3. Preencha:
   - **Name**: Nossa Maternidade
   - **Database Password**: (salve com segurança)
   - **Region**: South America (São Paulo)

### 2. Executar Scripts SQL

No Supabase Dashboard > SQL Editor, execute os scripts **nesta ordem**:

```bash
# 1. Tabelas base
scripts/001_create_tables.sql

# 2. Trigger de perfil
scripts/002_create_profile_trigger.sql

# 3. Tabelas avançadas
scripts/003_add_advanced_tables.sql

# 4. Extensão vetorial
scripts/004_enable_vector_extension.sql

# 5. Sistema de gamificação
scripts/005_gamification_system.sql

# 6. Segurança RLS
scripts/013_enable_rls_security.sql

# 7. Índices de performance
scripts/014_add_performance_indexes.sql

# 8. Fix do trigger
scripts/fix_handle_new_user.sql
```

### 3. Configurar Autenticação

1. Vá em **Authentication > Providers**
2. Habilite:
   - ✅ Email/Password
   - ✅ Google OAuth (opcional)
   - ✅ Apple (opcional para iOS)

3. Configure URLs de redirect:
   - **Site URL**: `https://seu-site.netlify.app`
   - **Redirect URLs**:
     - `http://localhost:3000/onboarding`
     - `https://seu-site.netlify.app/onboarding`

### 4. Obter Credenciais

Em **Project Settings > API**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (⚠️ manter secreto)

---

## 🤖 Configuração APIs de IA

### Anthropic (Claude)

1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. Vá em **API Keys**
3. Clique em **Create Key**
4. Copie: `ANTHROPIC_API_KEY=sk-ant-...`

**Custo estimado**: ~$0.25 por 1000 mensagens

### OpenAI (GPT-4)

1. Acesse [platform.openai.com](https://platform.openai.com)
2. Vá em **API Keys**
3. Clique em **Create new secret key**
4. Copie: `OPENAI_API_KEY=sk-proj-...`

**Custo estimado**: ~$0.03 por 1000 tokens

### Google AI (Opcional)

1. Acesse [makersuite.google.com](https://makersuite.google.com)
2. Crie uma API key
3. Copie: `GOOGLE_AI_API_KEY=...`

---

## 🚀 Deploy no Netlify

### Método 1: Deploy Automático (Recomendado)

1. **Conectar Repositório**
   ```bash
   # No Netlify Dashboard
   1. New site from Git
   2. Conecte seu GitHub
   3. Selecione: LionGab/v0-nossa-maternidade-app
   ```

2. **Configurar Build**
   ```
   Build command: npm install --legacy-peer-deps && npm run build
   Publish directory: .next
   ```

3. **Adicionar Variáveis de Ambiente**
   
   Vá em **Site settings > Environment variables** e adicione:

   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
   SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
   
   # URLs
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/onboarding
   NEXT_PUBLIC_PROD_SUPABASE_REDIRECT_URL=https://seu-site.netlify.app/onboarding
   NEXT_PUBLIC_APP_URL=https://seu-site.netlify.app
   
   # IA
   ANTHROPIC_API_KEY=sk-ant-sua-chave
   OPENAI_API_KEY=sk-proj-sua-chave
   GOOGLE_AI_API_KEY=sua-chave-google
   
   # Configurações
   NODE_ENV=production
   NEXT_PUBLIC_ENABLE_AI_FEATURES=true
   NEXT_PUBLIC_ENABLE_GAMIFICATION=true
   ```

4. **Deploy**
   ```bash
   # Automático ao fazer push na main
   git push origin main
   ```

### Método 2: CLI Manual

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Inicializar
netlify init

# Deploy
netlify deploy --prod
```

---

## ⚙️ Configuração CI/CD

### GitHub Actions

O arquivo `.github/workflows/ci-cd.yml` já está configurado!

**Adicione estes secrets no GitHub**:

1. Vá em **Settings > Secrets and variables > Actions**
2. Adicione:
   ```
   NETLIFY_AUTH_TOKEN
   NETLIFY_SITE_ID
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ANTHROPIC_API_KEY
   OPENAI_API_KEY
   ```

### Pipeline Automático

```
┌─────────────┐
│  Push Code  │
└──────┬──────┘
       │
       v
┌─────────────┐
│ Quality     │ ← Lint + Type Check
│ Check       │
└──────┬──────┘
       │
       v
┌─────────────┐
│ Build       │ ← npm run build
└──────┬──────┘
       │
       v
┌─────────────┐
│ Tests       │ ← Unit + E2E
└──────┬──────┘
       │
       v
┌─────────────┐
│ Security    │ ← npm audit + Snyk
└──────┬──────┘
       │
       v
┌─────────────┐
│ Deploy      │ ← Netlify Production
└─────────────┘
```

---

## 📊 Monitoramento

### Analytics

```bash
# Adicionar ao .env
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=seu-id
```

### Error Tracking

Recomendado: [Sentry](https://sentry.io)

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Performance

- **Lighthouse CI**: Automatizado no PR
- **Web Vitals**: Monitorado via Vercel Analytics

---

## 🔧 Troubleshooting

### Build falha no Netlify

```bash
# Erro: Cannot find module
Solução: Verificar package.json e npm install --legacy-peer-deps

# Erro: Environment variable not found
Solução: Adicionar variáveis no Netlify Dashboard

# Erro: Build timeout
Solução: Otimizar imports e usar lazy loading
```

### Autenticação não funciona

```bash
# Erro: Invalid redirect URL
Solução: Adicionar URL no Supabase > Auth > URL Configuration

# Erro: User session expired
Solução: Verificar middleware.ts e createClient()

# Erro: CORS
Solução: Configurar allowed origins no Supabase
```

### API de IA falha

```bash
# Erro: Invalid API key
Solução: Verificar env vars no Netlify

# Erro: Rate limit exceeded
Solução: Implementar backoff ou aumentar limite

# Erro: Model not found
Solução: Verificar nome do modelo no código
```

---

## 📱 PWA (Progressive Web App)

### Testar Instalação

1. Abra o site no Chrome mobile
2. Procure por "Instalar app"
3. Verifique funcionamento offline

### Customizar

Edite `public/manifest.json`:
```json
{
  "name": "Nossa Maternidade",
  "theme_color": "#FF69B4",
  "background_color": "#ffffff"
}
```

---

## 🎉 Checklist de Deploy

- [ ] Supabase configurado
- [ ] Scripts SQL executados
- [ ] Auth providers habilitados
- [ ] Variáveis de ambiente configuradas
- [ ] Build local funciona
- [ ] Deploy no Netlify bem-sucedido
- [ ] CI/CD configurado
- [ ] PWA testado em mobile
- [ ] Lighthouse score > 90
- [ ] Testes passando
- [ ] Monitoramento ativo

---

## 📞 Suporte

- **Documentação**: Ver arquivos `.md` no repositório
- **Issues**: [GitHub Issues](https://github.com/LionGab/v0-nossa-maternidade-app/issues)
- **Email**: suporte@nossmaternidade.com

---

**Feito com ❤️ para mães de todo o Brasil**
