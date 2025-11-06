# 🔗 Integração Supabase MCP + Orquestração Claude Code

## 📋 Visão Geral

Este documento descreve como o sistema de orquestração Claude Code + Cursor se integra com o Supabase MCP para automatizar tarefas de banco de dados.

## ✅ Supabase MCP Configurado

O Supabase MCP já está configurado no projeto:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "supabase-mcp"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_ANON_KEY": "${SUPABASE_ANON_KEY}",
        "SUPABASE_SERVICE_ROLE_KEY": "${SUPABASE_SERVICE_ROLE_KEY}"
      }
    }
  }
}
```

**Credenciais:**
- ✅ `SUPABASE_URL`: https://mnszbkeuerjcevjvdqme.supabase.co
- ✅ `SUPABASE_ANON_KEY`: Configurada
- ✅ `SUPABASE_SERVICE_ROLE_KEY`: Segura em `.env.local`

## 🚀 Workflows com Supabase MCP

### 1. Consultar Dados

```bash
# Via CLI
node scripts/claude-cursor.mjs workflow supabase-query -query "SELECT * FROM profiles LIMIT 10"

# Via PowerShell
.\scripts\orchestrator.ps1 run supabase-query -query "SELECT * FROM profiles LIMIT 10"
```

### 2. Verificar Schema

```bash
# Listar todas as tabelas
.\scripts\orchestrator.ps1 run supabase-check-schema

# Verificar tabela específica
.\scripts\orchestrator.ps1 run supabase-check-schema -table "profiles"
```

### 3. Criar Migration

```bash
.\scripts\orchestrator.ps1 run supabase-create-migration \
  -name "add_email_column" \
  -description "Adicionar coluna email na tabela profiles" \
  -tables "profiles,baby_profiles"
```

### 4. Criar API com CRUD

```bash
.\scripts\orchestrator.ps1 run supabase-api-with-crud \
  -resource "baby-profiles" \
  -table "baby_profiles"
```

Isso cria:
- ✅ API route em `app/api/baby-profiles/route.ts`
- ✅ Schema de validação em `lib/validations/baby-profiles.ts`
- ✅ Testes unitários

### 5. Backup de Tabela

```bash
.\scripts\orchestrator.ps1 run supabase-backup-table -table "profiles"
```

Salva backup em `backups/profiles-{timestamp}.json`

### 6. Analisar e Otimizar Query

```bash
.\scripts\orchestrator.ps1 run supabase-analyze-query \
  -query "SELECT * FROM profiles WHERE email = 'test@example.com'" \
  -table "profiles"
```

Gera:
- ✅ Análise de performance
- ✅ Sugestões de otimização
- ✅ SQL para criar índices

## 🔧 Uso no Cursor

### Via Terminal Integrado

1. Abra terminal no Cursor (`Ctrl + '`)
2. Execute comandos diretamente:
   ```bash
   node scripts/claude-cursor.mjs workflow supabase-query -query "SELECT * FROM profiles"
   ```

### Via MCP no Cursor

O Supabase MCP está disponível diretamente no Cursor:

1. Abra o chat do Cursor
2. Peça ao Claude:
   ```
   Use o Supabase MCP para consultar a tabela profiles
   ```

3. O Claude pode:
   - ✅ Consultar tabelas
   - ✅ Executar queries SQL
   - ✅ Verificar schema
   - ✅ Criar migrations
   - ✅ Analisar performance

## 📊 Tabelas do Projeto

Tabelas principais configuradas:

1. **`profiles`** - Perfis de usuário
2. **`baby_profiles`** - Perfis de bebês
3. **`onboarding_responses`** - Respostas de onboarding
4. **`user_gamification`** - Pontos, níveis, streaks
5. **`achievements`** - Conquistas
6. **`sentiment_analysis`** - Análise de sentimento

## 🎯 Exemplos Práticos

### Exemplo 1: Criar API CRUD Completa

```bash
# Cria API completa para gerenciar perfis de bebês
.\scripts\orchestrator.ps1 run supabase-api-with-crud \
  -resource "baby-profiles" \
  -table "baby_profiles"
```

### Exemplo 2: Verificar Schema Antes de Migração

```bash
# Verifica estrutura atual
.\scripts\orchestrator.ps1 run supabase-check-schema -table "profiles"

# Cria migration para adicionar coluna
.\scripts\orchestrator.ps1 run supabase-create-migration \
  -name "add_onboarding_completed" \
  -description "Adicionar coluna onboarding_completed em profiles"
```

### Exemplo 3: Otimizar Query Lenta

```bash
# Analisa query e sugere otimizações
.\scripts\orchestrator.ps1 run supabase-analyze-query \
  -query "SELECT * FROM baby_profiles WHERE user_id = $1" \
  -table "baby_profiles"
```

## 🔐 Segurança

- ✅ Credenciais seguras em `.env.local`
- ✅ RLS (Row Level Security) habilitado
- ✅ Validação Zod obrigatória em APIs
- ✅ Rate limiting em todas as APIs
- ✅ Service Role Key apenas para migrations

## 📝 Próximos Passos

1. **Use os workflows** para automatizar tarefas comuns
2. **Integre com CI/CD** para migrations automáticas
3. **Crie workflows customizados** para suas necessidades
4. **Use o Supabase MCP diretamente** no Cursor para consultas rápidas

## 🔗 Referências

- [Sistema de Orquestração](./CLAUDE_CURSOR_ORCHESTRATION.md)
- [Configuração MCP](./CURSOR_MCP_SETUP.md)
- [Supabase MCP Docs](https://github.com/supabase/supabase-mcp)

---

**Integração completa e pronta para uso! 🚀**

