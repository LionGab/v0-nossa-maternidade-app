# 🔧 FIX: Erro de Sintaxe no manifest.json

## Problema

```
Manifest: Line: 1, column: 1, Syntax error.
```

O browser está recebendo um `manifest.json` inválido. O arquivo no código está correto, mas pode estar sendo servido incorretamente.

---

## ✅ SOLUÇÃO: Criar Rota API para manifest.json

Criei uma rota API (`app/manifest.json/route.ts`) que serve o manifest.json corretamente com o Content-Type correto.

### Por Que Isso Resolve?

1. **Next.js pode interceptar rotas:** O Next.js pode estar interceptando `/manifest.json` e retornando HTML em vez do JSON
2. **Content-Type correto:** A rota API garante que o Content-Type seja `application/manifest+json`
3. **Sem problemas de cache:** A rota API sempre retorna o JSON correto

---

## 🔍 Verificação

### Passo 1: Testar a Rota

1. **Acesse:** `https://devserver-main--nossamaternidade.netlify.app/manifest.json`
2. **Verifique:**
   - ✅ Deve retornar JSON válido
   - ✅ Content-Type deve ser `application/manifest+json`
   - ❌ Não deve retornar HTML ou erro 404

### Passo 2: Limpar Cache

1. **Limpar cache do Netlify:**
   - Vá em **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

2. **Limpar cache do browser:**
   - Modo anônimo ou limpar cache completo (Ctrl+Shift+Delete)

3. **Testar novamente:**
   - Acesse o site
   - Veja se o erro persiste

---

## 📋 Alternativas (Se A Rota API Não Funcionar)

### Opção 1: Verificar Encoding do Arquivo

1. **Abra `public/manifest.json` no editor**
2. **Verifique encoding:**
   - Deve ser UTF-8
   - Não deve ter BOM (Byte Order Mark)

3. **Salve novamente:**
   - Salve como UTF-8 sem BOM
   - Certifique-se que começa com `{` (sem espaços antes)

### Opção 2: Recriar o Arquivo

1. **Delete `public/manifest.json`**
2. **Crie um novo arquivo** com o conteúdo correto
3. **Salve como UTF-8 sem BOM**

### Opção 3: Verificar se o Arquivo Está no Build

1. **Verifique os logs do build no Netlify:**
   - Procure por erros relacionados ao manifest.json
   - Verifique se o arquivo está sendo copiado para o build

---

## 🧪 Testar Localmente

1. **Rode localmente:**
   ```bash
   npm run dev
   ```

2. **Acesse:** `http://localhost:3000/manifest.json`
3. **Verifique:**
   - Deve retornar JSON válido
   - Content-Type deve ser `application/manifest+json`

4. **Se funcionar localmente:**
   - O problema está no Netlify
   - Verifique configuração do Netlify

5. **Se não funcionar localmente:**
   - O problema está no código
   - Verifique se a rota API foi criada corretamente

---

## 📋 Checklist

- [ ] Rota API criada (`app/manifest.json/route.ts`)
- [ ] Testei acesso direto a `/manifest.json`
- [ ] Limpei cache do Netlify (Clear cache and deploy)
- [ ] Limpei cache do browser ou testei em modo anônimo
- [ ] Verifiquei que retorna JSON válido
- [ ] Verifiquei que Content-Type está correto
- [ ] Testei localmente (se possível)

---

## 🆘 Se Ainda Não Funcionar

1. **Verifique os logs do build no Netlify:**
   - Procure por erros relacionados ao manifest.json
   - Verifique se a rota API foi criada corretamente

2. **Verifique o Network tab:**
   - Abra DevTools (F12) → Network
   - Procure por requisições para `/manifest.json`
   - Veja o que está sendo retornado

3. **Teste a rota diretamente:**
   - Acesse `https://devserver-main--nossamaternidade.netlify.app/manifest.json`
   - Veja o que é retornado
   - Se retornar HTML, o Next.js está interceptando

---

**Criado em:** 2025-11-03
