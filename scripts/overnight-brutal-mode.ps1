# 🌙 Automação Noturna - Modo Brutal
# Análise assertiva com Claude Code CLI (auto compact 60-70k tokens)

param(
    [switch]$SkipTests,
    [switch]$SkipBuild,
    [switch]$DryRun,
    [int]$MaxTokens = 70000,
    [int]$MinTokens = 60000
)

$ErrorActionPreference = "Continue"
$StartTime = Get-Date
$ProjectRoot = Join-Path $PSScriptRoot ".."
$ReportsDir = Join-Path $ProjectRoot "reports"
$DateStamp = Get-Date -Format "yyyyMMdd"
$LogsDir = Join-Path $ProjectRoot "logs"
$LogFile = Join-Path $LogsDir "overnight-brutal-$DateStamp.log"

# Criar diretórios
@($ReportsDir, $LogsDir) | ForEach-Object {
    if (!(Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
    }
}

# Função de log
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogMessage = "[$Timestamp] [$Level] $Message"
    Add-Content -Path $LogFile -Value $LogMessage
    Write-Host $LogMessage
}

function Write-Phase {
    param([string]$Message, [string]$Color = "Yellow")
    Write-Host "`n" -NoNewline
    Write-Host "════════════════════════════════════════" -ForegroundColor Gray
    Write-Host $Message -ForegroundColor $Color
    Write-Host "════════════════════════════════════════" -ForegroundColor Gray
    Write-Log $Message "PHASE"
}

function Write-Step {
    param([string]$Message)
    Write-Host "  -> $Message" -ForegroundColor Cyan
    Write-Log $Message "STEP"
}

function Write-Success {
    param([string]$Message)
    Write-Host "  [OK] $Message" -ForegroundColor Green
    Write-Log $Message "SUCCESS"
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "  [ERRO] $Message" -ForegroundColor Red
    Write-Log $Message "ERROR"
}

# Log de início
Write-Host ""
Write-Host "🔥 AUTOMACAO NOTURNA - MODO BRUTAL INICIADA" -ForegroundColor Magenta
Write-Host "Horario: $StartTime" -ForegroundColor Gray
Write-Host "Tokens: $MinTokens - $MaxTokens" -ForegroundColor Gray
Write-Host "Log: $LogFile" -ForegroundColor Gray
Write-Log "Automação noturna modo brutal iniciada" "INFO"

if ($DryRun) {
    Write-Host "⚠️  MODO DRY RUN - Nenhuma alteracao sera feita" -ForegroundColor Yellow
    Write-Log "Executando em modo DRY RUN" "WARN"
}

# ============================================
# FASE 1: VALIDAÇÃO E PREPARAÇÃO
# ============================================
Write-Phase "FASE 1: Validacao e Preparacao" "Yellow"

Write-Step "Verificando ferramentas..."
$ToolsAvailable = @{
    ClaudeCode = $false
    GitHubCLI  = $false
    Node       = $false
}

# Verificar Claude Code CLI
try {
    $ClaudeVersion = & npx @anthropic-ai/claude-code --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $ToolsAvailable.ClaudeCode = $true
        Write-Success "Claude Code CLI disponível"
    }
}
catch {
    Write-Error-Custom "Claude Code CLI não disponível"
}

# Verificar GitHub CLI
try {
    $GitHubVersion = & gh --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $ToolsAvailable.GitHubCLI = $true
        Write-Success "GitHub CLI disponível"
    }
}
catch {
    Write-Host "  [INFO] GitHub CLI não disponível (opcional)" -ForegroundColor Gray
}

# Verificar Node.js
try {
    $NodeVersion = & node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $ToolsAvailable.Node = $true
        Write-Success "Node.js disponível: $NodeVersion"
    }
}
catch {
    Write-Error-Custom "Node.js não disponível"
    exit 1
}

if (-not $ToolsAvailable.ClaudeCode) {
    Write-Error-Custom "Claude Code CLI é obrigatório para modo brutal"
    Write-Host "  Instale: npm install -g @anthropic-ai/claude-code" -ForegroundColor Yellow
    exit 1
}

# ============================================
# FASE 2: ANÁLISE BRUTAL DE CÓDIGO
# ============================================
Write-Phase "FASE 2: Analise Brutal de Codigo" "Red"

Write-Step "Executando análise brutal com Claude Code CLI..."
if (!$DryRun) {
    try {
        $BrutalAnalysisScript = Join-Path $PSScriptRoot "claude-code-brutal-analyzer.ps1"
        $AnalysisReport = Join-Path $ReportsDir "brutal-analysis-$DateStamp.md"

        $AnalysisResult = & powershell -ExecutionPolicy Bypass -File $BrutalAnalysisScript `
            -TargetPath "./app" `
            -OutputPath $AnalysisReport `
            -MaxTokens $MaxTokens `
            -MinTokens $MinTokens

        if ($LASTEXITCODE -eq 0) {
            Write-Success "Análise brutal concluída!"
            Write-Host "  Relatório: $AnalysisReport" -ForegroundColor Cyan
            Write-Log "Análise brutal concluída: $AnalysisReport" "SUCCESS"
        }
        else {
            Write-Error-Custom "Análise brutal falhou"
            Write-Log "Análise brutal falhou" "ERROR"
        }
    }
    catch {
        Write-Error-Custom "Erro na análise brutal: $_"
        Write-Log "Erro na análise brutal: $_" "ERROR"
    }
}
else {
    Write-Host "  [DRY RUN] Análise brutal seria executada" -ForegroundColor Gray
}

# ============================================
# FASE 3: REFATORAÇÃO AUTOMÁTICA
# ============================================
Write-Phase "FASE 3: Refatoracao Automatica" "Yellow"

Write-Step "Refatorando código com Claude Code CLI..."
if (!$DryRun) {
    try {
        $RefactorReport = Join-Path $ReportsDir "refactor-$DateStamp.md"
        $AppPath = Join-Path $ProjectRoot "app"

        # Configurar auto compact
        $env:CLAUDE_MAX_TOKENS = $MaxTokens.ToString()
        $env:CLAUDE_MIN_TOKENS = $MinTokens.ToString()

        # Refatoração com auto compact
        $RefactorArgs = @(
            "@anthropic-ai/claude-code",
            "refactor",
            $AppPath,
            "--output", $RefactorReport,
            "--max-tokens", $MaxTokens.ToString(),
            "--context-window", "200000",
            "--improve-performance",
            "--fix-smells",
            "--ultrathink"
        )

        Write-Host "  Executando refatoração com auto compact..." -ForegroundColor Gray
        $RefactorResult = & npx $RefactorArgs 2>&1

        if ($LASTEXITCODE -eq 0) {
            Write-Success "Refatoração concluída!"
            Write-Host "  Relatório: $RefactorReport" -ForegroundColor Cyan
            Write-Log "Refatoração concluída: $RefactorReport" "SUCCESS"
        }
        else {
            Write-Error-Custom "Refatoração falhou"
            Write-Log "Refatoração falhou" "ERROR"
        }
    }
    catch {
        Write-Error-Custom "Erro na refatoração: $_"
        Write-Log "Erro na refatoração: $_" "ERROR"
    }
}
else {
    Write-Host "  [DRY RUN] Refatoração seria executada" -ForegroundColor Gray
}

# ============================================
# FASE 4: ANÁLISE DE SEGURANÇA
# ============================================
Write-Phase "FASE 4: Analise de Seguranca" "Red"

Write-Step "Scan de segurança com Claude Code CLI..."
if (!$DryRun) {
    try {
        $SecurityReport = Join-Path $ReportsDir "security-$DateStamp.md"
        $AppPath = Join-Path $ProjectRoot "app"

        # Configurar auto compact
        $env:CLAUDE_MAX_TOKENS = $MaxTokens.ToString()

        $SecurityArgs = @(
            "@anthropic-ai/claude-code",
            "security-audit",
            $AppPath,
            "--output", $SecurityReport,
            "--max-tokens", $MaxTokens.ToString(),
            "--check-secrets",
            "--check-injection",
            "--ultrathink"
        )

        Write-Host "  Executando scan de segurança..." -ForegroundColor Gray
        $SecurityResult = & npx $SecurityArgs 2>&1

        if ($LASTEXITCODE -eq 0) {
            Write-Success "Scan de segurança concluído!"
            Write-Host "  Relatório: $SecurityReport" -ForegroundColor Cyan
            Write-Log "Scan de segurança concluído: $SecurityReport" "SUCCESS"
        }
        else {
            Write-Error-Custom "Scan de segurança falhou"
            Write-Log "Scan de segurança falhou" "ERROR"
        }
    }
    catch {
        Write-Error-Custom "Erro no scan de segurança: $_"
        Write-Log "Erro no scan de segurança: $_" "ERROR"
    }
}
else {
    Write-Host "  [DRY RUN] Scan de segurança seria executado" -ForegroundColor Gray
}

# ============================================
# FASE 5: ANÁLISE DE PERFORMANCE
# ============================================
Write-Phase "FASE 5: Analise de Performance" "Yellow"

Write-Step "Análise de bundle e performance..."
if (!$DryRun) {
    try {
        $PerformanceReport = Join-Path $ReportsDir "performance-$DateStamp.md"
        $AppPath = Join-Path $ProjectRoot "app"

        # Configurar auto compact
        $env:CLAUDE_MAX_TOKENS = $MaxTokens.ToString()

        $PerformanceArgs = @(
            "@anthropic-ai/claude-code",
            "analyze-bundle",
            $AppPath,
            "--output", $PerformanceReport,
            "--max-tokens", $MaxTokens.ToString(),
            "--optimize-assets",
            "--ultrathink"
        )

        Write-Host "  Executando análise de performance..." -ForegroundColor Gray
        $PerformanceResult = & npx $PerformanceArgs 2>&1

        if ($LASTEXITCODE -eq 0) {
            Write-Success "Análise de performance concluída!"
            Write-Host "  Relatório: $PerformanceReport" -ForegroundColor Cyan
            Write-Log "Análise de performance concluída: $PerformanceReport" "SUCCESS"
        }
        else {
            Write-Error-Custom "Análise de performance falhou"
            Write-Log "Análise de performance falhou" "ERROR"
        }
    }
    catch {
        Write-Error-Custom "Erro na análise de performance: $_"
        Write-Log "Erro na análise de performance: $_" "ERROR"
    }
}
else {
    Write-Host "  [DRY RUN] Análise de performance seria executada" -ForegroundColor Gray
}

# ============================================
# FASE 6: TESTES E VALIDAÇÃO
# ============================================
Write-Phase "FASE 6: Testes e Validacao" "Yellow"

if (!$SkipTests) {
    Write-Step "Executando testes E2E..."
    if (!$DryRun) {
        try {
            $TestResult = & npm run test:all 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Testes E2E concluídos com sucesso"
                Write-Log "Testes E2E concluídos" "SUCCESS"
            }
            else {
                Write-Error-Custom "Alguns testes falharam"
                Write-Log "Testes falharam" "ERROR"
            }
        }
        catch {
            Write-Error-Custom "Erro ao executar testes: $_"
            Write-Log "Erro nos testes: $_" "ERROR"
        }
    }
    else {
        Write-Host "  [DRY RUN] Testes seriam executados" -ForegroundColor Gray
    }
}

# ============================================
# FASE 7: BUILD E VALIDAÇÃO FINAL
# ============================================
Write-Phase "FASE 7: Build e Validacao Final" "Yellow"

if (!$SkipBuild) {
    Write-Step "Verificando tipos TypeScript..."
    if (!$DryRun) {
        try {
            $TscResult = & npx tsc --noEmit 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Success "TypeScript: sem erros"
                Write-Log "TypeScript validado" "SUCCESS"
            }
            else {
                Write-Error-Custom "Erros de TypeScript encontrados"
                Write-Log "Erros TypeScript encontrados" "ERROR"
            }
        }
        catch {
            Write-Error-Custom "Erro na verificação de tipos: $_"
            Write-Log "Erro na verificação TypeScript: $_" "ERROR"
        }
    }

    Write-Step "Executando build de produção..."
    if (!$DryRun) {
        try {
            $BuildResult = & npm run build 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Build concluído com sucesso"
                Write-Log "Build concluído" "SUCCESS"
            }
            else {
                Write-Error-Custom "Build falhou"
                Write-Log "Build falhou" "ERROR"
            }
        }
        catch {
            Write-Error-Custom "Erro no build: $_"
            Write-Log "Erro no build: $_" "ERROR"
        }
    }
}

# ============================================
# RESUMO FINAL
# ============================================
$EndTime = Get-Date
$Duration = $EndTime - $StartTime

Write-Host ""
Write-Phase "AUTOMACAO NOTURNA - MODO BRUTAL CONCLUIDA" "Green"
Write-Host "  Inicio: $StartTime" -ForegroundColor Gray
Write-Host "  Fim:    $EndTime" -ForegroundColor Gray
$DurationText = $Duration.TotalMinutes.ToString('F2')
Write-Host "  Duracao: $DurationText minutos" -ForegroundColor Gray
Write-Host ""
$ReportsMsg = "  Relatorios disponiveis em: " + $ReportsDir
Write-Host $ReportsMsg -ForegroundColor Cyan
$LogMsg = "  Log completo: " + $LogFile
Write-Host $LogMsg -ForegroundColor Cyan
Write-Host ""

Write-Log 'Automacao noturna modo brutal concluida' 'INFO'
$DurationMinutes = $Duration.TotalMinutes.ToString('F2')
$DurationLog = 'Duracao: ' + $DurationMinutes + ' min'
Write-Log $DurationLog 'INFO'

# Retornar código de saída
if ($LASTEXITCODE -eq 0) {
    exit 0
}
else {
    exit 1
}
