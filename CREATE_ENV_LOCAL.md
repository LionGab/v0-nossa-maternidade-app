# 📝 Criar Arquivo .env.local

## ⚠️ IMPORTANTE

Este arquivo contém as variáveis de ambiente **REAIS** do projeto.

**NUNCA commite este arquivo no Git!**

O arquivo `.env.local` já está no `.gitignore` e será ignorado automaticamente.

## 📋 Instruções

### 1. Criar o arquivo

Crie um arquivo chamado `.env.local` na **raiz do projeto** (mesmo nível do `package.json`)

### 2. Copiar o conteúdo

Copie o conteúdo abaixo e cole no arquivo `.env.local`:

```env
# ============================================
# Variáveis de Ambiente - Nossa Maternidade
# ============================================
# ⚠️ NUNCA commitar este arquivo no Git (já está no .gitignore)

# ========================================
# SUPABASE
# ========================================
NEXT_PUBLIC_SUPABASE_URL=https://mnszbkeuerjcevjvdqme.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTY3ODEsImV4cCI6MjA3NzQ5Mjc4MX0.f2jPp6KLzzrJPTt63FKNyDanh_0uw9rJ1-gbSvQFueo

# ⚠️ SERVICE_ROLE_KEY - NÃO USAR NO FRONTEND (apenas para referência)
# Esta chave deve ser usada APENAS em Edge Functions do Supabase (backend)
# NUNCA exponha esta chave no código cliente
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTkxNjc4MSwiZXhwIjoyMDc3NDkyNzgxfQ.zOb5c5HhJhOF3-tWAkfo9HxKoUpA2JbsKFS939IPnd4

# ========================================
# APIs DE IA
# ========================================
GOOGLE_AI_API_KEY=AIzaSyC9YVWRmnGyGu4c9y7g-mNkkipDqb5JBZg
ANTHROPIC_API_KEY=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
OPENAI_API_KEY=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
PERPLEXITY_API_KEY=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

# ========================================
# OUTRAS APIs (opcionais)
# ========================================
# EXPO_PUBLIC_ELEVENLABS_API_KEY=
# EXPO_PUBLIC_HEYGEN_API_KEY=
# EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
# EXPO_PUBLIC_ONESIGNAL_APP_ID=

# ========================================
# CONFIGURAÇÕES ADICIONAIS
# ========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/onboarding

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_GAMIFICATION=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Ambiente
NODE_ENV=development
```

### 3. Validar configuração

Após criar o arquivo, execute:

```bash
# Validar variáveis de ambiente
npm run validate:env

# Testar API keys
npm run test:api-keys
```

### 4. Reiniciar servidor

Se o servidor já estiver rodando, reinicie:

```bash
# Parar servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

## ✅ Verificação

O arquivo `.env.local` deve:
- ✅ Estar na raiz do projeto
- ✅ Conter todas as variáveis acima
- ✅ Não estar no Git (já está no .gitignore)
- ✅ Passar na validação (`npm run validate:env`)

## 🚨 Importante

**⚠️ NUNCA:**
- Commite o arquivo `.env.local` no Git
- Compartilhe as chaves de API publicamente
- Use `EXPO_PUBLIC_` em projetos Next.js (use `NEXT_PUBLIC_`)

**✅ SEMPRE:**
- Use `.env.local` para desenvolvimento local
- Use variáveis de ambiente do servidor para produção
- Mantenha as chaves seguras e privadas
