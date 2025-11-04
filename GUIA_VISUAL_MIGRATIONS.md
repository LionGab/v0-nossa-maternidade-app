# 🎯 GUIA VISUAL - Como Executar Migrations

## ❌ ERRO ATUAL

Você está tentando executar este arquivo:
```
lib/swr-config.ts  ← ❌ ESTE É TYPESCRIPT, NÃO SQL!
```

**Este arquivo NÃO é uma migration SQL!** É código TypeScript da aplicação Next.js.

---

## ✅ O QUE FAZER

### 1. Abra o Supabase Dashboard
- Acesse: https://supabase.com/dashboard
- Selecione seu projeto

### 2. Vá para SQL Editor
- Menu lateral → **SQL Editor**
- Clique em **+ New Query**

### 3. Execute ESTES arquivos (nesta ordem):

#### 📄 Arquivo 1: `supabase/migrations/20250127_saved_recipes.sql`

**Onde está:** `supabase/migrations/20250127_saved_recipes.sql`

**Como executar:**
1. Abra o arquivo `supabase/migrations/20250127_saved_recipes.sql` no VS Code
2. Copie **TODO** o conteúdo do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** (ou Ctrl+Enter)

---

#### 📄 Arquivo 2: `supabase/migrations/20250127_saved_videos.sql`

**Onde está:** `supabase/migrations/20250127_saved_videos.sql`

**Como executar:**
1. Abra o arquivo `supabase/migrations/20250127_saved_videos.sql` no VS Code
2. Copie **TODO** o conteúdo do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** (ou Ctrl+Enter)

---

#### 📄 Arquivo 3: `supabase/migrations/20250127_api_cache.sql`

**Onde está:** `supabase/migrations/20250127_api_cache.sql`

**Como executar:**
1. Abra o arquivo `supabase/migrations/20250127_api_cache.sql` no VS Code
2. Copie **TODO** o conteúdo do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** (ou Ctrl+Enter)

---

## 📁 ESTRUTURA DE ARQUIVOS

```
v0-nossa-maternidade-app/
│
├── lib/
│   └── swr-config.ts          ← ❌ NÃO EXECUTAR (TypeScript)
│
├── app/
│   └── api/
│       └── recipes/save/route.ts  ← ❌ NÃO EXECUTAR (TypeScript)
│
└── supabase/
    └── migrations/
        ├── 20250127_saved_recipes.sql    ← ✅ EXECUTAR ESTE
        ├── 20250127_saved_videos.sql     ← ✅ EXECUTAR ESTE
        └── 20250127_api_cache.sql        ← ✅ EXECUTAR ESTE
```

---

## 🔍 COMO IDENTIFICAR SE É SQL

**Arquivos SQL têm:**
- ✅ Extensão `.sql`
- ✅ Estão na pasta `supabase/migrations/`
- ✅ Começam com comentários SQL: `-- Migration:`
- ✅ Contêm comandos SQL: `CREATE TABLE`, `INSERT`, etc.

**Arquivos TypeScript têm:**
- ❌ Extensão `.ts` ou `.tsx`
- ❌ Estão em `lib/`, `app/`, `components/`, etc.
- ❌ Contêm `import`, `export`, `function`, etc.
- ❌ **NÃO devem ser executados no Supabase!**

---

## ✅ VERIFICAÇÃO

Após executar as 3 migrations, execute esta query no SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('saved_recipes', 'saved_videos', 'api_cache');
```

**Deve retornar 3 linhas:**
- `saved_recipes`
- `saved_videos`
- `api_cache`

Se retornar 3 linhas, **SUCESSO!** ✅

---

## 🎯 RESUMO

1. ✅ Execute **APENAS** arquivos `.sql` da pasta `supabase/migrations/`
2. ❌ **NÃO execute** arquivos `.ts` ou `.tsx`
3. ❌ **NÃO execute** `lib/swr-config.ts` (é código da aplicação)
4. ✅ Execute **nesta ordem**: recipes → videos → cache

---

## 🆘 AINDA COM DÚVIDAS?

Se ainda estiver em dúvida sobre qual arquivo executar:

1. **Abra o arquivo no VS Code**
2. **Verifique a primeira linha:**
   - Se começa com `-- Migration:` → ✅ É SQL, pode executar
   - Se começa com `import` ou `export` → ❌ É TypeScript, NÃO execute

---

**Agora você sabe exatamente quais arquivos executar!** 🚀
