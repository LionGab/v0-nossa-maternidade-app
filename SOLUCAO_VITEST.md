# 🔧 Solução: "vitest não é reconhecido"

## Problema

Ao executar `npm run test:coverage`, você recebe o erro:
```
'vitest' não é reconhecido como um comando interno
ou externo, um programa operável ou um arquivo em lotes.
```

## Causa

As dependências não foram instaladas ainda, ou o `vitest` não está no `node_modules/.bin`.

## ✅ Solução

### Método 1: Instalar Dependências (Recomendado)

Execute no PowerShell:

```powershell
# 1. Instalar todas as dependências
npm install

# 2. Verificar se vitest foi instalado
npm list vitest

# 3. Executar testes
npm run test:coverage
```

### Método 2: Usar Script de Setup

Execute:

```powershell
.\setup-tests.ps1
```

Este script:
- ✅ Verifica Node.js e npm
- ✅ Instala todas as dependências
- ✅ Verifica instalação do Vitest e Playwright
- ✅ Instala dependências faltantes se necessário

### Método 3: Instalar Manualmente

Se o problema persistir, instale manualmente:

```powershell
# Instalar dependências de teste
npm install --save-dev vitest @vitest/ui @vitest/coverage-v8 jsdom

# Instalar dependências de testing library
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Instalar Playwright (se ainda não tiver)
npm install --save-dev @playwright/test
npx playwright install
```

## 🔍 Verificação

Após instalar, verifique:

```powershell
# Verificar vitest
npx vitest --version

# Ou verificar no node_modules
ls node_modules\.bin\vitest*
```

## 📝 Nota Importante

O npm pode executar scripts do `node_modules/.bin` automaticamente. Se usar diretamente:

- ❌ `vitest` (pode não funcionar)
- ✅ `npx vitest` (sempre funciona)
- ✅ `npm run test` (usa o script do package.json)

## ✅ Após Resolver

Execute os testes:

```powershell
# Testes unitários
npm run test

# Com cobertura
npm run test:coverage

# Todos os testes
npm run test:all
```

---

## 🆘 Se o Problema Persistir

1. **Limpar cache do npm:**
   ```powershell
   npm cache clean --force
   ```

2. **Deletar node_modules e reinstalar:**
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json  # Se existir
   npm install
   ```

3. **Verificar PATH do Windows:**
   - Certifique-se de que `node_modules/.bin` está acessível
   - Ou use `npx` antes de cada comando

---

**Criado para resolver o problema de vitest não encontrado**
**Data:** 2025-11-02
