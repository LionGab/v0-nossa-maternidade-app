# 📦 Instalar Dependências - Passo a Passo

## ❗ Problema

O erro `'vitest' não é reconhecido` significa que as dependências ainda não foram instaladas.

## ✅ Solução Rápida

Execute no PowerShell (no diretório do projeto):

```powershell
npm install
```

Isso instalará **todas** as dependências do projeto, incluindo:
- ✅ vitest
- ✅ @vitest/ui
- ✅ @vitest/coverage-v8
- ✅ @playwright/test
- ✅ @testing-library/react
- ✅ E todas as outras dependências

## ⏱️ Tempo Estimado

- **Primeira vez:** 2-5 minutos (dependendo da internet)
- **Próximas vezes:** Mais rápido (cache do npm)

## 📋 Passo a Passo Completo

### 1. Abra o PowerShell

Certifique-se de estar no diretório correto:

```powershell
cd C:\Users\User\NossaMaternidade\v0-nossa-maternidade-app-2
```

### 2. Verifique se está no lugar certo

```powershell
ls package.json
```

Se aparecer o arquivo, está no lugar certo! ✅

### 3. Instale as dependências

```powershell
npm install
```

Você verá algo como:
```
added 1234 packages in 2m
```

### 4. Verifique a instalação

```powershell
npm list vitest
```

Se mostrar algo como `vitest@3.1.9`, está instalado! ✅

### 5. Execute os testes

```powershell
npm test
```

Agora deve funcionar! 🎉

---

## 🔍 Verificar se Instalou Corretamente

Após `npm install`, verifique:

```powershell
# Verificar vitest
npm list vitest

# Verificar playwright
npm list @playwright/test

# Verificar se node_modules existe
Test-Path node_modules
```

Todos devem retornar resultados positivos.

---

## 🚀 Próximos Comandos

Agora você pode executar:

```powershell
# Testes unitários
npm test

# Testes em watch mode
npm run test:watch

# Testes com cobertura
npm run test:coverage

# Testes E2E
npm run test:e2e

# Todos os testes
npm run test:all
```

---

## 🆘 Problemas Comuns

### Erro: "npm não é reconhecido"

**Solução:** Instale Node.js de https://nodejs.org/

### Erro: "Acesso negado"

**Solução:** Execute o PowerShell como Administrador

### Erro: "Network timeout"

**Solução:**
```powershell
npm install --registry https://registry.npmjs.org/
```

Ou use um proxy/VPN

### Muito lento

**Solução:**
```powershell
# Limpar cache
npm cache clean --force

# Reinstalar
npm install
```

---

## ✅ Checklist

Após instalar, verifique:

- [ ] `node_modules` existe
- [ ] `npm list vitest` mostra a versão
- [ ] `npm test` funciona
- [ ] `npm run test:coverage` funciona

---

## 📝 Nota

O `npm install` instala:
- Todas as dependências de produção (`dependencies`)
- Todas as dependências de desenvolvimento (`devDependencies`)
- Cria a pasta `node_modules`
- Cria/atualiza `package-lock.json`

**Isso é normal e necessário!** ✅

---

**Execute `npm install` agora e depois tente `npm test` novamente!** 🚀
