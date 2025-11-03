# 🚀 INSTRUÇÕES DE DEPLOY - NOSSA MATERNIDADE

**Data:** $(date)
**Status:** ✅ **PRONTO PARA DEPLOY**

---

## 📋 CHECKLIST PRÉ-DEPLOY

### 0. Instalar Sentry (Opcional)

Se usar Sentry, instalar com:
```bash
npm install --save @sentry/nextjs --legacy-peer-deps
```

**Nota:** A flag `--legacy-peer-deps` é necessária devido ao conflito entre `vaul` (requer React 18) e React 19 do projeto. É seguro pois React 19 é compatível.

### 1. Variáveis de Ambiente (Netlify)

Acesse: **Netlify Dashboard → Seu Site → Site settings → Environment variables**

Configure todas as variáveis:

```bash
# Obrigatórias
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Opcionais (mas recomendadas)
SENTRY_DSN=https://...@sentry.io/...
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-proj-...
GOOGLE_AI_API_KEY=AIza...

# Configuração
NEXT_PUBLIC_APP_URL=https://seu-site.netlify.app
NODE_ENV=production
```

### 2. Build Settings (Netlify)

**Build command:**
```bash
npm run build
```

**Publish directory:**
```
.next
```

**Node version:**
```
20.x ou 22.x
```

### 3. Deploy

1. Push para `main` branch
2. Netlify fará deploy automático
3. Verificar logs do build
4. Testar site em produção

---

## ✅ VALIDAÇÕES PÓS-DEPLOY

- [ ] Site acessível
- [ ] Login/Signup funcionando
- [ ] Rotas protegidas redirecionando
- [ ] PWA instalável
- [ ] Service worker funcionando
- [ ] APIs respondendo

---

**Ver guia completo:** `PRODUCTION_READY_CHECKLIST.md`
