# 📋 INSTRUÇÕES PARA EXECUTAR MIGRATIONS SQL

## ⚠️ IMPORTANTE

**NÃO execute arquivos TypeScript (`.ts`) no Supabase!**
Execute **APENAS** arquivos SQL (`.sql`) na pasta `supabase/migrations/`.

---

## 📝 Migrations que precisam ser executadas

Execute estas 3 migrations SQL na ordem abaixo:

### 1. `20250127_saved_recipes.sql`
- Cria tabela para receitas salvas
- Executar no Supabase SQL Editor

### 2. `20250127_saved_videos.sql`
- Cria tabela para vídeos salvos
- Executar no Supabase SQL Editor

### 3. `20250127_api_cache.sql`
- Cria tabela para cache de API
- Executar no Supabase SQL Editor

---

## 🚀 Como executar no Supabase

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Copie e cole o conteúdo de cada migration SQL
5. Execute cada uma individualmente

**OU** use o Supabase CLI:

```bash
supabase db push
```

---

## ❌ O QUE NÃO FAZER

- ❌ **NÃO execute** `lib/swr-config.ts` (é TypeScript, não SQL!)
- ❌ **NÃO execute** arquivos `.ts` ou `.tsx`
- ✅ **Execute APENAS** arquivos `.sql`

---

## ✅ Verificação

Após executar as migrations, verifique se as tabelas foram criadas:

```sql
-- Verificar tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('saved_recipes', 'saved_videos', 'api_cache');
```

---

## 📁 Arquivos TypeScript (NÃO EXECUTAR)

Estes arquivos são para a aplicação Next.js, **NÃO** para o Supabase:

- `lib/swr-config.ts` - Configuração SWR (TypeScript)
- `app/api/recipes/save/route.ts` - API endpoint (TypeScript)
- `app/api/videos/save/route.ts` - API endpoint (TypeScript)

Esses arquivos **já estão funcionando** no código da aplicação.
