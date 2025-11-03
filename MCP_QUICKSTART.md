# ⚡ MCP Quick Start - Cursor

## 🎯 O que são MCPs?

MCPs (Model Context Protocol) permitem que o Cursor acesse recursos externos como:
- 🗄️ Bancos de dados
- 📁 Sistemas de arquivos
- 🔀 Repositórios Git
- 🌐 APIs da Web

## ✅ Status: Pronto para Usar!

✨ **Todos os MCPs já estão configurados neste projeto!**

## 🚀 Como Começar (3 passos)

### 1️⃣ Instalar Dependências (Opcional)

Os MCPs usam `npx`, mas para melhor performance, instale globalmente:

```bash
cd /workspace/.cursor
./setup.sh
```

### 2️⃣ Reiniciar Cursor

1. Feche completamente o Cursor
2. Reabra o projeto
3. Aguarde 30 segundos

### 3️⃣ Testar

Digite no chat do Cursor:

```
Liste todas as tabelas do banco Supabase
```

## 📋 MCPs Disponíveis

| MCP | Função | Status | Requer Config |
|-----|--------|--------|---------------|
| 🗄️ Supabase | Banco de dados | ✅ Ativo | Não |
| 📁 Filesystem | Arquivos | ✅ Ativo | Não |
| 🔀 Git | Controle de versão | ✅ Ativo | Não |
| 🔍 Brave Search | Pesquisa web | ⚠️ Requer API Key | Sim |
| 🐘 PostgreSQL | SQL direto | ⚠️ Requer senha | Sim |
| 🌐 Fetch | HTTP requests | ✅ Ativo | Não |
| 🧠 Memory | Contexto IA | ✅ Ativo | Não |

## 💡 Comandos Úteis

### Banco de Dados
```
"Mostre o schema da tabela profiles"
"Quantos posts existem no banco?"
"Liste os últimos 10 usuários criados"
```

### Código
```
"Encontre todos os componentes que usam useState"
"Liste arquivos modificados hoje"
"Mostre dependências do package.json"
```

### Git
```
"Últimos 5 commits"
"Mostre branches ativas"
"Diff do último commit"
```

### Pesquisa
```
"Pesquise sobre React Server Components"
"Busque vulnerabilidades do Next.js"
```

## ⚙️ Configuração Opcional

### Adicionar Brave Search

1. Obtenha key grátis: https://api.search.brave.com/app/keys
2. Edite `.cursor/mcp.json`
3. Substitua `"BRAVE_API_KEY": ""`
4. Reinicie Cursor

### Ativar PostgreSQL Direto

1. Obtenha senha no Supabase Dashboard
2. Edite `.cursor/mcp.json`
3. Substitua `[YOUR-PASSWORD]`
4. Reinicie Cursor

## 📖 Documentação Completa

- **Setup Detalhado:** `CURSOR_MCP_SETUP.md`
- **Guia Original:** `GUIA-INSTALACAO-MCPS.md`
- **Config App:** `MCP_CONFIG.md`

## 🆘 Problemas?

### MCPs não aparecem
```bash
# Limpar cache e reinstalar
npm cache clean --force
cd /workspace/.cursor && ./setup.sh
```

### Erro de permissão
```bash
chmod +x /workspace/.cursor/setup.sh
```

### Supabase não conecta
Verifique credenciais em `.cursor/mcp.json`

## 🎉 Pronto!

Agora você pode:
- 💬 Conversar com seu banco de dados
- 🔍 Pesquisar no código instantaneamente
- 🕵️ Analisar histórico Git
- 🌐 Buscar informações atualizadas

**Experimente agora:** Digite no chat do Cursor:
```
"Faça um resumo completo deste projeto usando os MCPs"
```

---

**Atualizado:** 2025-11-03  
**Workspace:** `/workspace`
