# 🚨 CORREÇÃO URGENTE: Signup "Failed to fetch"

## Problema

O erro `TypeError: Failed to fetch` no signup indica que a URL do Supabase não está sendo resolvida corretamente.

**Causa:** Variáveis de ambiente no Netlify estão incorretas ou duplicadas.

---

## ✅ SOLUÇÃO DEFINITIVA (3 minutos)

### Passo 1: Deletar Variáveis EXPO_PUBLIC_* (CRÍTICO)

1. **Acesse:** https://app.netlify.com/sites/nossamaternidade/settings/deploys#environment-variables

2. **DELETE estas variáveis:**
   - `EXPO_PUBLIC_SUPABASE_URL` ← **MUITO IMPORTANTE**
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_CLAUDE_API_KEY`
   - `EXPO_PUBLIC_GEMINI_API_KEY`
   - `EXPO_PUBLIC_OPENAI_API_KEY`
   - `EXPO_PUBLIC_PERPLEXITY_API_KEY`

3. **Para cada uma:**
   - Clique na variável
   - Clique em "Delete" ou "Remove"
   - Confirme a deleção

### Passo 2: Verificar/Atualizar NEXT_PUBLIC_SUPABASE_URL

1. **Encontre `NEXT_PUBLIC_SUPABASE_URL`** na lista

2. **Clique para editar**

3. **Verifique o valor:**
   - Deve ser: `https://mnszbkeuerjcevjvdqme.supabase.co`
   - **NÃO deve ser:** `https://bbcwitnbnosyfpjtzkr.supabase.co`

4. **Se estiver incorreto:**
   - Delete o valor atual completamente
   - Cole exatamente: `https://mnszbkeuerjcevjvdqme.supabase.co`
   - **NÃO adicione espaços, aspas ou caracteres extras**
   - Clique em "Save"

5. **Verifique o contexto:**
   - Deve estar em "All scopes" ou em "Production"
   - Se estiver apenas em "Deploy preview", adicione também em "Production"

### Passo 3: Forçar Deploy com Cache Limpo

1. **Vá em Deploys:**
   - https://app.netlify.com/sites/nossamaternidade/deploys

2. **Clique em "Trigger deploy"** (canto superior direito)

3. **Selecione "Clear cache and deploy site"**
   - ⚠️ **IMPORTANTE:** Use "Clear cache" para garantir que as variáveis atualizadas sejam usadas

4. **Aguarde o build completar** (~3-5 minutos)

5. **Verifique os logs:**
   - Clique no deploy para ver os logs
   - No início, procure por "Environment variables"
   - Deve mostrar: `NEXT_PUBLIC_SUPABASE_URL = https://mnszbkeuerjcevjvdqme.supabase.co`
   - Se mostrar URL diferente, a variável não foi atualizada corretamente

### Passo 4: Limpar Cache do Browser

1. **Abra o site em produção** em uma **aba anônima/privada**

2. **Ou faça hard refresh:**
   - **Windows/Linux:** `Ctrl + Shift + R`
   - **Mac:** `Cmd + Shift + R`

3. **Ou limpe o cache manualmente:**
   - Abra DevTools (F12)
   - Clique com botão direito no botão de recarregar
   - Selecione "Empty Cache and Hard Reload"

### Passo 5: Testar Signup

1. **Acesse:** `https://seu-app.netlify.app/signup`

2. **Preencha o formulário:**
   - Nome completo
   - Email válido
   - Senha (mínimo 6 caracteres)

3. **Clique em "Criar conta"**

4. **Verifique no DevTools (F12) → Network:**
   - Procure por requisições para `supabase.co`
   - A URL deve ser: `https://mnszbkeuerjcevjvdqme.supabase.co/auth/v1/signup`
   - **NÃO deve ser:** `https://bbcwitnbnosyfpjtzkr.supabase.co/...`

---

## 🔍 Verificação

Se ainda não funcionar:

1. **Verifique os logs do build:**
   - No deploy, veja se mostra a URL correta nas variáveis de ambiente

2. **Verifique no Network tab:**
   - Qual URL está sendo usada na requisição
   - Se for a URL antiga, a variável não foi atualizada corretamente

3. **Teste localmente:**
   - Crie um arquivo `.env.local`:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://mnszbkeuerjcevjvdqme.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-key-aqui
     ```
   - Rode `npm run dev`
   - Teste o signup
   - Se funcionar localmente, o problema está 100% no Netlify

---

## ⚡ Solução Rápida via CLI

Se preferir usar CLI:

```powershell
# 1. Deletar variáveis EXPO_PUBLIC_*
netlify env:unset EXPO_PUBLIC_SUPABASE_URL --context production
netlify env:unset EXPO_PUBLIC_SUPABASE_URL --context deploy-preview
netlify env:unset EXPO_PUBLIC_SUPABASE_ANON_KEY --context production
netlify env:unset EXPO_PUBLIC_SUPABASE_ANON_KEY --context deploy-preview

# 2. Configurar variável correta
netlify env:set --context production NEXT_PUBLIC_SUPABASE_URL "https://mnszbkeuerjcevjvdqme.supabase.co"
netlify env:set --context deploy-preview NEXT_PUBLIC_SUPABASE_URL "https://mnszbkeuerjcevjvdqme.supabase.co"

# 3. Verificar
netlify env:get NEXT_PUBLIC_SUPABASE_URL --context production

# 4. Deploy com cache limpo
netlify deploy --prod --build
```

---

## 📋 Checklist Final

- [ ] Deletei `EXPO_PUBLIC_SUPABASE_URL` e todas as outras `EXPO_PUBLIC_*`
- [ ] Verifiquei que `NEXT_PUBLIC_SUPABASE_URL` tem valor `https://mnszbkeuerjcevjvdqme.supabase.co`
- [ ] Verifiquei que não há espaços antes/depois do valor
- [ ] Verifiquei que a variável está em "Production" (ou "All scopes")
- [ ] Fiz deploy com "Clear cache and deploy site"
- [ ] Verifiquei os logs do build para confirmar URL correta
- [ ] Limpei cache do browser ou testei em modo anônimo
- [ ] Testei signup e verifiquei no Network tab que usa URL correta

---

## 🎯 Por Que Isso Resolve?

1. **Variáveis duplicadas:** As `EXPO_PUBLIC_*` podem estar sendo usadas em vez das `NEXT_PUBLIC_*`
2. **URL antiga:** A `EXPO_PUBLIC_SUPABASE_URL` pode ter a URL antiga `bbcwitnbnosyfpjtzkr.supabase.co`
3. **Cache:** O build pode estar usando cache antigo com variáveis antigas
4. **Contexto:** Variável pode estar apenas em um contexto e não em Production

**Depois de deletar todas as `EXPO_PUBLIC_*` e garantir que `NEXT_PUBLIC_SUPABASE_URL` está correta, o problema deve ser resolvido.**

---

**Tempo estimado:** 3 minutos ⏱️

**Criado em:** 2025-11-03
