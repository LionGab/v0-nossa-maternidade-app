#!/bin/bash
# Script para migrar arquivos de Next.js para React Native/Expo
# Uso: ./scripts/migrate-to-mobile.sh

set -e

echo "🚀 Iniciando migração para React Native/Expo..."

# 1. Renomear arquivos de config
echo "📝 Renomeando arquivos de configuração..."

if [ -f "vitest.config.mobile.ts" ]; then
  mv vitest.config.mobile.ts vitest.config.ts
  echo "✅ vitest.config.ts atualizado"
fi

if [ -f "vitest.setup.mobile.ts" ]; then
  mv vitest.setup.mobile.ts vitest.setup.ts
  echo "✅ vitest.setup.ts atualizado"
fi

if [ -f "eslint.config.mobile.mjs" ]; then
  mv eslint.config.mobile.mjs eslint.config.mjs
  echo "✅ eslint.config.mjs atualizado"
fi

if [ -f "tsconfig.mobile.json" ]; then
  mv tsconfig.mobile.json tsconfig.json
  echo "✅ tsconfig.json atualizado"
fi

if [ -f ".cursorrules.mobile" ]; then
  mv .cursorrules.mobile .cursorrules
  echo "✅ .cursorrules atualizado"
fi

# 2. Mover CI/CD workflow
echo "📦 Configurando CI/CD..."

if [ -f ".github/workflows/ci-cd.mobile.yml" ]; then
  # Backup do workflow antigo se existir
  if [ -f ".github/workflows/ci-cd.yml" ]; then
    mv .github/workflows/ci-cd.yml .github/workflows/ci-cd.web.yml.backup
    echo "📦 Backup do workflow web criado"
  fi

  mv .github/workflows/ci-cd.mobile.yml .github/workflows/ci-cd.yml
  echo "✅ CI/CD workflow atualizado"
fi

# 3. Criar estrutura de testes
echo "📁 Criando estrutura de testes..."

mkdir -p __tests__/{components,lib,hooks}
mkdir -p e2e/{detox,maestro}
echo "✅ Estrutura de testes criada"

# 4. Instalar dependências
echo "📚 Instalando dependências..."

npm install --save-dev \
  vitest \
  @vitest/ui \
  @vitest/coverage-v8 \
  @testing-library/react-native \
  @testing-library/jest-native \
  jest-expo \
  detox || echo "⚠️ Algumas dependências podem precisar de instalação manual"

echo "✅ Dependências instaladas"

# 5. Criar arquivo .env.example se não existir
if [ ! -f ".env.example" ]; then
  echo "📝 Criando .env.example..."
  cat > .env.example << EOF
# Expo Public Variables
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# EAS Build
EAS_TOKEN=your_eas_token
EOF
  echo "✅ .env.example criado"
fi

echo ""
echo "✅ Migração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure EAS Build: eas build:configure"
echo "2. Adicione secrets no GitHub (EAS_TOKEN, etc.)"
echo "3. Crie testes em __tests__/"
echo "4. Configure Detox ou Maestro para E2E"
echo "5. Teste o CI/CD fazendo um commit"
echo ""
echo "📚 Veja MIGRATION_GUIDE.md para mais detalhes"
