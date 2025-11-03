# Script PowerShell para configurar ambiente de testes
# Execute: .\setup-tests.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Ambiente de Testes" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale Node.js de https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar npm
Write-Host "Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Instalando dependências..." -ForegroundColor Yellow
Write-Host "Isso pode levar alguns minutos..." -ForegroundColor Gray

# Instalar dependências
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Erro ao instalar dependências!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ Dependências instaladas com sucesso!" -ForegroundColor Green
Write-Host ""

# Verificar se vitest foi instalado
Write-Host "Verificando instalação do Vitest..." -ForegroundColor Yellow
$vitestPath = npm list vitest 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Vitest instalado" -ForegroundColor Green
} else {
    Write-Host "✗ Vitest não encontrado, tentando instalar..." -ForegroundColor Yellow
    npm install --save-dev vitest @vitest/ui @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
}

# Verificar se playwright foi instalado
Write-Host "Verificando instalação do Playwright..." -ForegroundColor Yellow
$playwrightPath = npm list @playwright/test 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Playwright instalado" -ForegroundColor Green
} else {
    Write-Host "✗ Playwright não encontrado, tentando instalar..." -ForegroundColor Yellow
    npm install --save-dev @playwright/test
    Write-Host "Instalando browsers do Playwright..." -ForegroundColor Yellow
    npx playwright install
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Concluído!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Agora você pode executar:" -ForegroundColor Green
Write-Host "  npm run test          - Testes unitários" -ForegroundColor White
Write-Host "  npm run test:watch    - Testes em watch mode" -ForegroundColor White
Write-Host "  npm run test:ui       - Interface visual" -ForegroundColor White
Write-Host "  npm run test:coverage - Com cobertura" -ForegroundColor White
Write-Host "  npm run test:e2e      - Testes E2E" -ForegroundColor White
Write-Host "  npm run test:all      - Todos os testes" -ForegroundColor White
Write-Host ""
