# 🌙 Automação Noturna v2 - Nossa Maternidade
# Sistema robusto de automação noturna com validação, análise e relatórios

param(
    [switch]$DryRun,
    [switch]$SkipTests,
    [switch]$SkipBuild,
    [switch]$SkipAnalysis
)

$ErrorActionPreference = "Continue"
$StartTime = Get-Date
$ProjectRoot = Join-Path $PSScriptRoot ".."
$ReportsDir = Join-Path $ProjectRoot "reports"
$LogsDir = Join-Path $ProjectRoot "logs"
$DateStamp = Get-Date -Format "yyyyMMdd"
$TimeStamp = Get-Date -Format "yyyyMMdd-HHmmss"
$LogFile = Join-Path $LogsDir "overnight-v2-$TimeStamp.log"
$ReportDir = Join-Path $ReportsDir $DateStamp

# Criar diretórios necessários
@($ReportsDir, $LogsDir, $ReportDir) | ForEach-Object {
    if (!(Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
    }
}

# Sistema de logs estruturado
function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO",
        [switch]$NoConsole
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"

    # Log para arquivo
    Add-Content -Path $LogFile -Value $logEntry -Encoding UTF8

    # Log para console
    if (-not $NoConsole) {
        $color = switch ($Level) {
            "ERROR" { "Red" }
            "WARN" { "Yellow" }
            "SUCCESS" { "Green" }
            "PHASE" { "Cyan" }
            default { "White" }
        }
        Write-Host $logEntry -ForegroundColor $color
    }
}

function Write-Phase {
    param([string]$Message)
    Write-Log "════════════════════════════════════════" "PHASE"
    Write-Log $Message "PHASE"
    Write-Log "════════════════════════════════════════" "PHASE"
}

function Write-Step {
    param([string]$Message)
    Write-Log "  -> $Message" "INFO"
}

function Write-Success {
    param([string]$Message)
    Write-Log "  [OK] $Message" "SUCCESS"
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Log "  [ERRO] $Message" "ERROR"
}

# Resultado estruturado
$Result = @{
    timestamp = $StartTime.ToString("yyyy-MM-dd HH:mm:ss")
    dryRun = $DryRun
    phases = @{}
    overallStatus = "success"
    errors = @()
    warnings = @()
}

# Log de início
Write-Phase "🌙 AUTOMAÇÃO NOTURNA v2 INICIADA"
Write-Log "Horário: $StartTime"
Write-Log "Diretório: $ProjectRoot"
Write-Log "Log: $LogFile"
Write-Log "Relatórios: $ReportDir"

if ($DryRun) {
    Write-Log "MODO DRY-RUN ATIVADO - Nenhuma alteração será feita" "WARN"
}

# ============================================================================
# FASE 1: Validação (00:00 - 00:15)
# ============================================================================
Write-Phase "FASE 1: Validação de Ferramentas"
$Phase1Start = Get-Date

try {
    Write-Step "Executando validação de ferramentas..."

    if ($DryRun) {
        Write-Log "  [DRY-RUN] Validação de ferramentas seria executada" "WARN"
        $Result.phases.validation = @{
            status = "skipped"
            reason = "dry-run"
        }
    }
    else {
        $validationScript = Join-Path $PSScriptRoot "validate-tools.ps1"

        if (Test-Path $validationScript) {
            $validationOutput = & $validationScript -JsonOutput 2>&1

            if ($LASTEXITCODE -eq 0) {
                $validationResult = $validationOutput | ConvertFrom-Json
                $Result.phases.validation = @{
                    status = "success"
                    result = $validationResult
                }
                Write-Success "Todas as ferramentas validadas"
            }
            else {
                $Result.phases.validation = @{
                    status = "failed"
                    error = $validationOutput | Out-String
                }
                $Result.errors += "Validação de ferramentas falhou"
                Write-Error-Custom "Validação de ferramentas falhou"

                # Continuar mesmo assim (soft fail)
                Write-Log "Continuando apesar da falha na validação..." "WARN"
            }
        }
        else {
            Write-Error-Custom "Script de validação não encontrado: $validationScript"
            $Result.errors += "Script de validação não encontrado"
        }
    }
}
catch {
    Write-Error-Custom "Erro na Fase 1: $_"
    $Result.errors += "Fase 1: $_"
}

$Phase1Duration = (Get-Date) - $Phase1Start
Write-Log "Fase 1 concluída em $($Phase1Duration.TotalSeconds)s" "INFO"

# ============================================================================
# FASE 2: Testes e Qualidade (00:15 - 01:30)
# ============================================================================
Write-Phase "FASE 2: Testes e Qualidade"
$Phase2Start = Get-Date

if ($SkipTests) {
    Write-Log "Testes pulados via parâmetro -SkipTests" "WARN"
    $Result.phases.tests = @{
        status = "skipped"
        reason = "user-request"
    }
}
else {
    try {
        # Testes E2E
        Write-Step "Executando testes E2E..."

        if ($DryRun) {
            Write-Log "  [DRY-RUN] Testes E2E seriam executados" "WARN"
        }
        else {
            Push-Location $ProjectRoot
            try {
                $testOutput = npm run test:all 2>&1
                $testResult = @{
                    success = $LASTEXITCODE -eq 0
                    output = $testOutput | Out-String
                }

                # Salvar resultado
                $testReportPath = Join-Path $ReportDir "tests" "test-results-$DateStamp.json"
                $testReportDir = Split-Path $testReportPath -Parent
                if (!(Test-Path $testReportDir)) {
                    New-Item -ItemType Directory -Path $testReportDir -Force | Out-Null
                }

                $testReport = @{
                    timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
                    success = $testResult.success
                    output = $testResult.output
                    passed = ($testOutput | Select-String "passed").Count
                    failed = ($testOutput | Select-String "failed").Count
                    total = ($testOutput | Select-String "passed|failed").Count
                }

                $testReport | ConvertTo-Json -Depth 10 | Out-File -FilePath $testReportPath -Encoding UTF8
                Write-Success "Resultados dos testes salvos em $testReportPath"

                if ($testResult.success) {
                    $Result.phases.tests = @{
                        status = "success"
                        report = $testReportPath
                    }
                    Write-Success "Todos os testes passaram"
                }
                else {
                    $Result.phases.tests = @{
                        status = "partial"
                        report = $testReportPath
                        failed = $testReport.failed
                    }
                    $Result.warnings += "$($testReport.failed) testes falharam"
                    Write-Error-Custom "$($testReport.failed) testes falharam"
                }
            }
            finally {
                Pop-Location
            }
        }

        # Cobertura de testes
        Write-Step "Gerando cobertura de testes..."

        if ($DryRun) {
            Write-Log "  [DRY-RUN] Cobertura seria gerada" "WARN"
        }
        else {
            Push-Location $ProjectRoot
            try {
                npm run test:coverage 2>&1 | Out-Null
                Write-Success "Cobertura de testes gerada"
            }
            catch {
                Write-Error-Custom "Erro ao gerar cobertura: $_"
                $Result.warnings += "Cobertura de testes não pôde ser gerada"
            }
            finally {
                Pop-Location
            }
        }

        # Auditoria de segurança
        Write-Step "Executando auditoria de segurança..."

        if ($DryRun) {
            Write-Log "  [DRY-RUN] Auditoria seria executada" "WARN"
        }
        else {
            Push-Location $ProjectRoot
            try {
                $auditOutput = npm audit --json 2>&1
                $auditReportPath = Join-Path $ReportDir "security-audit-$DateStamp.json"
                $auditOutput | Out-File -FilePath $auditReportPath -Encoding UTF8
                Write-Success "Auditoria de segurança salva em $auditReportPath"
            }
            catch {
                Write-Error-Custom "Erro na auditoria: $_"
                $Result.warnings += "Auditoria de segurança falhou"
            }
            finally {
                Pop-Location
            }
        }
    }
    catch {
        Write-Error-Custom "Erro na Fase 2: $_"
        $Result.errors += "Fase 2: $_"
        $Result.phases.tests = @{
            status = "failed"
            error = $_.Exception.Message
        }
    }
}

$Phase2Duration = (Get-Date) - $Phase2Start
Write-Log "Fase 2 concluída em $($Phase2Duration.TotalSeconds)s" "INFO"

# ============================================================================
# FASE 3: Análise de Código (01:30 - 03:00)
# ============================================================================
Write-Phase "FASE 3: Análise de Código"
$Phase3Start = Get-Date

if ($SkipAnalysis) {
    Write-Log "Análise de código pulada via parâmetro -SkipAnalysis" "WARN"
    $Result.phases.analysis = @{
        status = "skipped"
        reason = "user-request"
    }
}
else {
    try {
        # GitHub Copilot CLI
        Write-Step "Executando análise com GitHub Copilot CLI..."

        if ($DryRun) {
            Write-Log "  [DRY-RUN] Análise do Copilot seria executada" "WARN"
        }
        else {
            $copilotScript = Join-Path $PSScriptRoot "copilot-executor.ps1"

            if (Test-Path $copilotScript) {
                $copilotPrompt = "Analise o código deste projeto e identifique: 1) Problemas de qualidade (bugs, code smells) 2) Oportunidades de melhoria 3) Problemas de segurança 4) Violações de boas práticas 5) Sugestões de refatoração"

                $copilotOutputPath = Join-Path $ReportDir "copilot" "analysis-$TimeStamp.json"
                $copilotOutputDir = Split-Path $copilotOutputPath -Parent
                if (!(Test-Path $copilotOutputDir)) {
                    New-Item -ItemType Directory -Path $copilotOutputDir -Force | Out-Null
                }

                & $copilotScript -Prompt $copilotPrompt -OutputFile $copilotOutputPath -JsonOutput 2>&1 | Out-Null

                if ($LASTEXITCODE -eq 0) {
                    Write-Success "Análise do Copilot concluída: $copilotOutputPath"
                    $Result.phases.copilot = @{
                        status = "success"
                        report = $copilotOutputPath
                    }
                }
                else {
                    Write-Error-Custom "Análise do Copilot falhou"
                    $Result.warnings += "Análise do Copilot falhou"
                    $Result.phases.copilot = @{
                        status = "failed"
                    }
                }
            }
            else {
                Write-Error-Custom "Script do Copilot não encontrado: $copilotScript"
            }
        }

        # Anthropic SDK (Análise Profunda)
        Write-Step "Executando análise profunda com Anthropic SDK..."

        if ($DryRun) {
            Write-Log "  [DRY-RUN] Análise profunda seria executada" "WARN"
        }
        else {
            $analyzerScript = Join-Path $PSScriptRoot "code-analyzer.mjs"

            if (Test-Path $analyzerScript) {
                $analyzerOutputPath = Join-Path $ReportDir "code-analyzer" "deep-analysis-$TimeStamp.json"
                $analyzerOutputDir = Split-Path $analyzerOutputPath -Parent
                if (!(Test-Path $analyzerOutputDir)) {
                    New-Item -ItemType Directory -Path $analyzerOutputDir -Force | Out-Null
                }

                Push-Location $ProjectRoot
                try {
                    $analyzerOutput = node $analyzerScript $analyzerOutputPath 2>&1

                    if ($LASTEXITCODE -eq 0) {
                        Write-Success "Análise profunda concluída: $analyzerOutputPath"
                        $Result.phases.anthropic = @{
                            status = "success"
                            report = $analyzerOutputPath
                        }
                    }
                    else {
                        Write-Error-Custom "Análise profunda falhou: $analyzerOutput"
                        $Result.warnings += "Análise profunda falhou"
                        $Result.phases.anthropic = @{
                            status = "failed"
                            error = $analyzerOutput | Out-String
                        }
                    }
                }
                finally {
                    Pop-Location
                }
            }
            else {
                Write-Error-Custom "Script de análise não encontrado: $analyzerScript"
            }
        }
    }
    catch {
        Write-Error-Custom "Erro na Fase 3: $_"
        $Result.errors += "Fase 3: $_"
    }
}

$Phase3Duration = (Get-Date) - $Phase3Start
Write-Log "Fase 3 concluída em $($Phase3Duration.TotalSeconds)s" "INFO"

# ============================================================================
# FASE 4: Build e Validação (03:00 - 04:00)
# ============================================================================
Write-Phase "FASE 4: Build e Validação"
$Phase4Start = Get-Date

if ($SkipBuild) {
    Write-Log "Build pulado via parâmetro -SkipBuild" "WARN"
    $Result.phases.build = @{
        status = "skipped"
        reason = "user-request"
    }
}
else {
    try {
        # Verificar tipos TypeScript
        Write-Step "Verificando tipos TypeScript..."

        if ($DryRun) {
            Write-Log "  [DRY-RUN] Verificação de tipos seria executada" "WARN"
        }
        else {
            Push-Location $ProjectRoot
            try {
                $typeCheck = npx tsc --noEmit 2>&1

                if ($LASTEXITCODE -eq 0) {
                    Write-Success "Tipos TypeScript verificados"
                    $Result.phases.typeCheck = @{
                        status = "success"
                    }
                }
                else {
                    Write-Error-Custom "Erros de tipo encontrados: $typeCheck"
                    $Result.errors += "Erros de tipo TypeScript"
                    $Result.phases.typeCheck = @{
                        status = "failed"
                        errors = $typeCheck | Out-String
                    }
                }
            }
            finally {
                Pop-Location
            }
        }

        # Build
        Write-Step "Executando build..."

        if ($DryRun) {
            Write-Log "  [DRY-RUN] Build seria executado" "WARN"
        }
        else {
            Push-Location $ProjectRoot
            try {
                $buildOutput = npm run build 2>&1

                if ($LASTEXITCODE -eq 0) {
                    Write-Success "Build concluído com sucesso"
                    $Result.phases.build = @{
                        status = "success"
                    }
                }
                else {
                    Write-Error-Custom "Build falhou: $buildOutput"
                    $Result.errors += "Build falhou"
                    $Result.phases.build = @{
                        status = "failed"
                        errors = $buildOutput | Out-String
                    }
                }
            }
            finally {
                Pop-Location
            }
        }
    }
    catch {
        Write-Error-Custom "Erro na Fase 4: $_"
        $Result.errors += "Fase 4: $_"
    }
}

$Phase4Duration = (Get-Date) - $Phase4Start
Write-Log "Fase 4 concluída em $($Phase4Duration.TotalSeconds)s" "INFO"

# ============================================================================
# FASE 5: Geração de Relatórios (04:00 - 04:30)
# ============================================================================
Write-Phase "FASE 5: Geração de Relatórios"
$Phase5Start = Get-Date

try {
    Write-Step "Gerando relatório combinado..."

    if ($DryRun) {
        Write-Log "  [DRY-RUN] Relatório seria gerado" "WARN"
    }
    else {
        $reportGeneratorScript = Join-Path $PSScriptRoot "report-generator.mjs"

        if (Test-Path $reportGeneratorScript) {
            Push-Location $ProjectRoot
            try {
                node $reportGeneratorScript $DateStamp 2>&1 | Out-Null

                if ($LASTEXITCODE -eq 0) {
                    Write-Success "Relatório combinado gerado"
                    $Result.phases.reporting = @{
                        status = "success"
                        reportDir = $ReportDir
                    }
                }
                else {
                    Write-Error-Custom "Geração de relatório falhou"
                    $Result.warnings += "Geração de relatório falhou"
                }
            }
            finally {
                Pop-Location
            }
        }
        else {
            Write-Error-Custom "Script de geração de relatório não encontrado: $reportGeneratorScript"
        }
    }
}
catch {
    Write-Error-Custom "Erro na Fase 5: $_"
    $Result.errors += "Fase 5: $_"
}

$Phase5Duration = (Get-Date) - $Phase5Start
Write-Log "Fase 5 concluída em $($Phase5Duration.TotalSeconds)s" "INFO"

# ============================================================================
# Resumo Final
# ============================================================================
$EndTime = Get-Date
$TotalDuration = $EndTime - $StartTime

# Atualizar status geral
if ($Result.errors.Count -gt 0) {
    $Result.overallStatus = "failed"
}
elseif ($Result.warnings.Count -gt 0) {
    $Result.overallStatus = "partial"
}
else {
    $Result.overallStatus = "success"
}

Write-Phase "📊 RESUMO FINAL"
Write-Log "Status Geral: $($Result.overallStatus)"
Write-Log "Tempo Total: $($TotalDuration.TotalMinutes) minutos"
Write-Log "Erros: $($Result.errors.Count)"
Write-Log "Avisos: $($Result.warnings.Count)"
Write-Log ""
Write-Log "Relatórios disponíveis em: $ReportDir"
Write-Log "Log completo em: $LogFile"

# Salvar resultado JSON
$resultPath = Join-Path $ReportDir "execution-result-$TimeStamp.json"
$Result.duration = $TotalDuration.TotalSeconds
$Result | ConvertTo-Json -Depth 10 | Out-File -FilePath $resultPath -Encoding UTF8
Write-Log "Resultado salvo em: $resultPath"

# Exit code
if ($Result.overallStatus -eq "success") {
    Write-Log "✅ Automação concluída com sucesso!" "SUCCESS"
    exit 0
}
elseif ($Result.overallStatus -eq "partial") {
    Write-Log "⚠️ Automação concluída com avisos" "WARN"
    exit 1
}
else {
    Write-Log "❌ Automação concluída com erros" "ERROR"
    exit 1
}
