# 🤖 CI/CD para App Mobile

## 🎯 Objetivo

Automatizar builds e deploys do app mobile iOS/Android usando GitHub Actions e EAS Build.

---

## 📋 Configuração Inicial

### 1. Secrets do GitHub

Adicione em **Settings > Secrets and variables > Actions**:

```
EXPO_TOKEN=<seu-expo-token>
```

Para obter o token:
```bash
eas whoami
# Se não estiver logado:
eas login

# Criar token
eas token:create --type publish
```

### 2. Secrets Opcionais (para deploy nas lojas)

```
GOOGLE_SERVICE_ACCOUNT_JSON=<conteúdo-do-arquivo-json>
APPLE_TEAM_ID=<seu-team-id>
APPLE_APP_STORE_CONNECT_API_KEY_ID=<key-id>
APPLE_APP_STORE_CONNECT_API_KEY=<base64-do-p8>
```

---

## 🔧 Workflow: Build Mobile

Crie `.github/workflows/mobile-build.yml`:

```yaml
name: Mobile Build

on:
  push:
    branches: [main, develop]
    paths:
      - 'mobile/**'
  pull_request:
    branches: [main]
    paths:
      - 'mobile/**'
  workflow_dispatch:
    inputs:
      platform:
        description: 'Platform to build'
        required: true
        type: choice
        options:
          - android
          - ios
          - all
      profile:
        description: 'Build profile'
        required: true
        type: choice
        options:
          - development
          - preview
          - production

jobs:
  build:
    name: Build Mobile App
    runs-on: ubuntu-latest
    
    steps:
      - name: 🔍 Checkout
        uses: actions/checkout@v4
      
      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: mobile/package-lock.json
      
      - name: 📦 Install dependencies
        working-directory: mobile
        run: npm ci
      
      - name: 🔐 Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: 🏗️ Build Android (Preview)
        if: github.event_name == 'push' || (github.event_name == 'workflow_dispatch' && (github.event.inputs.platform == 'android' || github.event.inputs.platform == 'all'))
        working-directory: mobile
        run: |
          PROFILE=${{ github.event.inputs.profile || 'preview' }}
          eas build --platform android --profile $PROFILE --non-interactive --no-wait
      
      - name: 🏗️ Build iOS
        if: github.event_name == 'workflow_dispatch' && (github.event.inputs.platform == 'ios' || github.event.inputs.platform == 'all')
        working-directory: mobile
        run: |
          PROFILE=${{ github.event.inputs.profile || 'production' }}
          eas build --platform ios --profile $PROFILE --non-interactive --no-wait
      
      - name: 📊 Summary
        run: |
          echo "### 📱 Mobile Build Started" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "Platform: ${{ github.event.inputs.platform || 'android' }}" >> $GITHUB_STEP_SUMMARY
          echo "Profile: ${{ github.event.inputs.profile || 'preview' }}" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "Check build status at: https://expo.dev/" >> $GITHUB_STEP_SUMMARY
```

---

## 🧪 Workflow: Testes Mobile

Crie `.github/workflows/mobile-test.yml`:

```yaml
name: Mobile Tests

on:
  pull_request:
    paths:
      - 'mobile/**'
  push:
    branches: [main, develop]
    paths:
      - 'mobile/**'

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: 🔍 Checkout
        uses: actions/checkout@v4
      
      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: mobile/package-lock.json
      
      - name: 📦 Install dependencies
        working-directory: mobile
        run: npm ci
      
      - name: 🧪 Run tests
        working-directory: mobile
        run: npm test
      
      - name: 📊 Lint
        working-directory: mobile
        run: npm run lint
```

---

## 🚀 Workflow: Deploy (Submit para Stores)

Crie `.github/workflows/mobile-deploy.yml`:

```yaml
name: Mobile Deploy

on:
  workflow_dispatch:
    inputs:
      platform:
        description: 'Platform to submit'
        required: true
        type: choice
        options:
          - android
          - ios
          - all

jobs:
  submit:
    name: Submit to Stores
    runs-on: ubuntu-latest
    
    steps:
      - name: 🔍 Checkout
        uses: actions/checkout@v4
      
      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: 📦 Install dependencies
        working-directory: mobile
        run: npm ci
      
      - name: 🔐 Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: 🤖 Submit to Google Play
        if: github.event.inputs.platform == 'android' || github.event.inputs.platform == 'all'
        working-directory: mobile
        run: eas submit --platform android --non-interactive
        env:
          GOOGLE_SERVICE_ACCOUNT_JSON: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_JSON }}
      
      - name: 🍎 Submit to App Store
        if: github.event.inputs.platform == 'ios' || github.event.inputs.platform == 'all'
        working-directory: mobile
        run: eas submit --platform ios --non-interactive
        env:
          APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
          APPLE_APP_STORE_CONNECT_API_KEY_ID: ${{ secrets.APPLE_APP_STORE_CONNECT_API_KEY_ID }}
          APPLE_APP_STORE_CONNECT_API_KEY: ${{ secrets.APPLE_APP_STORE_CONNECT_API_KEY }}
```

---

## 📊 Badge no README

Adicione badges ao README.md:

```markdown
[![Mobile Build](https://github.com/LionGab/v0-nossa-maternidade-app/actions/workflows/mobile-build.yml/badge.svg)](https://github.com/LionGab/v0-nossa-maternidade-app/actions/workflows/mobile-build.yml)
[![Mobile Tests](https://github.com/LionGab/v0-nossa-maternidade-app/actions/workflows/mobile-test.yml/badge.svg)](https://github.com/LionGab/v0-nossa-maternidade-app/actions/workflows/mobile-test.yml)
```

---

## 🎯 Uso

### Build Manual via GitHub

1. Vá em **Actions** no GitHub
2. Selecione **Mobile Build**
3. Clique em **Run workflow**
4. Escolha platform e profile
5. Aguarde o build na nuvem (EAS)

### Build Automático

- Push para `main` ou `develop` → Build Android preview automático
- Pull Request → Testes automáticos

### Deploy para Stores

1. Primeiro faça o build de produção
2. Vá em **Actions** > **Mobile Deploy**
3. Escolha a plataforma
4. Run workflow

---

## 🔒 Segurança

### Proteger Secrets

- Nunca commite tokens ou chaves
- Use GitHub Secrets
- Rotacione tokens periodicamente

### Branch Protection

Configure em **Settings > Branches**:
- Require pull request reviews
- Require status checks (mobile tests)
- Restrict pushes

---

## 📈 Monitoramento

### EAS Dashboard

- https://expo.dev/accounts/[seu-account]/projects/nossa-maternidade
- Visualize todos os builds
- Download de APKs/IPAs
- Logs de erro

### GitHub Insights

- **Actions**: Histórico de builds
- **Insights > Deployments**: Timeline de deploys

---

## 🐛 Troubleshooting

### Build falha com "Authentication error"

```bash
# Gerar novo token
eas token:create --type publish

# Atualizar secret no GitHub
# Settings > Secrets > EXPO_TOKEN
```

### Build lento

- Builds na nuvem (EAS) levam 10-20 min
- Primeira build é mais lenta (cache vazio)
- Builds subsequentes são mais rápidas

### Submit falha

- Verifique credenciais das lojas
- Android: Service account key correto?
- iOS: Team ID e API key válidos?

---

## 🎯 Checklist de Setup

- [ ] Conta Expo criada
- [ ] EAS CLI instalado localmente
- [ ] Primeiro build local bem-sucedido
- [ ] EXPO_TOKEN adicionado no GitHub Secrets
- [ ] Workflows criados (.github/workflows/)
- [ ] Branch protection configurada
- [ ] Primeiro build via Actions testado
- [ ] README atualizado com badges

---

## 📚 Recursos

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [GitHub Actions Docs](https://docs.github.com/actions)
- [Expo GitHub Action](https://github.com/expo/expo-github-action)

---

**Desenvolvido com ❤️ para mães brasileiras**
