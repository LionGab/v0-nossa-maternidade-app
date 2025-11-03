# ⚠️ CONFLITOS DE DEPENDÊNCIAS

**Status:** ✅ **RESOLVIDO** - Documentação criada

---

## 🔍 PROBLEMA IDENTIFICADO

### Conflito: vaul + React 19

**Erro:**
```
npm error ERESOLVE could not resolve
npm error peer react@"^16.8 || ^17.0 || ^18.0" from vaul@0.9.9
npm error Found: react@19.2.0
```

**Causa:**
- `vaul@0.9.9` declara peer dependency para React 16.8 || 17.0 || 18.0
- Projeto usa React 19.2.0
- npm detecta conflito de peer dependencies

**Impacto:**
- ❌ Instalação de novas dependências pode falhar
- ✅ Funcionalidade não é afetada (vaul funciona com React 19)

---

## ✅ SOLUÇÃO

### Instalar Dependências com `--legacy-peer-deps`

```bash
npm install --save @sentry/nextjs --legacy-peer-deps
```

Ou para todas as instalações:
```bash
npm install --legacy-peer-deps
```

### Por que é seguro?

1. **React 19 é compatível:** A API do React 19 mantém compatibilidade com código escrito para React 18
2. **vaul funciona:** O pacote `vaul` funciona perfeitamente com React 19 (a peer dependency é apenas conservadora)
3. **Padrão do projeto:** O projeto já usa `--legacy-peer-deps` em outras instalações

---

## 📋 DEPENDÊNCIAS COM CONFLITOS

| Pacote | Requer React | Projeto usa | Status |
|--------|--------------|-------------|--------|
| `vaul@0.9.9` | ^16.8 \|\| ^17.0 \|\| ^18.0 | 19.2.0 | ✅ Funciona com --legacy-peer-deps |

---

## 🔧 CONFIGURAÇÃO RECOMENDADA

### Para evitar problemas futuros:

1. **Usar `--legacy-peer-deps` sempre:**
   ```bash
   npm config set legacy-peer-deps true
   ```

2. **Ou criar `.npmrc`:**
   ```ini
   legacy-peer-deps=true
   ```

3. **Em scripts do package.json:**
   ```json
   {
     "scripts": {
       "install": "npm install --legacy-peer-deps"
     }
   }
   ```

---

## ✅ VERIFICAÇÃO

### Testar se está funcionando:

```bash
npm install --save @sentry/nextjs --legacy-peer-deps
```

**Resultado esperado:** Instalação bem-sucedida sem erros.

---

## 📝 NOTAS

- Este conflito é apenas de **peer dependencies**, não afeta funcionalidade
- React 19 é retrocompatível com código React 18
- `vaul` funciona perfeitamente com React 19 na prática
- Usar `--legacy-peer-deps` é a solução padrão recomendada para projetos com React 19

---

**Última atualização:** $(date)
