# 🚀 Guia de Instalação de MCPs para v0-nossa-maternidade-app

## ✅ Passo 1: Obter Credenciais do Supabase

1. Acesse: https://supabase.com/dashboard
2. Abra seu projeto **v0-nossa-maternidade-app**
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon/public key** (chave pública)
   - **service_role key** (chave privada - CUIDADO!)

## ✅ Passo 2: Obter Chave do Brave Search (Opcional)

1. Acesse: https://api.search.brave.com/app/keys
2. Crie uma conta grátis
3. Gere uma API key
4. Copie a chave

## ✅ Passo 2.5: Obter Token do GitHub (Opcional)

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Dê um nome: "Claude Desktop MCP"
4. Selecione as permissões necessárias:
   - `repo` (acesso completo a repositórios)
   - `read:org` (se quiser acesso a organizações)
5. Clique em "Generate token"
6. **COPIE O TOKEN** (você só verá uma vez!)

## ✅ Passo 3: Localizar o Arquivo de Configuração

### Windows:
1. Pressione `Win + R`
2. Cole: `%APPDATA%\Claude`
3. Procure o arquivo: `claude_desktop_config.json`

**Se o arquivo NÃO existir:**
- Crie manualmente um arquivo chamado `claude_desktop_config.json` nessa pasta

## ✅ Passo 4: Configurar MCPs (Opção 1: Automático)

### Usando o Script PowerShell:

1. Abra o PowerShell na pasta do projeto
2. Execute:
```powershell
.\scripts\setup-mcps.ps1
```
3. O script irá:
   - Criar/atualizar o arquivo de configuração
   - Fazer backup se já existir
   - Atualizar caminhos automaticamente
   - Preservar configurações existentes

## ✅ Passo 4: Configurar MCPs (Opção 2: Manual)

1. **Abra** o arquivo `claude_desktop_config.json` com um editor de texto
2. **Copie** o conteúdo do arquivo `mcp-config-example.json` que está nesta pasta
3. **Cole** no arquivo de configuração do Claude Desktop
4. **Substitua** os valores:
   - `COLE_SEU_TOKEN_GITHUB_AQUI` → Token GitHub (ou remova a seção github)
   - `COLE_SUA_CHAVE_BRAVE_AQUI` → Brave API key (ou remova a seção brave-search)

## ✅ Passo 5: Validar o JSON

1. Copie o conteúdo do seu arquivo editado
2. Acesse: https://jsonlint.com/
3. Cole e clique em "Validate JSON"
4. Corrija erros se houver

## ✅ Passo 6: Reiniciar Claude Desktop

1. **Feche COMPLETAMENTE** o Claude Desktop (não apenas minimizar)
2. **Reabra** o Claude Desktop
3. Aguarde 30-60 segundos para os MCPs carregarem

## ✅ Passo 7: Testar os MCPs

No Claude Desktop, tente estes comandos:

### Testar Supabase:
```
Liste todas as tabelas do meu banco de dados Supabase
```

### Testar Filesystem:
```
Mostre a estrutura de pastas do projeto v0-nossa-maternidade-app
```

### Testar Git:
```
Quais foram os últimos 5 commits do projeto?
```

### Testar GitHub:
```
Mostre os últimos 5 commits do repositório LionGab/v0-nossa-maternidade-app
```

### Testar Brave Search:
```
Pesquise sobre as melhores práticas de Next.js 15 em 2025
```

### Testar Browser Extension:
```
Navegue para https://supabase.com e tire um snapshot da página
```

---

## 🔧 Troubleshooting

### Erro: "Cannot find module"
Os MCPs usam `npx -y` para instalação automática, mas se tiver problemas:
```bash
npm cache clean --force
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-git
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-brave-search
npm install -g @modelcontextprotocol/server-browser
npm install -g supabase-mcp
```

### MCPs não aparecem
1. Verifique se o JSON está válido em jsonlint.com
2. Confirme que fechou COMPLETAMENTE o Claude Desktop
3. Verifique se os caminhos estão corretos (use barras invertidas duplas `\\` no Windows)

### Erro com Git MCP
Se estiver usando `uvx`, você precisa ter o `uv` instalado:
```bash
# Windows (via PowerShell como Admin)
irm https://astral.sh/uv/install.ps1 | iex
```

Ou use `npx` como configurado no exemplo.

---

## 📝 Notas de Segurança

⚠️ **NUNCA** compartilhe suas chaves `service_role_key`!

- A chave `anon_key` é pública (ok compartilhar)
- A chave `service_role_key` é PRIVADA (nunca commitar no Git)

## 🎯 MCPs Configurados

✅ **Supabase** - Interagir com seu banco de dados
✅ **Filesystem** - Navegar pelos arquivos do projeto
✅ **Git** - Ver histórico, branches, commits
✅ **GitHub** - Gerenciar issues, PRs, commits via API
✅ **Brave Search** - Buscar informações atualizadas na web
✅ **Browser Extension** - Navegar e interagir com páginas web

---

## 📚 Comandos Úteis Após Instalação

```
# Ver schema do banco
"Mostre o schema completo da tabela 'profiles' no Supabase"

# Analisar código
"Use o filesystem para encontrar todos os componentes React que usam useEffect"

# Histórico git
"Mostre os commits relacionados a autenticação nos últimos 30 dias"

# GitHub
"Crie uma issue no repositório sobre melhorias de performance"
"Liste todas as PRs abertas no repositório"
"Mostre os detalhes do último commit na branch main"

# Pesquisa atualizada
"Pesquise sobre as vulnerabilidades de segurança mais recentes do Next.js"

# Browser
"Navegue para a documentação do Next.js e resuma os principais pontos"
```

---

## ✅ Checklist de Instalação

### Método Automático (Recomendado)
- [ ] Executei `.\scripts\setup-mcps.ps1`
- [ ] Editei o arquivo de configuração e adicionei tokens (se necessário)
- [ ] Fechei completamente o Claude Desktop
- [ ] Reabri o Claude Desktop
- [ ] Aguardei 60 segundos
- [ ] Testei pelo menos um MCP

### Método Manual
- [ ] Obtive as credenciais do Supabase
- [ ] Obtive a chave do Brave Search (opcional)
- [ ] Obtive o token do GitHub (opcional)
- [ ] Localizei o arquivo claude_desktop_config.json
- [ ] Copiei a configuração do mcp-config-example.json
- [ ] Substituí todas as credenciais
- [ ] Validei o JSON em jsonlint.com
- [ ] Fechei completamente o Claude Desktop
- [ ] Reabri o Claude Desktop
- [ ] Aguardei 60 segundos
- [ ] Testei pelo menos um MCP

---

**Configuração criada para:** v0-nossa-maternidade-app
**Data:** 2025-11-03
**Local do projeto:** C:\Users\Usuario\Documents\gl\v0-nossa-maternidade-app
