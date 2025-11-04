# 🌙 Automação Noturna - Nossa Maternidade
# Executa tarefas autônomas enquanto você dorme

param(
    [switch]$SkipTests,
    [switch]$SkipBuild,
    [switch]$DryRun
)

$ErrorActionPreference = "Continue"
$StartTime = Get-Date
$ProjectRoot = Join-Path $PSScriptRoot ".."
$ReportsDir = Join-Path $ProjectRoot "reports"
$DateStamp = Get-Date -Format "yyyyMMdd"

# Criar diretório de relatórios se não existir
if (!(Test-Path $ReportsDir)) {
    New-Item -ItemType Directory -Path $ReportsDir -Force | Out-Null
}

function Write-Phase {
    param([string]$Message, [string]$Color = "Yellow")
    Write-Host "`n" -NoNewline
    Write-Host "════════════════════════════════════════" -ForegroundColor Gray
    Write-Host $Message -ForegroundColor $Color
    Write-Host "════════════════════════════════════════" -ForegroundColor Gray
}

function Write-Step {
    param([string]$Message)
    Write-Host "  -> $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "  [OK] $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "  [ERRO] $Message" -ForegroundColor Red
}

# Log de inicio
Write-Host ""
Write-Host "AUTOMACAO NOTURNA INICIADA" -ForegroundColor Magenta
Write-Host "Horario: $StartTime" -ForegroundColor Gray
Write-Host "Diretorio: $PSScriptRoot" -ForegroundColor Gray

if ($DryRun) {
    Write-Host "MODO DRY RUN - Nenhuma alteracao sera feita" -ForegroundColor Yellow
}

# ============================================
# FASE 1: TESTES E QUALIDADE
# ============================================
Write-Phase "FASE 1: Testes e Qualidade" "Yellow"

if (!$SkipTests) {
    Write-Step "Executando todos os testes E2E..."
    try {
        if (!$DryRun) {
            $TestResult = & npm run test:all 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Testes E2E concluídos com sucesso"
            }
            else {
                Write-Error-Custom "Alguns testes falharam (verifique relatório)"
            }
        }
        else {
            Write-Host "  [DRY RUN] Testes seriam executados" -ForegroundColor Gray
        }
    }
    catch {
        Write-Error-Custom "Erro ao executar testes: $_"
    }

    Write-Step "Gerando relatório de cobertura..."
    try {
        if (!$DryRun) {
            $CoverageResult = & npm run test:coverage 2>&1
            Write-Success "Relatório de cobertura gerado"
        }
        else {
            Write-Host "  [DRY RUN] Cobertura seria gerada" -ForegroundColor Gray
        }
    }
    catch {
        Write-Error-Custom "Erro ao gerar cobertura: $_"
    }
}
else {
    Write-Host "  ⊘ Testes pulados (--SkipTests)" -ForegroundColor Gray
}

# ============================================
# FASE 2: ANÁLISE E REFATORAÇÃO
# ============================================
Write-Phase "FASE 2: Analise e Refatoracao" "Yellow"

Write-Step "Analisando código com Claude Code..."
try {
    if (!$DryRun) {
        $AppPath = Join-Path $PSScriptRoot ".." "app"
        $AuditReport = Join-Path $ReportsDir "code-audit-$DateStamp.md"

        # Verificar se Claude Code está disponível
        $ClaudeAvailable = & npx claude --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Claude Code disponível"
            # npx claude code --analyze --ultrathink $AppPath --output $AuditReport
            Write-Host "  [INFO] Análise de código seria executada aqui" -ForegroundColor Gray
        }
        else {
            Write-Error-Custom "Claude Code não disponível (instale: npm install -g @anthropic-ai/claude-code)"
        }
    }
    else {
        Write-Host "  [DRY RUN] Análise de código seria executada" -ForegroundColor Gray
    }
}
catch {
    Write-Error-Custom "Erro na análise de código: $_"
}

Write-Step "Verificando GitHub Copilot CLI..."
try {
    if (!$DryRun) {
        # Verificar se Copilot CLI está disponível
        $CopilotAvailable = & gh copilot --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "GitHub Copilot CLI disponível"

            # FASE 2: Refatoração com Copilot (modo programático)
            Write-Step "Refatorando com Copilot (modo programático)..."
            $RefactorPrompt = "Refactor code in ./app directory following best practices and patterns. Generate a refactoring report in reports/refactor-$DateStamp.md"
            # copilot -p $RefactorPrompt --allow-tool 'write' --allow-tool 'shell'
            Write-Host "  [INFO] Refatoração com Copilot seria executada aqui" -ForegroundColor Gray
        }
        else {
            Write-Host "  [INFO] GitHub Copilot CLI não disponível (instale: gh copilot setup)" -ForegroundColor Gray
        }
    }
    else {
        Write-Host "  [DRY RUN] Verificação de Copilot seria executada" -ForegroundColor Gray
    }
}
catch {
    Write-Host "  [INFO] Erro ao verificar Copilot CLI: $_" -ForegroundColor Gray
}

# ============================================
# FASE 3: SEGURANÇA E AUDITORIA
# ============================================
Write-Phase "FASE 3: Seguranca e Auditoria" "Yellow"

Write-Step "Verificando vulnerabilidades (npm audit)..."
try {
    if (!$DryRun) {
        $AuditResult = & npm audit --audit-level=moderate 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Nenhuma vulnerabilidade crítica encontrada"
        }
        else {
            Write-Error-Custom "Vulnerabilidades encontradas (verifique: npm audit)"
        }
    }
    else {
        Write-Host "  [DRY RUN] Auditoria seria executada" -ForegroundColor Gray
    }
}
catch {
    Write-Error-Custom "Erro na auditoria: $_"
}

# ============================================
# FASE 4: PERFORMANCE E OTIMIZAÇÃO
# ============================================
Write-Phase "FASE 4: Performance e Otimizacao" "Yellow"

Write-Step "Otimizando imagens..."
try {
    if (!$DryRun) {
        $OptimizeResult = & npm run optimize:images 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Imagens otimizadas"
        }
        else {
            Write-Error-Custom "Erro ao otimizar imagens"
        }
    }
    else {
        Write-Host "  [DRY RUN] Otimização seria executada" -ForegroundColor Gray
    }
}
catch {
    Write-Error-Custom "Erro na otimização: $_"
}

# ============================================
# FASE 5: BUILD E VALIDAÇÃO
# ============================================
Write-Phase "FASE 6: CI/CD e Deploy" "Yellow"

if (!$SkipBuild) {
    Write-Step "Verificando tipos TypeScript..."
    try {
        if (!$DryRun) {
            $TscResult = & npx tsc --noEmit 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Success "TypeScript: sem erros"
            }
            else {
                Write-Error-Custom "Erros de TypeScript encontrados"
            }
        }
        else {
            Write-Host "  [DRY RUN] Verificação de tipos seria executada" -ForegroundColor Gray
        }
    }
    catch {
        Write-Error-Custom "Erro na verificação de tipos: $_"
    }

    Write-Step "Executando build de produção..."
    try {
        if (!$DryRun) {
            $BuildResult = & npm run build 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Build concluído com sucesso"
            }
            else {
                Write-Error-Custom "Build falhou (verifique erros acima)"
            }
        }
        else {
            Write-Host "  [DRY RUN] Build seria executado" -ForegroundColor Gray
        }
    }
    catch {
        Write-Error-Custom "Erro no build: $_"
    }
}
else {
    Write-Host "  ⊘ Build pulado (--SkipBuild)" -ForegroundColor Gray
}

# ============================================
# RESUMO FINAL
# ============================================
$EndTime = Get-Date
$Duration = $EndTime - $StartTime

Write-Host ""
Write-Phase "AUTOMACAO NOTURNA CONCLUIDA" "Green"
Write-Host "  Inicio: $StartTime" -ForegroundColor Gray
Write-Host "  Fim:    $EndTime" -ForegroundColor Gray
Write-Host "  Duracao: $($Duration.TotalMinutes.ToString('F2')) minutos" -ForegroundColor Gray
Write-Host ""
Write-Host "  Relatorios disponiveis em: $ReportsDir" -ForegroundColor Cyan
Write-Host ""

# Retornar código de saída
if ($LASTEXITCODE -eq 0) {
    exit 0
}
else {
    exit 1
}
