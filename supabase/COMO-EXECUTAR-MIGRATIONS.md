# 🚀 Como Executar Migrations no Supabase

## ⚠️ ERRO ATUAL

```
column profiles.onboarding_completed does not exist
```

O middleware está tentando acessar uma coluna que não existe na tabela `profiles`.

---

## ✅ SOLUÇÃO: Executar a Migration

### **Opção 1: Via Supabase Dashboard (Recomendado)**

1. **Acesse o Supabase Dashboard:**
   - https://supabase.com/dashboard

2. **Selecione seu projeto:**
   - `v0-nossa-maternidade-app` (mnszbkeuerjcevjvdqme)
   - Ou acesse direto: https://mnszbkeuerjcevjvdqme.supabase.co

3. **Vá para o SQL Editor:**
   - Clique em **SQL Editor** no menu lateral

4. **Crie uma nova query:**
   - Clique em **+ New Query**

5. **Cole o SQL:**
   ```sql
   -- Adicionar coluna onboarding_completed
   ALTER TABLE profiles
   ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false NOT NULL;

   -- Criar índice
   CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed
   ON profiles(onboarding_completed);

   -- Comentário na coluna
   COMMENT ON COLUMN profiles.onboarding_completed IS
   'Indica se o usuário completou o processo de onboarding inicial';
   ```

6. **Execute:**
   - Clique em **Run** (ou pressione Ctrl+Enter)

7. **Verifique:**
   - Vá em **Table Editor** → **profiles**
   - Confirme que a coluna `onboarding_completed` foi criada

---

### **Opção 2: Via Supabase CLI (Avançado)**

Se você tem o Supabase CLI instalado:

```bash
# 1. Login no Supabase
npx supabase login

# 2. Link com o projeto remoto
npx supabase link --project-ref mnszbkeuerjcevjvdqme

# 3. Aplicar migration
npx supabase db push
```

---

## 🔍 Verificar se Funcionou

Após executar a migration, teste no SQL Editor:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name = 'onboarding_completed';
```

**Resultado esperado:**
| column_name | data_type | is_nullable | column_default |
|-------------|-----------|-------------|----------------|
| onboarding_completed | boolean | NO | false |

---

## 🎯 Próximos Passos

Após executar a migration:

1. ✅ Reinicie o servidor de desenvolvimento: `npm run dev`
2. ✅ Acesse: http://localhost:3000/login
3. ✅ O erro deve desaparecer!

---

## ⚙️ Estrutura Completa da Tabela `profiles`

Após a migration, a tabela deve ter:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

---

## 🆘 Troubleshooting

### Erro: "permission denied for table profiles"
**Solução:** Você precisa estar usando a **service_role key** ou executar via Dashboard.

### Erro: "relation profiles does not exist"
**Solução:** A tabela `profiles` ainda não foi criada. Crie primeiro:

```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Policy: Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Policy: Usuários podem inserir seu próprio perfil
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);
```

---

**📝 Arquivo de migration:** `supabase/migrations/20250103_add_onboarding_completed.sql`
