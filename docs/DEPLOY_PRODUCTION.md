# Deploy em Produção - Nossa Maternidade

> Guia completo para deploy do app mobile via **Expo + EAS** e Edge Functions no Supabase.

---

## 📋 Pré-requisitos

### Contas e Credenciais

- [ ] **Expo Account** criada e verificada
- [ ] **EAS CLI** instalado (`npm install -g eas-cli`)
- [ ] **Apple Developer Account** (iOS) - $99/ano
- [ ] **Google Play Console** (Android) - $25 única vez
- [ ] **Supabase Project** com Edge Functions habilitadas

### Secrets Configurados

Ver `docs/SECURITY.md` para lista completa. Principais:

```bash
# Expo/EAS
EAS_TOKEN=<token-do-expo>
EXPO_PROJECT_ID=<project-id>

# Supabase
SUPABASE_URL=<url-do-projeto>
SUPABASE_ANON_KEY=<chave-anonima>
SUPABASE_SERVICE_ROLE_KEY=<chave-service-role>

# IA Providers
ANTHROPIC_API_KEY=<claude-key>
GEMINI_API_KEY=<gemini-key>
PERPLEXITY_API_KEY=<perplexity-key>
MANUS_API_KEY=<manus-key>

# Monitoramento
SENTRY_DSN=<sentry-dsn>
SENTRY_AUTH_TOKEN=<sentry-auth-token>

# Ambiente
APP_ENV=production
```

---

## 🏗️ Estrutura de Canais EAS

### Canais (Channels)

```
preview → staging → production
```

**Uso:**
- **preview**: PRs e desenvolvimento (QR code)
- **staging**: Testes internos (internal track)
- **production**: Produção (production track)

### Tracks (Google Play)

```
internal → closed-beta → open-beta → production
```

**Uso:**
- **internal**: Testes rápidos (máx 100 testers)
- **closed-beta**: Testes com grupo seleto
- **open-beta**: Testes públicos
- **production**: Produção

---

## 📱 Deploy Mobile (Expo + EAS)

### 1. Configuração Inicial

```bash
# Login no Expo
eas login

# Configurar projeto
eas build:configure

# Criar app.json/app.config.js com EAS
```

**app.json:**
```json
{
  "expo": {
    "name": "Nossa Maternidade",
    "slug": "nossa-maternidade",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.nossamaternidade.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.nossamaternidade.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "<project-id>"
      }
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

### 2. Builds

#### Preview (PRs)

```bash
# Build preview Android
eas build --platform android --profile preview

# Build preview iOS
eas build --platform ios --profile preview

# Build preview ambos
eas build --platform all --profile preview
```

#### Staging

```bash
# Build staging com track internal
eas build --platform android --profile staging --channel staging
eas build --platform ios --profile staging --channel staging
```

#### Production

```bash
# Build production
eas build --platform android --profile production --channel production
eas build --platform ios --profile production --channel production
```

### 3. Submit para Stores

#### Google Play

```bash
# Submit para internal track
eas submit --platform android --track internal --latest

# Submit para production
eas submit --platform android --track production --latest
```

#### App Store

```bash
# Submit para App Store
eas submit --platform ios --latest
```

### 4. Atualizações OTA (Over-The-Air)

```bash
# Publicar update para preview
eas update --branch preview --message "Fix: correção de bug"

# Publicar update para staging
eas update --branch staging --message "Feature: nova funcionalidade"

# Publicar update para production
eas update --branch production --message "Release: v1.0.1"
```

---

## 🔧 Profiles EAS (eas.json)

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "staging": {
      "distribution": "store",
      "channel": "staging",
      "env": {
        "APP_ENV": "staging"
      }
    },
    "production": {
      "distribution": "store",
      "channel": "production",
      "env": {
        "APP_ENV": "production"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      },
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-team-id"
      }
    }
  }
}
```

---

## 🚀 Edge Functions (Supabase)

### 1. Deploy Local

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link projeto
supabase link --project-ref <project-ref>

# Deploy function
supabase functions deploy <function-name>
```

### 2. Deploy via CI/CD

**GitHub Actions** (`.github/workflows/deploy-functions.yml`):

```yaml
name: Deploy Edge Functions

on:
  push:
    branches: [main]
    paths:
      - 'infra/supabase/functions/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: supabase/setup-cli@v1

      - name: Deploy functions
        run: |
          supabase functions deploy --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

### 3. Testes de Functions

```bash
# Testar localmente
supabase functions serve <function-name>

# Testar com Deno
deno test --allow-net --allow-env infra/supabase/functions/<function-name>/test.ts
```

---

## 🔄 Release Train

### Processo Semanal (Quartas)

1. **Segunda**: Build staging → Submit para internal track
2. **Terça**: Testes internos + feedback
3. **Quarta**: Build production → Submit para production track
4. **Quinta-Sexta**: Monitoramento + hotfixes se necessário

### Versionamento

**Semantic Versioning:**
- `MAJOR.MINOR.PATCH` (ex: `1.2.3`)
- **MAJOR**: Breaking changes
- **MINOR**: Novas features (backward compatible)
- **PATCH**: Bug fixes

**Atualização:**
```json
// app.json
{
  "expo": {
    "version": "1.2.3",
    "ios": {
      "buildNumber": "123"
    },
    "android": {
      "versionCode": 123
    }
  }
}
```

---

## 📊 Monitoramento Pós-Deploy

### Sentry

- **Dashboard**: [sentry.io](https://sentry.io)
- **Eventos**: Erros, performance, releases
- **Alertas**: Email/Slack quando erro crítico

### Analytics

**Eventos-chave:**
- `sign_up` - Novo usuário
- `daily_active_users` - DAU
- `weekly_active_users` - WAU
- `retention_d7` - Retenção 7 dias

### Health Checks

```bash
# Verificar status do app
curl https://api.nossamaternidade.app/health

# Verificar status das functions
curl https://<project-ref>.supabase.co/functions/v1/health
```

---

## 🐛 Rollback

### App (OTA Update)

```bash
# Reverter para versão anterior
eas update --branch production --message "Rollback: v1.0.0" --republish
```

### Functions

```bash
# Reverter function
supabase functions deploy <function-name> --version <previous-version>
```

### Stores (Emergency)

- **Google Play**: Rollback via Console (internal track primeiro)
- **App Store**: Rejeitar build ou usar version anterior

---

## ✅ Checklist de Deploy

### Antes do Deploy

- [ ] Secrets configurados (GitHub/Expo)
- [ ] Versionamento atualizado (app.json)
- [ ] Changelog atualizado
- [ ] Testes passando (unit + E2E)
- [ ] Build local funcionando

### Durante o Deploy

- [ ] Build EAS iniciado
- [ ] Submit para stores iniciado
- [ ] Functions deployadas
- [ ] OTA update publicado (se aplicável)

### Após o Deploy

- [ ] Monitoramento ativo (Sentry)
- [ ] Analytics verificados
- [ ] Testes de smoke (app instalado)
- [ ] Documentação atualizada

---

## 🔗 Links Úteis

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [Supabase Functions](https://supabase.com/docs/guides/functions)
- [Expo Updates](https://docs.expo.dev/eas-update/introduction/)

---

**Última atualização:** 2025-01-27
**Mantido por:** Equipe Nossa Maternidade
