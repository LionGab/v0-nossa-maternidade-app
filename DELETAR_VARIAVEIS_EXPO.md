# 🚨 URGENTE: Deletar Variáveis EXPO_PUBLIC_*

## Problema Identificado

Você tem variáveis **duplicadas** com prefixo `EXPO_PUBLIC_*` no Netlify:

- ❌ `EXPO_PUBLIC_SUPABASE_URL` ← **DELETE**
- ❌ `EXPO_PUBLIC_SUPABASE_ANON_KEY` ← **DELETE**
- ❌ `EXPO_PUBLIC_CLAUDE_API_KEY` ← **DELETE**
- ❌ `EXPO_PUBLIC_GEMINI_API_KEY` ← **DELETE**
- ❌ `EXPO_PUBLIC_OPENAI_API_KEY` ← **DELETE**
- ❌ `EXPO_PUBLIC_PERPLEXITY_API_KEY` ← **DELETE**

**O problema:** Seu projeto usa **Next.js**, não Expo. O Next.js procura por `NEXT_PUBLIC_*`, não `EXPO_PUBLIC_*`.

**Possível causa do erro:** Algum código ou configuração pode estar tentando usar as variáveis `EXPO_PUBLIC_*` primeiro, e se elas existirem, podem estar com valores antigos (como a URL antiga do Supabase).

---

## ✅ SOLUÇÃO (2 minutos)

### Passo 1: Verificar Valor de EXPO_PUBLIC_SUPABASE_URL

**ANTES de deletar, verifique o valor:**

1. Clique em `EXPO_PUBLIC_SUPABASE_URL`
2. Veja o valor atual
3. Se for `https://bbcwitnbnosyfpjtzkr.supabase.co` ← **ESSE É O PROBLEMA!**
4. Se for `https://mnszbkeuerjcevjvdqme.supabase.co`, ainda assim deve ser deletada (duplicada)

### Passo 2: Verificar Valor de NEXT_PUBLIC_SUPABASE_URL

1. Clique em `NEXT_PUBLIC_SUPABASE_URL`
2. Verifique que o valor é: `https://mnszbkeuerjcevjvdqme.supabase.co`
3. Se não for, atualize para esse valor

### Passo 3: Deletar TODAS as Variáveis EXPO_PUBLIC_*

1. **Acesse:** https://app.netlify.com/sites/nossamaternidade/settings/deploys#environment-variables

2. **Para CADA variável abaixo, clique e DELETE:**
   - `EXPO_PUBLIC_CLAUDE_API_KEY`
   - `EXPO_PUBLIC_GEMINI_API_KEY`
   - `EXPO_PUBLIC_OPENAI_API_KEY`
   - `EXPO_PUBLIC_PERPLEXITY_API_KEY`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_SUPABASE_URL` ← **MUITO IMPORTANTE**

3. **Confirme a deleção** quando solicitado

### Passo 4: Verificar Variáveis NEXT_PUBLIC_* Corretas

Certifique-se de que estas variáveis existem e têm valores corretos:

- ✅ `NEXT_PUBLIC_SUPABASE_URL` = `https://mnszbkeuerjcevjvdqme.supabase.co`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (sua key completa)
- ✅ `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` = (sua URL de redirect)
- ✅ `NEXT_PUBLIC_ENABLE_ANALYTICS` = (valor correto)

### Passo 5: Fazer Novo Deploy com Cache Limpo

1. Vá em **Deploys** → **Trigger deploy** → **Clear cache and deploy site**
2. Aguarde o build completar
3. Teste o signup

---

## 🔍 Verificação

Após deletar e fazer deploy:

1. **Acesse o site em produção**
2. **Abra DevTools (F12)** → **Network**
3. **Tente fazer signup**
4. **Verifique a requisição:**
   - Deve ir para: `https://mnszbkeuerjcevjvdqme.supabase.co/auth/v1/signup`
   - **NÃO deve** ir para: `https://bbcwitnbnosyfpjtzkr.supabase.co/...`

---

## 📋 Checklist

- [ ] Verifiquei o valor de `EXPO_PUBLIC_SUPABASE_URL` (se tinha URL antiga)
- [ ] Verifiquei que `NEXT_PUBLIC_SUPABASE_URL` tem valor correto
- [ ] Deletei `EXPO_PUBLIC_SUPABASE_URL`
- [ ] Deletei `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Deletei `EXPO_PUBLIC_CLAUDE_API_KEY`
- [ ] Deletei `EXPO_PUBLIC_GEMINI_API_KEY`
- [ ] Deletei `EXPO_PUBLIC_OPENAI_API_KEY`
- [ ] Deletei `EXPO_PUBLIC_PERPLEXITY_API_KEY`
- [ ] Fiz deploy com cache limpo
- [ ] Testei signup e verifiquei no Network tab

---

## ⚡ Por Que Isso Resolve?

1. **Variáveis duplicadas causam confusão:** O build pode tentar usar variáveis `EXPO_PUBLIC_*` primeiro
2. **Pode ter valor antigo:** A `EXPO_PUBLIC_SUPABASE_URL` pode ter a URL antiga `bbcwitnbnosyfpjtzkr.supabase.co`
3. **Next.js não usa EXPO_PUBLIC_*:** Essas variáveis não deveriam existir em um projeto Next.js

**Depois de deletar, apenas as variáveis `NEXT_PUBLIC_*` serão usadas, que são as corretas.**

---

**Tempo estimado:** 2 minutos ⏱️

**Criado em:** 2025-11-03
