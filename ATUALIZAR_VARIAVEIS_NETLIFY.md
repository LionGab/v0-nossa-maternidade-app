# 🔧 Atualizar Variáveis de Ambiente no Netlify

## Problema
O signup está falhando porque as variáveis de ambiente no Netlify estão usando a URL antiga do Supabase.

## Solução Rápida (Dashboard)

1. **Acesse o Dashboard do Netlify:**
   - https://app.netlify.com/sites/nossamaternidade/settings/deploys#environment-variables

2. **Atualize estas variáveis:**

   ```
   NEXT_PUBLIC_SUPABASE_URL
   = https://mnszbkeuerjcevjvdqme.supabase.co

   NEXT_PUBLIC_SUPABASE_ANON_KEY
   = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTY3ODEsImV4cCI6MjA3NzQ5Mjc4MX0.f2jPp6KLzzrJPTt63FKNyDanh_0uw9rJ1-gbSvQFueo

   SUPABASE_SERVICE_ROLE_KEY
   = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTkxNjc4MSwiZXhwIjoyMDc3NDkyNzgxfQ.zOb5c5HhJhOF3-tWAkfo9HxKoUpA2JbsKFS939IPnd4
   ```

3. **Salve as mudanças**

4. **Faça um novo deploy:**
   - Vá em **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

## Solução via CLI (Recomendado)

### 1. Instalar Netlify CLI

```powershell
npm install netlify-cli -g
```

### 2. Fazer login (primeira vez)

```powershell
netlify login
```

### 3. Linkar o site (primeira vez)

```powershell
netlify link
```

### 4. Atualizar variáveis de ambiente

```powershell
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://mnszbkeuerjcevjvdqme.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTY3ODEsImV4cCI6MjA3NzQ5Mjc4MX0.f2jPp6KLzzrJPTt63FKNyDanh_0uw9rJ1-gbSvQFueo"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTkxNjc4MSwiZXhwIjoyMDc3NDkyNzgxfQ.zOb5c5HhJhOF3-tWAkfo9HxKoUpA2JbsKFS939IPnd4"
```

### 5. Ou usar o script automatizado

```powershell
.\scripts\update-netlify-env.ps1
```

### 6. Fazer deploy

```powershell
netlify deploy --prod
```

## Verificar se funcionou

Após o deploy, teste o signup:
1. Acesse: https://nossamaternidade.netlify.app/signup
2. Preencha o formulário
3. Clique em "Criar conta"
4. Não deve mais aparecer o erro "Failed to fetch"

## ⚠️ IMPORTANTE

- Após atualizar as variáveis, **sempre faça um novo deploy**
- As variáveis de ambiente só são aplicadas no próximo deploy
- Use `--prod` para deploy em produção

## Troubleshooting

### Se o comando `netlify` não for reconhecido:

1. Verifique se está instalado:
   ```powershell
   npm list -g netlify-cli
   ```

2. Se não estiver, instale novamente:
   ```powershell
   npm install netlify-cli -g
   ```

3. Se ainda não funcionar, use npx:
   ```powershell
   npx netlify-cli env:set NEXT_PUBLIC_SUPABASE_URL "https://mnszbkeuerjcevjvdqme.supabase.co"
   ```

### Verificar variáveis atuais:

```powershell
netlify env:list
```
