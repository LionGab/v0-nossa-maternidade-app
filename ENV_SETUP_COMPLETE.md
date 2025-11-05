# 🔐 Configuração Completa de Variáveis de Ambiente

## ✅ Variáveis Configuradas

### Supabase (CRÍTICO)
```env
NEXT_PUBLIC_SUPABASE_URL=https://mnszbkeuerjcevjvdqme.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTY3ODEsImV4cCI6MjA3NzQ5Mjc4MX0.f2jPp6KLzzrJPTt63FKNyDanh_0uw9rJ1-gbSvQFueo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTkxNjc4MSwiZXhwIjoyMDc3NDkyNzgxfQ.zOb5c5HhJhOF3-tWAkfo9HxKoUpA2JbsKFS939IPnd4
```

### APIs de IA (Todas Configuradas)
```env
GOOGLE_AI_API_KEY=AIzaSyC9YVWRmnGyGu4c9y7g-mNkkipDqb5JBZg
ANTHROPIC_API_KEY=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
OPENAI_API_KEY=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
PERPLEXITY_API_KEY=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
```

### URLs da Aplicação
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/onboarding
```

### Feature Flags
```env
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_GAMIFICATION=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### Ambiente
```env
NODE_ENV=development
```

## 📝 Instruções de Configuração

### 1. Criar arquivo .env.local

Crie o arquivo `.env.local` na raiz do projeto com o conteúdo acima.

**⚠️ IMPORTANTE:**
- O arquivo `.env.local` já está no `.gitignore`
- **NUNCA** commite este arquivo no Git
- Use `EXPO_PUBLIC_` para projetos Expo/React Native
- Use `NEXT_PUBLIC_` para projetos Next.js (este projeto)

### 2. Verificar Configuração

Execute o script de validação:
```bash
npm run validate:env
```

### 3. Reiniciar Servidor

Após configurar as variáveis:
```bash
npm run dev
```

## ✅ Checklist de Validação

- [ ] Arquivo `.env.local` criado
- [ ] Todas as variáveis Supabase configuradas
- [ ] Todas as APIs de IA configuradas
- [ ] URLs da aplicação configuradas
- [ ] Servidor reiniciado
- [ ] Teste de conexão Supabase passou
- [ ] Teste de APIs de IA passou

## 🧪 Testar Configuração

### Teste 1: Supabase
```bash
node scripts/test-supabase-connection.mjs
```

### Teste 2: APIs de IA
```bash
npm run test:api-keys
```

### Teste 3: Aplicação Completa
```bash
npm run dev
# Acesse: http://localhost:3000
```

## 🚨 Troubleshooting

### Erro: "Missing Supabase environment variables"
**Solução:** Verifique se o arquivo `.env.local` existe e contém `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Erro: "API key not configured"
**Solução:** Verifique se a chave da API está correta no `.env.local`

### Erro: "Failed to fetch"
**Solução:** Verifique se a URL do Supabase está correta e acessível

