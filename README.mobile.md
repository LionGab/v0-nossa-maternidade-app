# 📱 Nossa Maternidade - Mobile App

Aplicativo React Native (Expo) + TypeScript com Supabase, otimizado para **mobile nativo** e **web**.

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 20+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`) - para builds nativos

### Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Iniciar desenvolvimento
npm start
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm start          # Inicia Expo dev server
npm run android    # Abre no Android
npm run ios        # Abre no iOS
npm run web        # Abre no navegador (web)

# Build
npm run build              # Export web build
npm run build:android     # Build Android (EAS)
npm run build:ios         # Build iOS (EAS)
npm run build:all         # Build todas as plataformas

# Qualidade
npm run lint              # ESLint
npm run type-check        # TypeScript check
npm test                  # Testes unitários
npm run test:watch        # Testes em watch mode
npm run test:coverage     # Coverage report

# E2E
npm run test:e2e:ios      # Detox iOS
npm run test:e2e:android  # Detox Android
npm run test:e2e:maestro  # Maestro tests
```

## 📁 Estrutura do Projeto

```
├── app/                    # Expo Router (app directory)
│   ├── (tabs)/            # Tab navigation
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Home screen
├── components/            # Componentes React Native
│   ├── ui/                # Componentes base
│   └── ...
├── lib/                   # Utilitários e configs
│   ├── supabase/         # Clientes Supabase
│   └── ...
├── hooks/                 # Custom hooks
├── __tests__/            # Testes unitários
├── e2e/                  # Testes E2E (Detox/Maestro)
│   ├── detox/           # Testes Detox
│   └── maestro/         # Testes Maestro
├── assets/               # Imagens, fonts, etc.
├── scripts/              # Scripts de automação
└── ...

# Configurações
├── app.json              # Config Expo (mobile + web)
├── eas.json              # EAS Build config
├── babel.config.js       # Babel config
├── metro.config.js       # Metro bundler config
├── tsconfig.json         # TypeScript config
├── vitest.config.ts      # Vitest config
├── eslint.config.mjs     # ESLint config
└── detox.config.js       # Detox config
```

## 🏗️ Build e Deploy

### EAS Build (Recomendado)

```bash
# Configurar EAS
eas build:configure

# Build para desenvolvimento
eas build --profile development --platform ios

# Build para preview
eas build --profile preview --platform all

# Build para produção
eas build --profile production --platform all
```

### Build Local (iOS)

```bash
# iOS
cd ios
pod install
cd ..
npm run ios

# Android
npm run android
```

### Deploy Web

```bash
# Export web
npm run build

# Deploy (Netlify, Vercel, etc.)
# O build web está em web-build/
```

## 🧪 Testes

### Testes Unitários

```bash
# Executar todos
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# UI mode
npm run test:ui
```

### Testes E2E

#### Detox

```bash
# Instalar
npm install --save-dev detox

# iOS
npm run test:e2e:ios

# Android
npm run test:e2e:android
```

#### Maestro (Alternativa mais simples)

```bash
# Instalar Maestro
curl -Ls https://get.maestro.mobile.dev | bash

# Criar testes em e2e/maestro/*.yaml
# Executar
npm run test:e2e:maestro
```

## 🔧 Configuração

### Variáveis de Ambiente

Use `EXPO_PUBLIC_*` para variáveis públicas (disponíveis no cliente):

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**⚠️ Importante:** Variáveis sem `EXPO_PUBLIC_*` não estarão disponíveis no cliente.

### Expo Config (app.json)

- **Mobile:** iOS e Android configurados
- **Web:** PWA configurado (standalone, service worker, etc.)
- **Assets:** Ícones, splash screen, etc.

### EAS Build (eas.json)

- **development:** Para desenvolvimento local
- **preview:** Para testes internos
- **production:** Para App Store/Play Store

## 📱 Plataformas Suportadas

- ✅ **iOS** (nativo)
- ✅ **Android** (nativo)
- ✅ **Web** (PWA otimizado)

## 🛠️ Tecnologias

- **React Native** - Framework mobile
- **Expo** - Tooling e runtime
- **Expo Router** - Roteamento (file-based)
- **TypeScript** - Tipagem estática
- **Supabase** - Backend (Auth, Database, Storage)
- **Vitest** - Testes unitários
- **Detox/Maestro** - Testes E2E
- **EAS Build** - Builds nativos na nuvem

## 📚 Documentação

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Supabase + React Native](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)

## 🚀 CI/CD

GitHub Actions configurado em `.github/workflows/ci-cd.mobile.yml`:

- ✅ Code Quality (TypeScript + ESLint)
- ✅ Build Check (Expo)
- ✅ Unit Tests
- ✅ EAS Build (Android + iOS)
- ✅ Security Scan
- ✅ E2E Tests placeholder

## 📝 Checklist de Setup

- [ ] Instalar dependências: `npm install`
- [ ] Configurar `.env` com credenciais Supabase
- [ ] Configurar EAS: `eas build:configure`
- [ ] Adicionar secrets no GitHub (EAS_TOKEN, etc.)
- [ ] Testar localmente: `npm start`
- [ ] Criar testes em `__tests__/`
- [ ] Configurar Detox ou Maestro para E2E
- [ ] Testar build: `eas build --profile preview`

## ⚠️ Notas Importantes

### Mobile vs Web

- **Mobile:** Usa APIs nativas (AsyncStorage, Camera, etc.)
- **Web:** Usa APIs web (localStorage, MediaDevices, etc.)
- Expo Router detecta automaticamente a plataforma

### Variáveis de Ambiente

- **Next.js:** `NEXT_PUBLIC_*`
- **Expo:** `EXPO_PUBLIC_*`

### Testes

- **Unit:** `@testing-library/react-native` (não `@testing-library/react`)
- **E2E:** Detox ou Maestro (não Playwright)

### Build

- **Web:** `expo export` → pasta `web-build/`
- **Mobile:** `eas build` → App Store/Play Store

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🔗 Links

- [Repositório](https://github.com/LionGab/LionNath)
- [Documentação Completa](./MIGRATION_GUIDE.md)
- [Guia de Migração](./MIGRATION_GUIDE.md)

