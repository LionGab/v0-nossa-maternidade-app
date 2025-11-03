# 🎯 Qual Site Usar no Netlify?

## 📍 Dois Ambientes no Netlify

### 1. **Production (Principal)**
- **URL:** `https://nossamaternidade.netlify.app`
- **Branch:** Configurada como "Production branch" (geralmente `main`)
- **Quando usar:**
  - ✅ Testes finais antes de ir ao ar
  - ✅ Para usuários finais
  - ✅ Para validar que tudo funciona em produção

### 2. **Preview (Branch Deploy)**
- **URL:** `https://devserver-main--nossamaternidade.netlify.app`
- **Branch:** `main@HEAD`
- **Quando usar:**
  - ✅ Testes durante desenvolvimento
  - ✅ Validar mudanças antes de merge
  - ✅ Testar em ambiente isolado

---

## ✅ Qual Site Usar Agora?

### Para Testar o Signup Corrigido:

**Use o PRODUCTION:** `https://nossamaternidade.netlify.app`

**Por quê?**
- O preview server pode ter variáveis de ambiente diferentes
- O production é o que os usuários finais vão acessar
- É mais importante garantir que o production está funcionando

---

## 🔧 Configurar Variáveis de Ambiente

### IMPORTANTE: Configurar em AMBOS os Ambientes

As variáveis de ambiente podem ser diferentes entre production e preview.

### Passo 1: Verificar Variáveis no Production

1. **Acesse:** https://app.netlify.com/sites/nossamaternidade/settings/deploys#environment-variables

2. **Verifique o contexto:**
   - **Production** - Variáveis usadas no site principal
   - **Deploy previews** - Variáveis usadas nos previews
   - **Branch deploys** - Variáveis usadas em branch deploys

3. **Para cada variável importante:**
   - Certifique-se que está em **"All scopes"** ou em **"Production"** e **"Deploy previews"**

### Passo 2: Deletar Variáveis EXPO_PUBLIC_* em TODOS os Contextos

1. **Para cada variável `EXPO_PUBLIC_*`:**
   - Clique na variável
   - Veja em quais contextos está definida
   - Delete de TODOS os contextos (Production, Deploy previews, Branch deploys)

2. **Variáveis a deletar:**
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_CLAUDE_API_KEY`
   - `EXPO_PUBLIC_GEMINI_API_KEY`
   - `EXPO_PUBLIC_OPENAI_API_KEY`
   - `EXPO_PUBLIC_PERPLEXITY_API_KEY`

### Passo 3: Configurar NEXT_PUBLIC_* em TODOS os Contextos

1. **Para `NEXT_PUBLIC_SUPABASE_URL`:**
   - Clique na variável
   - Verifique que está em **"All scopes"** ou em todos os contextos necessários
   - Se não estiver, adicione em cada contexto:
     - Production
     - Deploy previews
     - Branch deploys

2. **Valor correto:**
   ```
   https://mnszbkeuerjcevjvdqme.supabase.co
   ```

---

## 🧪 Testar em Ambos os Ambientes

### Teste 1: Production

1. **Acesse:** `https://nossamaternidade.netlify.app/signup`
2. **Teste o signup**
3. **Verifique no Network tab:**
   - URL deve ser: `https://mnszbkeuerjcevjvdqme.supabase.co/auth/v1/signup`
   - Não deve ser: `https://bbcwitnbnosyfpjtzkr.supabase.co/...`

### Teste 2: Preview (Opcional)

1. **Acesse:** `https://devserver-main--nossamaternidade.netlify.app/signup`
2. **Teste o signup**
3. **Verifique no Network tab:**
   - URL deve ser: `https://mnszbkeuerjcevjvdqme.supabase.co/auth/v1/signup`
   - Se mostrar URL antiga, as variáveis não estão configuradas no contexto "Deploy previews"

---

## ⚙️ Configurar Variáveis via CLI (Mais Fácil)

Se preferir usar CLI para garantir que está em todos os contextos:

```powershell
# 1. Deletar variáveis EXPO_PUBLIC_* de todos os contextos
netlify env:unset EXPO_PUBLIC_SUPABASE_URL --context production
netlify env:unset EXPO_PUBLIC_SUPABASE_URL --context deploy-preview
netlify env:unset EXPO_PUBLIC_SUPABASE_URL --context branch-deploy

# 2. Configurar NEXT_PUBLIC_SUPABASE_URL em todos os contextos
netlify env:set --context production NEXT_PUBLIC_SUPABASE_URL "https://mnszbkeuerjcevjvdqme.supabase.co"
netlify env:set --context deploy-preview NEXT_PUBLIC_SUPABASE_URL "https://mnszbkeuerjcevjvdqme.supabase.co"
netlify env:set --context branch-deploy NEXT_PUBLIC_SUPABASE_URL "https://mnszbkeuerjcevjvdqme.supabase.co"

# 3. Verificar
netlify env:list
```

---

## 📋 Checklist

- [ ] Identifiquei que há dois ambientes (production e preview)
- [ ] Vou usar o **production** para testes finais
- [ ] Deletei variáveis `EXPO_PUBLIC_*` de TODOS os contextos
- [ ] Configurei `NEXT_PUBLIC_SUPABASE_URL` em TODOS os contextos
- [ ] Verifiquei que o valor está correto em cada contexto
- [ ] Testei signup no production
- [ ] Verifiquei no Network tab que usa URL correta

---

## 🎯 Recomendação Final

**Para agora:** Use o **production** (`https://nossamaternidade.netlify.app`) para testar o signup corrigido.

**Para desenvolvimento futuro:** Use o preview para testar mudanças antes de fazer merge.

**Importante:** Garanta que as variáveis de ambiente estão configuradas corretamente em **AMBOS** os ambientes, especialmente `NEXT_PUBLIC_SUPABASE_URL`.

---

**Criado em:** 2025-11-03
