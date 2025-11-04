# Script de Testes Completos Antes do Commit (PowerShell)
# Testa todas as funcionalidades do app

Write-Host "🧪 Iniciando testes completos do app..." -ForegroundColor Cyan
Write-Host ""

# Verificar se Playwright está instalado
$playwrightInstalled = Get-Command npx -ErrorAction SilentlyContinue
if (-not $playwrightInstalled) {
  Write-Host "❌ Playwright não encontrado. Instalando..." -ForegroundColor Yellow
  npm install -D @playwright/test
  npx playwright install
}

# Executar build primeiro
Write-Host "📦 Executando build..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Build falhou! Corrija os erros antes de continuar." -ForegroundColor Red
  exit 1
}

Write-Host "✅ Build concluído!" -ForegroundColor Green
Write-Host ""

# Executar testes E2E
Write-Host "🧪 Executando testes E2E completos..." -ForegroundColor Cyan
npx playwright test e2e/complete-app-test.spec.ts --reporter=list

if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "✅ Todos os testes passaram!" -ForegroundColor Green
  Write-Host "🚀 Pronto para commit!" -ForegroundColor Green
  exit 0
} else {
  Write-Host ""
  Write-Host "❌ Alguns testes falharam. Revise antes de fazer commit." -ForegroundColor Red
  exit 1
}

