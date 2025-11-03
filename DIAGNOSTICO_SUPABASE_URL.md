# 🔍 DIAGNÓSTICO COMPLETO: URL Supabase Incorreta

## ✅ CONFIRMADO: Código está Limpo

Busquei **TODAS** as referências à URL antiga no código e **NENHUMA** foi encontrada:

- ✅ **Não há referências** à URL `bbcwitnbnosyfpjtzkr` em `app/`, `lib/`, `components/`
- ✅ **Não há URLs hardcoded** no código fonte
- ✅ **Todas as referências** usam `process.env.NEXT_PUBLIC_SUPABASE_URL`
- ✅ **netlify.toml** não tem URL hardcoded
- ✅ **Não há arquivos .env** commitados

**Conclusão:** O problema está **100% na configuração do Netlify Dashboard.**

---

## 🎯 CAUSA PROVÁVEL: Variável de Ambiente no Netlify

### Possíveis Cenários:

1. **Variável em contexto errado**
   - Variável está em "Deploy preview" mas não em "Production"
   - Ou vice-versa

2. **Variável duplicada**
   - Existe uma variável antiga que está sendo usada
   - A nova variável foi criada mas a antiga ainda existe

3. **Erro de digitação ao atualizar**
   - A variável foi editada mas ainda tem um caractere errado
   - Ex: espaço antes/depois, caractere invisível

4. **Cache do build antigo**
   - O deploy foi feito antes de atualizar a variável
   - Ou o cache não foi limpo

5. **Variável com nome errado**
   - Existe `SUPABASE_URL` (sem `NEXT_PUBLIC_`)
   - Que está sendo usada em vez da correta

---

## ✅ CHECKLIST DE VERIFICAÇÃO NO NETLIFY

### Passo 1: Verificar TODAS as Variáveis

1. **Acesse:** https://app.netlify.com/sites/nossamaternidade/settings/deploys#environment-variables

2. **Procure por TODAS as variáveis relacionadas ao Supabase:**
   - `NEXT_PUBLIC_SUPABASE_URL` ← **DEVE existir**
   - `SUPABASE_URL` ← **NÃO deve existir** (se existir, DELETE)
   - `EXPO_PUBLIC_SUPABASE_URL` ← **NÃO deve existir** (se existir, DELETE)
   - Qualquer outra variável com "SUPABASE_URL" no nome

3. **Para CADA variável encontrada:**
   - Clique para ver os detalhes
   - Verifique o **valor** exato
   - Verifique em quais **contextos** está definida (Production, Deploy preview, etc.)

### Passo 2: Verificar Valor Exato

Para a variável `NEXT_PUBLIC_SUPABASE_URL`:

**Valor correto (COPIE E COLE):**
```
https://mnszbkeuerjcevjvdqme.supabase.co
```

**Verifique:**
- ✅ Começa com `https://`
- ✅ Termina com `.supabase.co`
- ✅ Não tem espaços antes/depois
- ✅ Não tem aspas
- ✅ É exatamente `mnszbkeuerjcevjvdqme` (não `bbcwitnbnosyfpjtzkr`)

### Passo 3: Verificar Contextos

A variável `NEXT_PUBLIC_SUPABASE_URL` deve estar definida em:

- ✅ **Production** (obrigatório)
- ✅ **Deploy preview** (recomendado)
- ✅ **Branch deploy** (opcional)

**Como verificar:**
1. Clique na variável `NEXT_PUBLIC_SUPABASE_URL`
2. Veja em quais contextos ela aparece
3. Se estiver apenas em "Deploy preview", adicione também em "Production"

### Passo 4: Remover Variáveis Duplicadas/Antigas

Se encontrar variáveis com nomes similares:

1. **DELETE** qualquer variável chamada:
   - `SUPABASE_URL` (sem `NEXT_PUBLIC_`)
   - `EXPO_PUBLIC_SUPABASE_URL`
   - Qualquer variável que contenha `bbcwitnbnosyfpjtzkr`

2. **Mantenha APENAS:**
   - `NEXT_PUBLIC_SUPABASE_URL` com valor `https://mnszbkeuerjcevjvdqme.supabase.co`

### Passo 5: Forçar Novo Deploy

1. **Vá em Deploys:**
   - https://app.netlify.com/sites/nossamaternidade/deploys

2. **Trigger deploy com cache limpo:**
   - Clique em **"Trigger deploy"** → **"Clear cache and deploy site"**
   - ⚠️ **IMPORTANTE:** Use "Clear cache" para garantir que o build use as variáveis atualizadas

3. **Aguarde o build completar**

4. **Verifique os logs:**
   - No deploy, clique para ver os logs
   - Procure por "Environment variables" no início do build
   - Verifique se mostra `NEXT_PUBLIC_SUPABASE_URL` com a URL correta

---

## 🔧 SOLUÇÃO RÁPIDA VIA CLI

Se preferir usar CLI para garantir que está correto:

```powershell
# 1. Verificar variáveis atuais
netlify env:list

# 2. Deletar variável antiga (se existir)
netlify env:unset SUPABASE_URL
netlify env:unset EXPO_PUBLIC_SUPABASE_URL

# 3. Configurar variável correta em TODOS os contextos
netlify env:set --context production NEXT_PUBLIC_SUPABASE_URL "https://mnszbkeuerjcevjvdqme.supabase.co"
netlify env:set --context deploy-preview NEXT_PUBLIC_SUPABASE_URL "https://mnszbkeuerjcevjvdqme.supabase.co"
netlify env:set --context branch-deploy NEXT_PUBLIC_SUPABASE_URL "https://mnszbkeuerjcevjvdqme.supabase.co"

# 4. Verificar se foi salvo corretamente
netlify env:get NEXT_PUBLIC_SUPABASE_URL

# 5. Fazer deploy com cache limpo
netlify deploy --prod --build
```

---

## 🆘 SE AINDA NÃO FUNCIONAR

### 1. Verificar Build Logs

No deploy, procure por:

```
Environment variables:
NEXT_PUBLIC_SUPABASE_URL = https://...
```

**Se a URL no log for diferente de `https://mnszbkeuerjcevjvdqme.supabase.co`, a variável não foi atualizada corretamente.**

### 2. Verificar no Código do Build

No build log, procure por:

```
> next build
```

E depois procure por alguma mensagem que mostre a URL sendo usada.

### 3. Testar Localmente

1. Crie um arquivo `.env.local` na raiz:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://mnszbkeuerjcevjvdqme.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-key-aqui
   ```

2. Rode localmente:
   ```bash
   npm run dev
   ```

3. Teste o signup. Se funcionar localmente, o problema está definitivamente no Netlify.

### 4. Última Opção: Recriar Site

Se nada funcionar, pode ser algum problema no site do Netlify. Nesse caso:

1. **Exporte as configurações atuais**
2. **Crie um novo site** no Netlify
3. **Configure tudo do zero**
4. **Faça o deploy**

---

## 📋 CHECKLIST FINAL

- [ ] Verifiquei TODAS as variáveis relacionadas ao Supabase no Dashboard
- [ ] Confirmei que `NEXT_PUBLIC_SUPABASE_URL` existe e tem o valor correto
- [ ] Removi variáveis duplicadas/antigas (`SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_URL`)
- [ ] Verifiquei que a variável está em TODOS os contextos necessários
- [ ] Fiz um novo deploy com "Clear cache"
- [ ] Verifiquei os logs do build para confirmar que a URL correta está sendo usada
- [ ] Testei o signup no site em produção

---

**Tempo estimado:** 10 minutos ⏱️

**Criado em:** 2025-11-03
