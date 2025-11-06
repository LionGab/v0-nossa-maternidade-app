# 🔥 Claude Code CLI - Análise Brutal de Código
# Configurado para auto compact 60-70k tokens com análise assertiva

param(
    [string]$TargetPath = "./app",
    [string]$OutputPath = "",
    [switch]$DryRun,
    [int]$MaxTokens = 65000,
    [int]$MinTokens = 60000
)

$ErrorActionPreference = "Continue"
$ProjectRoot = Join-Path $PSScriptRoot ".."
$ReportsDir = Join-Path $ProjectRoot "reports"
$DateStamp = Get-Date -Format "yyyyMMdd_HHmmss"

if ([string]::IsNullOrEmpty($OutputPath)) {
    $OutputPath = Join-Path $ReportsDir "claude-brutal-analysis-$DateStamp.md"
}

# Criar diretório de relatórios se não existir
if (!(Test-Path $ReportsDir)) {
    New-Item -ItemType Directory -Path $ReportsDir -Force | Out-Null
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

# Verificar se Claude Code CLI está disponível
Write-Step "Verificando Claude Code CLI..."
try {
    $ClaudeVersion = & npx @anthropic-ai/claude-code --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Claude Code CLI disponível: $ClaudeVersion"
    }
    else {
        Write-Error-Custom "Claude Code CLI não encontrado"
        Write-Host "  Instale: npm install -g @anthropic-ai/claude-code" -ForegroundColor Yellow
        exit 1
    }
}
catch {
    Write-Error-Custom "Erro ao verificar Claude Code CLI: $_"
    exit 1
}

# Prompt brutal e assertivo para análise
$BrutalPrompt = @"
ANÁLISE BRUTAL DE CÓDIGO - SEJA EXTREMAMENTE ASSERTIVO

Você é um code reviewer sênior brutal e direto. Analise este código com ZERO tolerância para:

1. CÓDIGO RUIM:
   - Código duplicado
   - Funções muito longas (> 100 linhas)
   - Complexidade ciclomática alta (> 10)
   - Acoplamento excessivo
   - Baixa coesão
   - Performance ruim
   - Padrões anti-pattern

2. PROBLEMAS DE ARQUITETURA:
   - Violação de SOLID
   - Dependências circulares
   - Responsabilidades misturadas
   - Falta de abstração
   - Over-engineering ou under-engineering

3. SEGURANÇA:
   - SQL injection
   - XSS vulnerabilidades
   - Exposição de secrets
   - Falta de validação
   - Race conditions
   - Memory leaks

4. PERFORMANCE:
   - Queries N+1
   - Bundle size grande
   - Re-renders desnecessários
   - Imagens não otimizadas
   - Código não lazy-loaded
   - Dependências pesadas

5. QUALIDADE:
   - Falta de testes
   - Código morto
   - Comentários desatualizados
   - TypeScript `any`
   - Error handling inadequado
   - Logging insuficiente

SEJA DIRETO E ESPECÍFICO:
- Identifique EXATAMENTE onde está o problema
- Explique POR QUE é ruim
- Forneça SOLUÇÃO CONCRETA com código
- Priorize por impacto (crítico, alto, médio, baixo)
- Não seja educado - seja honesto e direto

FORMATO DO RELATÓRIO:
1. RESUMO EXECUTIVO (top 5 problemas críticos)
2. ANÁLISE DETALHADA (por arquivo/categoria)
3. SOLUÇÕES PRIORITIZADAS (com código de exemplo)
4. MÉTRICAS (complexidade, cobertura, performance)
"@

Write-Host ""
Write-Host "🔥 ANÁLISE BRUTAL DE CÓDIGO INICIADA" -ForegroundColor Magenta
Write-Host "Target: $TargetPath" -ForegroundColor Gray
Write-Host "Output: $OutputPath" -ForegroundColor Gray
Write-Host "Tokens: $MinTokens - $MaxTokens" -ForegroundColor Gray
Write-Host ""

if ($DryRun) {
    Write-Host "  [DRY RUN] Análise seria executada com:" -ForegroundColor Yellow
    Write-Host "    - Auto compact: $MinTokens-$MaxTokens tokens" -ForegroundColor Gray
    Write-Host "    - Prompt: Brutal e assertivo" -ForegroundColor Gray
    Write-Host "    - Output: $OutputPath" -ForegroundColor Gray
    exit 0
}

# Configurar variável de ambiente para auto compact
$env:CLAUDE_MAX_TOKENS = $MaxTokens.ToString()
$env:CLAUDE_MIN_TOKENS = $MinTokens.ToString()

Write-Step "Executando análise brutal com Claude Code CLI..."
Write-Host "  Configurando auto compact: $MinTokens - $MaxTokens tokens" -ForegroundColor Gray
Write-Host "  Modo: Brutal e assertivo" -ForegroundColor Gray
Write-Host ""

try {
    Push-Location $ProjectRoot

    # Criar arquivo temporário com prompt
    $PromptFile = Join-Path $env:TEMP "claude-brutal-prompt-$DateStamp.txt"
    $BrutalPrompt | Out-File -FilePath $PromptFile -Encoding UTF8

    # Executar Claude Code CLI com auto compact
    # Usando --max-tokens e --context-window para controlar compactação
    $ClaudeArgs = @(
        "@anthropic-ai/claude-code",
        "analyze",
        $TargetPath,
        "--prompt-file", $PromptFile,
        "--output", $OutputPath,
        "--max-tokens", $MaxTokens.ToString(),
        "--context-window", "200000",  # 200k contexto, compactar para 60-70k
        "--ultrathink",
        "--verbose"
    )

    Write-Host "  Comando: npx $($ClaudeArgs -join ' ')" -ForegroundColor Gray
    Write-Host ""

    $AnalysisResult = & npx $ClaudeArgs 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Success "Análise brutal concluída!"
        Write-Host "  Relatório salvo em: $OutputPath" -ForegroundColor Cyan

        # Ler relatório e mostrar resumo
        if (Test-Path $OutputPath) {
            $ReportContent = Get-Content $OutputPath -Raw
            Write-Host ""
            Write-Host "  RESUMO DO RELATÓRIO:" -ForegroundColor Yellow
            $Lines = $ReportContent.Split("`n")
            $SummaryLines = $Lines | Select-Object -First 30
            $SummaryLines | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
        }
    }
    else {
        Write-Error-Custom "Análise falhou"
        Write-Host "  Output: $AnalysisResult" -ForegroundColor Red
        exit 1
    }

    # Limpar arquivo temporário
    if (Test-Path $PromptFile) {
        Remove-Item $PromptFile -Force
    }

    Pop-Location
}
catch {
    Write-Error-Custom "Erro na análise: $_"
    Pop-Location
    exit 1
}

Write-Host ""
Write-Success "Análise brutal concluída com sucesso!"
Write-Host "  Relatório: $OutputPath" -ForegroundColor Cyan
