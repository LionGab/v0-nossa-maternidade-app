# 🚨 FIX URGENTE: Signup Não Funciona

## Problema
O signup está falhando com erro `Failed to fetch` porque está usando a URL **antiga** do Supabase:
- ❌ URL antiga: `bbcwitnbnosyfpjtzkr.supabase.co` (não resolve)
- ✅ URL correta: `mnszbkeuerjcevjvdqme.supabase.co`

## Causa
As variáveis de ambiente no **Netlify** ainda estão configuradas com valores antigos.

## Solução

### 1. Atualizar Variáveis no Netlify Dashboard

1. Acesse: https://app.netlify.com/sites/nossamaternidade/settings/deploys#environment-variables

2. Atualize ou adicione estas variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=https://mnszbkeuerjcevjvdqme.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTY3ODEsImV4cCI6MjA3NzQ5Mjc4MX0.f2jPp6KLzzrJPTt63FKNyDanh_0uw9rJ1-gbSvQFueo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTkxNjc4MSwiZXhwIjoyMDc3NDkyNzgxfQ.zOb5c5HhJhOF3-tWAkfo9HxKoUpA2JbsKFS939IPnd4
```

### 2. Após Atualizar

1. Vá em **Deploys** → **Trigger deploy** → **Clear cache and deploy site**
2. Ou faça um novo commit e push para forçar redeploy

### 3. Verificar

Após o redeploy, teste o signup novamente. O erro `Failed to fetch` deve desaparecer.

## Erro Atual

```
TypeError: Failed to fetch
at signUp (AppEntry-80f466486c0…34d088c.js:641:6181)
```

Requisição falhando para:
- ❌ `bbcwitnbnosyfpjtzkr.supabase.co/auth/v1/signup`
- ✅ Deveria usar: `mnszbkeuerjcevjvdqme.supabase.co/auth/v1/signup`

## Arquivos Já Corrigidos

- ✅ `# =================================.txt` - Atualizado com URL correta
- ✅ Código fonte usa variáveis de ambiente corretamente
- ❌ **Netlify Dashboard** - Precisa atualizar variáveis de ambiente

## Comando Rápido (se usar Netlify CLI)

```bash
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://mnszbkeuerjcevjvdqme.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTY3ODEsImV4cCI6MjA3NzQ5Mjc4MX0.f2jPp6KLzzrJPTt63FKNyDanh_0uw9rJ1-gbSvQFueo"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTkxNjc4MSwiZXhwIjoyMDc3NDkyNzgxfQ.zOb5c5HhJhOF3-tWAkfo9HxKoUpA2JbsKFS939IPnd4"
```

## ⚠️ IMPORTANTE

Após atualizar as variáveis no Netlify, é necessário fazer um **novo deploy** para que as mudanças tenham efeito!
