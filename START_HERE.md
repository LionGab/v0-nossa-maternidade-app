# 🚀 INÍCIO RÁPIDO - MVP Nossa Maternidade

## ⚡ Configuração em 5 Minutos

### 1️⃣ Criar Arquivo `.env.local`

Crie o arquivo `.env.local` na **raiz do projeto** com este conteúdo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://mnszbkeuerjcevjvdqme.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTY3ODEsImV4cCI6MjA3NzQ5Mjc4MX0.f2jPp6KLzzrJPTt63FKNyDanh_0uw9rJ1-gbSvQFueo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTkxNjc4MSwiZXhwIjoyMDc3NDkyNzgxfQ.zOb5c5HhJhOF3-tWAkfo9HxKoUpA2JbsKFS939IPnd4

GOOGLE_AI_API_KEY=AIzaSyC9YVWRmnGyGu4c9y7g-mNkkipDqb5JBZg
ANTHROPIC_API_KEY=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
OPENAI_API_KEY=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
PERPLEXITY_API_KEY=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

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/onboarding

NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_GAMIFICATION=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false

NODE_ENV=development
```

**⚠️ IMPORTANTE:** O arquivo `.env.local` já está no `.gitignore`. NUNCA commite este arquivo!

### 2️⃣ Executar Migration no Supabase

1. Acesse: https://bbcwitnbnosyfpjtzkr.supabase.co
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Abra o arquivo: `supabase/migrations/20250103_complete_setup.sql`
5. Copie todo o conteúdo e cole no SQL Editor
6. Clique em **RUN**

### 3️⃣ Instalar e Validar

```bash
# Instalar dependências
npm install

# Validar variáveis de ambiente
npm run validate:env

# Testar API keys
npm run test:api-keys
```

### 4️⃣ Iniciar Servidor

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## ✅ Checklist Rápido

- [ ] Arquivo `.env.local` criado
- [ ] Migration executada no Supabase
- [ ] `npm install` executado
- [ ] `npm run validate:env` passou
- [ ] `npm run test:api-keys` passou
- [ ] `npm run dev` rodando
- [ ] Aplicação acessível em http://localhost:3000

---

## 📚 Documentação Completa

- **Configuração Completa**: `MVP_SETUP_GUIDE.md`
- **Criar .env.local**: `CREATE_ENV_LOCAL.md`
- **Status do MVP**: `MVP_READY.md`
- **Variáveis de Ambiente**: `ENV_SETUP_COMPLETE.md`

---

## 🧪 Testar Funcionalidades

Após configurar, teste:

1. **Signup**: http://localhost:3000/signup
2. **Login**: http://localhost:3000/login
3. **Onboarding**: http://localhost:3000/onboarding
4. **Chat**: http://localhost:3000/chat
5. **Receitas**: http://localhost:3000/receitas

---

## 🚨 Problemas Comuns

### Erro: "Missing Supabase environment variables"
**Solução:** Verifique se o arquivo `.env.local` existe e contém as variáveis corretas

### Erro: "column profiles.onboarding_completed does not exist"
**Solução:** Execute a migration `20250103_complete_setup.sql` no Supabase

### Erro: "Failed to fetch" no signup
**Solução:** Verifique se o trigger `handle_new_user` existe (execute a migration)

---

## 🎉 Pronto!

Após completar todos os passos acima, o MVP estará **100% funcional**!

**Próximo passo:** Comece a usar a aplicação em http://localhost:3000
