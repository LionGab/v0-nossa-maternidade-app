# 🔧 FIX: Erro "publish directory cannot be the same as base directory"

## Problema

```
Error: Your publish directory cannot be the same as the base directory of your site.
Plugin: @netlify/plugin-nextjs
```

O plugin `@netlify/plugin-nextjs` não permite que o `publish` seja o mesmo que o `base`. O plugin gerencia o diretório de publicação automaticamente.

---

## ✅ SOLUÇÃO (2 minutos)

### Opção 1: Via Netlify Dashboard (Recomendado)

1. **Acesse o Netlify Dashboard:**
   - Vá para: https://app.netlify.com/sites/nossamaternidade/settings/deploys#build-settings

2. **Configure Build Settings:**
   - **Base directory:** Deixe VAZIO ou `.`
   - **Publish directory:** Deixe VAZIO (não preencha nada!)
   - **Build command:** `npm install --legacy-peer-deps && npm run build`

3. **IMPORTANTE:**
   - O campo "Publish directory" DEVE estar VAZIO
   - O plugin `@netlify/plugin-nextjs` gerencia isso automaticamente
   - Se você definir qualquer valor, vai causar o erro

4. **Salve as configurações**

5. **Faça um novo deploy:**
   - Vá em **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

---

### Opção 2: Via netlify.toml (✅ CORRIGIDO)

O `netlify.toml` agora especifica `publish = ".next"` explicitamente para evitar que o Netlify infira como `.` (igual ao base).

**Configuração correta no `netlify.toml`:**
```toml
[build]
  base = "."
  command = "npm install --legacy-peer-deps && npm run build"
  publish = ".next"
  # O plugin @netlify/plugin-nextjs gerencia internamente, mas precisamos especificar publish diferente de base
```

**Por quê?**
- O Netlify infere `publish = "."` quando não especificado, causando conflito com `base = "."`
- Especificando `publish = ".next"` resolve o conflito
- O plugin Next.js ainda gerencia o output internamente corretamente

---

## 🔍 Verificação

Após corrigir:

1. **No Dashboard:**
   - Vá em **Site settings** → **Build & deploy** → **Build settings**
   - Verifique que "Publish directory" está VAZIO
   - Verifique que "Base directory" está VAZIO ou `.`

2. **No Deploy:**
   - Os logs não devem mais mostrar o erro
   - O plugin deve processar corretamente o build do Next.js

---

## 📋 Checklist

- [ ] Acessei o Netlify Dashboard
- [ ] Removi qualquer valor do campo "Publish directory"
- [ ] Deixei "Base directory" vazio ou `.`
- [ ] Salvei as configurações
- [ ] Fiz um novo deploy com cache limpo
- [ ] Build passou sem erros

---

## 🆘 Se Ainda Não Funcionar

1. **Verifique se há configurações conflitantes:**
   - No Dashboard, certifique-se que não há configurações manuais sobrescrevendo o `netlify.toml`

2. **Limpe o cache completamente:**
   - Vá em **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

3. **Verifique a versão do plugin:**
   - O `netlify.toml` usa `@netlify/plugin-nextjs` (versão mais recente)
   - Se necessário, atualize: `npm install -D @netlify/plugin-nextjs@latest`

4. **Teste o build localmente:**
   ```bash
   npm run build
   ```
   Se funcionar localmente, o problema está na configuração do Netlify.

---

**Tempo estimado:** 2 minutos ⏱️

**Criado em:** 2025-11-03
