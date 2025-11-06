# 🚀 Como Funciona Agora - Sistema de Orquestração

## 📋 Visão Geral

O sistema combina **Claude Code CLI** + **Cursor** + **Supabase MCP** para automatizar seu workflow de desenvolvimento.

## 🎯 Três Formas de Usar

### 1️⃣ Via CLI Helper (Mais Rápido)

Comandos diretos para tarefas comuns:

```bash
# Analisar código
npm run orchestrate analyze app/components/MyComponent.tsx

# Refatorar código
npm run orchestrate refactor app/components/MyComponent.tsx

# Gerar componente completo
npm run orchestrate component Button onClick,children

# Criar API route
npm run orchestrate api users POST

# Correção rápida
npm run orchestrate quick-fix app/api/users/route.ts
```

### 2️⃣ Via PowerShell Orchestrator (Windows)

Para workflows mais complexos:

```powershell
# Ver status
.\scripts\orchestrator.ps1 status

# Listar workflows
.\scripts\orchestrator.ps1 workflows

# Executar workflow
.\scripts\orchestrator.ps1 run new-component -name "MyButton" -props "onClick,children"

# Executar comando Claude direto
.\scripts\orchestrator.ps1 claude analyze app/components/MyComponent.tsx
```

### 3️⃣ Via Supabase MCP no Cursor

Direto no chat do Cursor:

```
Use o Supabase MCP para consultar a tabela profiles
```

O Claude pode:
- ✅ Consultar tabelas
- ✅ Executar queries SQL
- ✅ Verificar schema
- ✅ Criar migrations
- ✅ Analisar performance

## 🔄 Fluxo de Trabalho Típico

### Exemplo 1: Criar Componente Novo

```bash
# 1. Gerar componente completo
npm run orchestrate component UserCard name,email,avatar

# Isso cria:
# - components/UserCard.tsx
# - __tests__/components/UserCard.test.tsx
# - Documentação
```

### Exemplo 2: Criar API com CRUD

```powershell
# 1. Criar API completa
.\scripts\orchestrator.ps1 run supabase-api-with-crud -resource "baby-profiles" -table "baby_profiles"

# Isso cria:
# - app/api/baby-profiles/route.ts (GET, POST, PUT, DELETE)
# - lib/validations/baby-profiles.ts (schema Zod)
# - Testes unitários
```

### Exemplo 3: Correção Rápida

```bash
# 1. Identificar e corrigir bugs
npm run orchestrate quick-fix app/components/MyComponent.tsx

# Isso faz:
# - Análise de código
# - Detecção de bugs
# - Refatoração automática
```

### Exemplo 4: Verificar Schema Supabase

```powershell
# 1. Verificar estrutura do banco
.\scripts\orchestrator.ps1 run supabase-check-schema -table "profiles"

# Isso:
# - Lista todas as tabelas
# - Verifica colunas específicas
# - Gera relatório em Markdown
```

## 🛠️ Componentes do Sistema

### 1. Claude Code CLI
- **Instalado**: `@anthropic-ai/claude-code` (v2.0.32)
- **Função**: Análise, refatoração, otimização de código
- **Uso**: Via comandos diretos ou workflows

### 2. Scripts de Orquestração
- **PowerShell**: `scripts/orchestrator.ps1`
- **Node.js**: `scripts/orchestrator.mjs`
- **CLI Helper**: `scripts/claude-cursor.mjs`

### 3. Workflows Configurados
- **12 workflows** disponíveis
- **6 para código** (componentes, APIs, refatoração)
- **6 para Supabase** (queries, migrations, CRUD)

### 4. Supabase MCP
- **Configurado** no Cursor
- **Acesso direto** ao banco de dados
- **Integrado** com workflows

## 📊 Workflows Disponíveis

### Código
1. **`new-component`** - Cria componente React completo
2. **`new-api`** - Cria API route completa
3. **`quick-fix`** - Correção rápida de bugs
4. **`refactor-and-optimize`** - Refatoração completa
5. **`full-audit`** - Auditoria completa
6. **`setup-new-feature`** - Setup de nova feature

### Supabase
7. **`supabase-query`** - Consulta dados
8. **`supabase-check-schema`** - Verifica schema
9. **`supabase-create-migration`** - Cria migrations
10. **`supabase-api-with-crud`** - API com CRUD
11. **`supabase-backup-table`** - Backup de tabelas
12. **`supabase-analyze-query`** - Otimiza queries

## 🎨 Exemplos Práticos

### Cenário 1: Novo Recurso Completo

```powershell
# 1. Setup inicial
.\scripts\orchestrator.ps1 run setup-new-feature -feature "notifications"

# 2. Criar componente
npm run orchestrate component NotificationBell count,onClick

# 3. Criar API
.\scripts\orchestrator.ps1 run supabase-api-with-crud -resource "notifications" -table "notifications"

# 4. Verificar schema
.\scripts\orchestrator.ps1 run supabase-check-schema -table "notifications"
```

### Cenário 2: Otimizar Código Existente

```bash
# 1. Refatorar e otimizar
npm run orchestrate refactor-and-optimize app/components/Dashboard.tsx

# Isso faz:
# - Análise completa
# - Refatoração
# - Otimização de performance
# - Testes
# - Documentação
```

### Cenário 3: Troubleshooting

```powershell
# 1. Verificar status
.\scripts\orchestrator.ps1 status

# 2. Analisar problema
npm run orchestrate analyze app/api/users/route.ts

# 3. Correção rápida
npm run orchestrate quick-fix app/api/users/route.ts

# 4. Auditoria completa
.\scripts\orchestrator.ps1 run full-audit -file "app/api/users/route.ts"
```

## 🔧 Integração com Cursor

### No Terminal do Cursor

1. Abra terminal (`Ctrl + '`)
2. Execute comandos diretamente:
   ```bash
   npm run orchestrate component Button onClick
   ```

### No Chat do Cursor

1. Abra chat do Cursor (`Ctrl + L`)
2. Peça ao Claude:
   ```
   Use o workflow new-component para criar um componente Button
   ```

   Ou:
   ```
   Use o Supabase MCP para consultar a tabela profiles
   ```

## 📝 Fluxo de Dados

```
┌─────────────┐
│  Você       │
└──────┬──────┘
       │
       ├─→ CLI Helper (comandos rápidos)
       │
       ├─→ PowerShell Orchestrator (workflows)
       │
       └─→ Cursor Chat (MCP direto)
            │
            ├─→ Claude Code CLI
            │
            ├─→ Supabase MCP
            │
            └─→ Sistema de Agentes
```

## 🚀 Começando Agora

### 1. Verificar Status
```bash
npm run orchestrate:status
```

### 2. Ver Workflows
```bash
npm run orchestrate:workflows
```

### 3. Testar Primeiro Comando
```bash
# Analisar um arquivo existente
npm run orchestrate analyze app/components/bottom-navigation.tsx
```

### 4. Criar Primeiro Componente
```bash
# Criar componente completo
npm run orchestrate component TestButton onClick,children
```

## 💡 Dicas

1. **Use CLI Helper** para tarefas simples e rápidas
2. **Use Workflows** para tarefas complexas com múltiplas etapas
3. **Use Supabase MCP** no Cursor para consultas diretas ao banco
4. **Combine ferramentas** para workflows personalizados

## 📚 Documentação

- **Quick Start**: `QUICK_START_ORCHESTRATION.md`
- **Documentação Completa**: `CLAUDE_CURSOR_ORCHESTRATION.md`
- **Integração Supabase**: `INTEGRACAO_SUPABASE_MCP.md`
- **Sistema de Agentes**: `CODE_AGENTS_SYSTEM.md`

---

**Pronto para usar! Comece com `npm run orchestrate:status` 🚀**
