# ✅ Checklist de Credenciais - Automação Noturna

## 🔐 Credenciais Fornecidas

### ✅ **Supabase** (Atualizado)
- **URL**: `https://mnszbkeuerjcevjvdqme.supabase.co`
- **ANON_KEY**: Configurado no `mcp.json`
- **SERVICE_ROLE_KEY**: Configurado no `mcp.json`

### ✅ **Perplexity** (Fornecido)
- **API_KEY**: `pplx-***` (configurado no `.env.local`)
- **Status**: ✅ Configurado no projeto
- **Uso**: Pesquisa e notícias maternais
- **⚠️ IMPORTANTE:** Credenciais não devem ser expostas em arquivos de documentação

### ✅ **Google AI (Gemini)** (Fornecido)
- **API_KEY**: `AIza***` (configurado no `.env.local`)
- **Status**: ✅ Configurado no projeto
- **Uso**: Análise contextual e enriquecimento
- **⚠️ IMPORTANTE:** Credenciais não devem ser expostas em arquivos de documentação

---

## ⚠️ Credenciais Faltando

### 🔴 **CRÍTICO** (Para Automação Noturna)

#### 1. **GitHub Token** (`GITHUB_TOKEN`)
- **Onde usar**: MCP GitHub, GitHub Copilot CLI
- **Como obter**:
  1. Acesse: https://github.com/settings/tokens
  2. Clique em **"Generate new token (classic)"**
  3. Selecione scopes: `repo`, `workflow`, `read:org`
  4. Copie o token (formato: `ghp_...`)
- **Onde configurar**:
  - `.env.local`: `GITHUB_TOKEN=ghp_seu_token_aqui`
  - `mcp.json`: Já está configurado para usar `${GITHUB_TOKEN}`

#### 2. **Anthropic API Key** (`ANTHROPIC_API_KEY`)
- **Onde usar**: Claude Code CLI, Chat empático
- **Como obter**:
  1. Acesse: https://console.anthropic.com/settings/keys
  2. Clique em **"Create Key"**
  3. Copie o token (formato: `sk-ant-api03-...`)
- **Onde configurar**:
  - `.env.local`: `ANTHROPIC_API_KEY=sk-ant-api03-seu_token_aqui`

#### 3. **OpenAI API Key** (`OPENAI_API_KEY`)
- **Onde usar**: GPT-4 para recomendações e chat geral
- **Como obter**:
  1. Acesse: https://platform.openai.com/api-keys
  2. Clique em **"Create new secret key"**
  3. Copie o token (formato: `sk-proj-...` ou `sk-...`)
- **Onde configurar**:
  - `.env.local`: `OPENAI_API_KEY=sk-proj-seu_token_aqui`

### 🟡 **OPCIONAL** (Mas Recomendado)

#### 4. **Brave Search API Key** (`BRAVE_API_KEY`)
- **Onde usar**: MCP Brave Search (alternativa ao Perplexity)
- **Como obter**:
  1. Acesse: https://api.search.brave.com/app/keys
  2. Crie uma conta (se não tiver)
  3. Gere uma API key
- **Onde configurar**:
  - `.env.local`: `BRAVE_API_KEY=sua_chave_brave_aqui`
  - `mcp.json`: Já está configurado para usar `${BRAVE_API_KEY}`

---

## 📋 Resumo

### ✅ **Já Configurado:**
- ✅ Supabase (URL, ANON_KEY, SERVICE_ROLE_KEY)
- ✅ Perplexity API Key
- ✅ Google AI (Gemini) API Key

### ⚠️ **Faltando (CRÍTICO):**
- ❌ **GitHub Token** (`GITHUB_TOKEN`) - Para GitHub Copilot CLI e MCP GitHub
- ❌ **Anthropic API Key** (`ANTHROPIC_API_KEY`) - Para Claude Code CLI
- ❌ **OpenAI API Key** (`OPENAI_API_KEY`) - Para GPT-4

### 🟡 **Faltando (OPCIONAL):**
- ❌ **Brave Search API Key** (`BRAVE_API_KEY`) - Alternativa ao Perplexity

---

## 🚀 Próximos Passos

1. **Obter GitHub Token** (CRÍTICO)
   - Criar em: https://github.com/settings/tokens
   - Adicionar em `.env.local`: `GITHUB_TOKEN=ghp_seu_token_aqui`

2. **Obter Anthropic API Key** (CRÍTICO)
   - Criar em: https://console.anthropic.com/settings/keys
   - Adicionar em `.env.local`: `ANTHROPIC_API_KEY=sk-ant-api03-seu_token_aqui`

3. **Obter OpenAI API Key** (CRÍTICO)
   - Criar em: https://platform.openai.com/api-keys
   - Adicionar em `.env.local`: `OPENAI_API_KEY=sk-proj-seu_token_aqui`

4. **Obter Brave Search API Key** (OPCIONAL)
   - Criar em: https://api.search.brave.com/app/keys
   - Adicionar em `.env.local`: `BRAVE_API_KEY=sua_chave_brave_aqui`

---

## ✅ Após Configurar

1. Reiniciar o Cursor para carregar novas credenciais
2. Testar automação noturna: `npm run overnight:dry-run`
3. Verificar se todas as ferramentas estão funcionando

---

**Status**: ⚠️ **3 credenciais críticas faltando** (GitHub, Anthropic, OpenAI)
