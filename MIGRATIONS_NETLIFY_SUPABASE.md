# 🚀 Executar Migrations com Netlify + Supabase

## ✅ Sua Situação

Você tem **Netlify integrado com Supabase**, então há **2 formas** de executar as migrations:

---

## 📋 Opção 1: Via Supabase Dashboard (Recomendado - Mais Rápido)

### Passo a Passo

1. **Acesse o Supabase Dashboard**
   - https://supabase.com/dashboard
   - Selecione seu projeto: `v0-nossa-maternidade-app`

2. **Vá para SQL Editor**
   - Menu lateral → **SQL Editor**
   - Clique em **+ New Query**

3. **Execute as 3 migrations nesta ordem:**

   #### Migration 1: `20250127_saved_recipes.sql`
   ```sql
   -- Copie e cole TODO o conteúdo do arquivo:
   -- supabase/migrations/20250127_saved_recipes.sql
   ```
   - Clique em **Run** (ou Ctrl+Enter)

   #### Migration 2: `20250127_saved_videos.sql`
   ```sql
   -- Copie e cole TODO o conteúdo do arquivo:
   -- supabase/migrations/20250127_saved_videos.sql
   ```
   - Clique em **Run** (ou Ctrl+Enter)

   #### Migration 3: `20250127_api_cache.sql`
   ```sql
   -- Copie e cole TODO o conteúdo do arquivo:
   -- supabase/migrations/20250127_api_cache.sql
   ```
   - Clique em **Run** (ou Ctrl+Enter)

4. **Verificar se funcionou:**
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('saved_recipes', 'saved_videos', 'api_cache');
   ```
   Deve retornar 3 linhas.

---

## 📋 Opção 2: Via Supabase CLI (Automático)

Se você tem o Supabase CLI configurado localmente:

```bash
# 1. Login no Supabase
npx supabase login

# 2. Link com seu projeto remoto
# Substitua PROJECT_REF pelo ID do seu projeto Supabase
npx supabase link --project-ref mnszbkeuerjcevjvdqme

# 3. Aplicar TODAS as migrations pendentes
npx supabase db push
```

Isso vai aplicar **automaticamente** todas as migrations da pasta `supabase/migrations/` que ainda não foram executadas.

---

## 🔍 Verificar se as Tabelas Foram Criadas

Execute no SQL Editor do Supabase:

```sql
-- Verificar tabelas criadas
SELECT
    table_name,
    (SELECT COUNT(*)
     FROM information_schema.columns
     WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN ('saved_recipes', 'saved_videos', 'api_cache')
ORDER BY table_name;
```

**Resultado esperado:**
| table_name      | column_count |
|----------------|--------------|
| api_cache      | 6            |
| saved_recipes  | 9            |
| saved_videos   | 7            |

---

## ⚠️ IMPORTANTE

### O que NÃO fazer:

- ❌ **NÃO execute** arquivos TypeScript (`.ts`) no Supabase
- ❌ **NÃO execute** `lib/swr-config.ts` (é código da aplicação, não SQL)
- ✅ **Execute APENAS** arquivos `.sql` da pasta `supabase/migrations/`

### Ordem de Execução:

As migrations devem ser executadas **nesta ordem**:

1. ✅ `20250127_saved_recipes.sql`
2. ✅ `20250127_saved_videos.sql`
3. ✅ `20250127_api_cache.sql`

---

## 🎯 Após Executar as Migrations

1. **Teste no app:**
   - Tente salvar uma receita
   - Tente salvar um vídeo
   - Verifique se não há erros no console

2. **Verifique o cache:**
   - Gere receitas idênticas duas vezes
   - A segunda vez deve ser mais rápida (cache hit)

3. **Deploy no Netlify:**
   - Após migrations executadas, faça deploy normalmente
   - O Netlify vai usar o Supabase que já está configurado

---

## 📝 Notas

- **Netlify e Supabase são independentes** para migrations
- As migrations são executadas **diretamente no Supabase**
- O Netlify apenas **usa** o Supabase através das variáveis de ambiente
- Não há necessidade de configurar migrations no Netlify

---

## 🆘 Se Der Erro

### Erro: "relation already exists"
- Significa que a tabela já existe
- Use `CREATE TABLE IF NOT EXISTS` (já está nos scripts)
- Pode ignorar o erro ou dropar a tabela primeiro

### Erro: "permission denied"
- Verifique se está usando a conta correta
- Verifique se tem permissões no projeto Supabase

### Erro: "syntax error"
- Verifique se copiou o arquivo **completo**
- Verifique se não há caracteres especiais
- Execute cada migration **individualmente**

---

**Pronto! Após executar as 3 migrations, o app estará 100% funcional!** 🚀
