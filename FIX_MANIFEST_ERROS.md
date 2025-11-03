# 🔧 FIX: Erros de manifest.json e React #310

## Problemas Identificados

1. **Erro de sintaxe no manifest.json** (múltiplos erros)
   - Manifest: Line: 1, column: 1, Syntax error (4 vezes)

2. **Erro React #310** (minified)
   - Uncaught Error: Minified React error #310
   - Relacionado a `useMemo`

---

## 🔧 Solução 1: Corrigir manifest.json

### Problema

O Netlify pode não estar servindo o `manifest.json` com o Content-Type correto. O arquivo está correto, mas precisa de configuração no `netlify.toml`.

### Solução

O `netlify.toml` já tem configuração para manifest.json, mas vamos verificar se está correta:

```toml
# Headers para manifest
[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"
    Cache-Control = "public, max-age=31536000, immutable"
```

Se o erro persistir, pode ser cache do browser ou problema de build.

### Passos:

1. **Verificar se o arquivo existe:**
   - `public/manifest.json` deve existir
   - Deve ser JSON válido

2. **Limpar cache do Netlify:**
   - Vá em **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

3. **Limpar cache do browser:**
   - Abra DevTools (F12) → Application → Clear storage
   - Ou use modo anônimo

4. **Verificar se o arquivo está sendo servido:**
   - Acesse: `https://devserver-main--nossamaternidade.netlify.app/manifest.json`
   - Deve retornar JSON válido
   - Se retornar HTML ou erro, há problema de roteamento

---

## 🔧 Solução 2: Corrigir Erro React #310

### Problema

O erro React #310 geralmente está relacionado a:
- Hooks sendo chamados condicionalmente
- Dependências de `useMemo`/`useCallback` mudando inesperadamente
- Múltiplas versões do React

### Verificação

No código, o `useMemo` está sendo usado corretamente:

```typescript
// app/dashboard/page.tsx
const dashboardCards = useMemo(() => [
  // ... array de cards
], []) // ✅ Array vazio de dependências (correto para dados estáticos)
```

### Possíveis Causas:

1. **Problema de build/compilação:**
   - O build pode ter gerado código inválido
   - Cache do build antigo

2. **Problema de versão do React:**
   - Pode haver múltiplas versões do React
   - Incompatibilidade entre versões

3. **Problema de extensão do browser:**
   - Algumas extensões podem interferir com React

### Soluções:

1. **Limpar cache e fazer novo build:**
   ```bash
   # Localmente
   rm -rf .next node_modules package-lock.json
   npm install
   npm run build

   # No Netlify
   # Vá em Deploys → Trigger deploy → Clear cache and deploy site
   ```

2. **Verificar versões do React:**
   ```bash
   npm list react react-dom
   ```
   - Deve ter apenas uma versão de cada
   - Se houver múltiplas, pode causar conflitos

3. **Testar sem extensões:**
   - Use modo anônimo/privado
   - Ou desative extensões do browser

4. **Verificar build logs:**
   - No Netlify, veja os logs do build
   - Procure por warnings ou erros relacionados ao React

---

## 🔍 Verificação Rápida

### Teste 1: Manifest.json

1. **Acesse diretamente:**
   ```
   https://devserver-main--nossamaternidade.netlify.app/manifest.json
   ```

2. **Verifique:**
   - ✅ Deve retornar JSON válido
   - ✅ Content-Type deve ser `application/manifest+json`
   - ❌ Não deve retornar HTML ou erro 404

3. **Se retornar erro:**
   - O arquivo não está sendo servido corretamente
   - Pode ser problema de roteamento do Next.js

### Teste 2: React Error

1. **Abra o console (F12)**
2. **Veja o erro completo:**
   - Clique no erro para ver detalhes
   - Procure pela stack trace

3. **Verifique se há múltiplas versões do React:**
   - No console, digite: `window.__REACT_DEVTOOLS_GLOBAL_HOOK__`
   - Se retornar algo, React está carregado

---

## ✅ Solução Rápida (Tentar Primeiro)

1. **Limpar cache do Netlify:**
   - Vá em **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

2. **Limpar cache do browser:**
   - Modo anônimo ou limpar cache completo

3. **Testar novamente:**
   - Acesse o site
   - Veja se os erros persistem

4. **Se persistirem:**
   - Verifique os logs do build no Netlify
   - Verifique se há erros durante o build

---

## 📋 Checklist

- [ ] Verifiquei que `public/manifest.json` existe e é JSON válido
- [ ] Verifiquei que `netlify.toml` tem headers corretos para manifest.json
- [ ] Limpei cache do Netlify (Clear cache and deploy)
- [ ] Limpei cache do browser ou testei em modo anônimo
- [ ] Testei acesso direto a `/manifest.json`
- [ ] Verifiquei logs do build no Netlify
- [ ] Verifiquei versões do React (deve haver apenas uma)
- [ ] Testei em modo anônimo (sem extensões)

---

## 🆘 Se Ainda Não Funcionar

### Para manifest.json:

1. **Verificar se o arquivo está sendo servido:**
   - O Next.js pode estar interceptando a rota
   - Verificar se há conflito de rotas

2. **Adicionar rota explícita no next.config.mjs:**
   - Pode ser necessário configurar o Next.js para servir o manifest.json corretamente

### Para React #310:

1. **Habilitar modo de desenvolvimento:**
   - O erro minificado não mostra detalhes
   - Fazer build em modo dev pode mostrar erro completo

2. **Verificar dependências:**
   - Pode haver conflito de versões
   - Verificar `package.json` e `package-lock.json`

---

**Tempo estimado:** 10 minutos ⏱️

**Criado em:** 2025-11-03
