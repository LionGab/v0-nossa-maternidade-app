# ✅ Checklist de Deploy - Nossa Maternidade

Use este checklist para garantir um deploy bem-sucedido no Netlify.

---

## 📋 Pré-Deploy

### Supabase
- [ ] Projeto criado no Supabase
- [ ] Scripts SQL executados (na ordem correta - veja DEPLOY_GUIDE.md)
- [ ] Credenciais anotadas:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] Authentication configurado
- [ ] Redirect URLs configuradas

### APIs de IA
- [ ] Conta Anthropic criada
- [ ] ANTHROPIC_API_KEY anotada
- [ ] Conta OpenAI criada
- [ ] OPENAI_API_KEY anotada

### Netlify
- [ ] Conta criada no Netlify
- [ ] Repositório GitHub conectado

---

## 🚀 Deploy

### 1. Configurar Environment Variables no Netlify

Vá em Site settings > Environment variables e adicione:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
ANTHROPIC_API_KEY=sua-chave-anthropic
OPENAI_API_KEY=sua-chave-openai
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://seu-site.netlify.app/onboarding
```

- [ ] Todas as variáveis configuradas
- [ ] URLs corretas (sem trailing slashes)
- [ ] Chaves corretas (sem espaços extras)

### 2. Verificar Build Settings

- [ ] Build command: `corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile && pnpm run build`
- [ ] Publish directory: `.next`
- [ ] Node version: 20
- [ ] Plugin @netlify/plugin-nextjs instalado

### 3. Fazer Deploy

- [ ] Clicar em "Deploy site"
- [ ] Aguardar build completar (~2-3 minutos)
- [ ] Verificar se build foi bem-sucedido

---

## ✅ Pós-Deploy

### Verificações Básicas

- [ ] Site acessível (abrir URL do Netlify)
- [ ] Página inicial carrega sem erros
- [ ] Console do navegador sem erros críticos

### Testar Autenticação

- [ ] Acessar `/signup`
- [ ] Criar nova conta
- [ ] Verificar email de confirmação (se configurado)
- [ ] Fazer login
- [ ] Verificar redirecionamento correto

### Testar Onboarding

- [ ] Completar processo de onboarding
- [ ] Verificar se dados são salvos
- [ ] Verificar redirecionamento para dashboard

### Testar Dashboard

- [ ] Dashboard carrega
- [ ] Gamification widget funciona
- [ ] Navegação funciona
- [ ] Logout funciona

### Verificar Logs

- [ ] Netlify > Functions > Logs
- [ ] Sem erros críticos
- [ ] APIs respondendo

### Performance

- [ ] Lighthouse score (opcional)
- [ ] Tempo de carregamento aceitável
- [ ] Responsividade em mobile

---

## 🔧 Troubleshooting

### Build Falha

**Erro: "pnpm: command not found"**
- Verificar netlify.toml
- Verificar build command

**Erro: "Missing environment variable"**
- Verificar se todas as vars estão configuradas
- Verificar nomes das variáveis

### Runtime Errors

**401 Unauthorized**
- Verificar credenciais do Supabase
- Verificar middleware

**Profile not found**
- Executar scripts SQL
- Verificar trigger do Supabase

**IA não responde**
- Verificar chaves de API
- Verificar logs de erro

---

## 📊 Métricas de Sucesso

### Build
- ✅ Build time < 3 minutos
- ✅ Zero erros de build
- ✅ Todas as rotas geradas

### Funcionalidade
- ✅ Login/Signup funciona
- ✅ Onboarding funciona
- ✅ Dashboard acessível
- ✅ APIs respondem

### Performance
- ✅ Página inicial < 3s
- ✅ Sem erros no console
- ✅ Responsivo

---

## 🎉 Deploy Completo!

Se todos os itens acima foram verificados, seu deploy está completo!

### Próximos Passos

1. Configurar domínio customizado (opcional)
2. Configurar SSL (automático)
3. Configurar error tracking
4. Monitorar métricas

---

**Data do deploy:** _________

**URL do site:** _________

**Notas:**

_________________________________________

_________________________________________

_________________________________________
