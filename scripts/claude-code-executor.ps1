# 🔧 Claude Code CLI Executor - Com Auto Compact Forçado
# Wrapper para executar Claude Code CLI com auto compact garantido

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("Analyze", "Refactor", "Security", "Performance")]
    [string]$Action,

    [string]$Path = "./app",
    [string]$OutputPath = "",
    [string]$PromptFile = "",
    [switch]$DryRun,
    [int]$MaxTokens = 70000,
    [int]$MinTokens = 60000,
    [string]$Model = "claude-sonnet-4-5-20250929"
)

$ErrorActionPreference = "Continue"
$ProjectRoot = Join-Path $PSScriptRoot ".."
$ReportsDir = Join-Path $ProjectRoot "reports"
$DateStamp = Get-Date -Format "yyyyMMdd_HHmmss"

# Criar diretório de relatórios
if (!(Test-Path $ReportsDir)) {
    New-Item -ItemType Directory -Path $ReportsDir -Force | Out-Null
}

$ClaudeCodeDir = Join-Path $ReportsDir "claude-code"
if (!(Test-Path $ClaudeCodeDir)) {
    New-Item -ItemType Directory -Path $ClaudeCodeDir -Force | Out-Null
}

# Definir output path padrão
if ([string]::IsNullOrEmpty($OutputPath)) {
    $OutputPath = Join-Path $ClaudeCodeDir "$Action-$DateStamp.json"
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

# Verificar Claude Code CLI
Write-Step "Verificando Claude Code CLI..."
try {
    $ClaudeVersion = & npx claude --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Claude Code CLI disponível: $ClaudeVersion"
    }
    else {
        Write-Error-Custom "Claude Code CLI não encontrado"
        exit 1
    }
}
catch {
    Write-Error-Custom "Erro ao verificar Claude Code CLI: $_"
    exit 1
}

# ⚠️ PROTEÇÕES DE SEGURANÇA - LIMITAR APENAS AO REPOSITÓRIO
Write-Step "Validando limites de segurança..."

# Listar diretórios permitidos (apenas dentro do repositório)
$AllowedDirs = @(
    $ProjectRoot,
    (Join-Path $ProjectRoot "app"),
    (Join-Path $ProjectRoot "components"),
    (Join-Path $ProjectRoot "lib"),
    (Join-Path $ProjectRoot "hooks"),
    (Join-Path $ProjectRoot "scripts")
)

# Validar segurança usando script dedicado
$SecurityValidator = Join-Path $PSScriptRoot "security-validator.ps1"
if (Test-Path $SecurityValidator) {
    $ValidationResult = & powershell -ExecutionPolicy Bypass -File $SecurityValidator -Path $Path -AllowedDirs $AllowedDirs 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Falha na validação de segurança!"
        Write-Host $ValidationResult -ForegroundColor Red
        exit 1
    }
}

# Garantir que Path está dentro do repositório (dupla verificação)
$FullPath = Resolve-Path $Path -ErrorAction SilentlyContinue
if ($null -eq $FullPath) {
    $FullPath = Join-Path $ProjectRoot $Path
}

if ($FullPath -notlike "$ProjectRoot*") {
    Write-Error-Custom "ERRO DE SEGURANÇA: Path '$Path' está FORA do repositório!"
    Write-Host "  Repositório: $ProjectRoot" -ForegroundColor Red
    Write-Host "  Path tentado: $FullPath" -ForegroundColor Red
    exit 1
}

Write-Success "Path validado - está dentro do repositório: $FullPath"

# Carregar prompt baseado na ação
$PromptsDir = Join-Path $PSScriptRoot "prompts"
$PromptContent = ""

switch ($Action) {
    "Analyze" {
        $PromptFile = Join-Path $PromptsDir "claude-code-analysis.md"
    }
    "Refactor" {
        $PromptFile = Join-Path $PromptsDir "claude-code-refactor.md"
    }
    "Security" {
        $PromptFile = Join-Path $PromptsDir "claude-code-analysis.md"
        $PromptContent = Get-Content $PromptFile -Raw
        $PromptContent += "`n`n## FOCO ESPECÍFICO: SEGURANÇA`nAnalise APENAS aspectos de segurança. Seja EXTREMAMENTE rigoroso."
    }
    "Performance" {
        $PromptFile = Join-Path $PromptsDir "claude-code-analysis.md"
        $PromptContent = Get-Content $PromptFile -Raw
        $PromptContent += "`n`n## FOCO ESPECÍFICO: PERFORMANCE`nAnalise APENAS aspectos de performance. Identifique TODOS os gargalos."
    }
}

if ([string]::IsNullOrEmpty($PromptContent) -and (Test-Path $PromptFile)) {
    $PromptContent = Get-Content $PromptFile -Raw
}

if ([string]::IsNullOrEmpty($PromptContent)) {
    Write-Error-Custom "Prompt não encontrado: $PromptFile"
    exit 1
}

# Adicionar instruções de auto compact EXPLÍCITAS + LIMITES DE SEGURANÇA
$AutoCompactInstructions = @"

## ⚠️ LIMITES DE SEGURANÇA - LEIA ANTES DE COMPACTAR

**IMPORTANTE**: Você DEVE trabalhar APENAS dentro deste repositório:
- Repositório: $ProjectRoot
- Path permitido: $Path
- Diretórios permitidos: $($AllowedDirs -join ', ')

**PROIBIDO**:
- ❌ NÃO modificar arquivos fora do repositório
- ❌ NÃO acessar diretórios fora de: $ProjectRoot
- ❌ NÃO executar comandos que modificam sistema
- ❌ NÃO deletar arquivos
- ❌ NÃO modificar arquivos SEM permissão explícita

**PERMITIDO**:
- ✅ Ler arquivos dentro do repositório
- ✅ Analisar código (apenas leitura)
- ✅ Gerar relatórios JSON/Markdown
- ✅ Auto compact de código para análise

## ⚠️ INSTRUÇÕES CRÍTICAS DE AUTO COMPACT

VOCÊ DEVE USAR AUTO COMPACT. Estas são instruções OBRIGATÓRIAS:

1. **Context Window**: Você tem acesso a 200.000 tokens
2. **Target Compact**: Compacte para $MinTokens - $MaxTokens tokens
3. **NÃO PULE ARQUIVOS**: Se o código é muito grande, compacte MAIS agressivamente, mas NÃO pule
4. **Validação**: Após análise, liste TODOS os arquivos analisados no relatório JSON
5. **Verificação**: Se você não mencionar um arquivo no relatório, significa que NÃO analisou

### Como Compactar Mantendo Contexto:
- Remova comentários redundantes
- Resuma funções simples em uma linha
- Mantenha estrutura de arquivos e imports
- Mantenha lógica complexa completa
- Mantenha código crítico (segurança, performance) completo

### Estratégia de Compactação por Tamanho:
- Arquivo < 100 linhas: Mantenha completo
- Arquivo 100-500 linhas: Compacte funções simples, mantenha complexas
- Arquivo 500-1000 linhas: Compacte agressivamente, mantenha apenas crítico
- Arquivo > 1000 linhas: Compacte MUITO agressivamente, mas mantenha estrutura

### Validação Obrigatória no Relatório:
O JSON DEVE conter:
```json
{
  "files_analyzed": ["lista", "completa", "de", "arquivos"],
  "files_skipped": [], // DEVE estar vazio
  "compaction_stats": {
    "total_files": 0,
    "files_compacted": 0,
    "compaction_ratio": 0.0
  }
}
```

"@

$PromptContent = $PromptContent + $AutoCompactInstructions

# Salvar prompt temporário
$TempPromptFile = Join-Path $env:TEMP "claude-prompt-$DateStamp.md"
$PromptContent | Out-File -FilePath $TempPromptFile -Encoding UTF8

Write-Host ""
Write-Host "🔧 EXECUTANDO CLAUDE CODE CLI - $Action" -ForegroundColor Magenta
Write-Host "  Modelo: $Model" -ForegroundColor Gray
Write-Host "  Path: $Path" -ForegroundColor Gray
Write-Host "  Auto Compact: $MinTokens - $MaxTokens tokens" -ForegroundColor Gray
Write-Host "  Output: $OutputPath" -ForegroundColor Gray
Write-Host ""

if ($DryRun) {
    Write-Host "  [DRY RUN] Comando seria executado:" -ForegroundColor Yellow
    Write-Host "    npx claude -p `"$($PromptContent.Substring(0, [Math]::Min(200, $PromptContent.Length)))...`" --model $Model --output-format json --allowed-tools Read > $OutputPath" -ForegroundColor Gray
    exit 0
}

# Executar Claude Code CLI com auto compact forçado + PROTEÇÕES
Write-Step "Executando Claude Code CLI com auto compact e proteções de segurança..."
try {
    Push-Location $ProjectRoot

    # Construir comando com auto compact explícito + LIMITES DE SEGURANÇA
    # --allowed-tools Read: APENAS leitura, sem modificação
    # --add-dir: APENAS diretórios permitidos
    $AddDirArgs = $AllowedDirs | ForEach-Object { "--add-dir", $_ }
    $ClaudeCommand = "npx claude -p `"$($PromptContent -replace '"', '\"')`" --model $Model --output-format json --print --allowed-tools Read $($AddDirArgs -join ' ')"

    Write-Host "  Executando comando (pode demorar HORAS)..." -ForegroundColor Gray
    Write-Host "  Comando: $ClaudeCommand" -ForegroundColor DarkGray

    # Executar e capturar output
    $Output = & powershell -Command $ClaudeCommand 2>&1 | Out-String

    # Salvar output
    $Output | Out-File -FilePath $OutputPath -Encoding UTF8

    # Validar output
    if (Test-Path $OutputPath) {
        $Content = Get-Content $OutputPath -Raw

        # Verificar se é JSON válido
        try {
            $Json = $Content | ConvertFrom-Json
            Write-Success "Relatório JSON gerado com sucesso"

            # Validar se auto compact funcionou
            if ($Json.files_analyzed -or $Json.files_skipped) {
                $FilesAnalyzed = if ($Json.files_analyzed) { $Json.files_analyzed.Count } else { 0 }
                $FilesSkipped = if ($Json.files_skipped) { $Json.files_skipped.Count } else { 0 }

                Write-Host "  Arquivos analisados: $FilesAnalyzed" -ForegroundColor Cyan
                Write-Host "  Arquivos pulados: $FilesSkipped" -ForegroundColor $(if ($FilesSkipped -eq 0) { "Green" } else { "Red" })

                if ($FilesSkipped -gt 0) {
                    Write-Error-Custom "ATENÇÃO: $FilesSkipped arquivos foram pulados! Auto compact pode não ter funcionado."
                }
            }
            else {
                Write-Host "  [AVISO] Relatório não contém informações de validação de auto compact" -ForegroundColor Yellow
            }
        }
        catch {
            Write-Error-Custom "Relatório não é JSON válido: $_"
            Write-Host "  Output salvo em: $OutputPath" -ForegroundColor Gray
        }
    }
    else {
        Write-Error-Custom "Arquivo de output não foi criado"
    }

    # Limpar arquivo temporário
    if (Test-Path $TempPromptFile) {
        Remove-Item $TempPromptFile -Force
    }

    Pop-Location
}
catch {
    Write-Error-Custom "Erro ao executar Claude Code CLI: $_"
    Pop-Location
    exit 1
}

Write-Host ""
Write-Success "Execução concluída!"
Write-Host "  Relatório: $OutputPath" -ForegroundColor Cyan
Write-Host ""

exit 0
