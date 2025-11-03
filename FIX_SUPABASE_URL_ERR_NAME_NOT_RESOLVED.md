# 🚨 FIX URGENTE: URL do Supabase Incorreta

## Erro

```
POST https://bbcwitnbnosyfpjtzkr.supabase.co/auth/v1/signup
net::ERR_NAME_NOT_RESOLVED
```

A aplicação está tentando usar uma URL do Supabase que não existe ou está incorreta.

**URL incorreta:** `https://bbcwitnbnosyfpjtzkr.supabase.co`
**URL correta:** `https://mnszbkeuerjcevjvdqme.supabase.co`

---

## ✅ SOLUÇÃO (2 minutos)

### Passo 1: Atualizar Variável de Ambiente no Netlify

1. **Acesse o Netlify Dashboard:**
   - Vá para: https://app.netlify.com/sites/nossamaternidade/settings/deploys#environment-variables

2. **Encontre a variável `NEXT_PUBLIC_SUPABASE_URL`:**
   - Procure por `NEXT_PUBLIC_SUPABASE_URL` na lista
   - Clique para editar

3. **Atualize o valor:**
   - **Valor atual (incorreto):** `https://bbcwitnbnosyfpjtzkr.supabase.co`
   - **Novo valor (correto):** `https://mnszbkeuerjcevjvdqme.supabase.co`
   - Cole o valor completo sem aspas
   - Clique em **"Save"**

4. **Verifique se foi salvo:**
   - O valor deve mostrar: `https://mnszbkeuerjcevjvdqme.supabase.co`
   - Não deve ter espaços antes/depois

### Passo 2: Fazer Novo Deploy

1. **Vá em Deploys:**
   - https://app.netlify.com/sites/nossamaternidade/deploys

2. **Trigger novo deploy:**
   - Clique em **"Trigger deploy"** → **"Clear cache and deploy site"**

3. **Aguarde o build completar**

---

## 🔍 Alternativa: Via CLI

```powershell
# Atualizar URL do Supabase
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://mnszbkeuerjcevjvdqme.supabase.co"

# Verificar se foi atualizada
netlify env:get NEXT_PUBLIC_SUPABASE_URL

# Fazer deploy
netlify deploy --prod
```

---

## ⚠️ IMPORTANTE

1. **Verifique se não há variáveis duplicadas:**
   - Procure por outras variáveis com nomes similares
   - Remova variáveis antigas se existirem

2. **Verifique todos os contextos:**
   - Production
   - Deploy preview
   - Branch deploy
   - Certifique-se que todos têm a URL correta

3. **Após atualizar, SEMPRE faça um novo deploy:**
   - As variáveis só são aplicadas no próximo build
   - Limpe o cache para garantir

---

## 📋 Checklist

- [ ] Acessei o Netlify Dashboard
- [ ] Encontrei a variável `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Atualizei para `https://mnszbkeuerjcevjvdqme.supabase.co`
- [ ] Verifiquei que não há espaços antes/depois
- [ ] Salvei a alteração
- [ ] Fiz um novo deploy com cache limpo
- [ ] Testei o signup no site

---

## 🆘 Se Ainda Não Funcionar

1. **Verifique se há variáveis com nomes errados:**
   - `SUPABASE_URL` (sem `NEXT_PUBLIC_`)
   - `EXPO_PUBLIC_SUPABASE_URL` (se existir)
   - Remova variáveis antigas

2. **Verifique todos os contextos:**
   - No Dashboard, veja se há variáveis em diferentes contextos
   - Atualize todas para usar a URL correta

3. **Limpe o cache do navegador:**
   - O site pode estar usando versão antiga em cache
   - Faça hard refresh (Ctrl+Shift+R)

---

**Tempo estimado:** 2 minutos ⏱️

**Criado em:** 2025-11-03
