# 🚀 Guia de Deploy no Netlify - Nossa Maternidade

> Guia passo a passo para fazer deploy do projeto no Netlify e visualizar visualmente

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter:

- ✅ Conta no Netlify (criar em [netlify.com](https://netlify.com))
- ✅ Repositório no GitHub (já temos: `LionGab/v0-nossa-maternidade-app`)
- ✅ Variáveis de ambiente configuradas (Supabase, APIs de IA)

---

## 🎯 Método 1: Deploy via Netlify UI (Recomendado - Mais Rápido)

### Passo 1: Conectar Repositório

1. Acesse [app.netlify.com](https://app.netlify.com)
2. Faça login com sua conta GitHub
3. Clique em **"Add new site"** → **"Import an existing project"**
4. Escolha **"Deploy with GitHub"**
5. Autorize o Netlify a acessar seus repositórios
6. Selecione o repositório: `LionGab/v0-nossa-maternidade-app`
7. Selecione a branch: `main`

### Passo 2: Configurar Build Settings

Configure estas opções:

```
Build command: npm run build
Publish directory: .next
```

⚠️ **Nota:** Netlify automaticamente detecta Next.js e pode usar as configurações padrão.

### Passo 3: Configurar Variáveis de Ambiente

Clique em **"Show advanced"** → **"New variable"** e adicione:

#### Variáveis Obrigatórias

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica

# APIs de IA
ANTHROPIC_API_KEY=sua-chave-anthropic
OPENAI_API_KEY=sua-chave-openai
GEMINI_API_KEY=sua-chave-gemini (opcional)
PERPLEXITY_API_KEY=sua-chave-perplexity (opcional)

# URLs
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://seu-app.netlify.app/onboarding
```

### Passo 4: Deploy

1. Clique em **"Deploy site"**
2. Aguarde o build completar (geralmente 2-5 minutos)
3. Você verá o link: `https://seu-app-aleatorio.netlify.app`

### Passo 5: Personalizar Domínio

1. Vá em **"Site settings"** → **"Domain management"**
2. Clique em **"Add custom domain"**
3. Digite o domínio desejado (ex: `nossa-maternidade.netlify.app`)
4. Siga as instruções para configurar DNS (se usar domínio próprio)

---

## 🛠️ Método 2: Deploy via CLI (Avançado)

### Passo 1: Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

### Passo 2: Login no Netlify

```bash
netlify login
```

Isso abrirá seu navegador para autenticação.

### Passo 3: Inicializar Projeto

```bash
netlify init
```

Siga as instruções:
- Escolha **"Create & configure a new site"**
- Escolha seu time/organização
- Nome do site (ou deixe vazio para nome aleatório)
- Branch para deploys: `main`

### Passo 4: Configurar Variáveis de Ambiente

```bash
# Adicionar variáveis uma por uma
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://seu-projeto.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "sua-chave-publica"
netlify env:set ANTHROPIC_API_KEY "sua-chave-anthropic"
netlify env:set OPENAI_API_KEY "sua-chave-openai"

# Ou adicionar todas de uma vez
netlify env:import .env.local
```

### Passo 5: Fazer Deploy

```bash
# Build e deploy
netlify deploy --prod

# Ou apenas build local (para testar)
netlify build
netlify deploy
```

---

## ⚙️ Configuração Adicional

### Arquivo `netlify.toml`

O arquivo `netlify.toml` já foi criado na raiz do projeto com as configurações necessárias.

### Configurações Importantes

- **Node Version:** 20 (definido em `netlify.toml`)
- **Build Command:** `npm run build`
- **Publish Directory:** `.next`

### Variáveis de Ambiente Específicas

Se você precisa de diferentes variáveis para produção vs desenvolvimento:

```bash
# Variáveis de produção
netlify env:set --context production NEXT_PUBLIC_SUPABASE_URL "..."

# Variáveis de preview/deploy
netlify env:set --context deploy-preview NEXT_PUBLIC_SUPABASE_URL "..."
```

---

## 🔍 Verificando o Deploy

### 1. Build Logs

No painel do Netlify:
- Vá em **"Deploys"** → clique no deploy
- Veja os **"Deploy logs"** para verificar erros

### 2. Site Functions

Verifique se as rotas de API estão funcionando:
- `https://seu-app.netlify.app/api/gamification/stats`
- `https://seu-app.netlify.app/api/multi-ai/chat`

### 3. Testar Funcionalidades

1. Acesse o site
2. Teste login/cadastro
3. Teste chat com IA
4. Verifique dashboard

---

## 🐛 Troubleshooting

### Erro: "Build failed"

**Causa:** Dependências ou variáveis de ambiente faltando

**Solução:**
```bash
# Verificar logs do build no Netlify
# Adicionar todas as variáveis de ambiente necessárias
```

### Erro: "Module not found"

**Causa:** Dependências não instaladas

**Solução:**
Adicione ao `netlify.toml`:
```toml
[build]
  command = "npm install && npm run build"
```

### Erro: "API routes not working"

**Causa:** Netlify precisa do plugin Next.js

**Solução:**
O plugin já está configurado em `netlify.toml`. Se não funcionar:
1. Vá em **"Site settings"** → **"Plugins"**
2. Instale **"@netlify/plugin-nextjs"**

### Erro: "Environment variables not found"

**Causa:** Variáveis não configuradas

**Solução:**
1. Vá em **"Site settings"** → **"Environment variables"**
2. Adicione todas as variáveis necessárias
3. Faça novo deploy

---

## 📊 Monitoramento

### Analytics (Opcional)

1. Vá em **"Site settings"** → **"Analytics"**
2. Ative **"Netlify Analytics"** (plano pago)
3. Ou use **Google Analytics** (gratuito)

### Logs em Tempo Real

```bash
# Ver logs em tempo real
netlify logs:watch

# Ver logs de funções
netlify functions:list
netlify functions:invoke function-name
```

---

## 🚀 Deploy Contínuo (CI/CD)

O Netlify automaticamente faz deploy toda vez que você faz push para a branch `main`.

### Configurar Branch

1. Vá em **"Site settings"** → **"Build & deploy"**
2. Configure **"Production branch"** para `main`
3. Configure **"Deploy contexts"** se necessário

### Deploy Previews

Toda vez que você abre um Pull Request, o Netlify cria um **deploy preview** automaticamente:

- Link único para cada PR
- Teste isolado antes de merge
- Deploy automático ao fazer merge

---

## ✅ Checklist de Deploy

Antes de fazer deploy, verifique:

- [ ] Repositório conectado ao Netlify
- [ ] Variáveis de ambiente configuradas
- [ ] Build funcionando localmente (`npm run build`)
- [ ] `netlify.toml` configurado
- [ ] Testes passando (`npm test`)
- [ ] Domínio personalizado configurado (opcional)

---

## 🎉 Próximos Passos Após Deploy

1. **Testar Funcionalidades**
   - Login/Cadastro
   - Chat com IA
   - Dashboard
   - Gamificação

2. **Configurar Domínio Personalizado**
   - Adicionar domínio próprio
   - Configurar SSL (automático no Netlify)

3. **Monitorar Performance**
   - Verificar analytics
   - Monitorar logs
   - Verificar uptime

4. **Otimizar**
   - Ativar CDN
   - Configurar cache
   - Otimizar imagens

---

## 📚 Recursos Adicionais

- [Documentação Netlify](https://docs.netlify.com)
- [Next.js no Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Guia de Troubleshooting](TROUBLESHOOTING.md)

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs de deploy no Netlify
2. Consulte [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. Verifique se todas as variáveis de ambiente estão configuradas
4. Teste build local: `npm run build`

---

**Última atualização:** 2025-11-01

**Status:** ✅ Pronto para deploy no Netlify
