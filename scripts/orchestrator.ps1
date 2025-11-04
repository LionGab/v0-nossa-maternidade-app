# 🚀 Sistema de Orquestração Claude Code + Cursor
# Integração otimizada para workflow super ágil e automático

param(
    [Parameter(Position=0)]
    [string]$Command = "help",

    [Parameter(Position=1)]
    [string[]]$Arguments = @(),

    [switch]$DebugMode,
    [switch]$DryRun
)

# Cores para output
$Colors = @{
    Info = "Cyan"
    Success = "Green"
    Warning = "Yellow"
    Error = "Red"
    Debug = "Gray"
}

# Configurações
$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Join-Path $ScriptRoot ".."
$WorkflowsPath = Join-Path $ProjectRoot "workflows.json"
$ConfigPath = Join-Path $ProjectRoot ".cursor" | Join-Path -ChildPath "orchestrator.json"

# Funções de utilidade
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White",
        [string]$Prefix = ""
    )
    if ($Prefix) {
        Write-Host "$Prefix " -NoNewline -ForegroundColor $Color
    }
    Write-Host $Message -ForegroundColor $Color
}

function Write-Info { param([string]$msg) Write-ColorOutput $msg $Colors.Info "[*]" }
function Write-Success { param([string]$msg) Write-ColorOutput $msg $Colors.Success "[OK]" }
function Write-War6ning { param([string]$msg) Write-ColorOutput $msg $Colors.Warning "[!]" }
function Write-Error { param([string]$msg) Write-ColorOutput $msg $Colors.Error "[ERRO]" }
function Write-Debug { param([string]$msg) if ($DebugMode) { Write-ColorOutput $msg $Colors.Debug "[D]" } }

# Verificar se Claude CLI está instalado
function Test-ClaudeCLI {
    try {
        # Tentar comando global primeiro
        $claudeVersion = claude --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Debug "Claude CLI encontrado: $claudeVersion"
            return $true
        }
    } catch {
        Write-Debug "Claude CLI não encontrado globalmente"
    }

    # Tentar via npx
    try {
        $claudeVersion = npx @anthropic-ai/claude-code --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Debug "Claude CLI encontrado via npx: $claudeVersion"
            return $true
        }
    } catch {
        Write-Debug "Claude CLI não encontrado via npx"
    }

    return $false
}

# Verificar se Cursor está rodando
function Test-CursorRunning {
    $cursorProcess = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue
    return $null -ne $cursorProcess
}

# Executar comando Claude CLI
function Invoke-ClaudeCommand {
    param(
        [string]$Action,
        [string]$Input,
        [hashtable]$Options = @{}
    )

    Write-Info "Executando comando Claude: $Action"

    if (-not (Test-ClaudeCLI)) {
        Write-Error "Claude CLI não encontrado. Execute: npm install -g @anthropic-ai/claude-code"
        return $null
    }

    # Tentar comando global primeiro, depois npx
    $cmd = "claude"
    try {
        $null = claude --version 2>&1
    } catch {
        $cmd = "npx"
        $args = @("@anthropic-ai/claude-code")
    }

    $args = @()

    switch ($Action) {
        "analyze" {
            $args += "analyze", $Input
        }
        "refactor" {
            $args += "refactor", $Input
        }
        "test" {
            $args += "test", $Input
        }
        "document" {
            $args += "document", $Input
        }
        "optimize" {
            $args += "optimize", $Input
        }
    }

    if ($DryRun) {
        Write-Warning "DRY RUN: $cmd $($args -join ' ')"
        return @{ success = $true; output = "Dry run mode" }
    }

    try {
        Push-Location $ProjectRoot
        $result = & $cmd $args 2>&1 | Out-String
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Comando executado com sucesso"
            return @{ success = $true; output = $result }
        } else {
            Write-Error "Erro ao executar comando: $result"
            return @{ success = $false; error = $result }
        }
    } catch {
        Write-Error "Exceção ao executar comando: $_"
        return @{ success = $false; error = $_.Exception.Message }
    } finally {
        Pop-Location
    }
}

# Executar workflow
function Invoke-Workflow {
    param(
        [string]$WorkflowName,
        [hashtable]$Params = @{}
    )

    Write-Info "Executando workflow: $WorkflowName"

    if (-not (Test-Path $WorkflowsPath)) {
        Write-Error "Arquivo workflows.json não encontrado"
        return $false
    }

    $workflows = Get-Content $WorkflowsPath -Raw | ConvertFrom-Json
    $workflow = $workflows.workflows | Where-Object { $_.name -eq $WorkflowName }

    if (-not $workflow) {
        Write-Error "Workflow '$WorkflowName' não encontrado"
        Write-Info "Workflows disponíveis:"
        $workflows.workflows | ForEach-Object { Write-Host "  - $($_.name)" -ForegroundColor Cyan }
        return $false
    }

    Write-Info "Descrição: $($workflow.description)"
    Write-Info "Etapas: $($workflow.steps.Count)"

    foreach ($step in $workflow.steps) {
        Write-Info "Executando etapa: $($step.name)"

        switch ($step.type) {
            "claude" {
                $result = Invoke-ClaudeCommand -Action $step.action -Input $step.input
                if (-not $result.success) {
                    Write-Error "Falha na etapa: $($step.name)"
                    return $false
                }
            }
            "script" {
                if ($DryRun) {
                    Write-Warning "DRY RUN: $($step.script)"
                } else {
                    Invoke-Expression $step.script
                }
            }
            "cursor" {
                Write-Info "Enviando comando para Cursor: $($step.command)"
                # Aqui você pode integrar com Cursor API se disponível
                # Por enquanto, apenas logamos
            }
            "file" {
                if ($DryRun) {
                    Write-Warning "DRY RUN: Criar arquivo $($step.path)"
                } else {
                    $content = $step.content
                    if ($Params.Count -gt 0) {
                        foreach ($key in $Params.Keys) {
                            $content = $content -replace "{{$key}}", $Params[$key]
                        }
                    }
                    $fullPath = Join-Path $ProjectRoot $step.path
                    $dir = Split-Path $fullPath -Parent
                    if (-not (Test-Path $dir)) {
                        New-Item -ItemType Directory -Path $dir -Force | Out-Null
                    }
                    Set-Content -Path $fullPath -Value $content -Encoding UTF8
                    Write-Success "Arquivo criado: $($step.path)"
                }
            }
        }
    }

    Write-Success "Workflow '$WorkflowName' executado com sucesso!"
    return $true
}

# Listar workflows disponíveis
function Show-Workflows {
    if (-not (Test-Path $WorkflowsPath)) {
        Write-Warning "Arquivo workflows.json não encontrado"
        return
    }

    $workflows = Get-Content $WorkflowsPath -Raw | ConvertFrom-Json
    Write-Info "Workflows disponíveis:"
    Write-Host ""

    foreach ($workflow in $workflows.workflows) {
        Write-Host "  $($workflow.name)" -ForegroundColor Cyan
        Write-Host "    $($workflow.description)" -ForegroundColor Gray
        Write-Host ""
    }
}

# Status do sistema
function Show-Status {
    Write-Info "Status do Sistema de Orquestração"
    Write-Host ""

    Write-Host "Claude CLI: " -NoNewline
    if (Test-ClaudeCLI) {
        Write-Host "[OK] Instalado" -ForegroundColor Green
    } else {
        Write-Host "[ERRO] Nao encontrado" -ForegroundColor Red
        Write-Host "  Execute: npm install -g @anthropic-ai/claude-code" -ForegroundColor Yellow
    }

    Write-Host "Cursor: " -NoNewline
    if (Test-CursorRunning) {
        Write-Host '[OK] Rodando' -ForegroundColor Green
    } else {
        Write-Host '[!] Nao esta rodando' -ForegroundColor Yellow
    }

    Write-Host "Workflows: " -NoNewline
    if ($WorkflowsPath -and (Test-Path $WorkflowsPath)) {
        try {
            $workflows = Get-Content $WorkflowsPath -Raw | ConvertFrom-Json
            $count = $workflows.workflows.Count
            Write-Host "[OK] $count workflows configurados" -ForegroundColor Green
        } catch {
            Write-Host '[ERRO] Erro ao ler workflows' -ForegroundColor Red
        }
    } else {
        Write-Host '[ERRO] Nao encontrado' -ForegroundColor Red
    }

    Write-Host "Config: " -NoNewline
    if ($ConfigPath -and (Test-Path $ConfigPath)) {
        Write-Host '[OK] Configurado' -ForegroundColor Green
    } else {
        Write-Host '[!] Nao configurado' -ForegroundColor Yellow
    }
}

# Ajuda
function Show-Help {
    Write-Host ""
    Write-Host "🚀 Sistema de Orquestração Claude Code + Cursor" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Uso:" -ForegroundColor Yellow
    Write-Host '  .\orchestrator.ps1 [comando] [argumentos] [opcoes]'
    Write-Host ""
    Write-Host "Comandos:" -ForegroundColor Yellow
    Write-Host "  status              Mostra status do sistema"
    Write-Host "  workflows           Lista workflows disponíveis"
    Write-Host '  run [workflow]      Executa um workflow'
    Write-Host '  claude [action]      Executa comando Claude CLI direto'
    Write-Host "  help                 Mostra esta ajuda"
    Write-Host ""
    Write-Host "Opções:" -ForegroundColor Yellow
    Write-Host "  -DebugMode          Mostra informações de debug"
    Write-Host "  -DryRun             Simula execução sem fazer mudanças"
    Write-Host ""
    Write-Host "Exemplos:" -ForegroundColor Yellow
    Write-Host "  .\orchestrator.ps1 status"
    Write-Host "  .\orchestrator.ps1 workflows"
    Write-Host "  .\orchestrator.ps1 run new-component -DryRun"
    Write-Host "  .\orchestrator.ps1 claude analyze app/components/MyComponent.tsx"
    Write-Host ""
}

# Main
Push-Location $ProjectRoot

try {
    switch ($Command.ToLower()) {
        "status" {
            Show-Status
        }
        "workflows" {
            Show-Workflows
        }
        "run" {
            if ($Arguments.Count -eq 0) {
                Write-Error "Especifique o nome do workflow"
                Show-Workflows
                exit 1
            }
            $workflowName = $Arguments[0]
            $params = @{}
            if ($Arguments.Count -gt 1) {
                for ($i = 1; $i -lt $Arguments.Count; $i += 2) {
                    if ($i + 1 -lt $Arguments.Count) {
                        $params[$Arguments[$i].TrimStart('-')] = $Arguments[$i + 1]
                    }
                }
            }
            $success = Invoke-Workflow -WorkflowName $workflowName -Params $params
            exit $(if ($success) { 0 } else { 1 })
        }
        "claude" {
            if ($Arguments.Count -eq 0) {
                Write-Error "Especifique a acao do Claude (analyze, refactor, test, document, optimize)"
                exit 1
            }
            $action = $Arguments[0]
            $input = if ($Arguments.Count -gt 1) { $Arguments[1] } else { "" }
            $result = Invoke-ClaudeCommand -Action $action -Input $input
            exit $(if ($result.success) { 0 } else { 1 })
        }
        "help" {
            Show-Help
        }
        default {
            Write-Error "Comando desconhecido: $Command"
            Write-Host ""
            Show-Help
            exit 1
        }
    }
} catch {
    Write-Error "Erro inesperado: $($_.Exception.Message)"
    exit 1
} finally {
    Pop-Location
}
