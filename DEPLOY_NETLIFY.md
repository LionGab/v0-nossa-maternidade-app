# 🚀 Deploy do Nossa Maternidade no Netlify

Este guia fornece instruções passo a passo para fazer o deploy do aplicativo "Nossa Maternidade" no Netlify.

## 📋 Pré-requisitos

Antes de começar, você precisará de:

1. Conta no [Netlify](https://www.netlify.com/)
2. Conta no [Supabase](https://supabase.com/)
3. Chaves de API para IA (opcional, mas recomendado):
   - [Anthropic Claude](https://console.anthropic.com/)
   - [OpenAI](https://platform.openai.com/)
   - [Google Gemini](https://ai.google.dev/)

## 🔧 Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [Supabase](https://supabase.com/)
2. Clique em "New Project"
3. Preencha os dados:
   - **Name**: nossa-maternidade (ou outro nome)
   - **Database Password**: escolha uma senha forte
   - **Region**: escolha o mais próximo do Brasil
4. Aguarde a criação do projeto (leva alguns minutos)

### 2. Obter Credenciais

1. No dashboard do Supabase, vá em **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon/public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY)

⚠️ **ATENÇÃO**: Nunca exponha a service_role key publicamente!

### 3. Executar Scripts SQL

No Supabase Dashboard, vá em **SQL Editor** e execute os scripts na seguinte ordem:

1. `scripts/001_create_tables.sql`
2. `scripts/002_create_profile_trigger.sql`
3. `scripts/003_add_advanced_tables.sql`
4. `scripts/004_enable_vector_extension.sql`
5. `scripts/005_gamification_system.sql`
6. `scripts/013_enable_rls_security.sql`
7. `scripts/014_add_performance_indexes.sql`
8. `scripts/fix_handle_new_user.sql`

### 4. Configurar Autenticação

1. Vá em **Authentication** > **Providers**
2. Habilite **Email**
3. Configure as URLs de redirecionamento:
   - Development: `http://localhost:3000/onboarding`
   - Production: `https://seu-dominio.netlify.app/onboarding`

## 🌐 Deploy no Netlify

### Opção 1: Deploy via Interface Web (Recomendado para Iniciantes)

1. **Conectar Repositório**
   - Acesse [Netlify](https://app.netlify.com/)
   - Clique em "Add new site" > "Import an existing project"
   - Conecte com GitHub
   - Selecione o repositório `v0-nossa-maternidade-app`

2. **Configurar Build**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Base directory**: (deixe vazio)

3. **Configurar Variáveis de Ambiente**
   
   Vá em **Site settings** > **Environment variables** e adicione:

   ```
   # Supabase (obrigatório)
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
   SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
   
   # IA (opcional, mas recomendado)
   ANTHROPIC_API_KEY=sk-ant-sua-chave
   OPENAI_API_KEY=sk-sua-chave
   GOOGLE_GENERATIVE_AI_API_KEY=sua-chave-gemini
   
   # URLs
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://seu-dominio.netlify.app/onboarding
   ```

4. **Deploy**
   - Clique em "Deploy site"
   - Aguarde a conclusão do build (5-10 minutos)
   - Acesse o site via URL fornecida

### Opção 2: Deploy via CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## 🎯 Validação Pós-Deploy

Após o deploy, teste as seguintes funcionalidades:

### ✅ Checklist de Validação

- [ ] Página inicial carrega corretamente
- [ ] Criar conta funciona
- [ ] Login funciona
- [ ] Onboarding salva respostas
- [ ] Dashboard exibe nome do usuário
- [ ] Todas as páginas estão acessíveis:
  - [ ] Mundo Nath
  - [ ] Receitas
  - [ ] Rotina Semanal
  - [ ] Autocuidado
  - [ ] Brincadeiras
  - [ ] Histórias de Sono
  - [ ] Birras
  - [ ] Perfil do Bebê
  - [ ] Chat/NathIA
- [ ] Navegação inferior funciona em mobile
- [ ] Gamificação está ativa
- [ ] Chat com IA responde (se configurado)

## 🐛 Troubleshooting

### Build Falha

**Erro**: "Failed to fetch fonts from Google Fonts"
- **Solução**: O projeto já está configurado para usar fontes via CDN. Se persistir, verifique se a build está usando Node 20+.

**Erro**: "supabaseUrl is required"
- **Solução**: Verifique se as variáveis de ambiente estão configuradas corretamente no Netlify.

### Runtime Errors

**Erro**: "Failed to connect to Supabase"
- **Solução**: Verifique se as URLs de redirecionamento estão configuradas no Supabase.

**Erro**: "IA não responde"
- **Solução**: Verifique se as chaves de API de IA estão configuradas e são válidas.

### Performance

- Habilite o plugin Next.js no Netlify (já configurado em `netlify.toml`)
- Configure CDN para assets estáticos
- Monitore usage de IA APIs para evitar custos excessivos

## 📊 Monitoramento

### Logs

Visualize logs em tempo real:
```bash
netlify logs
```

### Analytics

Ative o Netlify Analytics em **Settings** > **Analytics** para:
- Tráfego
- Performance
- Erros 4xx/5xx

### Custos de IA

Monitore uso das APIs:
- **Anthropic Console**: https://console.anthropic.com/
- **OpenAI Dashboard**: https://platform.openai.com/usage
- **Google AI Studio**: https://ai.google.dev/

## 🔄 Atualizações

Após fazer mudanças no código:

1. Commit e push para GitHub
2. Netlify detecta automaticamente e faz redeploy
3. Aguarde conclusão do build
4. Verifique mudanças no site

## 📞 Suporte

### Recursos Úteis

- [Documentação Netlify](https://docs.netlify.com/)
- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)

### Problemas Comuns

Consulte [NETLIFY_TROUBLESHOOTING.md](./NETLIFY_TROUBLESHOOTING.md) para soluções detalhadas.

## 🎉 Pronto!

Seu aplicativo "Nossa Maternidade" agora está no ar! 🚀

Compartilhe o link com as mães e comece a fazer a diferença! 💝

---

**Desenvolvido com ❤️ para mães de todo o Brasil**
