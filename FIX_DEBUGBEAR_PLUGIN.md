# 🔧 FIX: Plugin DebugBear Falhando

## Problema

```
Plugin "netlify-build-plugin-debugbear" failed
Error: DEBUGBEAR_API_KEY environment variable needs to be set
```

O plugin DebugBear está falhando porque não tem a variável de ambiente `DEBUGBEAR_API_KEY` configurada. Como o deploy completou com sucesso, o plugin não é essencial e pode ser removido.

---

## ✅ SOLUÇÃO: Remover o Plugin (Recomendado)

O DebugBear é um serviço opcional de monitoramento de performance que requer API key paga. Se você não precisa dele, simplesmente remova:

### Passo a Passo (1 minuto)

1. **Acesse o Netlify Dashboard:**
   - Vá para: https://app.netlify.com/sites/nossamaternidade/settings/plugins

2. **Remova o Plugin:**
   - Procure por **"DebugBear"** ou **"netlify-build-plugin-debugbear"**
   - Clique em **"Remove"** ou **"Uninstall"**

3. **Confirme a remoção**

4. **Faça um novo deploy:**
   - Vá em **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

---

## 🔄 Alternativa: Configurar o Plugin (Se Necessário)

Se você realmente precisa do DebugBear:

1. **Crie uma conta no DebugBear:**
   - Acesse: https://www.debugbear.com
   - Crie uma conta e gere uma API key

2. **Adicione a variável de ambiente no Netlify:**
   - Vá em **Site settings** → **Environment variables** → **Add variable**
   - **Key:** `DEBUGBEAR_API_KEY`
   - **Value:** Sua API key do DebugBear

3. **Faça um novo deploy**

---

## 📋 Por Que Remover?

- ✅ **Não é essencial:** O deploy funciona sem ele
- ✅ **Evita erros:** Remove o aviso de falha nos logs
- ✅ **Gratuito:** Não precisa pagar por serviço adicional
- ✅ **Simplicidade:** Menos configurações para manter

**Nota:** O Netlify já tem ferramentas nativas de monitoramento (Analytics, Build Logs) que são suficientes para a maioria dos casos.

---

**Tempo estimado:** 1 minuto ⏱️

**Criado em:** 2025-11-03
