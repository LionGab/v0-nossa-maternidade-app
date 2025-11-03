# 📦 Como Instalar pnpm no Windows

## Método 1: Via npm (Recomendado - Mais Rápido)

Se você já tem Node.js e npm instalados, execute:

```powershell
npm install -g pnpm
```

## Método 2: Via PowerShell (Standalone)

Execute no PowerShell:

```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

Se encontrar erro de política de execução, execute primeiro:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Método 3: Via Corepack (Node.js 16.10+)

Se você tem Node.js 16.10 ou superior:

```powershell
corepack enable
corepack prepare pnpm@latest --activate
```

## Método 4: Via Chocolatey

Se você tem Chocolatey instalado:

```powershell
choco install pnpm
```

---

## ✅ Verificar Instalação

Após instalar, verifique:

```powershell
pnpm --version
```

---

## 🔄 Alternativa: Usar npm

Se não conseguir instalar o pnpm, você pode usar npm. Porém, **recomendamos pnpm** pois:
- Mais rápido
- Usa menos espaço em disco
- Melhor para monorepos

### Converter scripts para npm

Todos os scripts funcionam com npm, apenas substitua `pnpm` por `npm`:

```bash
# Em vez de
pnpm test:all

# Use
npm run test:all
```

---

## 📝 Depois de Instalar pnpm

1. **Instalar dependências:**
```powershell
pnpm install
```

2. **Executar testes:**
```powershell
pnpm test:all
```

3. **Executar em desenvolvimento:**
```powershell
pnpm dev
```

---

## 🆘 Solução de Problemas

### Erro: "pnpm não é reconhecido"

1. **Reinicie o terminal** após instalar
2. **Verifique o PATH:**
   ```powershell
   $env:Path -split ';' | Select-String -Pattern "pnpm"
   ```

3. **Adicione ao PATH manualmente:**
   - Localização típica: `C:\Users\SEU_USUARIO\AppData\Local\pnpm`
   - Ou: `C:\Program Files\nodejs\node_modules\pnpm`

### Erro: "ExecutionPolicy"

Execute como Administrador:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
```

---

## 🔗 Links Úteis

- [Documentação oficial do pnpm](https://pnpm.io/)
- [Guia de instalação](https://pnpm.io/installation)
