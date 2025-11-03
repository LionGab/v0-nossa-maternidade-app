# 🔐 Guia de Configuração de Variáveis de Ambiente

**Data:** $(date)
**Status:** ✅ **GUIA COMPLETO**

---

## 📋 Índice

1. [Desenvolvimento Local](#desenvolvimento-local)
2. [Produção (Netlify)](#produção-netlify)
3. [Testes](#testes)
4. [Lista Completa de Variáveis](#lista-completa-de-variáveis)

---

## 🏠 Desenvolvimento Local

### Passo 1: Criar arquivo `.env.local`

Na **raiz do projeto**, crie um arquivo chamado `.env.local`:

```bash
# Windows PowerShell
Copy-Item .env.example .env.local

# Linux/Mac
cp .env.example .env.local
```

### Passo 2: Preencher com suas credenciais

Abra o arquivo `.env.local` e preencha com seus valores reais:

```env
# Supabase (Obrigatório)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-aqui

# APIs de IA (Opcional)
ANTHROPIC_API_KEY=sk-ant-sua-chave-aqui
OPENAI_API_KEY=sk-sua-chave-aqui

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/onboarding
```

### Passo 3: Verificar que está funcionando

Rode o projeto:

```bash
npm run dev
```

Se tudo estiver configurado corretamente, você verá logs informativos no console.

⚠️ **IMPORTANTE:**
- O arquivo `.env.local` está no `.gitignore` e **NUNCA** deve ser commitado
- Use `.env.example` como referência (sem valores sensíveis)

---

## 🌐 Produção (Netlify)

### Método 1: Via Interface Web (Recomendado)

1. **Acesse o Netlify Dashboard**
   - Vá para [app.netlify.com](https://app.netlify.com)
   - Selecione seu site

2. **Navegue até Environment Variables**
   - Vá em **Site settings** > **Environment variables**
   - Ou durante o deploy: **Show advanced** > **New variable**

3. **Adicione cada variável:**

   Clique em **"Add variable"** e adicione:

   ```
   Key: NEXT_PUBLIC_SUPABASE_URL
   Value: https://seu-projeto.supabase.co

   Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: sua-chave-publica-aqui

   Key: ANTHROPIC_API_KEY
   Value: sk-ant-sua-chave-aqui

   ... e assim por diante
   ```

4. **Configurar Contexto (Opcional)**
   - **All scopes**: Variável disponível em produção e previews
   - **Production**: Apenas em produção
   - **Deploy previews**: Apenas em previews (branches)

5. **Salvar e Fazer Deploy**
   - Clique em **Save**
   - Faça um novo deploy para aplicar as mudanças

### Método 2: Via Netlify CLI

```bash
# Instalar Netlify CLI (se ainda não tiver)
npm install -g netlify-cli

# Login no Netlify
netlify login

# Adicionar variáveis uma por uma
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://seu-projeto.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "sua-chave-publica-aqui"
netlify env:set ANTHROPIC_API_KEY "sk-ant-sua-chave-aqui"
netlify env:set OPENAI_API_KEY "sk-sua-chave-aqui"

# Ou importar todas de uma vez de um arquivo .env
netlify env:import .env.production
```

### Verificar Variáveis Configuradas

```bash
# Listar todas as variáveis
netlify env:list

# Ver valor de uma variável específica (sem mostrar o valor)
netlify env:get NEXT_PUBLIC_SUPABASE_URL
```

---

## 🧪 Testes

As variáveis de ambiente para testes são configuradas **diretamente nos arquivos de teste**.

### Configuração nos Testes

Os testes já estão configurados em `__tests__/lib/env.test.tsx`:

```typescript
// Configurar variáveis ANTES de importar o módulo
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key-123456789'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.NODE_ENV = 'test'
```

**Você não precisa configurar nada manualmente** - os testes usam valores mockados.

---

## 📝 Lista Completa de Variáveis

### Obrigatórias (Para Aplicação Funcionar)

| Variável | Descrição | Onde Obter |
|----------|-----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do seu projeto Supabase | [Supabase Dashboard](https://app.supabase.com) > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública anônima do Supabase | [Supabase Dashboard](https://app.supabase.com) > Settings > API |

### Opcionais (Funcionalidades Específicas)

#### APIs de IA

| Variável | Descrição | Onde Obter |
|----------|-----------|------------|
| `ANTHROPIC_API_KEY` | Chave API do Anthropic (Claude) | [Anthropic Console](https://console.anthropic.com/settings/keys) |
| `OPENAI_API_KEY` | Chave API do OpenAI | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `GOOGLE_AI_API_KEY` | Chave API do Google AI (Gemini) | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `PERPLEXITY_API_KEY` | Chave API do Perplexity | [Perplexity Dashboard](https://www.perplexity.ai/settings/api) |

#### Supabase Avançado

| Variável | Descrição | Onde Obter |
|----------|-----------|------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de service role (server-side) | [Supabase Dashboard](https://app.supabase.com) > Settings > API |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | URL de redirecionamento após autenticação | URL do seu app + `/onboarding` |

#### URLs

| Variável | Descrição | Valor de Exemplo |
|----------|-----------|------------------|
| `NEXT_PUBLIC_APP_URL` | URL da aplicação em produção | `https://seu-app.netlify.app` |

#### Feature Flags

| Variável | Descrição | Valores |
|----------|-----------|---------|
| `NEXT_PUBLIC_ENABLE_AI_FEATURES` | Habilitar recursos de IA | `true` ou `false` (padrão: `true`) |
| `NEXT_PUBLIC_ENABLE_GAMIFICATION` | Habilitar gamificação | `true` ou `false` (padrão: `true`) |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Habilitar analytics | `true` ou `false` (padrão: `false`) |

#### Sentry (Error Tracking)

| Variável | Descrição | Onde Obter |
|----------|-----------|------------|
| `SENTRY_DSN` | DSN do Sentry (server-side) | [Sentry Dashboard](https://sentry.io/settings/seu-projeto/keys) |
| `NEXT_PUBLIC_SENTRY_DSN` | DSN público do Sentry (client-side) | [Sentry Dashboard](https://sentry.io/settings/seu-projeto/keys) |

#### Ambiente

| Variável | Descrição | Valores |
|----------|-----------|---------|
| `NODE_ENV` | Ambiente atual | `development`, `production`, `test` |

---

## ✅ Checklist de Configuração

### Desenvolvimento Local

- [ ] Arquivo `.env.local` criado na raiz do projeto
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurado
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurado
- [ ] `npm run dev` funciona sem erros
- [ ] Aplicação carrega corretamente

### Produção (Netlify)

- [ ] Todas as variáveis obrigatórias configuradas no Netlify
- [ ] Variáveis opcionais (APIs de IA) configuradas
- [ ] `NEXT_PUBLIC_APP_URL` aponta para a URL correta
- [ ] `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` configurado
- [ ] Deploy bem-sucedido
- [ ] Aplicação funciona em produção

---

## 🔒 Segurança

### ⚠️ NUNCA Faça:

- ❌ Commitar arquivos `.env.local` ou `.env` no Git
- ❌ Compartilhar valores de API keys publicamente
- ❌ Usar a mesma chave em desenvolvimento e produção
- ❌ Expor `SUPABASE_SERVICE_ROLE_KEY` no client-side

### ✅ SEMPRE Faça:

- ✅ Use `.env.example` como template (sem valores reais)
- ✅ Mantenha `.env.local` no `.gitignore`
- ✅ Revogue chaves comprometidas imediatamente
- ✅ Use variáveis de ambiente do Netlify para produção

---

## 🆘 Troubleshooting

### Variáveis não estão funcionando?

1. **Verifique o nome da variável**
   - Variáveis client-side devem começar com `NEXT_PUBLIC_`
   - Variáveis server-side NÃO devem começar com `NEXT_PUBLIC_`

2. **Reinicie o servidor de desenvolvimento**
   ```bash
   # Parar o servidor (Ctrl+C)
   # Iniciar novamente
   npm run dev
   ```

3. **Verifique se está no arquivo correto**
   - Desenvolvimento: `.env.local`
   - Produção: Netlify Dashboard > Environment variables

4. **Verifique sintaxe**
   - Sem espaços ao redor do `=`
   - Sem aspas desnecessárias (a menos que o valor tenha espaços)

### Exemplo Correto vs Incorreto:

```env
# ✅ CORRETO
NEXT_PUBLIC_SUPABASE_URL=https://abc.supabase.co

# ❌ INCORRETO
NEXT_PUBLIC_SUPABASE_URL = https://abc.supabase.co  # Espaço antes do =
NEXT_PUBLIC_SUPABASE_URL="https://abc.supabase.co"  # Aspas desnecessárias
NEXT_PUBLIC_SUPABASE_URL = "https://abc.supabase.co"  # Ambos os erros
```

---

## 📚 Referências

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Supabase Environment Variables](https://supabase.com/docs/guides/getting-started/local-development#environment-variables)

---

**Última atualização:** $(date)
