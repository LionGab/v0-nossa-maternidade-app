# 🔧 Corrigir: "Cannot find module 'vitest/config'"

## ❗ Problema

Erro ao executar testes:
```
Error: Cannot find module 'vitest/config'
```

## 🔍 Causa

As dependências **não foram instaladas** no projeto ainda. O `npx` está usando uma versão temporária que não tem acesso aos módulos locais.

## ✅ Solução

### Passo 1: Instalar Dependências

Execute no PowerShell:

```powershell
npm install
```

**Isso é ESSENCIAL!** Sem isso, nada vai funcionar.

### Passo 2: Aguardar Conclusão

O `npm install` pode levar 2-5 minutos na primeira vez.

Você verá algo como:
```
added 1234 packages in 2m
```

### Passo 3: Executar Testes Novamente

```powershell
# Agora deve funcionar!
npm test

# Ou com cobertura
npm run test:coverage
```

---

## 🔍 O que foi Corrigido

✅ Adicionei `@vitejs/plugin-react` ao `package.json` (estava faltando)
✅ As dependências agora podem ser instaladas corretamente

---

## 📋 Checklist de Instalação

Execute `npm install` e verifique:

```powershell
# 1. Verificar se node_modules existe
Test-Path node_modules

# 2. Verificar vitest
npm list vitest

# 3. Verificar @vitejs/plugin-react
npm list @vitejs/plugin-react

# 4. Verificar jsdom
npm list jsdom
```

Todos devem retornar resultados positivos.

---

## ⚠️ Importante

**NÃO use `npx vitest` diretamente!**

Use sempre:
```powershell
npm test              # ✅ Correto
npm run test:coverage # ✅ Correto
npx vitest           # ❌ Pode causar problemas
```

O `npm` sabe onde encontrar as dependências instaladas localmente.

---

## 🆘 Se Ainda Não Funcionar

### 1. Limpar e Reinstalar

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
```

### 2. Verificar Versão do Node.js

```powershell
node --version
```

Deve ser Node.js 18 ou superior.

### 3. Atualizar npm

```powershell
npm install -g npm@latest
```

---

## ✅ Após Instalar

Você poderá executar:

```powershell
npm test                  # Testes unitários
npm run test:watch        # Watch mode
npm run test:coverage     # Com cobertura
npm run test:e2e          # Testes E2E
npm run test:all          # Todos os testes
```

---

**Execute `npm install` agora e depois tente `npm test`!** 🚀
