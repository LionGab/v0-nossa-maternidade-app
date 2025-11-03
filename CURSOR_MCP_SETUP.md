# 🚀 Configuração de MCPs no Cursor - v0-nossa-maternidade-app

## ✅ Status da Configuração

**Data:** 2025-11-03  
**Workspace:** `/workspace`  
**Arquivo de Configuração:** `.cursor/mcp.json`

## 📋 MCPs Instalados

Este projeto está configurado com os seguintes MCPs (Model Context Protocol servers):

### 1. 🗄️ **Supabase MCP**
- **Função:** Interagir diretamente com o banco de dados Supabase
- **Comandos úteis:**
  - "Liste todas as tabelas do banco"
  - "Mostre o schema da tabela profiles"
  - "Quantos usuários existem na tabela profiles?"
  - "Execute uma query para buscar posts recentes"

### 2. 📁 **Filesystem MCP**
- **Função:** Navegar e manipular arquivos do projeto
- **Comandos úteis:**
  - "Mostre a estrutura de pastas do projeto"
  - "Liste todos os componentes React"
  - "Encontre todos os arquivos que usam 'useEffect'"
  - "Leia o conteúdo do arquivo app/page.tsx"

### 3. 🔀 **Git MCP**
- **Função:** Acessar histórico e informações do Git
- **Comandos úteis:**
  - "Mostre os últimos 10 commits"
  - "Quais arquivos foram modificados recentemente?"
  - "Mostre o diff do último commit"
  - "Liste todas as branches"

### 4. 🔍 **Brave Search MCP**
- **Função:** Buscar informações atualizadas na web
- **Comandos úteis:**
  - "Pesquise sobre Next.js 15 best practices"
  - "Busque vulnerabilidades recentes do React"
  - "Procure exemplos de PWA com Service Workers"
- **Nota:** Requer chave API do Brave (gratuita)

### 5. 🐘 **PostgreSQL MCP**
- **Função:** Conexão direta com PostgreSQL (Supabase)
- **Comandos úteis:**
  - "Execute uma query complexa no banco"
  - "Mostre estatísticas de performance"
  - "Liste indexes das tabelas"
- **Nota:** Requer string de conexão completa

### 6. 🌐 **Fetch MCP**
- **Função:** Fazer requisições HTTP para APIs externas
- **Comandos úteis:**
  - "Faça uma requisição GET para a API do projeto"
  - "Teste o endpoint /api/chat"
  - "Verifique o status da API do Supabase"

### 7. 🧠 **Memory MCP**
- **Função:** Sistema de memória para contexto de longo prazo
- **Comandos úteis:**
  - "Lembre-se desta preferência do usuário"
  - "Recupere informações sobre nossa última conversa"
  - "Armazene este padrão de código"

## 🔧 Como Usar

### Ativando os MCPs no Cursor

1. **Os MCPs já estão configurados** neste workspace
2. Reinicie o Cursor para carregar as configurações
3. Os MCPs serão carregados automaticamente ao abrir este projeto

### Testando os MCPs

Execute estes comandos no chat do Cursor para verificar:

```
# Teste Supabase
Liste todas as tabelas do meu banco Supabase

# Teste Filesystem
Mostre a estrutura de pastas em /workspace/app

# Teste Git
Quais foram os últimos 5 commits?

# Teste Brave Search (se configurado)
Pesquise sobre React Server Components
```

## ⚙️ Configuração Avançada

### Adicionando Brave API Key

1. Obtenha uma chave grátis: https://api.search.brave.com/app/keys
2. Edite `.cursor/mcp.json`
3. Substitua a linha `"BRAVE_API_KEY": ""` por sua chave
4. Reinicie o Cursor

### Configurando PostgreSQL Direto

1. Obtenha sua senha do Supabase
2. Edite `.cursor/mcp.json`
3. Substitua `[YOUR-PASSWORD]` na connection string
4. Reinicie o Cursor

## 🎯 Casos de Uso Recomendados

### Para Desenvolvimento
```
"Use o filesystem MCP para analisar todos os componentes 
que fazem requisições ao Supabase e liste-os"
```

### Para Debugging
```
"Use o Supabase MCP para verificar se há posts órfãos 
sem user_id válido"
```

### Para Code Review
```
"Use o Git MCP para mostrar todas as mudanças na pasta 
app/api/ nos últimos 7 dias"
```

### Para Pesquisa
```
"Use o Brave Search para encontrar as melhores práticas 
de segurança para PWAs em 2025"
```

## 🔒 Segurança

### ⚠️ Informações Sensíveis

O arquivo `.cursor/mcp.json` contém:
- ✅ `SUPABASE_ANON_KEY` - Seguro expor (chave pública)
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` - **NUNCA commitar no Git público**

### Proteção

O arquivo `.cursor/` está ignorado no `.gitignore` para proteger suas credenciais.

## 📊 MCPs por Categoria

### Integração com Banco de Dados
- ✅ Supabase MCP
- ✅ PostgreSQL MCP

### Navegação de Código
- ✅ Filesystem MCP
- ✅ Git MCP

### Busca e Pesquisa
- ✅ Brave Search MCP
- ✅ Fetch MCP

### IA e Contexto
- ✅ Memory MCP

## 🛠️ Troubleshooting

### MCPs não aparecem

1. Verifique se o arquivo `.cursor/mcp.json` existe
2. Reinicie completamente o Cursor (feche e reabra)
3. Aguarde 30-60 segundos para carregar

### Erro "Cannot find module"

Execute no terminal:
```bash
npm cache clean --force
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-git
npm install -g @modelcontextprotocol/server-brave-search
npm install -g @modelcontextprotocol/server-postgres
npm install -g @modelcontextprotocol/server-fetch
npm install -g @modelcontextprotocol/server-memory
npm install -g supabase-mcp
```

### Supabase MCP não funciona

1. Verifique se as credenciais estão corretas em `.cursor/mcp.json`
2. Teste as credenciais manualmente:
```bash
curl https://bbcwitnbnosyfpfjtzkry.supabase.co/rest/v1/ \
  -H "apikey: [SUA-ANON-KEY]"
```

### PostgreSQL MCP não conecta

1. Verifique a connection string
2. Certifique-se de ter substituído `[YOUR-PASSWORD]`
3. A senha pode ser obtida no Supabase Dashboard

## 📚 Recursos Adicionais

### Documentação Oficial
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Cursor MCP Documentation](https://docs.cursor.com/advanced/mcp)
- [Supabase MCP](https://github.com/supabase-community/supabase-mcp)

### Relacionado neste Projeto
- `MCP_CONFIG.md` - Configuração do Memory Context Protocol da app
- `GUIA-INSTALACAO-MCPS.md` - Guia original (para Claude Desktop)
- `mcp-config-example.json` - Exemplo de configuração

## ✅ Checklist de Verificação

- [x] Diretório `.cursor/` criado
- [x] Arquivo `mcp.json` configurado
- [x] Credenciais do Supabase adicionadas
- [x] MCPs essenciais (filesystem, git) configurados
- [ ] Brave API Key configurada (opcional)
- [ ] PostgreSQL password configurada (opcional)
- [ ] Cursor reiniciado
- [ ] MCPs testados e funcionando

## 🎉 Benefícios

Com todos os MCPs configurados, você pode:

1. **Desenvolver mais rápido** - Acesso direto ao banco e arquivos
2. **Debugar melhor** - Inspeção em tempo real do estado
3. **Manter qualidade** - Análise automática do código
4. **Pesquisar contexto** - Busca de informações atualizadas
5. **Trabalhar integrado** - Tudo dentro do Cursor

---

**Última atualização:** 2025-11-03  
**Versão do Cursor:** Compatible with all versions supporting MCP  
**Status:** ✅ Pronto para uso
