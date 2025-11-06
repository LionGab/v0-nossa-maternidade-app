# 🚀 Sistema de Orquestração Claude Code + Cursor

Sistema completo de orquestração que combina Claude Code CLI com Cursor para workflow super ágil e automático.

## 📋 Visão Geral

Este sistema permite:
- ✅ Executar comandos Claude CLI diretamente do terminal
- ✅ Automatizar workflows complexos com múltiplas etapas
- ✅ Integrar com o sistema de agentes de código existente
- ✅ Criar componentes, APIs e features completas automaticamente
- ✅ Correções rápidas e otimizações de código

## 🛠️ Instalação

### Pré-requisitos

1. **Node.js** 18+ instalado
2. **Claude CLI** instalado globalmente:
   ```bash
   npm install -g claude
   ```
3. **Cursor** instalado e configurado

### Configuração Inicial

1. Execute o setup de workflows:
   ```bash
   npm run setup:workflows
   ```

2. Verifique o status do sistema:
   ```bash
   .\scripts\orchestrator.ps1 status
   ```

## 🎯 Uso Rápido

### CLI Helper (Comandos Rápidos)

O `claude-cursor.mjs` fornece comandos rápidos e diretos:

```bash
# Analisar código
node scripts/claude-cursor.mjs analyze app/components/MyComponent.tsx

# Refatorar código
node scripts/claude-cursor.mjs refactor app/components/MyComponent.tsx

# Gerar testes
node scripts/claude-cursor.mjs test app/components/MyComponent.tsx

# Gerar documentação
node scripts/claude-cursor.mjs doc app/components/MyComponent.tsx

# Otimizar código
node scripts/claude-cursor.mjs optimize app/components/MyComponent.tsx

# Correção rápida
node scripts/claude-cursor.mjs quick-fix app/components/MyComponent.tsx

# Gerar componente completo
node scripts/claude-cursor.mjs component Button onClick,children

# Gerar API route
node scripts/claude-cursor.mjs api users POST

# Executar workflow
node scripts/claude-cursor.mjs workflow new-component
```

### PowerShell Orchestrator

Para Windows, use o script PowerShell:

```powershell
# Status do sistema
.\scripts\orchestrator.ps1 status

# Listar workflows
.\scripts\orchestrator.ps1 workflows

# Executar workflow
.\scripts\orchestrator.ps1 run new-component -name "MyButton" -props "onClick,children"

# Executar comando Claude direto
.\scripts\orchestrator.ps1 claude analyze app/components/MyComponent.tsx

# Modo dry-run (simulação)
.\scripts\orchestrator.ps1 run new-component -DryRun
```

### Node.js Orchestrator

Para tarefas avançadas e integração com APIs:

```javascript
import { executeWorkflow, listWorkflows } from './scripts/orchestrator.mjs';

// Listar workflows
const workflows = listWorkflows();
console.log(workflows);

// Executar workflow
const result = await executeWorkflow('new-component', {
  name: 'MyButton',
  props: 'onClick,children'
}, userId);
```

## 📚 Workflows Disponíveis

### 1. `new-component`
Cria um componente React completo:
- Componente TypeScript
- Testes unitários
- Documentação
- Integração com shadcn/ui

**Uso:**
```bash
node scripts/claude-cursor.mjs component Button onClick,children,disabled
```

### 2. `new-api`
Cria uma API route completa:
- Route handler Next.js
- Validação com Zod
- Autenticação Supabase
- Testes

**Uso:**
```bash
node scripts/claude-cursor.mjs api users POST
```

### 3. `quick-fix`
Correção rápida de bugs:
- Análise de código
- Detecção de bugs
- Refatoração automática

**Uso:**
```bash
node scripts/claude-cursor.mjs quick-fix app/components/MyComponent.tsx
```

### 4. `refactor-and-optimize`
Refatoração completa:
- Análise
- Refatoração
- Otimização de performance
- Testes
- Documentação

**Uso:**
```powershell
.\scripts\orchestrator.ps1 run refactor-and-optimize -file "app/components/MyComponent.tsx"
```

### 5. `full-audit`
Auditoria completa:
- Múltiplos agentes em paralelo
- Relatório detalhado
- Sugestões de melhoria

**Uso:**
```powershell
.\scripts\orchestrator.ps1 run full-audit -file "app/components/MyComponent.tsx"
```

### 6. `setup-new-feature`
Setup completo de nova feature:
- Estrutura de pastas
- Página principal
- Componentes base
- Utilitários

**Uso:**
```powershell
.\scripts\orchestrator.ps1 run setup-new-feature -feature "dashboard"
```

### 7. `supabase-query`
Consulta dados do Supabase usando MCP:
- Executa query SQL
- Salva resultados em JSON
- Integração com Supabase MCP

**Uso:**
```powershell
.\scripts\orchestrator.ps1 run supabase-query -query "SELECT * FROM profiles LIMIT 10"
```

### 8. `supabase-check-schema`
Verifica schema do banco Supabase:
- Lista todas as tabelas
- Verifica colunas de tabelas específicas
- Gera relatório em Markdown

**Uso:**
```powershell
.\scripts\orchestrator.ps1 run supabase-check-schema -table "profiles"
```

### 9. `supabase-create-migration`
Cria migration SQL para Supabase:
- Gera SQL baseado em descrição
- Cria arquivo de migration
- Valida SQL gerado

**Uso:**
```powershell
.\scripts\orchestrator.ps1 run supabase-create-migration -name "add_column" -description "Adicionar coluna email na tabela profiles"
```

### 10. `supabase-api-with-crud`
Cria API route completa com CRUD Supabase:
- API route Next.js
- CRUD completo (Create, Read, Update, Delete)
- Validação Zod
- Integração Supabase

**Uso:**
```powershell
.\scripts\orchestrator.ps1 run supabase-api-with-crud -resource "users" -table "profiles"
```

### 11. `supabase-backup-table`
Backup de tabela Supabase:
- Exporta todos os dados
- Salva em JSON
- Verifica integridade

**Uso:**
```powershell
.\scripts\orchestrator.ps1 run supabase-backup-table -table "profiles"
```

### 12. `supabase-analyze-query`
Analisa e otimiza query Supabase:
- Análise de performance
- Sugestões de otimização
- Geração de índices

**Uso:**
```powershell
.\scripts\orchestrator.ps1 run supabase-analyze-query -query "SELECT * FROM profiles WHERE email = 'test@example.com'" -table "profiles"
```

## 🔧 Criando Workflows Customizados

Edite `workflows.json` para criar seus próprios workflows:

```json
{
  "name": "meu-workflow",
  "description": "Descrição do workflow",
  "steps": [
    {
      "name": "Etapa 1",
      "type": "claude",
      "action": "analyze",
      "input": "{{file}}",
      "required": true
    },
    {
      "name": "Etapa 2",
      "type": "file",
      "path": "output/{{name}}.ts",
      "content": "// Código gerado\n",
      "operation": "create"
    }
  ]
}
```

### Tipos de Etapas

1. **`claude`**: Executa comando Claude CLI
   - `action`: analyze, refactor, test, document, optimize
   - `input`: Código ou arquivo a processar

2. **`script`**: Executa script shell
   - `script`: Comando a executar

3. **`api`**: Chama API interna
   - `url`: Endpoint da API
   - `body`: Dados da requisição

4. **`file`**: Cria ou modifica arquivo
   - `path`: Caminho do arquivo
   - `content`: Conteúdo do arquivo
   - `operation`: create, merge, replace

### Parâmetros

Use `{{parametro}}` nos workflows para substituição dinâmica:

```json
{
  "input": "Analise {{file}}",
  "path": "components/{{name}}.tsx"
}
```

## 🔌 Integração com Cursor

### Via Terminal Integrado

1. Abra o terminal integrado do Cursor (`Ctrl + '`)
2. Execute comandos diretamente:
   ```bash
   node scripts/claude-cursor.mjs analyze app/components/MyComponent.tsx
   ```

### Via Comandos do Cursor

Crie atalhos de teclado no Cursor:
1. Abra `File > Preferences > Keyboard Shortcuts`
2. Adicione atalhos para comandos frequentes

### Via API Interna

O sistema se integra com o sistema de agentes de código existente:

```typescript
import { executeWorkflow } from '@/scripts/orchestrator.mjs';

// Executar workflow via API
const result = await executeWorkflow('new-component', {
  name: 'MyButton',
  props: 'onClick,children'
}, userId);
```

## 📊 Status e Monitoramento

### Verificar Status

```powershell
.\scripts\orchestrator.ps1 status
```

Mostra:
- ✅ Claude CLI instalado
- ✅ Cursor rodando
- ✅ Workflows configurados
- ✅ Configuração válida

### Validar Workflows

```bash
node scripts/orchestrator.mjs validate
```

Valida todos os workflows e reporta erros.

## 🎨 Exemplos Práticos

### Exemplo 1: Criar Componente Completo

```bash
# Um comando cria tudo
node scripts/claude-cursor.mjs component UserCard name,email,avatar

# Gera:
# - components/UserCard.tsx
# - __tests__/components/UserCard.test.tsx
# - Documentação
```

### Exemplo 2: Correção Rápida

```bash
# Identifica e corrige bugs automaticamente
node scripts/claude-cursor.mjs quick-fix app/api/users/route.ts
```

### Exemplo 3: Setup de Feature

```powershell
# Cria estrutura completa de uma nova feature
.\scripts\orchestrator.ps1 run setup-new-feature -feature "notifications"
```

### Exemplo 4: Auditoria Completa

```powershell
# Análise completa com múltiplos agentes
.\scripts\orchestrator.ps1 run full-audit -file "app/components/Dashboard.tsx"
```

## 🔐 Segurança

- ✅ Validação de inputs com Zod
- ✅ Autenticação obrigatória para APIs
- ✅ Rate limiting
- ✅ Sanitização de parâmetros
- ✅ Dry-run mode para testes

## 🐛 Troubleshooting

### Claude CLI não encontrado

```bash
npm install -g claude
```

### Workflows não encontrados

```bash
# Verificar se workflows.json existe
ls workflows.json

# Recriar workflows
npm run setup:workflows
```

### Erros de execução

1. Verifique logs com `-Verbose`:
   ```powershell
   .\scripts\orchestrator.ps1 run new-component -Verbose
   ```

2. Teste com `-DryRun`:
   ```powershell
   .\scripts\orchestrator.ps1 run new-component -DryRun
   ```

### Cursor não integrado

1. Verifique se Cursor está rodando
2. Reinicie Cursor após mudanças
3. Verifique configurações MCP

## 📝 Scripts NPM

Adicione ao `package.json`:

```json
{
  "scripts": {
    "orchestrate": "node scripts/claude-cursor.mjs",
    "orchestrate:status": "powershell -ExecutionPolicy Bypass -File scripts/orchestrator.ps1 status",
    "orchestrate:workflows": "powershell -ExecutionPolicy Bypass -File scripts/orchestrator.ps1 workflows",
    "setup:workflows": "node scripts/orchestrator.mjs validate"
  }
}
```

## 🚀 Próximos Passos

1. **Customize workflows** para suas necessidades
2. **Crie atalhos** no Cursor para comandos frequentes
3. **Integre com CI/CD** para automação completa
4. **Explore a API** para integrações avançadas

## 📖 Referências

- [Claude Code CLI Docs](https://docs.anthropic.com/claude-code)
- [Cursor Docs](https://cursor.sh/docs)
- [Sistema de Agentes](./CODE_AGENTS_SYSTEM.md)
- [Instruções Cursor](./CURSOR_INSTRUCTIONS.md)

---

**Desenvolvido com ❤️ para workflow super ágil e automático**
