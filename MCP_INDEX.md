# 📚 Índice Completo de MCPs

## 🎯 Navegação Rápida

### 🚀 Para Começar (Comece aqui!)
- **[MCP_QUICKSTART.md](MCP_QUICKSTART.md)** - Guia rápido de 3 passos

### 📖 Documentação Principal
- **[CURSOR_MCP_SETUP.md](CURSOR_MCP_SETUP.md)** - Guia completo para Cursor
- **[MCP_CONFIG.md](MCP_CONFIG.md)** - Sistema de memória da aplicação
- **[GUIA-INSTALACAO-MCPS.md](GUIA-INSTALACAO-MCPS.md)** - Guia original (Claude Desktop)

### 📁 Arquivos de Configuração
- **[.cursor/mcp.json](.cursor/mcp.json)** - Configuração ativa (com credenciais)
- **[.cursor/mcp.template.json](.cursor/mcp.template.json)** - Template sem credenciais
- **[.cursor/setup.sh](.cursor/setup.sh)** - Script de instalação
- **[.cursor/README.md](.cursor/README.md)** - Info sobre o diretório

### 📋 Referência Rápida
- **[mcp-config-example.json](mcp-config-example.json)** - Exemplo de configuração

---

## 🗺️ Estrutura de MCPs

```
/workspace/
├── .cursor/
│   ├── mcp.json              # ✅ CONFIGURAÇÃO ATIVA
│   ├── mcp.template.json     # 📝 Template
│   ├── setup.sh              # 🔧 Script de setup
│   └── README.md             # 📖 Info do diretório
│
├── MCP_QUICKSTART.md         # ⚡ COMECE AQUI!
├── CURSOR_MCP_SETUP.md       # 📚 Guia completo
├── MCP_CONFIG.md             # 🧠 Sistema de memória
├── MCP_INDEX.md              # 📋 Este arquivo
└── GUIA-INSTALACAO-MCPS.md  # 📖 Guia Claude Desktop
```

---

## 🎯 Escolha Seu Caminho

### Sou novo em MCPs
1. Leia: [MCP_QUICKSTART.md](MCP_QUICKSTART.md)
2. Execute: `.cursor/setup.sh`
3. Reinicie o Cursor
4. Teste: "Liste tabelas do Supabase"

### Quero configuração detalhada
1. Leia: [CURSOR_MCP_SETUP.md](CURSOR_MCP_SETUP.md)
2. Configure: `.cursor/mcp.json`
3. Instale: Rode o setup
4. Teste: Todos os MCPs

### Preciso configurar credenciais
1. Copie: `.cursor/mcp.template.json` → `.cursor/mcp.json`
2. Edite: Adicione suas chaves
3. Reinicie: Cursor
4. Verifique: Funcionamento

### Quero entender o sistema de memória
1. Leia: [MCP_CONFIG.md](MCP_CONFIG.md)
2. Explore: `lib/mcp/memory-manager.ts`
3. Teste: APIs de MCP em `app/api/mcp/`

---

## 🔍 Encontrar Informações

| Preciso de... | Veja... |
|--------------|---------|
| Quick start | [MCP_QUICKSTART.md](MCP_QUICKSTART.md) |
| Comandos úteis | [CURSOR_MCP_SETUP.md](CURSOR_MCP_SETUP.md) |
| Troubleshooting | [CURSOR_MCP_SETUP.md](CURSOR_MCP_SETUP.md) → Seção Troubleshooting |
| Segurança | [CURSOR_MCP_SETUP.md](CURSOR_MCP_SETUP.md) → Seção Segurança |
| Configurar Brave | [MCP_QUICKSTART.md](MCP_QUICKSTART.md) → Configuração Opcional |
| Sistema de memória | [MCP_CONFIG.md](MCP_CONFIG.md) |
| Claude Desktop | [GUIA-INSTALACAO-MCPS.md](GUIA-INSTALACAO-MCPS.md) |

---

## 📊 Status dos MCPs

| MCP | Arquivo Config | Documentação | Status |
|-----|---------------|--------------|--------|
| Supabase | ✅ `.cursor/mcp.json` | ✅ CURSOR_MCP_SETUP.md | 🟢 Ativo |
| Filesystem | ✅ `.cursor/mcp.json` | ✅ CURSOR_MCP_SETUP.md | 🟢 Ativo |
| Git | ✅ `.cursor/mcp.json` | ✅ CURSOR_MCP_SETUP.md | 🟢 Ativo |
| Brave Search | ⚠️ Requer API Key | ✅ MCP_QUICKSTART.md | 🟡 Opcional |
| PostgreSQL | ⚠️ Requer senha | ✅ CURSOR_MCP_SETUP.md | 🟡 Opcional |
| Fetch | ✅ `.cursor/mcp.json` | ✅ CURSOR_MCP_SETUP.md | 🟢 Ativo |
| Memory | ✅ `.cursor/mcp.json` | ✅ MCP_CONFIG.md | 🟢 Ativo |

**Legenda:**
- 🟢 Ativo - Funcionando sem configuração adicional
- 🟡 Opcional - Requer configuração de credenciais
- ✅ Configurado

---

## 🔧 Comandos Rápidos

### Instalação
```bash
cd /workspace/.cursor && ./setup.sh
```

### Verificar Configuração
```bash
cat /workspace/.cursor/mcp.json | head -20
```

### Testar MCPs no Cursor
```
Liste todas as tabelas do banco Supabase
```

---

## 🆘 Suporte

### Troubleshooting Geral
→ [CURSOR_MCP_SETUP.md](CURSOR_MCP_SETUP.md#troubleshooting)

### Problemas de Instalação
→ [MCP_QUICKSTART.md](MCP_QUICKSTART.md#problemas)

### Issues Conhecidos
→ [KNOWN_ISSUES.md](KNOWN_ISSUES.md)

---

## 🔗 Links Externos

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Cursor Docs - MCP](https://docs.cursor.com/advanced/mcp)
- [Supabase MCP](https://github.com/supabase-community/supabase-mcp)
- [Brave Search API](https://api.search.brave.com/)

---

## ✅ Checklist de Setup

- [ ] Li o [MCP_QUICKSTART.md](MCP_QUICKSTART.md)
- [ ] Executei `.cursor/setup.sh`
- [ ] Verifiquei `.cursor/mcp.json`
- [ ] Reiniciei o Cursor
- [ ] Testei pelo menos 1 MCP
- [ ] (Opcional) Configurei Brave API Key
- [ ] (Opcional) Configurei PostgreSQL
- [ ] Li a documentação completa

---

**Última atualização:** 2025-11-03  
**Workspace:** `/workspace`  
**Status:** ✅ Todos os MCPs configurados
