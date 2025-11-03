# 🔧 Solução: Conflito de Dependências (ERESOLVE)

## ❗ Problema

Erro ao executar `npm install`:
```
npm error ERESOLVE unable to resolve dependency tree
npm error Could not resolve dependency:
npm error peer react@"^16.8 || ^17.0 || ^18.0" from vaul@0.9.9
```

## 🔍 Causa

O pacote `vaul@0.9.9` requer React 16.8, 17.0 ou 18.0, mas o projeto usa React 19.2.0.

## ✅ Soluções

### Solução 1: Instalar com --legacy-peer-deps (Recomendado)

Execute:

```powershell
npm install --legacy-peer-deps
```

**O que isso faz:**
- ✅ Ignora conflitos de peer dependencies
- ✅ Instala todas as dependências
- ✅ Geralmente funciona bem na prática

### Solução 2: Atualizar vaul (Já aplicada)

Atualizei o `package.json` para usar `vaul@^1.0.0` que pode ter melhor suporte para React 19.

Execute:

```powershell
npm install
```

### Solução 3: Usar --force (Alternativa)

Se as soluções acima não funcionarem:

```powershell
npm install --force
```

**⚠️ Atenção:** Isso pode causar problemas em runtime se as dependências realmente não forem compatíveis.

---

## 🚀 Recomendação

Use a **Solução 1** primeiro:

```powershell
npm install --legacy-peer-deps
```

Isso é seguro e resolve o problema na maioria dos casos.

---

## ✅ Verificar Instalação

Após instalar, verifique:

```powershell
# Verificar se node_modules existe
Test-Path node_modules

# Verificar se vitest foi instalado
npm list vitest

# Verificar se vaul foi instalado
npm list vaul
```

---

## 📝 Nota sobre vaul

O `vaul` é um componente de drawer/sheet. Se você não estiver usando diretamente, pode ser removido do `package.json`.

Para verificar se está sendo usado:

```powershell
# Buscar no código
Select-String -Path "*.tsx","*.ts" -Pattern "vaul|from ['\"]vaul"
```

---

## 🔄 Após Resolver

Depois de instalar com sucesso:

```powershell
# Executar testes
npm test

# Ou todos os testes
npm run test:all
```

---

## 🆘 Se Ainda Não Funcionar

### Limpar cache e reinstalar

```powershell
# Limpar cache
npm cache clean --force

# Remover node_modules e package-lock.json
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Reinstalar
npm install --legacy-peer-deps
```

---

**Execute `npm install --legacy-peer-deps` agora!** 🚀
