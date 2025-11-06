# 🔧 Validação de Ferramentas - Nossa Maternidade
# Valida todas as ferramentas necessárias para automação noturna

param(
    [switch]$JsonOutput
)

$ErrorActionPreference = "Continue"
$ProjectRoot = Join-Path $PSScriptRoot ".."
$Results = @{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    tools = @{}
    allValid = $true
}

function Test-Command {
    param([string]$Command, [string]$Name)

    try {
        $null = Get-Command $Command -ErrorAction Stop
        $version = & $Command --version 2>&1 | Select-Object -First 1
        return @{
            available = $true
            version = $version.ToString().Trim()
        }
    }
    catch {
        return @{
            available = $false
            version = $null
            error = $_.Exception.Message
        }
    }
}

function Test-GitHubCLI {
    $result = Test-Command "gh" "GitHub CLI"

    if ($result.available) {
        # Verificar autenticação
        try {
            $authCheck = gh auth status 2>&1
            $result.authenticated = $authCheck -match "Logged in"
        }
        catch {
            $result.authenticated = $false
        }

        # Verificar Copilot CLI
        try {
            $copilotVersion = gh copilot --version 2>&1
            $result.copilotAvailable = $true
            $result.copilotVersion = $copilotVersion.ToString().Trim()
        }
        catch {
            $result.copilotAvailable = $false
        }
    }

    return $result
}

function Test-NodeJS {
    $result = Test-Command "node" "Node.js"

    if ($result.available) {
        # Verificar npm
        $npmResult = Test-Command "npm" "npm"
        $result.npm = $npmResult

        # Verificar dependências do projeto
        if (Test-Path (Join-Path $ProjectRoot "package.json")) {
            $packageJson = Get-Content (Join-Path $ProjectRoot "package.json") | ConvertFrom-Json
            $result.projectDependencies = $true
        }
    }

    return $result
}

function Test-TestingTools {
    $result = @{
        playwright = Test-Command "npx" "Playwright"
        vitest = $false
    }

    # Verificar se Playwright está instalado
    try {
        $playwrightCheck = npx playwright --version 2>&1
        $result.playwright.available = $true
        $result.playwright.version = $playwrightCheck.ToString().Trim()
    }
    catch {
        $result.playwright.available = $false
    }

    # Verificar Vitest via package.json
    if (Test-Path (Join-Path $ProjectRoot "package.json")) {
        $packageJson = Get-Content (Join-Path $ProjectRoot "package.json") | ConvertFrom-Json
        $result.vitest = $packageJson.devDependencies.PSObject.Properties.Name -contains "vitest"
    }

    return $result
}

function Test-AnthropicSDK {
    $result = @{
        available = $false
        version = $null
    }

    if (Test-Path (Join-Path $ProjectRoot "package.json")) {
        $packageJson = Get-Content (Join-Path $ProjectRoot "package.json") | ConvertFrom-Json
        $hasAnthropic = $packageJson.dependencies.PSObject.Properties.Name -contains "@anthropic-ai/sdk"

        if ($hasAnthropic) {
            $result.available = $true
            $result.version = $packageJson.dependencies."@anthropic-ai/sdk"
        }
    }

    # Verificar variável de ambiente
    $result.apiKeyConfigured = [bool]$env:ANTHROPIC_API_KEY

    return $result
}

function Write-Status {
    param(
        [string]$Tool,
        [object]$Result,
        [string]$Color = "Green"
    )

    if (-not $JsonOutput) {
        $status = if ($Result.available -or $Result.installed) { "[OK]" } else { "[FALTA]" }
        Write-Host "$status $Tool" -ForegroundColor $Color

        if ($Result.version) {
            Write-Host "    Versão: $($Result.version)" -ForegroundColor Gray
        }

        if ($Result.error) {
            Write-Host "    Erro: $($Result.error)" -ForegroundColor Red
        }
    }
}

# Validações
Write-Host "`n🔧 Validando Ferramentas...`n" -ForegroundColor Cyan

# GitHub CLI
$ghResult = Test-GitHubCLI
$Results.tools.githubCli = $ghResult
Write-Status "GitHub CLI" $ghResult
if (-not $ghResult.available) { $Results.allValid = $false }

# Node.js
$nodeResult = Test-NodeJS
$Results.tools.nodejs = $nodeResult
Write-Status "Node.js" $nodeResult
if (-not $nodeResult.available) { $Results.allValid = $false }

# Ferramentas de Teste
$testResult = Test-TestingTools
$Results.tools.testing = $testResult
Write-Status "Playwright" $testResult.playwright
Write-Status "Vitest" @{ available = $testResult.vitest; installed = $testResult.vitest }
if (-not $testResult.playwright.available -or -not $testResult.vitest) { $Results.allValid = $false }

# Anthropic SDK
$anthropicResult = Test-AnthropicSDK
$Results.tools.anthropic = $anthropicResult
Write-Status "Anthropic SDK" $anthropicResult
if (-not $anthropicResult.available) { $Results.allValid = $false }

# Resumo
Write-Host "`n" -NoNewline
if ($Results.allValid) {
    Write-Host '[OK] Todas as ferramentas estao disponiveis!' -ForegroundColor Green
}
else {
    Write-Host '[ERRO] Algumas ferramentas estao faltando!' -ForegroundColor Red
}

# Output JSON se solicitado
if ($JsonOutput) {
    $Results | ConvertTo-Json -Depth 10 | Write-Output
}

# Exit code
exit (if ($Results.allValid) { 0 } else { 1 })
