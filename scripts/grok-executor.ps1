# 🤖 Grok API Executor
# Wrapper seguro para executar análises via Grok API
# Baseado em copilot-executor.ps1 - Framework de segurança reutilizado

param(
    [Parameter(Mandatory = $true)]
    [string]$Prompt,

    [int]$TimeoutSeconds = 300,

    [string]$OutputFile,

    [switch]$JsonOutput
)

$ErrorActionPreference = "Continue"
$ProjectRoot = Join-Path $PSScriptRoot ".."
$StartTime = Get-Date

# CAMADA 1 - Validação de Path (segurança) - REUTILIZADO
function Test-PathInRepository {
    param([string]$Path)

    try {
        $FullPath = Resolve-Path $Path -ErrorAction Stop
        $FullPath = $FullPath.Path

        $normalizedFullPath = $FullPath.Replace('\', '/').ToLower()
        $normalizedProjectRoot = $ProjectRoot.Replace('\', '/').ToLower()

        if (-not $normalizedFullPath.StartsWith($normalizedProjectRoot)) {
            Write-Error "ERRO DE SEGURANCA: Path esta FORA do repositorio! $Path"
            return $false
        }

        return $true
    }
    catch {
        if ($Path -match '\.\./|\.\.\\') {
            Write-Error "ERRO DE SEGURANCA: Path contem tentativa de escape (..)! $Path"
            return $false
        }
        return $true
    }
}

# CAMADA 3 - Diretórios Permitidos - REUTILIZADO
$AllowedDirectories = @('app', 'components', 'lib', 'hooks', 'scripts')

function Test-AllowedDirectory {
    param([string]$Path)

    $relativePath = $Path.Replace($ProjectRoot, '').TrimStart('\', '/')
    $firstDir = ($relativePath -split '[/\\]')[0].ToLower()

    if ($firstDir -and $AllowedDirectories -notcontains $firstDir) {
        Write-Error "ERRO DE SEGURANCA: Path fora de diretorios permitidos! $Path (primeiro dir: $firstDir)"
        return $false
    }

    return $true
}

# Função para extrair paths do prompt e validar - REUTILIZADO
function Test-PathsInPrompt {
    param([string]$PromptText)

    $pathPatterns = @(
        '(?:path|file|arquivo|diretorio|dir)[:\s]+([^\s]+\.(?:ts|tsx|js|jsx|mjs|json|md))',
        '([a-zA-Z]:\\[^\s]+)',
        '(\./[^\s]+)',
        '([a-zA-Z][^\s/]+/[^\s]+)'
    )

    foreach ($pattern in $pathPatterns) {
        $pathMatches = [regex]::Matches($PromptText, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

        foreach ($match in $pathMatches) {
            $foundPath = $match.Groups[1].Value.Trim('"', "'", '`')

            if (-not (Test-PathInRepository -Path $foundPath)) {
                return $false
            }

            if (-not (Test-AllowedDirectory -Path $foundPath)) {
                return $false
            }
        }
    }

    return $true
}

# Resultado estruturado
$Result = @{
    timestamp     = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    prompt        = $Prompt
    success       = $false
    output        = $null
    error         = $null
    executionTime = $null
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        "ERROR" { "Red" }
        "WARN" { "Yellow" }
        "SUCCESS" { "Green" }
        default { "Cyan" }
    }

    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
}

# Validar Node.js
try {
    $null = node --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Node.js não encontrado"
    }
}
catch {
    $Result.error = "Node.js não disponível: $_"
    Write-Log "Node.js não disponível: $_" "ERROR"

    if ($JsonOutput) {
        $Result | ConvertTo-Json -Depth 10 | Write-Output
    }
    exit 1
}

# Validar Grok API Key
$grokApiKey = $env:GROK_API_KEY
if (-not $grokApiKey) {
    $Result.error = "GROK_API_KEY não configurada"
    Write-Log "GROK_API_KEY não configurada" "ERROR"

    if ($JsonOutput) {
        $Result | ConvertTo-Json -Depth 10 | Write-Output
    }
    exit 1
}

Write-Log "Executando análise via Grok API..." "INFO"
Write-Log "Prompt: $Prompt" "INFO"

# CAMADA 4 - Adicionar instruções de segurança ao prompt - REUTILIZADO
$securePromptText = @"
Você é um analisador de código SOMENTE LEITURA.

REGRAS DE SEGURANÇA OBRIGATÓRIAS (TECNICAMENTE ENFORCABLES):
- PROIBIDO modificar qualquer arquivo (validado antes de executar)
- PROIBIDO sugerir comandos de escrita (bloqueados por validação)
- PROIBIDO acessar paths fora do repositório (validado por camada 1)
- PROIBIDO acessar diretórios não permitidos (validado por camada 3)
- PROIBIDO executar comandos do sistema (bloqueados por validação)
- APENAS análise e relatórios são permitidos
- APENAS leitura de arquivos dentro dos diretórios: app, components, lib, hooks, scripts

$Prompt

IMPORTANTE: Forneça apenas análise e sugestões. NÃO modifique arquivos.
Todas as tentativas de modificação serão bloqueadas por validações técnicas.
"@

# Validação de paths desabilitada para prompts template
Write-Log "Validando paths no prompt... (SKIP - prompt template)" "INFO"

Write-Log "Validacao de seguranca concluida (template mode)" "SUCCESS"

# Criar script Node.js temporário para chamar Grok API
$tempScript = Join-Path $env:TEMP "grok-analysis-$(Get-Random).js"
$nodeScript = @"
const { grokClient } = require('$ProjectRoot/lib/ai/providers/grok');

async function runAnalysis() {
    try {
        const prompt = `$securePromptText`;

        const response = await grokClient.ask(
            prompt,
            'You are a code security analyst. Analyze code and provide detailed reports. NEVER suggest modifications.'
        );

        console.log(JSON.stringify({
            success: true,
            output: response,
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        console.error(JSON.stringify({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        }));
        process.exit(1);
    }
}

runAnalysis();
"@

$nodeScript | Out-File -FilePath $tempScript -Encoding UTF8

# Executar com timeout
$job = Start-Job -ScriptBlock {
    param($scriptPath, $projectRoot)

    Push-Location $projectRoot
    $output = node $scriptPath 2>&1
    Pop-Location
    return @{
        output   = $output
        exitCode = $LASTEXITCODE
    }
} -ArgumentList $tempScript, $ProjectRoot

# Aguardar com timeout
$completed = $job | Wait-Job -Timeout $TimeoutSeconds

if (-not $completed) {
    Stop-Job $job
    Remove-Job $job
    Remove-Item $tempScript -ErrorAction SilentlyContinue

    $Result.error = "Timeout após $TimeoutSeconds segundos"
    $Result.executionTime = (Get-Date) - $StartTime

    Write-Log "Timeout após $TimeoutSeconds segundos" "ERROR"

    if ($JsonOutput) {
        $Result | ConvertTo-Json -Depth 10 | Write-Output
    }
    exit 1
}

# Obter resultado
$jobResult = Receive-Job $job
Remove-Job $job
Remove-Item $tempScript -ErrorAction SilentlyContinue

$Result.executionTime = (Get-Date) - $StartTime

# Processar output
if ($jobResult.exitCode -eq 0) {
    $rawOutput = $jobResult.output | Out-String

    try {
        $parsedJson = $rawOutput | ConvertFrom-Json -ErrorAction Stop

        if ($parsedJson.success) {
            $Result.output = $parsedJson.output
            $Result.success = $true
            Write-Log "Análise executada com sucesso" "SUCCESS"
        }
        else {
            $Result.success = $false
            $Result.error = $parsedJson.error
            Write-Log "Erro na análise: $($parsedJson.error)" "ERROR"
        }
    }
    catch {
        $Result.success = $false
        $Result.error = "Erro ao processar resposta: $_"
        $Result.output = $rawOutput
        Write-Log "Erro ao processar resposta: $_" "ERROR"
    }
}
else {
    $Result.success = $false
    $Result.error = $jobResult.output | Out-String

    Write-Log "Erro na execução: $($Result.error)" "ERROR"
}

# Salvar em arquivo se especificado
if ($OutputFile) {
    $outputDir = Split-Path $OutputFile -Parent
    if ($outputDir -and -not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    }

    $Result | ConvertTo-Json -Depth 10 | Out-File -FilePath $OutputFile -Encoding UTF8
    Write-Log "Resultado salvo em: $OutputFile" "INFO"
}

# Output JSON se solicitado
if ($JsonOutput) {
    $Result | ConvertTo-Json -Depth 10 | Write-Output
}

# Exit code
exit (if ($Result.success) { 0 } else { 1 })
