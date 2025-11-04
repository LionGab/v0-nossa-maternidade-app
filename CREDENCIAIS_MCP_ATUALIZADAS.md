# 🔐 Credenciais MCP Atualizadas

## ✅ O que foi atualizado no `mcp.json`

### **Supabase** (Atualizado com novas credenciais)
- **URL**: `https://mnszbkeuerjcevjvdqme.supabase.co` ✅
- **ANON_KEY**: Atualizado ✅
- **SERVICE_ROLE_KEY**: Atualizado ✅

### **MCPs Otimizados** (8 MCPs essenciais)
1. ✅ **supabase** - Banco de dados do projeto
2. ✅ **filesystem** - Acesso a arquivos
3. ✅ **git** - Operações Git
4. ✅ **github** - Integração GitHub (requer `GITHUB_TOKEN`)
5. ✅ **memory** - Contexto e decisões do Cursor AI
6. ✅ **fetch** - Requisições HTTP (usar Perplexity API)
7. ✅ **sequential-thinking** - Raciocínio complexo
8. ✅ **brave-search** - Pesquisas web (requer `BRAVE_API_KEY`)
9. ✅ **puppeteer** - Automação visual

### **MCPs Removidos** (não necessários)
- ❌ `postgres` - Usa Supabase
- ❌ `sqlite` - Não necessário
- ❌ `slack` - Não necessário
- ❌ `everart` - Não necessário
- ❌ `gmail` - Não necessário

---

## ⚠️ Credenciais que precisam ser configuradas

### **1. GitHub Token** (CRÍTICO)
**Para usar**: MCP GitHub, GitHub Copilot CLI

**Como obter**:
1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token (classic)"**
3. Selecione scopes: `repo`, `workflow`, `read:org`
4. Copie o token

**Configurar em `.env.local`**:
```env
GITHUB_TOKEN=ghp_seu_token_aqui
```

### **2. Anthropic API Key** (CRÍTICO)
**Para usar**: Claude Code CLI

**Como obter**:
1. Acesse: https://console.anthropic.com/settings/keys
2. Clique em **"Create Key"**
3. Copie o token

**Configurar em `.env.local`**:
```env
ANTHROPIC_API_KEY=sk-ant-api03-seu_token_aqui
```

### **3. OpenAI API Key** (CRÍTICO)
**Para usar**: GPT-4 no projeto

**Como obter**:
1. Acesse: https://platform.openai.com/api-keys
2. Clique em **"Create new secret key"**
3. Copie o token

**Configurar em `.env.local`**:
```env
OPENAI_API_KEY=sk-proj-seu_token_aqui
```

### **4. Brave Search API Key** (OPCIONAL)
**Para usar**: MCP Brave Search

**Como obter**:
1. Acesse: https://api.search.brave.com/app/keys
2. Crie conta e gere API key

**Configurar em `.env.local`**:
```env
BRAVE_API_KEY=sua_chave_brave_aqui
```

---

## 📝 Credenciais já configuradas no projeto

### **Perplexity** (já tem)
- **API_KEY**: `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`
- **Uso**: Via `fetch` MCP durante automação noturna

### **Google AI (Gemini)** (já tem)
- **API_KEY**: `AIzaSyC9YVWRmnGyGu4c9y7g-mNkkipDqb5JBZg`
- **Uso**: Já integrado no projeto via Google AI SDK

---

## 🎯 Resumo

### ✅ **Configurado:**
- Supabase (mcp.json atualizado)
- Perplexity (já no projeto)
- Gemini (já no projeto)

### ⚠️ **Faltando (3 CRÍTICOS):**
- `GITHUB_TOKEN` - Para GitHub Copilot CLI
- `ANTHROPIC_API_KEY` - Para Claude Code CLI
- `OPENAI_API_KEY` - Para GPT-4

### 🟡 **Faltando (1 OPCIONAL):**
- `BRAVE_API_KEY` - Para MCP Brave Search

---

**Próximo passo**: Obter as 3 credenciais críticas e configurar no `.env.local`
