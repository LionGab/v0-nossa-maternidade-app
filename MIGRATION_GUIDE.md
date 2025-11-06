# 🚀 Guia de Migração: Next.js → React Native/Expo

Este guia lista os arquivos adaptados para React Native/Expo do projeto web Next.js.

## 📋 Arquivos Criados

### 1. **Configuração de Testes**

#### `vitest.config.mobile.ts`
- Adaptado de `vitest.config.ts`
- Usa `@testing-library/react-native` ao invés de `@testing-library/react`
- Exclui diretórios mobile (`ios/`, `android/`, `.expo/`)
- Aliases adaptados para estrutura Expo

#### `vitest.setup.mobile.ts`
- Adaptado de `vitest.setup.ts`
- Mocks de APIs nativas do React Native:
  - `@react-native-async-storage/async-storage`
  - `expo-router`
  - `expo-constants`
  - `react-native/Platform`
  - `react-native/Animated`

### 2. **ESLint**

#### `eslint.config.mobile.mjs`
- Adaptado de `eslint.config.mjs`
- Extends: `expo` e `plugin:react-native/all`
- Regras específicas para React Native:
  - `react-native/no-unused-styles`
  - `react-native/split-platform-components`
  - `react-native/no-color-literals`

### 3. **TypeScript**

#### `tsconfig.mobile.json`
- Adaptado de `tsconfig.json`
- Extends: `expo/tsconfig.base`
- Lib: `["ES2020"]` (sem DOM)
- Paths adaptados para Expo

### 4. **CI/CD**

#### `.github/workflows/ci-cd.mobile.yml`
- Adaptado de `.github/workflows/ci-cd.yml`
- **Principais mudanças:**
  - ✅ Validação Expo config (`expo-doctor`)
  - ✅ Build check com `expo export`
  - ✅ EAS Build para Android e iOS
  - ✅ Jobs separados por plataforma
  - ❌ Remove Playwright (não funciona para mobile)
  - ❌ Remove Netlify deploy (não aplicável)
  - ✅ Adiciona Detox/Maestro placeholder

### 5. **E2E Testing**

#### `detox.config.js`
- Configuração para Detox (alternativa ao Playwright)
- Suporta iOS e Android
- Configurações para debug e release

**Alternativa:** Maestro (mais simples, não requer código)
- Criar arquivos `.yaml` em `maestro/`
- Executar: `maestro test ./maestro`

### 6. **Cursor Rules**

#### `.cursorrules.mobile`
- Adaptado de `.cursorrules`
- Notas sobre variáveis `EXPO_PUBLIC_*`
- Instruções específicas para React Native/Expo

## 🔧 Passos para Integração

### 1. Instalar Dependências

```bash
# Dependências de teste
npm install --save-dev \
  vitest \
  @vitest/ui \
  @vitest/coverage-v8 \
  @testing-library/react-native \
  @testing-library/jest-native \
  jest-expo

# Para E2E (escolha um):
# Opção A: Detox
npm install --save-dev detox

# Opção B: Maestro (não precisa instalar, apenas baixar binário)
```

### 2. Atualizar package.json

```json
{
  "scripts": {
    "test": "vitest run --config vitest.config.mobile.ts",
    "test:watch": "vitest --config vitest.config.mobile.ts",
    "test:coverage": "vitest run --coverage --config vitest.config.mobile.ts",
    "test:e2e": "detox test --configuration ios.sim.debug",
    "lint": "eslint . --config eslint.config.mobile.mjs"
  }
}
```

### 3. Renomear Arquivos

```bash
# Renomear para versão mobile
mv vitest.config.mobile.ts vitest.config.ts
mv vitest.setup.mobile.ts vitest.setup.ts
mv eslint.config.mobile.mjs eslint.config.mjs
mv tsconfig.mobile.json tsconfig.json
mv .cursorrules.mobile .cursorrules

# CI/CD
mkdir -p .github/workflows
mv .github/workflows/ci-cd.mobile.yml .github/workflows/ci-cd.yml
```

### 4. Configurar EAS Build

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar projeto
eas build:configure

# Criar eas.json (se não existir)
```

### 5. Configurar Secrets no GitHub

No GitHub → Settings → Secrets → Actions, adicionar:

- `EAS_TOKEN` - Token do Expo (criar em https://expo.dev/accounts/[account]/settings/access-tokens)
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `SNYK_TOKEN` (opcional)

### 6. Criar Estrutura de Testes

```bash
# Estrutura sugerida
mkdir -p __tests__/{components,lib,hooks}
mkdir -p e2e/{detox,maestro}
```

## 📝 Checklist de Migração

- [ ] Instalar dependências de teste
- [ ] Renomear arquivos de config
- [ ] Atualizar package.json scripts
- [ ] Configurar EAS Build
- [ ] Adicionar secrets no GitHub
- [ ] Criar estrutura de testes
- [ ] Migrar testes existentes (se houver)
- [ ] Configurar Detox ou Maestro
- [ ] Testar CI/CD localmente
- [ ] Fazer primeiro commit e verificar CI

## ⚠️ Diferenças Importantes

### Variáveis de Ambiente
- **Next.js**: `NEXT_PUBLIC_*`
- **Expo**: `EXPO_PUBLIC_*`

### Testes
- **Next.js**: `@testing-library/react` + Playwright
- **Expo**: `@testing-library/react-native` + Detox/Maestro

### Build
- **Next.js**: `next build` → deploy Netlify/Vercel
- **Expo**: `eas build` → App Store/Play Store

### Estilização
- **Next.js**: CSS/Tailwind
- **Expo**: StyleSheet do React Native

## 🚀 Próximos Passos

1. Integrar arquivos no repositório LionNath
2. Configurar EAS Build profiles
3. Criar testes unitários de exemplo
4. Configurar Detox ou Maestro para E2E
5. Testar pipeline completo

## 📚 Referências

- [Expo Testing](https://docs.expo.dev/guides/testing-with-jest/)
- [Detox](https://wix.github.io/Detox/)
- [Maestro](https://maestro.mobile.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
