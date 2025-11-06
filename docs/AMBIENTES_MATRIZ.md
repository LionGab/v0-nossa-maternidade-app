# Matriz de Ambientes - Nossa Maternidade

> Mapeamento de variáveis de ambiente por ambiente (dev, staging, production).

---

## 📊 Matriz de Ambientes

| Variável | Dev | Staging | Production |
|----------|-----|---------|------------|
| **APP_ENV** | `dev` | `staging` | `production` |
| **SUPABASE_URL** | `https://<dev-ref>.supabase.co` | `https://<staging-ref>.supabase.co` | `https://<prod-ref>.supabase.co` |
| **SUPABASE_ANON_KEY** | `<dev-anon-key>` | `<staging-anon-key>` | `<prod-anon-key>` |
| **SUPABASE_SERVICE_ROLE_KEY** | `<dev-service-key>` | `<staging-service-key>` | `<prod-service-key>` |
| **ANTHROPIC_API_KEY** | `<dev-key>` | `<staging-key>` | `<prod-key>` |
| **GEMINI_API_KEY** | `<dev-key>` | `<staging-key>` | `<prod-key>` |
| **PERPLEXITY_API_KEY** | `<dev-key>` | `<staging-key>` | `<prod-key>` |
| **MANUS_API_KEY** | `<dev-key>` | `<staging-key>` | `<prod-key>` |
| **SENTRY_DSN** | `<dev-dsn>` | `<staging-dsn>` | `<prod-dsn>` |
| **SENTRY_AUTH_TOKEN** | `<dev-token>` | `<staging-token>` | `<prod-token>` |
| **EAS_TOKEN** | `<dev-token>` | `<staging-token>` | `<prod-token>` |
| **EXPO_PROJECT_ID** | `<project-id>` | `<project-id>` | `<project-id>` |
| **LOG_LEVEL** | `debug` | `info` | `warn` |
| **ENABLE_ANALYTICS** | `false` | `true` | `true` |
| **ENABLE_CRASH_REPORTING** | `false` | `true` | `true` |

---

## 🔐 Secrets por Ambiente

### Development

**GitHub Secrets:**
- `DEV_SUPABASE_URL`
- `DEV_SUPABASE_ANON_KEY`
- `DEV_SUPABASE_SERVICE_ROLE_KEY`
- `DEV_ANTHROPIC_API_KEY`
- `DEV_GEMINI_API_KEY`
- `DEV_PERPLEXITY_API_KEY`
- `DEV_MANUS_API_KEY`
- `DEV_SENTRY_DSN`
- `DEV_SENTRY_AUTH_TOKEN`

**Expo Secrets:**
- `DEV_EAS_TOKEN`
- `DEV_EXPO_PROJECT_ID`

### Staging

**GitHub Secrets:**
- `STAGING_SUPABASE_URL`
- `STAGING_SUPABASE_ANON_KEY`
- `STAGING_SUPABASE_SERVICE_ROLE_KEY`
- `STAGING_ANTHROPIC_API_KEY`
- `STAGING_GEMINI_API_KEY`
- `STAGING_PERPLEXITY_API_KEY`
- `STAGING_MANUS_API_KEY`
- `STAGING_SENTRY_DSN`
- `STAGING_SENTRY_AUTH_TOKEN`

**Expo Secrets:**
- `STAGING_EAS_TOKEN`
- `STAGING_EXPO_PROJECT_ID`

### Production

**GitHub Secrets:**
- `PROD_SUPABASE_URL`
- `PROD_SUPABASE_ANON_KEY`
- `PROD_SUPABASE_SERVICE_ROLE_KEY`
- `PROD_ANTHROPIC_API_KEY`
- `PROD_GEMINI_API_KEY`
- `PROD_PERPLEXITY_API_KEY`
- `PROD_MANUS_API_KEY`
- `PROD_SENTRY_DSN`
- `PROD_SENTRY_AUTH_TOKEN`

**Expo Secrets:**
- `PROD_EAS_TOKEN`
- `PROD_EXPO_PROJECT_ID`

---

## 📝 .env.example

```bash
# Ambiente
APP_ENV=dev

# Supabase
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# IA Providers
ANTHROPIC_API_KEY=<anthropic-key>
GEMINI_API_KEY=<gemini-key>
PERPLEXITY_API_KEY=<perplexity-key>
MANUS_API_KEY=<manus-key>

# Monitoramento
SENTRY_DSN=<sentry-dsn>
SENTRY_AUTH_TOKEN=<sentry-auth-token>

# Expo/EAS
EAS_TOKEN=<eas-token>
EXPO_PROJECT_ID=<project-id>

# Configurações
LOG_LEVEL=debug
ENABLE_ANALYTICS=false
ENABLE_CRASH_REPORTING=false
```

---

## 🔄 Mapeamento de Secrets para Variáveis

### GitHub Actions

```yaml
env:
  SUPABASE_URL: ${{ secrets.DEV_SUPABASE_URL }}
  SUPABASE_ANON_KEY: ${{ secrets.DEV_SUPABASE_ANON_KEY }}
  SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.DEV_SUPABASE_SERVICE_ROLE_KEY }}
  ANTHROPIC_API_KEY: ${{ secrets.DEV_ANTHROPIC_API_KEY }}
  GEMINI_API_KEY: ${{ secrets.DEV_GEMINI_API_KEY }}
  PERPLEXITY_API_KEY: ${{ secrets.DEV_PERPLEXITY_API_KEY }}
  MANUS_API_KEY: ${{ secrets.DEV_MANUS_API_KEY }}
  SENTRY_DSN: ${{ secrets.DEV_SENTRY_DSN }}
  SENTRY_AUTH_TOKEN: ${{ secrets.DEV_SENTRY_AUTH_TOKEN }}
  EAS_TOKEN: ${{ secrets.DEV_EAS_TOKEN }}
  EXPO_PROJECT_ID: ${{ secrets.DEV_EXPO_PROJECT_ID }}
  APP_ENV: dev
  LOG_LEVEL: debug
```

### Expo (app.config.js)

```javascript
const getEnvVars = (env = process.env.APP_ENV || 'dev') => {
  const envVars = {
    dev: {
      supabaseUrl: process.env.DEV_SUPABASE_URL,
      supabaseAnonKey: process.env.DEV_SUPABASE_ANON_KEY,
      sentryDsn: process.env.DEV_SENTRY_DSN,
      logLevel: 'debug',
      enableAnalytics: false,
    },
    staging: {
      supabaseUrl: process.env.STAGING_SUPABASE_URL,
      supabaseAnonKey: process.env.STAGING_SUPABASE_ANON_KEY,
      sentryDsn: process.env.STAGING_SENTRY_DSN,
      logLevel: 'info',
      enableAnalytics: true,
    },
    production: {
      supabaseUrl: process.env.PROD_SUPABASE_URL,
      supabaseAnonKey: process.env.PROD_SUPABASE_ANON_KEY,
      sentryDsn: process.env.PROD_SENTRY_DSN,
      logLevel: 'warn',
      enableAnalytics: true,
    },
  };

  return envVars[env] || envVars.dev;
};

export default {
  expo: {
    extra: {
      ...getEnvVars(process.env.APP_ENV),
    },
  },
};
```

---

## ✅ Checklist de Configuração

### Dev
- [ ] Secrets criados no GitHub
- [ ] `.env.local` criado (não commitado)
- [ ] Supabase project dev criado
- [ ] Expo project configurado

### Staging
- [ ] Secrets criados no GitHub
- [ ] Supabase project staging criado
- [ ] EAS channel `staging` criado
- [ ] Google Play track `internal` configurado

### Production
- [ ] Secrets criados no GitHub
- [ ] Supabase project production criado
- [ ] EAS channel `production` criado
- [ ] Google Play track `production` configurado
- [ ] App Store Connect configurado

---

**Última atualização:** 2025-01-27
**Mantido por:** Equipe Nossa Maternidade
