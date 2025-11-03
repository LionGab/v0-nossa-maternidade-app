# 🚀 Configuração de MCPs no Cursor

Este guia explica como configurar todos os MCPs (Model Context Protocol) no Cursor para este projeto.

## ✅ MCPs Configurados

### Essenciais (Já Configurados)

1. **Supabase MCP** ✅
   - Conexão com banco de dados Supabase
   - Credenciais configuradas do arquivo `.env`
   - Permite consultar tabelas, executar queries, gerenciar dados

2. **Filesystem MCP** ✅
   - Acesso completo ao sistema de arquivos do projeto
   - Permite ler, escrever e navegar arquivos
   - Configurado para `/workspace`

3. **Git MCP** ✅
   - Integração com repositório Git
   - Permite ver histórico, branches, commits, diffs
   - Configurado para repositório em `/workspace`

### Opcionais (Requerem Configuração Adicional)

4. **Brave Search MCP** ⚠️
   - Pesquisas na web atualizadas
   - Requer: `BRAVE_API_KEY` no `.env`
   - Obter em: https://api.search.brave.com/app/keys

5. **GitHub MCP** ⚠️
   - Integração com GitHub
   - Requer: `GITHUB_TOKEN` no `.env`
   - Criar token em: https://github.com/settings/tokens

6. **Postgres MCP** ⚠️
   - Conexão direta com PostgreSQL
   - Requer: `DATABASE_URL` no `.env`
   - Formato: `postgresql://user:password@host:port/database`

7. **SQLite MCP** ⚠️
   - Trabalhar com bancos SQLite locais
   - Configurado para `/workspace`

8. **Puppeteer MCP** ✅
   - Automação de navegador
   - Útil para testes E2E e scraping

9. **Fetch MCP** ✅
   - Fazer requisições HTTP
   - Útil para chamadas de API

10. **Memory MCP** ✅
    - Gerenciamento de memória contextual
    - Útil para manter contexto entre conversas

11. **Sequential Thinking MCP** ✅
    - Pensamento sequencial para problemas complexos
    - Melhora raciocínio da IA

12. **Slack MCP** ⚠️
    - Integração com Slack
    - Requer: `SLACK_BOT_TOKEN` e `SLACK_USER_TOKEN` no `.env`

13. **Everart MCP** ⚠️
    - Geração de imagens
    - Requer: `EVERART_API_KEY` no `.env`

14. **Gmail MCP** ⚠️
    - Integração com Gmail
    - Requer: `GMAIL_CREDENTIALS_PATH` no `.env`

## 📋 Como Configurar no Cursor

### Opção 1: Usar Arquivo de Configuração do Cursor

1. Abra o Cursor
2. Vá em **Settings** → **Extensions** → **MCP** (ou procure por "MCP" nas configurações)
3. Clique em **Edit Configuration** ou **Add MCP Server**
4. Copie o conteúdo do arquivo `.cursor/mcp-config.json` ou `cursor-mcp-config.json`
5. Cole na configuração do Cursor
6. Ajuste as variáveis de ambiente conforme necessário

### Opção 2: Configurar Manualmente

1. Abra as configurações do Cursor (Ctrl+, ou Cmd+,)
2. Procure por "MCP" ou "Model Context Protocol"
3. Adicione cada servidor MCP manualmente usando as configurações abaixo

## 🔧 Configuração de Variáveis de Ambiente

Para usar os MCPs opcionais, adicione as seguintes variáveis ao seu arquivo `.env`:

```bash
# Brave Search (opcional)
BRAVE_API_KEY=sua_chave_aqui

# GitHub (opcional)
GITHUB_TOKEN=seu_token_aqui

# PostgreSQL (opcional - se usar conexão direta)
DATABASE_URL=postgresql://user:password@host:port/database

# Slack (opcional)
SLACK_BOT_TOKEN=xoxb-seu-token
SLACK_USER_TOKEN=xoxp-seu-token

# Everart (opcional)
EVERART_API_KEY=sua_chave_aqui

# Gmail (opcional)
GMAIL_CREDENTIALS_PATH=/caminho/para/credentials.json
```

## ✅ Verificar Instalação

Após configurar, você pode testar os MCPs fazendo perguntas como:

- **Supabase**: "Liste todas as tabelas do meu banco de dados Supabase"
- **Filesystem**: "Mostre a estrutura de arquivos do projeto"
- **Git**: "Quais foram os últimos 5 commits?"
- **Brave Search**: "Pesquise sobre Next.js 15"
- **GitHub**: "Liste os issues abertos do repositório"

## 🐛 Troubleshooting

### MCPs não aparecem

1. **Reinicie o Cursor completamente** após adicionar configurações
2. Verifique se o JSON está válido (use https://jsonlint.com/)
3. Confirme que os pacotes npm estão instalados:
   ```bash
   npm install -g supabase-mcp
   npm install -g @modelcontextprotocol/server-filesystem
   npm install -g @modelcontextprotocol/server-git
   ```

### Erro "Cannot find module"

Execute:
```bash
npm cache clean --force
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-git
npm install -g @modelcontextprotocol/server-brave-search
npm install -g supabase-mcp
```

### Erro com variáveis de ambiente

Certifique-se de que:
- As variáveis estão no arquivo `.env`
- O formato está correto (sem espaços extras)
- Você reiniciou o Cursor após adicionar variáveis

## 📚 Recursos Adicionais

- [Documentação MCP](https://modelcontextprotocol.io/)
- [Servidores MCP Disponíveis](https://github.com/modelcontextprotocol/servers)
- [Guia de Instalação Original](./GUIA-INSTALACAO-MCPS.md)

## 🎯 Próximos Passos

1. ✅ Configure os MCPs essenciais (Supabase, Filesystem, Git)
2. ⚠️ Configure MCPs opcionais conforme necessidade
3. ✅ Teste cada MCP para garantir funcionamento
4. ✅ Documente qualquer configuração adicional necessária

---

**Última atualização:** $(date)
**Projeto:** v0-nossa-maternidade-app
