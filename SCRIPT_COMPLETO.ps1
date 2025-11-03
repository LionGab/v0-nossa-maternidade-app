# Script PowerShell Completo - Deixar Tudo Funcionando
# Execute: .\SCRIPT_COMPLETO.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Completo do Ambiente de Testes" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "[1/5] Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "  Instale de https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar npm
Write-Host "[2/5] Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  ✓ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ npm não encontrado!" -ForegroundColor Red
    exit 1
}

# Limpar node_modules se existir
Write-Host "[3/5] Limpando instalação anterior..." -ForegroundColor Yellow
if (Test-Path node_modules) {
    Write-Host "  Removendo node_modules..." -ForegroundColor Gray
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
}
if (Test-Path package-lock.json) {
    Remove-Item package-lock.json -ErrorAction SilentlyContinue
}

# Instalar dependências
Write-Host "[4/5] Instalando dependências..." -ForegroundColor Yellow
Write-Host "  Isso pode levar 2-5 minutos..." -ForegroundColor Gray
npm install --legacy-peer-deps

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "  ✗ Erro na instalação!" -ForegroundColor Red
    Write-Host "  Tente executar manualmente: npm install --legacy-peer-deps" -ForegroundColor Yellow
    exit 1
}

Write-Host "  ✓ Dependências instaladas!" -ForegroundColor Green
Write-Host ""

# Verificar instalação
Write-Host "[5/5] Verificando instalação..." -ForegroundColor Yellow

$checks = @(
    @{ Name = "vitest"; Path = "vitest" },
    @{ Name = "@vitejs/plugin-react"; Path = "@vitejs/plugin-react" },
    @{ Name = "jsdom"; Path = "jsdom" },
    @{ Name = "@playwright/test"; Path = "@playwright/test" }
)

$allOk = $true
foreach ($check in $checks) {
    $result = npm list $check.Path 2>&1
    if ($LASTEXITCODE -eq 0) {
        $version = ($result | Select-String -Pattern "$($check.Path)@[^\s]+").Matches.Value
        Write-Host "  ✓ $($check.Name): $version" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $($check.Name): Não encontrado" -ForegroundColor Red
        $allOk = $false
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Instalação Concluída!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($allOk) {
    Write-Host "✅ Tudo instalado corretamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Agora você pode executar:" -ForegroundColor Yellow
    Write-Host "  npm test              - Testes unitários" -ForegroundColor White
    Write-Host "  npm run test:watch    - Testes em watch mode" -ForegroundColor White
    Write-Host "  npm run test:ui       - Interface visual" -ForegroundColor White
    Write-Host "  npm run test:coverage - Com cobertura" -ForegroundColor White
    Write-Host "  npm run test:e2e      - Testes E2E" -ForegroundColor White
    Write-Host "  npm run test:all      - Todos os testes" -ForegroundColor White
    Write-Host ""

    # Perguntar se quer executar testes
    $runTests = Read-Host "Deseja executar os testes agora? (s/n)"
    if ($runTests -eq "s" -or $runTests -eq "S") {
        Write-Host ""
        Write-Host "Executando testes..." -ForegroundColor Yellow
        npm test
    }
} else {
    Write-Host "⚠️  Algumas dependências não foram encontradas" -ForegroundColor Yellow
    Write-Host "Execute: npm install --legacy-peer-deps novamente" -ForegroundColor Yellow
}

Write-Host ""
