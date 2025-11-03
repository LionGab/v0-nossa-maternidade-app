# 🎯 Usar Preview Server como Principal

## ✅ Entendendo a Situação

Você tem dois ambientes:

1. **Preview Server (Novo):**
   - URL: `https://devserver-main--nossamaternidade.netlify.app`
   - Branch: `main@HEAD`
   - Iniciado: Hoje 7:32 PM
   - **Este é o que você quer usar**

2. **Production (Antigo):**
   - URL: `https://nossamaternidade.netlify.app`
   - Publicado: Hoje 7:28 PM
   - Pode estar com código/variaveis antigas

---

## 🎯 Opção 1: Usar Preview Server para Testes (Recomendado)

O preview server (`devserver-main--nossamaternidade.netlify.app`) é o mais recente e provavelmente tem as correções mais recentes.

### Passos:

1. **Use o Preview Server para testes:**
   - URL: `https://devserver-main--nossamaternidade.netlify.app`
   - Teste o signup aqui
   - Verifique se funciona corretamente

2. **Certifique-se que as variáveis de ambiente estão configuradas no contexto "Deploy previews":**
   - Acesse: https://app.netlify.com/sites/nossamaternidade/settings/deploys#environment-variables
   - Para cada variável importante:
     - Clique na variável
     - Verifique que está em **"Deploy previews"** ou **"All scopes"**
     - Se não estiver, adicione no contexto "Deploy previews"

3. **Deletar variáveis `EXPO_PUBLIC_*` do contexto "Deploy previews":**
   - Clique em cada variável `EXPO_PUBLIC_*`
   - Verifique se está em "Deploy previews"
   - Se estiver, delete desse contexto também

---

## 🔄 Opção 2: Fazer Preview Virar Production

Se você quer que o preview server seja o site principal, você precisa fazer um novo deploy no production:

### Passo 1: Verificar que o Código está Correto

1. **Verifique que todas as correções estão no código:**
   - Variáveis `EXPO_PUBLIC_*` não estão no código
   - Código usa `NEXT_PUBLIC_SUPABASE_URL` corretamente

2. **Faça commit e push (se necessário):**
   ```bash
   git add .
   git commit -m "Fix: Remove EXPO_PUBLIC variables and update Supabase URL"
   git push origin main
   ```

### Passo 2: Trigger Deploy no Production

1. **Acesse:** https://app.netlify.com/sites/nossamaternidade/deploys

2. **Clique em "Trigger deploy"** → **"Clear cache and deploy site"**

3. **Aguarde o build completar**

4. **O production será atualizado** com o mesmo código do preview

### Passo 3: Verificar Variáveis no Production

1. **Acesse:** https://app.netlify.com/sites/nossamaternidade/settings/deploys#environment-variables

2. **Verifique que:**
   - `NEXT_PUBLIC_SUPABASE_URL` tem valor `https://mnszbkeuerjcevjvdqme.supabase.co`
   - Não há variáveis `EXPO_PUBLIC_*`
   - Variáveis estão em "Production" ou "All scopes"

---

## ⚙️ Configurar Variáveis no Preview (IMPORTANTE)

Como você quer usar o preview server, certifique-se que as variáveis estão configuradas corretamente:

### Via Dashboard:

1. **Acesse:** https://app.netlify.com/sites/nossamaternidade/settings/deploys#environment-variables

2. **Para `NEXT_PUBLIC_SUPABASE_URL`:**
   - Clique na variável
   - Verifique se está em **"Deploy previews"** ou **"All scopes"**
   - Se não estiver, clique em "Add variable":
     - Key: `NEXT_PUBLIC_SUPABASE_URL`
     - Value: `https://mnszbkeuerjcevjvdqme.supabase.co`
     - Context: Selecione **"Deploy previews"**
     - Clique em "Save"

3. **Para variáveis `EXPO_PUBLIC_*`:**
   - Clique em cada uma
   - Se estiver em "Deploy previews", delete desse contexto também

### Via CLI:

```powershell
# 1. Configurar NEXT_PUBLIC_SUPABASE_URL no contexto deploy-preview
netlify env:set --context deploy-preview NEXT_PUBLIC_SUPABASE_URL "https://mnszbkeuerjcevjvdqme.supabase.co"

# 2. Deletar EXPO_PUBLIC_SUPABASE_URL do contexto deploy-preview
netlify env:unset --context deploy-preview EXPO_PUBLIC_SUPABASE_URL

# 3. Verificar
netlify env:list --context deploy-preview
```

---

## 🧪 Testar no Preview Server

1. **Acesse:** `https://devserver-main--nossamaternidade.netlify.app/signup`

2. **Teste o signup:**
   - Preencha o formulário
   - Clique em "Criar conta"

3. **Verifique no DevTools (F12) → Network:**
   - Procure por requisições para `supabase.co`
   - A URL deve ser: `https://mnszbkeuerjcevjvdqme.supabase.co/auth/v1/signup`
   - **NÃO deve ser:** `https://bbcwitnbnosyfpjtzkr.supabase.co/...`

4. **Se funcionar:**
   - ✅ O preview server está configurado corretamente
   - Você pode usar esse URL para testes

5. **Se não funcionar:**
   - ⚠️ As variáveis de ambiente não estão configuradas no contexto "Deploy previews"
   - Siga os passos acima para configurar

---

## 📋 Checklist

- [ ] Entendi que o preview server é o mais recente (7:32 PM)
- [ ] Vou usar `https://devserver-main--nossamaternidade.netlify.app` para testes
- [ ] Verifiquei que `NEXT_PUBLIC_SUPABASE_URL` está configurada no contexto "Deploy previews"
- [ ] Deletei variáveis `EXPO_PUBLIC_*` do contexto "Deploy previews"
- [ ] Testei signup no preview server
- [ ] Verifiquei no Network tab que usa URL correta
- [ ] Se necessário, vou fazer deploy no production para atualizá-lo

---

## 🎯 Recomendação

**Para agora:** Use o preview server (`https://devserver-main--nossamaternidade.netlify.app`) para testar o signup corrigido.

**Depois:** Se funcionar no preview, faça um novo deploy no production para atualizar o site principal.

**Importante:** Certifique-se que as variáveis de ambiente estão configuradas corretamente no contexto **"Deploy previews"**, não apenas em "Production".

---

**Criado em:** 2025-11-03
