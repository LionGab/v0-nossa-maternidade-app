# Instalador GitHub CLI com Copilot - Windows
# Instala GitHub CLI e configura Copilot CLI

param(
    [switch]$SkipCopilotSetup
)

Write-Host "Instalando GitHub CLI..." -ForegroundColor Cyan

# Verificar se ja esta instalado
$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue
if ($ghInstalled) {
    Write-Host "OK: GitHub CLI ja esta instalado" -ForegroundColor Green
    gh --version
}
else {
    Write-Host "Instalando GitHub CLI via winget..." -ForegroundColor Yellow

    # Tentar instalar via winget
    try {
        winget install --id GitHub.cli --silent --accept-package-agreements --accept-source-agreements
        Write-Host "OK: GitHub CLI instalado com sucesso" -ForegroundColor Green
    }
    catch {
        Write-Host "ERRO: Erro ao instalar via winget. Tente instalar manualmente:" -ForegroundColor Red
        Write-Host "   winget install GitHub.cli" -ForegroundColor Yellow
        Write-Host "   Ou baixe em: https://cli.github.com/" -ForegroundColor Yellow
        exit 1
    }
}

# Verificar instalacao
Write-Host ""
Write-Host "Verificando instalacao..." -ForegroundColor Cyan
$ghVersion = gh --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: GitHub CLI instalado:" -ForegroundColor Green
    Write-Host $ghVersion
}
else {
    Write-Host "ERRO: GitHub CLI nao foi instalado corretamente" -ForegroundColor Red
    exit 1
}

# Autenticar
Write-Host ""
Write-Host "Autenticando no GitHub..." -ForegroundColor Cyan
Write-Host "ATENCAO: Voce precisara autenticar no navegador..." -ForegroundColor Yellow
try {
    gh auth login
    Write-Host "OK: Autenticacao concluida" -ForegroundColor Green
}
catch {
    Write-Host "ATENCAO: Autenticacao nao concluida. Execute manualmente: gh auth login" -ForegroundColor Yellow
}

# Configurar Copilot CLI
if (!$SkipCopilotSetup) {
    Write-Host ""
    Write-Host "Configurando GitHub Copilot CLI..." -ForegroundColor Cyan
    try {
        gh copilot setup
        Write-Host "OK: Copilot CLI configurado" -ForegroundColor Green
    }
    catch {
        Write-Host "ATENCAO: Copilot CLI nao configurado. Execute manualmente: gh copilot setup" -ForegroundColor Yellow
    }
}

# Verificar status
Write-Host ""
Write-Host "Status final:" -ForegroundColor Cyan
gh --version
Write-Host ""
gh auth status
Write-Host ""

if ($SkipCopilotSetup) {
    Write-Host "ATENCAO: Execute 'gh copilot setup' para configurar o Copilot CLI" -ForegroundColor Yellow
}
else {
    Write-Host "OK: Instalacao concluida!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximos passos:" -ForegroundColor Cyan
    Write-Host "   1. Teste: gh copilot --version" -ForegroundColor Gray
    Write-Host "   2. Teste: gh copilot status" -ForegroundColor Gray
    Write-Host "   3. Execute: npm run overnight:dry-run" -ForegroundColor Gray
}
