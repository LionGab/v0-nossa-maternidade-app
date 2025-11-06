#!/bin/bash

# Script de Testes Completos Antes do Commit
# Testa todas as funcionalidades do app

echo "🧪 Iniciando testes completos do app..."
echo ""

# Verificar se Playwright está instalado
if ! command -v npx playwright &> /dev/null; then
  echo "❌ Playwright não encontrado. Instalando..."
  npm install -D @playwright/test
  npx playwright install
fi

# Executar build primeiro
echo "📦 Executando build..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build falhou! Corrija os erros antes de continuar."
  exit 1
fi

echo "✅ Build concluído!"
echo ""

# Executar testes E2E
echo "🧪 Executando testes E2E completos..."
npx playwright test e2e/complete-app-test.spec.ts --reporter=list

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Todos os testes passaram!"
  echo "🚀 Pronto para commit!"
  exit 0
else
  echo ""
  echo "❌ Alguns testes falharam. Revise antes de fazer commit."
  exit 1
fi

