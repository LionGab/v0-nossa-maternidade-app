# 🚀 GUIA COMPLETO DE DEPLOY NO NETLIFY

**Projeto:** Nossa Maternidade PWA
**Status:** ✅ Pronto para deploy
**Última verificação:** 2025-11-03

---

## 📋 PRÉ-REQUISITOS

### ✅ Verificações Concluídas
- [x] Build funciona localmente (`npm run build`)
- [x] netlify.toml configurado
- [x] .env.example criado
- [x] Imagens otimizadas
- [x] Código commitado no GitHub
- [x] 0 erros TypeScript

### ⚠️ IMPORTANTE ANTES DE COMEÇAR

**Você TEM as chaves de API atuais?**
- Se sim: Prossiga normalmente
- Se NÃO: Veja seção "Gerar Novas Chaves de API"

---

## 🎯 MÉTODO 1: DEPLOY VIA INTERFACE WEB (RECOMENDADO - 10 min)

### Passo 1: Criar conta no Netlify

1. Acesse: https://app.netlify.com/signup
2. Escolha "Sign up with GitHub"
3. Autorize o Netlify a acessar seus repositórios

### Passo 2: Importar projeto do GitHub

1. No dashboard Netlify, clique **"Add new site"** → **"Import an existing project"**
2. Escolha **"Deploy with GitHub"**
3. Autorize o Netlify (se pedido)
4. Busque e selecione: **`LionGab/v0-nossa-maternidade-app`**

### Passo 3: Configurar build settings

**Configurações que o Netlify detectará automaticamente:**

```
Base directory:      (deixe em branco)
Build command:       npm install --legacy-peer-deps && npm run build
Publish directory:   .next
```

**Se não detectar, configure manualmente:**

- **Branch to deploy:** `claude/audit-pwa-app-011CUkeqiytGAY9hJnwJXV93` (ou `main` após merge)
- **Build command:** `npm install --legacy-peer-deps && npm run build`
- **Publish directory:** `.next`

### Passo 4: Configurar variáveis de ambiente

**ANTES de clicar "Deploy site", configure as variáveis:**

1. Clique em **"Show advanced"**
2. Clique em **"New variable"**
3. Adicione TODAS as variáveis abaixo:

#### 🔐 Variáveis Obrigatórias (COPIE DO SEU .env ATUAL)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkry.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-api03-...

# OpenAI (GPT-4)
OPENAI_API_KEY=sk-proj-...

# Google AI (Gemini)
GOOGLE_AI_API_KEY=AIzaSyC9...

# Perplexity
PERPLEXITY_API_KEY=pplx-...
```

#### ⚙️ Variáveis de Configuração

```bash
# URLs
NEXT_PUBLIC_PROD_SUPABASE_REDIRECT_URL=https://SEU-SITE.netlify.app/onboarding
NEXT_PUBLIC_APP_URL=https://SEU-SITE.netlify.app

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_GAMIFICATION=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# Node
NODE_ENV=production
```

**⚠️ IMPORTANTE:**
- Substitua `SEU-SITE` pelo nome que você escolher no Netlify
- Ou use o domínio temporário que o Netlify gera (você pode atualizar depois)

### Passo 5: Deploy!

1. Clique **"Deploy [nome-do-site]"**
2. Aguarde o build (~3-5 minutos)
3. 🎉 Site no ar!

### Passo 6: Configurar domínio personalizado (Opcional)

Se quiser `nossamaternidade.netlify.app`:

1. No dashboard do site → **Site settings** → **Domain management**
2. **Change site name**
3. Digite: `nossamaternidade` (ou outro nome disponível)
4. Salve

---

## 🎯 MÉTODO 2: DEPLOY VIA NETLIFY CLI (AVANÇADO - 5 min)

### Passo 1: Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

### Passo 2: Login

```bash
netlify login
```

Isso abrirá o navegador para autenticar.

### Passo 3: Inicializar projeto

```bash
# Na raiz do projeto
netlify init
```

Escolha:
- `Create & configure a new site`
- Team: Seu time pessoal
- Site name: `nossamaternidade` (ou outro)
- Build command: `npm install --legacy-peer-deps && npm run build`
- Publish directory: `.next`

### Passo 4: Configurar variáveis de ambiente

**Opção A: Via CLI (uma por vez)**
```bash
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://bbcwitnbnosyfpfjtzkry.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGci..."
netlify env:set SUPABASE_SERVICE_ROLE_KEY "eyJhbGci..."
netlify env:set ANTHROPIC_API_KEY "sk-ant-..."
netlify env:set OPENAI_API_KEY "sk-proj-..."
netlify env:set GOOGLE_AI_API_KEY "AIzaSyC..."
netlify env:set PERPLEXITY_API_KEY "pplx-..."
netlify env:set NEXT_PUBLIC_ENABLE_AI_FEATURES "true"
netlify env:set NEXT_PUBLIC_ENABLE_GAMIFICATION "true"
netlify env:set NEXT_PUBLIC_ENABLE_ANALYTICS "false"
netlify env:set NODE_ENV "production"
```

**Opção B: Via arquivo (mais rápido)**
```bash
# Cria arquivo temporário com todas as vars
cat > netlify-env.txt << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkry.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-proj-...
GOOGLE_AI_API_KEY=AIzaSyC...
PERPLEXITY_API_KEY=pplx-...
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_GAMIFICATION=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NODE_ENV=production
EOF

# Importa todas de uma vez
netlify env:import netlify-env.txt

# IMPORTANTE: Deletar o arquivo depois!
rm netlify-env.txt
```

### Passo 5: Deploy

```bash
# Deploy de produção
netlify deploy --prod
```

Confirme:
- Publish directory: `.next` (ou tecle Enter se já estiver correto)

Aguarde ~3-5 minutos. Pronto! 🎉

---

## 🎯 MÉTODO 3: DEPLOY AUTOMÁTICO VIA GIT (MELHOR A LONGO PRAZO)

### Como Funciona

1. Conecte repositório GitHub ao Netlify (Método 1)
2. Configure variáveis de ambiente
3. **Cada push para branch principal = deploy automático**

### Configurar Branch de Deploy

No Netlify dashboard:

1. **Site settings** → **Build & deploy** → **Continuous Deployment**
2. **Branch deploys:** Escolha branch principal
3. Configure **Deploy contexts:**
   - **Production branch:** `main` (após fazer merge do seu branch atual)
   - **Deploy Preview:** Todos os outros branches/PRs

### Deploy Preview Automático

**Vantagem:** Toda Pull Request gera um preview deploy!

```bash
# Exemplo de workflow:
git checkout -b feature/nova-funcionalidade
git add .
git commit -m "feat: nova funcionalidade"
git push origin feature/nova-funcionalidade

# Netlify automaticamente cria:
# - Preview deploy: https://deploy-preview-123--nossamaternidade.netlify.app
# - Comentário no PR do GitHub com link
```

---

## 🔐 GERAR NOVAS CHAVES DE API (Se necessário)

### Se você precisa revogar e gerar novas chaves:

#### 1. Supabase
```
1. Acesse: https://app.supabase.com/project/bbcwitnbnosyfpfjtzkry/settings/api
2. Role até "Project API keys"
3. Clique em "Reset" em cada chave
4. Copie as novas chaves
```

#### 2. Anthropic (Claude)
```
1. Acesse: https://console.anthropic.com/settings/keys
2. Clique "Create Key"
3. Nomeie: "Nossa Maternidade Production"
4. Copie a chave (aparece uma vez só!)
```

#### 3. OpenAI
```
1. Acesse: https://platform.openai.com/api-keys
2. Clique "Create new secret key"
3. Nomeie: "Nossa Maternidade Prod"
4. Copie a chave
```

#### 4. Google AI (Gemini)
```
1. Acesse: https://aistudio.google.com/app/apikey
2. Clique "Create API Key"
3. Copie a chave
```

#### 5. Perplexity
```
1. Acesse: https://www.perplexity.ai/settings/api
2. Gere nova chave
3. Copie
```

**Atualize no Netlify:**
```bash
# Via CLI
netlify env:set ANTHROPIC_API_KEY "nova-chave-aqui"

# Ou via interface:
Site settings → Environment variables → Edit variables
```

---

## ✅ VERIFICAÇÕES PÓS-DEPLOY

### 1. Site está no ar? (2 min)

Acesse seu domínio Netlify (ex: `https://nossamaternidade.netlify.app`)

**Checklist:**
- [ ] Página inicial carrega
- [ ] Logo aparece
- [ ] Botões "Começar Jornada" e "Já Sou Membro" funcionam

### 2. PWA funciona? (3 min)

**No Chrome (Desktop):**
- [ ] Abra DevTools (F12) → Application → Manifest
- [ ] Verifica se manifest carrega sem erros
- [ ] Application → Service Workers
- [ ] Verifica se Service Worker registrou

**No Chrome (Mobile ou DevTools mobile):**
- [ ] Deve aparecer botão "Instalar" ou ícone de +
- [ ] Tente instalar o PWA
- [ ] Verifica se ícone correto aparece na home screen

### 3. APIs funcionando? (5 min)

**Teste o chat:**
- [ ] Acesse `/chat`
- [ ] Digite uma mensagem de teste: "Olá, como você pode me ajudar?"
- [ ] IA deve responder (pode demorar 5-10s na primeira vez)

**Teste o Supabase:**
- [ ] Tente fazer signup em `/signup`
- [ ] Verifica se recebe email de confirmação (se configurado)
- [ ] Ou verifica se redireciona para onboarding

### 4. Imagens otimizadas carregando? (1 min)

- [ ] Ícones da PWA aparecem corretos
- [ ] Logo carrega rápido
- [ ] Sem imagens quebradas

### 5. Performance (2 min)

**Lighthouse:**
```
1. Abra site em modo anônimo (Ctrl+Shift+N)
2. F12 → Lighthouse
3. Categories: Performance, PWA, Best Practices, SEO
4. Device: Mobile
5. Click "Analyze page load"
```

**Metas:**
- [ ] Performance: > 80
- [ ] PWA: > 90
- [ ] Best Practices: > 90
- [ ] SEO: > 80

---

## 🐛 TROUBLESHOOTING

### ❌ Build falhou

**Erro comum: "npm install failed"**

**Solução:**
```
1. Netlify dashboard → Site settings → Build & deploy
2. Build command: Verificar se é exatamente:
   npm install --legacy-peer-deps && npm run build
3. Node version: Verificar se é 20
   Build settings → Build environment → NODE_VERSION = 20
```

**Erro: "Module not found"**

**Solução:**
```bash
# Localmente, teste se build funciona:
rm -rf node_modules .next
npm install --legacy-peer-deps
npm run build

# Se funcionar local, limpe cache do Netlify:
Netlify dashboard → Deploys → Trigger deploy → Clear cache and deploy
```

### ❌ Site carrega mas tudo branco

**Problema:** Variáveis de ambiente faltando

**Solução:**
```
1. Site settings → Environment variables
2. Conferir se TODAS as variáveis estão lá
3. Especialmente NEXT_PUBLIC_* (precisam do prefixo!)
4. Redeploy: Deploys → Trigger deploy
```

### ❌ APIs não funcionam (chat sem resposta)

**Problema 1:** Chaves de API inválidas

**Solução:**
```bash
# Teste as chaves localmente:
# No .env local, use as MESMAS chaves do Netlify
npm run dev
# Testa chat em localhost:3000/chat
# Se funcionar = chaves OK
# Se não = chaves inválidas, gere novas
```

**Problema 2:** CORS ou redirect URLs

**Solução para Supabase:**
```
1. Supabase dashboard → Authentication → URL Configuration
2. Site URL: https://nossamaternidade.netlify.app
3. Redirect URLs: Adicione:
   - https://nossamaternidade.netlify.app/onboarding
   - https://nossamaternidade.netlify.app/auth/callback
```

### ❌ Service Worker não registra

**Problema:** Headers não configurados

**Solução:**
```
Verifica se netlify.toml está na raiz (deve estar)
Se estiver, force redeploy:
Deploys → Trigger deploy → Deploy site
```

### ❌ Lighthouse PWA score baixo

**Checklist:**
- [ ] manifest.json acessível em /manifest.json
- [ ] Service Worker registrado (DevTools → Application → Service Workers)
- [ ] Ícones 192x192 e 512x512 existem e carregam
- [ ] HTTPS ativo (Netlify faz automaticamente)

---

## 🚀 OTIMIZAÇÕES PÓS-DEPLOY

### 1. Ativar Analytics (Opcional, mas recomendado)

**Netlify Analytics:**
```
1. Site overview → Analytics tab
2. Enable Analytics ($9/mês, mas tem 30 dias grátis)
```

**Vercel Analytics (Grátis):**
```typescript
// Já está no package.json, só ativar:
// 1. Criar conta Vercel (https://vercel.com)
// 2. Conectar projeto
// 3. Vai funcionar automaticamente (lib já instalada)
```

### 2. Configurar domínio customizado (Opcional)

Se você tem um domínio (ex: `nossamaternidade.com.br`):

```
1. Site settings → Domain management
2. Add custom domain
3. Digite seu domínio
4. Netlify vai te dar instruções de DNS
5. Configure no seu provedor de domínio
6. Aguarde propagação (até 48h)
```

### 3. Adicionar HTTPS forçado (Automático no Netlify!)

Netlify já força HTTPS automaticamente. Verifique:
```
Site settings → Domain management → HTTPS
Deve estar: "✓ HTTPS enabled"
```

### 4. Configurar redirects para WWW (Se aplicável)

Se quiser redirecionar www para não-www:

```toml
# Adicione no netlify.toml:
[[redirects]]
  from = "https://www.nossamaternidade.com.br/*"
  to = "https://nossamaternidade.com.br/:splat"
  status = 301
  force = true
```

### 5. Deploy hooks (Webhooks)

Para rebuilds automáticos:

```
1. Site settings → Build & deploy → Build hooks
2. Add build hook
3. Nome: "Rebuild production"
4. Branch: main
5. Copia URL do webhook

# Usar para:
# - Rebuild diário (cron job)
# - Rebuild quando CMS atualiza conteúdo
# - Rebuild quando Supabase muda dados
```

---

## 📊 MONITORAMENTO

### Logs em tempo real

```
# Via CLI:
netlify watch

# Ou via dashboard:
Deploys → [último deploy] → Deploy log
```

### Funções serverless (APIs)

```
# Ver logs das APIs:
Functions → [nome da função] → Function log

# Ou via CLI:
netlify functions:list
netlify functions:invoke chat-with-memory
```

### Alertas de downtime

Netlify notifica automaticamente se site cair.

**Configurar alertas adicionais:**
```
1. Site settings → Notifications
2. Add notification → Deploy succeeded/failed
3. Escolha: Email, Slack, etc
```

---

## 💰 CUSTOS ESTIMADOS

### Tier Gratuito do Netlify

**Inclui:**
- ✅ 100GB bandwidth/mês
- ✅ 300 minutos de build/mês
- ✅ Deploys ilimitados
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Deploy previews

**Suficiente para:**
- MVP com até ~500 usuários ativos/mês
- Teste com influenciadora ✅
- Validação do produto ✅

### Quando precisar escalar → Netlify Pro ($19/mês)

**Benefícios:**
- 400GB bandwidth
- 1000 minutos de build
- Analytics incluído
- Background functions
- Password protection (útil!)

---

## 📝 CHECKLIST FINAL

### Antes do Deploy
- [x] Build local funciona (`npm run build`)
- [x] Todas variáveis de ambiente listadas
- [x] Repositório GitHub sincronizado
- [x] netlify.toml configurado
- [x] Branch correto escolhido

### Durante Deploy
- [ ] Variáveis de ambiente configuradas no Netlify
- [ ] Build command: `npm install --legacy-peer-deps && npm run build`
- [ ] Publish directory: `.next`
- [ ] Node version: 20

### Após Deploy
- [ ] Site carrega (/)
- [ ] PWA manifest acessível (/manifest.json)
- [ ] Service Worker registrado
- [ ] Chat IA funciona (/chat)
- [ ] Signup/Login funciona
- [ ] Lighthouse PWA > 90
- [ ] Lighthouse Performance > 80

---

## 🎉 PRÓXIMOS PASSOS

### Após deploy bem-sucedido:

1. **Teste com dispositivos reais:**
   - iPhone (Safari)
   - Android (Chrome)
   - Teste instalação PWA

2. **Compartilhe com influenciadora:**
   - Envie link: `https://nossamaternidade.netlify.app`
   - Peça feedback
   - Monitore erros (se tiver error tracking)

3. **Implemente melhorias do ROADMAP:**
   - SEO (5h, ROI alto)
   - Error tracking (2h)
   - Analytics (3h)

4. **Monitore métricas:**
   - Netlify Analytics (se ativou)
   - Lighthouse scores semanais
   - Feedback de usuários

---

## 📞 SUPORTE

### Problemas com deploy?

**Netlify Community:**
- https://answers.netlify.com

**Documentação oficial:**
- https://docs.netlify.com/frameworks/next-js/overview/

**Logs detalhados:**
```bash
# CLI para debug:
netlify dev      # Roda localmente simulando Netlify
netlify watch    # Monitora deploys em tempo real
netlify status   # Status do site
```

---

## 🎯 RESUMO EXECUTIVO

### Deploy em 3 passos:

1. **Conecte GitHub ao Netlify** (2 min)
2. **Configure variáveis de ambiente** (5 min)
3. **Deploy!** (3-5 min aguardando build)

**Tempo total: ~10 minutos**

### URLs importantes:

- **Dashboard Netlify:** https://app.netlify.com
- **Seu site:** https://[nome-escolhido].netlify.app
- **Docs Netlify + Next.js:** https://docs.netlify.com/frameworks/next-js

---

**Pronto para fazer deploy? Escolha um método e vamos lá!** 🚀

Se tiver alguma dúvida ou problema durante o processo, me avise que ajudo a resolver! 💪
