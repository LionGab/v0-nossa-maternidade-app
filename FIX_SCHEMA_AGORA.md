# 🚨 FIX IMEDIATO - Adicionar Coluna Faltante

## 🔴 Erro Atual

```
column profiles.onboarding_completed does not exist
```

---

## ✅ SOLUÇÃO RÁPIDA (1 minuto)

### 1️⃣ Acesse o Supabase SQL Editor

- URL direta: https://mnszbkeuerjcevjvdqme.supabase.co
- Clique em: **SQL Editor** (menu lateral)
- Clique em: **New Query**

### 2️⃣ Cole este SQL e Execute

```sql
-- Adicionar coluna onboarding_completed
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false NOT NULL;

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed
ON profiles(onboarding_completed);

-- Adicionar comentário
COMMENT ON COLUMN profiles.onboarding_completed IS
'Indica se o usuário completou o processo de onboarding inicial';
```

### 3️⃣ Clique em RUN

Você deve ver: `Success. No rows returned`

### 4️⃣ Reinicie o Servidor

```bash
# Ctrl+C no terminal e depois:
npm run dev
```

### 5️⃣ Teste Novamente

Acesse: http://localhost:3000/login

✅ **O erro deve desaparecer!**

---

## 🔍 Verificação

Para confirmar que funcionou, execute no SQL Editor:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name = 'onboarding_completed';
```

**Resultado esperado:**
```
column_name             | data_type
------------------------|----------
onboarding_completed    | boolean
```

---

## 📋 Alternativa: Usar o Arquivo de Migration

Se preferir, você pode copiar o conteúdo do arquivo existente:

**Arquivo:** `supabase/migrations/20250103_add_onboarding_completed.sql`

E colar no SQL Editor.

---

## ⏭️ Depois de Corrigir

1. ✅ Teste signup: http://localhost:3000/signup
2. ✅ Teste login: http://localhost:3000/login
3. ✅ Complete o onboarding
4. ✅ Verifique dashboard

---

**⏱️ Tempo total: 1 minuto**

**Execute agora! 🚀**
