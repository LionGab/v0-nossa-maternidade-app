# 🚀 Guia de Deploy no Netlify - Nossa Maternidade App

Este guia detalha o processo completo de deploy da aplicação no Netlify.

## 📋 Pré-requisitos

Antes de iniciar o deploy, certifique-se de ter:

1. ✅ Conta no [Netlify](https://www.netlify.com/)
2. ✅ Projeto Supabase configurado
3. ✅ Chaves de API da Anthropic e OpenAI
4. ✅ Repositório Git com o código

## 🔧 Configuração Inicial

### 1. Preparar o Projeto Supabase

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Crie um novo projeto ou use um existente
3. Anote as seguintes credenciais (Settings > API):
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon/public key` (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - `service_role key` (SUPABASE_SERVICE_ROLE_KEY)

### 2. Executar Scripts SQL

No Supabase Dashboard > SQL Editor, execute os scripts na seguinte ordem:

```sql
-- 1. Criar tabelas básicas
scripts/001_create_tables.sql

-- 2. Criar trigger de perfil
scripts/002_create_profile_trigger.sql

-- 3. Adicionar tabelas avançadas
scripts/003_add_advanced_tables.sql

-- 4. Habilitar extensão vector
scripts/004_enable_vector_extension.sql

-- 5. Sistema de gamificação
scripts/005_gamification_system.sql

-- 6. Habilitar Row Level Security
scripts/013_enable_rls_security.sql

-- 7. Adicionar indexes de performance
scripts/014_add_performance_indexes.sql

-- 8. Corrigir trigger handle_new_user (se existir)
scripts/fix_handle_new_user.sql
```

### 3. Obter Chaves de API de IA

#### Anthropic (Claude)
1. Acesse [console.anthropic.com](https://console.anthropic.com/)
2. Crie uma API key
3. Anote a chave (ANTHROPIC_API_KEY)

#### OpenAI (GPT-4)
1. Acesse [platform.openai.com](https://platform.openai.com/)
2. Vá em API Keys e crie uma nova
3. Anote a chave (OPENAI_API_KEY)

## 🌐 Deploy no Netlify

### Opção 1: Via Dashboard (Recomendado)

1. **Conectar Repositório**
   - Acesse [app.netlify.com](https://app.netlify.com/)
   - Clique em "Add new site" > "Import an existing project"
   - Conecte com GitHub e selecione o repositório

2. **Configurar Build Settings**
   - Build command: `corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile && pnpm run build`
   - Publish directory: `.next`
   - O `netlify.toml` já está configurado e será usado automaticamente

3. **Configurar Environment Variables**
   
   Vá em Site settings > Environment variables e adicione:

   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
   SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role

   # AI APIs
   ANTHROPIC_API_KEY=sua-chave-anthropic
   OPENAI_API_KEY=sua-chave-openai

   # URLs
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://seu-site.netlify.app/onboarding
   ```

4. **Deploy**
   - Clique em "Deploy site"
   - Aguarde o build completar (~2-3 minutos)

### Opção 2: Via Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Inicializar projeto
netlify init

# Configurar variáveis de ambiente
netlify env:set NEXT_PUBLIC_SUPABASE_URL "seu-valor"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "seu-valor"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "seu-valor"
netlify env:set ANTHROPIC_API_KEY "seu-valor"
netlify env:set OPENAI_API_KEY "seu-valor"
netlify env:set NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL "https://seu-site.netlify.app/onboarding"

# Deploy
netlify deploy --prod
```

## ✅ Verificação Pós-Deploy

Após o deploy, verifique:

1. **Site Acessível**
   - Abra a URL do Netlify
   - Verifique se a página inicial carrega

2. **Autenticação**
   - Tente criar uma conta em `/signup`
   - Verifique se o email de confirmação é enviado
   - Complete o login

3. **Onboarding**
   - Complete o processo de onboarding
   - Verifique se os dados são salvos no Supabase

4. **Dashboard**
   - Acesse o dashboard
   - Verifique se as funcionalidades básicas funcionam

5. **Logs de Erro**
   - Vá em Netlify > Functions > Logs
   - Verifique se há erros

## 🔍 Troubleshooting

### Build Falha

**Erro: "pnpm: command not found"**
- Solução: Certifique-se de que o `netlify.toml` está configurado corretamente

**Erro: "Supabase credentials not configured"**
- Solução: Verifique se todas as variáveis de ambiente estão configuradas

**Erro: "Failed to fetch Google Fonts"**
- Solução: Já corrigido - usamos fontes do sistema agora

### Runtime Errors

**Erro 401 em APIs**
- Causa: Usuário não autenticado
- Solução: Verifique se o middleware está funcionando

**Erro: "Profile not found"**
- Causa: Trigger do Supabase não executou
- Solução: Execute `scripts/fix_handle_new_user.sql`

**Função não responde**
- Causa: Timeout ou erro na função
- Solução: Verifique logs no Netlify Functions

## 🔒 Segurança

### Checklist de Segurança

- [ ] Row Level Security habilitado no Supabase
- [ ] Service Role Key armazenada como variável de ambiente
- [ ] CORS configurado corretamente no Supabase
- [ ] Rate limiting implementado nas APIs críticas
- [ ] Validação de dados implementada

### Configurar CORS no Supabase

1. Vá em Supabase Dashboard > Authentication > URL Configuration
2. Adicione sua URL do Netlify em "Site URL"
3. Adicione `https://seu-site.netlify.app/**` em "Redirect URLs"

## 📊 Monitoramento

### Métricas a Acompanhar

1. **Build Time**
   - Meta: < 3 minutos
   - Local: Netlify > Deploys

2. **Function Invocations**
   - Local: Netlify > Functions

3. **Error Rate**
   - Local: Netlify > Functions > Logs

4. **Database Performance**
   - Local: Supabase > Database > Logs

## 🔄 CI/CD Automático

O deploy automático já está configurado:

- ✅ Push para `main` → Deploy em produção
- ✅ Pull Request → Deploy de preview
- ✅ Outras branches → Branch deploys

## 📝 Próximos Passos

Após o deploy bem-sucedido:

1. [ ] Configurar domínio customizado
2. [ ] Configurar SSL (automático no Netlify)
3. [ ] Configurar analytics
4. [ ] Configurar error tracking (Sentry)
5. [ ] Configurar monitoring
6. [ ] Fazer backup do banco de dados

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs no Netlify
2. Verifique os logs no Supabase
3. Consulte [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
4. Abra uma issue no GitHub

---

**Última atualização:** 02/11/2024
