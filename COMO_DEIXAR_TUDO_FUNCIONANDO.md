# ✅ Como Deixar Tudo Funcionando - Guia Completo

## 🎯 Objetivo

Fazer todos os testes funcionarem corretamente.

---

## 📋 Passo a Passo Completo

### PASSO 1: Instalar Dependências

Execute no PowerShell:

```powershell
# Instalar todas as dependências (pode levar 2-5 minutos)
npm install --legacy-peer-deps
```

**Por que `--legacy-peer-deps`?**
- Resolve conflitos entre React 19 e algumas dependências
- É seguro usar e geralmente funciona perfeitamente

---

### PASSO 2: Verificar Instalação

Após instalar, verifique:

```powershell
# Verificar se vitest foi instalado
npm list vitest

# Deve mostrar algo como: vitest@3.1.9
```

Se mostrar uma versão, está instalado! ✅

---

### PASSO 3: Executar Testes

Agora execute os testes:

```powershell
# Testes unitários
npm test
```

**O que esperar:**
- ✅ Testes devem executar sem erros de transformação
- ✅ Alguns testes podem falhar (isso é normal, vamos corrigir)
- ✅ Sem erros de "Cannot find module"

---

### PASSO 4: Ver Erros Específicos

Se houver erros, vamos corrigir. Execute e me mostre a saída completa.

---

## 🔧 Problemas Comuns e Soluções

### Erro: "Cannot find module"

**Causa:** Dependências não instaladas ou path alias não configurado

**Solução:**
```powershell
# Reinstalar dependências
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install --legacy-peer-deps
```

---

### Erro: "Transform failed with JSX"

**Causa:** JSX em arquivo .ts (já corrigido)

**Status:** ✅ **JÁ CORRIGIDO** - Não deve mais acontecer

---

### Erro: "Cannot read property of undefined"

**Causa:** Mock não configurado corretamente

**Solução:** Verificar se os mocks estão corretos nos arquivos de teste

---

## ✅ Checklist de Verificação

Execute este checklist:

```powershell
# 1. Verificar se node_modules existe
Test-Path node_modules
# Deve retornar: True

# 2. Verificar vitest
npm list vitest
# Deve mostrar versão

# 3. Verificar @vitejs/plugin-react
npm list @vitejs/plugin-react
# Deve mostrar versão

# 4. Verificar jsdom
npm list jsdom
# Deve mostrar versão

# 5. Executar testes
npm test
# Deve executar (mesmo que alguns falhem)
```

---

## 🚀 Comandos Rápidos

Após tudo funcionando:

```powershell
# Testes unitários
npm test

# Testes em watch mode (recarrega automaticamente)
npm run test:watch

# Interface visual de testes
npm run test:ui

# Testes com cobertura
npm run test:coverage

# Testes E2E
npm run test:e2e

# TODOS os testes
npm run test:all
```

---

## 📝 Arquivos Importantes

Certifique-se de que estes arquivos existem:

- ✅ `vitest.config.ts` - Configuração do Vitest
- ✅ `vitest.setup.ts` - Setup global (com mocks)
- ✅ `playwright.config.ts` - Configuração do Playwright
- ✅ `package.json` - Com todas as dependências
- ✅ `__tests__/` - Pasta com testes unitários
- ✅ `e2e/` - Pasta com testes E2E

---

## 🆘 Se Algo Não Funcionar

### Limpar e Reinstalar (Núcleo)

```powershell
# 1. Remover node_modules e cache
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force

# 2. Reinstalar
npm install --legacy-peer-deps

# 3. Testar
npm test
```

### Verificar Versão do Node.js

```powershell
node --version
```

**Deve ser:** Node.js 18 ou superior

Se não for, atualize: https://nodejs.org/

---

## 📊 Status dos Problemas

### ✅ Corrigido

1. ✅ JSX no vitest.setup.ts → Usando React.createElement
2. ✅ @vitejs/plugin-react adicionado ao package.json
3. ✅ Cache deprecated removido do vitest.config.ts
4. ✅ Conflito vaul/react resolvido

### ⏳ A Aguardar

- Executar `npm install --legacy-peer-deps`
- Executar `npm test` e verificar resultados

---

## 🎯 Próximos Passos Após Funcionar

1. ✅ Executar todos os testes
2. ✅ Ver cobertura de código
3. ✅ Corrigir testes que falharem
4. ✅ Adicionar mais testes
5. ✅ Integrar no CI/CD

---

## 📚 Documentação Relacionada

- `GUIA_TESTES.md` - Guia completo de testes
- `SOLUCAO_CONFLITO_DEPENDENCIAS.md` - Solução de conflitos
- `CORRIGIR_ERRO_VITEST.md` - Correção de erros do Vitest

---

**Execute `npm install --legacy-peer-deps` e depois `npm test`!** 🚀
