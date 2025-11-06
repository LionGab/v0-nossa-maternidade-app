# ⚡ Início Rápido - Claude Code + Cursor

## 🚀 Setup em 3 Passos

### 1. Instalar Claude CLI
```bash
npm install -g claude
```

### 2. Verificar Status
```bash
npm run orchestrate:status
```

### 3. Testar
```bash
# Analisar um arquivo
npm run orchestrate analyze app/components/bottom-navigation.tsx

# Ver workflows disponíveis
npm run orchestrate:workflows
```

## 📝 Comandos Essenciais

```bash
# CLI Helper (comandos rápidos)
npm run orchestrate <comando> [args]

# Exemplos:
npm run orchestrate analyze app/components/MyComponent.tsx
npm run orchestrate component Button onClick,children
npm run orchestrate quick-fix app/api/users/route.ts
```

## 🔧 PowerShell (Windows)

```powershell
# Status
.\scripts\orchestrator.ps1 status

# Listar workflows
.\scripts\orchestrator.ps1 workflows

# Executar workflow
.\scripts\orchestrator.ps1 run new-component -name "MyButton"
```

## 📚 Documentação Completa

Veja `CLAUDE_CURSOR_ORCHESTRATION.md` para documentação completa.

## 🎯 Workflows Populares

1. **Criar componente completo**
   ```bash
   npm run orchestrate component UserCard name,email
   ```

2. **Correção rápida**
   ```bash
   npm run orchestrate quick-fix app/components/MyComponent.tsx
   ```

3. **Gerar API**
   ```bash
   npm run orchestrate api users POST
   ```
