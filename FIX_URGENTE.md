# ⚠️ CORREÇÃO URGENTE: Supabase Não Conecta

## 🚨 Problema Identificado

**Erro**: `ERR_NAME_NOT_RESOLVED - bbcwitnbnosyfpfjtzkry.supabase.co`

**Causa**: A URL do Supabase no `.env.local` está incorreta. O domínio não existe.

---

## ✅ SOLUÇÃO EM 3 PASSOS (5 minutos)

### 📍 PASSO 1: Obter URL Correta do Supabase

**Opção A: Você JÁ tem um projeto Supabase**
1. Acesse: https://supabase.com/dashboard
2. Clique no seu projeto
3. Vá em: **Settings** → **API**
4. Copie:
   - **Project URL** (ex: `https://abc123xyz.supabase.co`)
   - **anon public** key (JWT grande começando com `eyJ...`)
   - **service_role** key (⚠️ SEGREDO - nunca exponha)

**Opção B: Você NÃO tem projeto (ou foi deletado)**
1. Acesse: https://supabase.com/dashboard
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: nossa-maternidade
   - **Database Password**: Crie uma senha forte e **ANOTE**
   - **Region**: South America (São Paulo)
   - **Plan**: Free
4. Aguarde ~2 minutos (criação do projeto)
5. Quando pronto, vá em **Settings** → **API**
6. Copie as credenciais (URL + keys)

---

### 📍 PASSO 2: Atualizar .env.local

Abra o arquivo `.env.local` na raiz do projeto e **substitua** estas linhas:

```env
# ANTES (URL ERRADA - NÃO EXISTE):
NEXT_PUBLIC_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkry.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...chave-antiga
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...chave-antiga

# DEPOIS (cole suas credenciais aqui):
NEXT_PUBLIC_SUPABASE_URL=https://SUA-URL-AQUI.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-completa-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-completa-aqui
```

**⚠️ ATENÇÃO**:
- Cole a URL EXATAMENTE como aparece no dashboard
- Copie as keys COMPLETAS (são ~500 caracteres cada)
- Não adicione espaços antes/depois
- Salve o arquivo (Ctrl+S)

---

### 📍 PASSO 3: Testar Conexão

**No terminal**:

```bash
# 1. Parar o servidor (se estiver rodando)
# Pressione Ctrl+C no terminal onde npm run dev está

# 2. Testar conexão
node scripts/test-supabase-connection.mjs
```

**Resultado esperado**:
```
✅ TESTE COMPLETO!
```

**Se der erro**:
- Verifique se copiou a URL correta
- Verifique se não tem espaços nas keys
- Tente acessar a URL no navegador: `https://SUA-URL.supabase.co`

---

## 🗄️ PRÓXIMO PASSO: Executar SQL Scripts

**Após a conexão funcionar**, você precisa criar as tabelas no banco:

1. Acesse seu projeto Supabase: https://SUA-URL.supabase.co
2. Vá em: **SQL Editor** → **New Query**
3. Abra o arquivo: `scripts/CONSOLIDATED_SETUP.sql`
4. Copie TODO o conteúdo (662 linhas)
5. Cole no SQL Editor
6. Clique em **RUN** (ou F5)
7. Aguarde ~10 segundos
8. Deve mostrar: **"Success. No rows returned"**

**Verificar se funcionou**:

Execute esta query no SQL Editor:

```sql
SELECT COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = 'public';
```

**Resultado esperado**: `total_tables: 17`

---

## 🧪 TESTE FINAL: Signup

```bash
# 1. Reiniciar servidor
npm run dev

# 2. Acessar no navegador
http://localhost:3000/signup

# 3. Preencher formulário
Email: teste@exemplo.com
Senha: senha123
Nome: Teste da Silva

# 4. Clicar em "Criar Conta"
```

**Resultado esperado**:
- ✅ Redirect para `/onboarding`
- ✅ Email de confirmação enviado
- ✅ Usuário aparece no Supabase Dashboard → Authentication → Users

---

## 📋 Checklist

Marque conforme completa:

- [ ] Acessei Supabase Dashboard
- [ ] Copiei URL do projeto
- [ ] Copiei anon key
- [ ] Copiei service_role key
- [ ] Atualizei `.env.local` com credenciais corretas
- [ ] Salvei `.env.local`
- [ ] Executei `node scripts/test-supabase-connection.mjs`
- [ ] Teste passou ✅
- [ ] Executei SQL scripts no Supabase SQL Editor
- [ ] Verificado: 17 tabelas criadas
- [ ] Reiniciei `npm run dev`
- [ ] Testei signup em `/signup`
- [ ] Signup funcionou ✅

---

## 🆘 Ainda com problema?

**Se o teste de conexão falhar**:
1. Leia: `scripts/FIX_SUPABASE_CONNECTION.md` (guia completo)
2. Verifique firewall/antivírus
3. Tente com outra rede (celular 4G/5G)
4. Verifique se o projeto Supabase está ativo (Dashboard)

**Se signup der erro 500 após scripts**:
1. Verifique se o trigger existe:
```sql
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```
2. Se retornar vazio, execute: `scripts/002_create_profile_trigger.sql`

---

## 🎯 Resumo

| Problema | Solução | Tempo |
|----------|---------|-------|
| URL inválida | Copiar URL correta do Supabase Dashboard | 2 min |
| Sem tabelas | Executar CONSOLIDATED_SETUP.sql | 1 min |
| Signup 500 | Verificar trigger handle_new_user | 1 min |

**Total**: ~5 minutos para resolver tudo ✅
