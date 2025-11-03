# ⚡ EXECUTE AGORA - Instalar Dependências

## ❗ O QUE FAZER AGORA

**O problema:** As dependências ainda não foram instaladas. Por isso o `vitest` não é reconhecido.

**A solução:** Execute este comando no PowerShell:

```powershell
npm install
```

## 📋 Passo a Passo Completo

### 1. Abra o PowerShell (se ainda não estiver aberto)

Certifique-se de estar no diretório do projeto:

```powershell
cd C:\Users\User\NossaMaternidade\v0-nossa-maternidade-app-2
```

### 2. Execute npm install

```powershell
npm install
```

**Isso vai:**
- ✅ Instalar todas as dependências (vitest, playwright, etc.)
- ✅ Criar a pasta `node_modules`
- ✅ Criar/atualizar `package-lock.json`
- ⏱️ Levar 2-5 minutos na primeira vez

Você verá algo como:
```
added 1234 packages in 2m 15s
```

### 3. Após a instalação, execute os testes

```powershell
npm test
```

Agora deve funcionar! ✅

---

## ✅ Verificar se Funcionou

Após `npm install`, execute:

```powershell
# Verificar se vitest foi instalado
npm list vitest

# Deve mostrar algo como: vitest@3.1.9
```

Se mostrar a versão, está instalado! ✅

---

## 🚀 Comandos Depois de Instalar

```powershell
# Testes unitários (uma vez)
npm test

# Testes em watch mode
npm run test:watch

# Testes com cobertura
npm run test:coverage

# Testes E2E
npm run test:e2e

# TODOS os testes
npm run test:all
```

---

## ⚠️ IMPORTANTE

**NÃO pule o `npm install`!**

Sem ele:
- ❌ `vitest` não será reconhecido
- ❌ `npm test` não funcionará
- ❌ Nenhum teste funcionará

Com ele:
- ✅ Tudo funciona perfeitamente

---

## 🆘 Se npm install der erro

### Erro: "npm não é reconhecido"

**Solução:** Instale Node.js de https://nodejs.org/

### Erro: "Acesso negado"

**Solução:** Execute o PowerShell como Administrador

### Erro: "Network timeout"

**Solução:** Tente novamente ou use proxy/VPN

---

## 📝 Por que isso acontece?

1. O projeto precisa das dependências instaladas localmente
2. O `npm install` baixa e instala tudo em `node_modules/`
3. Depois disso, os comandos `npm test`, etc. funcionam
4. **Isso é normal e necessário!** ✅

---

## ✅ Checklist Final

Após executar `npm install`:

- [ ] A pasta `node_modules` foi criada
- [ ] `npm list vitest` mostra uma versão
- [ ] `npm test` funciona sem erros

---

**EXECUTE `npm install` AGORA NO POWERSHELL!** 🚀

Depois disso, tudo vai funcionar! ✨
