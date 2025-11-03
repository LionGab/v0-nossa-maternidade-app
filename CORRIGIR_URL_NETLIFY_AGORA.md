# 🚨 CORREÇÃO URGENTE: URL Supabase no Netlify

## ✅ CONFIRMADO: Código está Limpo

A busca confirmou que **não há URLs hardcoded** no código da aplicação. A URL antiga só aparece em arquivos de documentação/scripts.

**O problema está 100% nas variáveis de ambiente do Netlify.**

---

## 🔧 SOLUÇÃO DEFINITIVA (5 minutos)

### Passo 1: Deletar TODAS as Variáveis Antigas

1. **Acesse:** https://app.netlify.com/sites/nossamaternidade/settings/deploys#environment-variables

2. **DELETE qualquer variável com nome:**
   - `SUPABASE_URL` (sem `NEXT_PUBLIC_`)
   - `EXPO_PUBLIC_SUPABASE_URL`
   - Qualquer variável que contenha `bbcwitnbnosyfpjtzkr`

3. **Mantenha APENAS:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Passo 2: Atualizar Variável Correta

1. **Encontre `NEXT_PUBLIC_SUPABASE_URL`** na lista

2. **Clique para editar**

3. **DELETE o valor atual completamente** (Ctrl+A, Delete)

4. **Cole o valor EXATO (copie daqui):**
   ```
   https://mnszbkeuerjcevjvdqme.supabase.co
   ```

5. **Verifique:**
   - ✅ Não tem espaços antes/depois
   - ✅ Não tem aspas
   - ✅ Começa com `https://`
   - ✅ Termina com `.supabase.co`
   - ✅ É exatamente `mnszbkeuerjcevjvdqme` (não `bbcwitnbnosyfpjtzkr`)

6. **Salve** (clique em "Save" ou "Update")

### Passo 3: Verificar Contextos

1. **Clique novamente em `NEXT_PUBLIC_SUPABASE_URL`** para ver os detalhes

2. **Verifique em quais contextos está definida:**
   - ✅ **Production** (deve ter)
   - ✅ **Deploy preview** (recomendado)
   - ✅ **Branch deploy** (opcional)

3. **Se estiver apenas em um contexto:**
   - Clique em "Add variable"
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://mnszbkeuerjcevjvdqme.supabase.co`
   - Context: Selecione o contexto faltante (Production, Deploy preview, etc.)
   - Clique em "Save"

### Passo 4: Forçar Novo Deploy com Cache Limpo

1. **Vá em Deploys:**
   - https://app.netlify.com/sites/nossamaternidade/deploys

2. **Clique em "Trigger deploy"** (botão no canto superior direito)

3. **Selecione "Clear cache and deploy site"**
   - ⚠️ **IMPORTANTE:** Use "Clear cache" para garantir que o build use as variáveis atualizadas

4. **Aguarde o build completar** (~2-5 minutos)

5. **Verifique os logs:**
   - Clique no deploy para ver os logs
   - No início, procure por "Environment variables"
   - Deve mostrar: `NEXT_PUBLIC_SUPABASE_URL = https://mnszbkeuerjcevjvdqme.supabase.co`
   - Se mostrar a URL antiga, a variável não foi atualizada corretamente

### Passo 5: Limpar Cache do Browser

1. **Abra o site em produção** (modo anônimo/privado)

2. **Ou faça hard refresh:**
   - **Windows/Linux:** `Ctrl + Shift + R`
   - **Mac:** `Cmd + Shift + R`

3. **Ou limpe o cache:**
   - Abra DevTools (F12)
   - Clique com botão direito no botão de recarregar
   - Selecione "Empty Cache and Hard Reload"

---

## 🔍 VERIFICAÇÃO FINAL

Após fazer o deploy:

1. **Acesse o site em produção**

2. **Abra o DevTools (F12)** → **Console**

3. **Tente fazer signup**

4. **Verifique a requisição:**
   - Vá em **Network** (aba no DevTools)
   - Procure por requisições para `supabase.co`
   - A URL deve ser: `https://mnszbkeuerjcevjvdqme.supabase.co/auth/v1/signup`
   - **NÃO deve ser:** `https://bbcwitnbnosyfpjtzkr.supabase.co/...`

5. **Se ainda mostrar a URL antiga:**
   - A variável não foi atualizada corretamente no Netlify
   - Volte ao Passo 2 e verifique novamente

---

## 🆘 SE AINDA NÃO FUNCIONAR

### Opção 1: Via CLI (Mais Confiável)

```powershell
# 1. Verificar variáveis atuais
netlify env:list

# 2. Deletar variável antiga (se existir)
netlify env:unset SUPABASE_URL --context production
netlify env:unset SUPABASE_URL --context deploy-preview

# 3. Configurar variável correta em TODOS os contextos
netlify env:set --context production NEXT_PUBLIC_SUPABASE_URL "https://mnszbkeuerjcevjvdqme.supabase.co"
netlify env:set --context deploy-preview NEXT_PUBLIC_SUPABASE_URL "https://mnszbkeuerjcevjvdqme.supabase.co"
netlify env:set --context branch-deploy NEXT_PUBLIC_SUPABASE_URL "https://mnszbkeuerjcevjvdqme.supabase.co"

# 4. Verificar se foi salvo
netlify env:get NEXT_PUBLIC_SUPABASE_URL --context production

# 5. Fazer deploy com cache limpo
netlify deploy --prod --build
```

### Opção 2: Recriar Variável do Zero

1. **DELETE a variável `NEXT_PUBLIC_SUPABASE_URL` completamente**

2. **Crie uma nova variável:**
   - Clique em "Add variable"
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://mnszbkeuerjcevjvdqme.supabase.co`
   - Context: Selecione "All scopes" ou todos os contextos
   - Clique em "Save"

3. **Faça novo deploy com cache limpo**

---

## 📋 CHECKLIST FINAL

- [ ] Deletei variáveis antigas (`SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_URL`)
- [ ] Atualizei `NEXT_PUBLIC_SUPABASE_URL` com valor `https://mnszbkeuerjcevjvdqme.supabase.co`
- [ ] Verifiquei que não há espaços antes/depois do valor
- [ ] Verifiquei que a variável está em TODOS os contextos necessários
- [ ] Fiz deploy com "Clear cache and deploy site"
- [ ] Verifiquei os logs do build para confirmar URL correta
- [ ] Limpei cache do browser ou testei em modo anônimo
- [ ] Testei signup no site em produção
- [ ] Verifiquei no Network tab que a requisição usa a URL correta

---

## ⚡ DICA: Verificar URL no Build Log

No log do deploy, procure por:

```
> next build
```

E logo depois:

```
Environment variables:
NEXT_PUBLIC_SUPABASE_URL = https://mnszbkeuerjcevjvdqme.supabase.co
```

Se a URL no log for diferente, a variável não foi atualizada corretamente.

---

**Tempo estimado:** 5 minutos ⏱️

**Criado em:** 2025-11-03
