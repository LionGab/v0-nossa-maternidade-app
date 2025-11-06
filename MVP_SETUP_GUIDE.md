# 🚀 Guia Completo de Configuração do MVP

## ✅ Checklist de Configuração Completa

### 1. Variáveis de Ambiente (CRÍTICO)

Crie o arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# ============================================
# SUPABASE (Obrigatório)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://mnszbkeuerjcevjvdqme.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTY3ODEsImV4cCI6MjA3NzQ5Mjc4MX0.f2jPp6KLzzrJPTt63FKNyDanh_0uw9rJ1-gbSvQFueo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTkxNjc4MSwiZXhwIjoyMDc3NDkyNzgxfQ.zOb5c5HhJhOF3-tWAkfo9HxKoUpA2JbsKFS939IPnd4

# ============================================
# APIs DE IA
# ============================================
GOOGLE_AI_API_KEY=AIzaSyC9YVWRmnGyGu4c9y7g-mNkkipDqb5JBZg
ANTHROPIC_API_KEY=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
OPENAI_API_KEY=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
PERPLEXITY_API_KEY=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

# ============================================
# URLs DA APLICAÇÃO
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/onboarding

# ============================================
# FEATURE FLAGS
# ============================================
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_GAMIFICATION=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# ============================================
# AMBIENTE
# ============================================
NODE_ENV=development
```

**⚠️ IMPORTANTE:**
- O arquivo `.env.local` já está no `.gitignore`
- **NUNCA** commite este arquivo no Git
- Use `NEXT_PUBLIC_` para variáveis que precisam ser acessíveis no cliente

### 2. Instalar Dependências

```bash
npm install
```

### 3. Validar Configuração

```bash
# Validar variáveis de ambiente
npm run validate:env

# Testar API keys
npm run test:api-keys
```

### 4. Configurar Supabase (CRÍTICO)

#### 4.1 Executar Migrations

Acesse o Supabase Dashboard: https://mnszbkeuerjcevjvdqme.supabase.co

1. Vá em **SQL Editor**
2. Execute os scripts na seguinte ordem:

**Migration 1: Adicionar coluna onboarding_completed**
```sql
-- Copie o conteúdo de: supabase/migrations/20250103_add_onboarding_completed.sql
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed
ON profiles(onboarding_completed);
```

**Migration 2: Criar trigger de perfil (se não existir)**
```sql
-- Criar função para criar profile automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    created_at,
    updated_at,
    onboarding_completed
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NOW(),
    NOW(),
    false
  );

  -- Inicializar gamificação
  INSERT INTO public.user_gamification (
    user_id,
    points,
    level,
    streak_days,
    last_activity_date,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    0,
    1,
    0,
    NOW(),
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

#### 4.2 Verificar Configuração

Execute no SQL Editor:
```sql
-- Verificar se a coluna existe
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name = 'onboarding_completed';

-- Verificar se o trigger existe
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### 5. Executar Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Todos os testes
npm run test:all
```

### 6. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### 7. Testar Funcionalidades Críticas

#### 7.1 Signup
1. Acesse: http://localhost:3000/signup
2. Preencha o formulário
3. Deve redirecionar para `/onboarding`

#### 7.2 Login
1. Acesse: http://localhost:3000/login
2. Faça login com credenciais criadas
3. Deve redirecionar para `/dashboard`

#### 7.3 Onboarding
1. Complete o onboarding após signup
2. Deve marcar `onboarding_completed = true` no perfil
3. Deve redirecionar para `/dashboard`

#### 7.4 Chat com IA
1. Acesse: http://localhost:3000/chat
2. Envie uma mensagem
3. Deve receber resposta da IA

#### 7.5 Geração de Receitas
1. Acesse: http://localhost:3000/receitas
2. Gere uma receita
3. Deve funcionar com as APIs configuradas

## 📋 Checklist Final

- [ ] Arquivo `.env.local` criado com todas as variáveis
- [ ] Variáveis de ambiente validadas (`npm run validate:env`)
- [ ] API keys testadas (`npm run test:api-keys`)
- [ ] Supabase migrations executadas
- [ ] Trigger `handle_new_user` criado
- [ ] Coluna `onboarding_completed` adicionada
- [ ] Testes passando (`npm run test`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Signup funcionando
- [ ] Login funcionando
- [ ] Onboarding funcionando
- [ ] Chat com IA funcionando
- [ ] Geração de receitas funcionando

## 🚨 Troubleshooting

### Erro: "Missing Supabase environment variables"
**Solução:** Verifique se o arquivo `.env.local` existe e contém as variáveis corretas

### Erro: "column profiles.onboarding_completed does not exist"
**Solução:** Execute a migration `20250103_add_onboarding_completed.sql` no Supabase

### Erro: "Failed to fetch" no signup
**Solução:** Verifique se o trigger `handle_new_user` existe e está funcionando

### Erro: "API key not configured"
**Solução:** Verifique se as chaves de API estão corretas no `.env.local`

### Erro: "Unauthorized" nas APIs
**Solução:** Verifique se o usuário está autenticado e se o middleware está funcionando

## ✅ Status Final

Após seguir todos os passos acima, o MVP deve estar **100% funcional** com:

- ✅ Autenticação (signup/login)
- ✅ Onboarding completo
- ✅ Chat com IA (múltiplas providers)
- ✅ Geração de receitas
- ✅ Análise de sentimentos
- ✅ Gamificação
- ✅ Todas as APIs configuradas

**🎉 MVP pronto para produção!**
