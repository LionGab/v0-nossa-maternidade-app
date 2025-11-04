# 🤖 GitHub Copilot CLI Executor
# Wrapper seguro para executar comandos do GitHub Copilot CLI

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

# CAMADA 1 - Validação de Path (segurança)
function Validate-Path {
    param([string]$Path)

    try {
        $FullPath = Resolve-Path $Path -ErrorAction Stop
        $FullPath = $FullPath.Path

        # Normalizar paths para comparação
        $normalizedFullPath = $FullPath.Replace('\', '/').ToLower()
        $normalizedProjectRoot = $ProjectRoot.Replace('\', '/').ToLower()

        if (-not $normalizedFullPath.StartsWith($normalizedProjectRoot)) {
            Write-Error "ERRO DE SEGURANCA: Path esta FORA do repositorio! $Path"
            return $false
        }

        return $true
    }
    catch {
        # Se não conseguir resolver, pode ser path relativo - validar de outra forma
        if ($Path -match '\.\./|\.\.\\') {
            Write-Error "ERRO DE SEGURANCA: Path contem tentativa de escape (..)! $Path"
            return $false
        }
        return $true
    }
}

# CAMADA 3 - Diretórios Permitidos
$AllowedDirectories = @('app', 'components', 'lib', 'hooks', 'scripts')

# Função para validar se path está em diretório permitido
function Validate-AllowedDirectory {
    param([string]$Path)

    $relativePath = $Path.Replace($ProjectRoot, '').TrimStart('\', '/')
    $firstDir = $relativePath.Split('\', '/')[0].ToLower()

    if ($firstDir -and $AllowedDirectories -notcontains $firstDir) {
        Write-Error "ERRO DE SEGURANCA: Path fora de diretorios permitidos! $Path (primeiro dir: $firstDir)"
        return $false
    }

    return $true
}

# Função para extrair paths do prompt e validar
function Validate-PathsInPrompt {
    param([string]$PromptText)

    # Padrões para encontrar paths no prompt
    $pathPatterns = @(
        '(?:path|file|arquivo|diretorio|dir)[:\s]+([^\s]+\.(?:ts|tsx|js|jsx|mjs|json|md))',  # Arquivos mencionados
        '([a-zA-Z]:\\[^\s]+)',  # Paths absolutos Windows
        '(\./[^\s]+)',  # Paths relativos
        '([a-zA-Z][^\s/]+/[^\s]+)'  # Paths tipo app/component
    )

    foreach ($pattern in $pathPatterns) {
        $matches = [regex]::Matches($PromptText, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

        foreach ($match in $matches) {
            $foundPath = $match.Groups[1].Value.Trim('"', "'", '`')

            # Validar path
            if (-not (Validate-Path -Path $foundPath)) {
                return $false
            }

            # Validar diretório permitido
            if (-not (Validate-AllowedDirectory -Path $foundPath)) {
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

# Validar GitHub CLI
try {
    $ghCheck = gh --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "GitHub CLI não encontrado"
    }
}
catch {
    $Result.error = "GitHub CLI não disponível: $_"
    Write-Log "GitHub CLI não disponível: $_" "ERROR"

    if ($JsonOutput) {
        $Result | ConvertTo-Json -Depth 10 | Write-Output
    }
    exit 1
}

# Validar Copilot CLI
try {
    $copilotCheck = gh copilot --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Copilot CLI não configurado"
    }
}
catch {
    $Result.error = "Copilot CLI não configurado: $_"
    Write-Log "Copilot CLI não configurado: $_" "ERROR"

    if ($JsonOutput) {
        $Result | ConvertTo-Json -Depth 10 | Write-Output
    }
    exit 1
}

Write-Log "Executando Copilot CLI..." "INFO"
Write-Log "Prompt: $Prompt" "INFO"

# CAMADA 4 - Adicionar instruções de segurança ao prompt
# NOTA: Estas instruções são reforço, mas a segurança real vem das camadas 1-3
$SecurePrompt = @"
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

# CAMADA 1 - Validar paths no prompt ANTES de executar
Write-Log "Validando paths no prompt..." "INFO"
if (-not (Validate-PathsInPrompt -PromptText $Prompt)) {
    $Result.error = "ERRO DE SEGURANCA: Prompt contem paths invalidos ou fora de diretorios permitidos"
    Write-Log $Result.error "ERROR"

    if ($JsonOutput) {
        $Result | ConvertTo-Json -Depth 10 | Write-Output
    }
    exit 1
}

# CAMADA 2 - Restrição de Ferramentas (validação robusta)
Write-Log "Validando comandos no prompt..." "INFO"

function Test-DangerousCommand {
    param([string]$Text)

    # Normalizar texto para validação case-insensitive
    $normalized = $Text.ToLower()

    # Padrões perigosos (case-insensitive, com variações)
    $dangerousPatterns = @(
        '\b(write|edit|delete|remove|rm|mv|cp|move|copy|mkdir|rmdir|create|new|update|modify|change|alter)\b',
        '\b(\.write|\.edit|\.delete|\.remove|\.create|\.update|\.modify)\b',
        '\b(set-content|out-file|add-content|new-item|remove-item|copy-item|move-item)\b',
        '\b(fs\.write|fs\.writeFile|fs\.writeFileSync|fs\.unlink|fs\.rmdir|fs\.mkdir)\b',
        '\b(exec|execute|run|system|process\.exec|child_process)\b',
        '\b(eval|Function|setTimeout|setInterval)\s*\(',  # Execução dinâmica
        'base64.*decode',  # Tentativa de ofuscar
        '\b(rm\s+-rf|rm\s+rf|rmdir\s+/s)\b',  # Comandos destrutivos
        '\b(del\s+/f|del\s+/s|erase)\b'  # Comandos Windows destrutivos
    )

    foreach ($pattern in $dangerousPatterns) {
        if ([regex]::IsMatch($normalized, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
            Write-Log "Comando perigoso detectado: $pattern" "ERROR"
            return $true
        }
    }

    # Validar strings concatenadas (tentativa de bypass)
    # Exemplo: "wri" + "te" = "write"
    $concatenatedPatterns = @(
        '\b(wri\s*\+\s*te|del\s*\+\s*ete|rm\s*\+\s*dir)\b',
        '\w+\s*\+\s*[\'"](te|ete|dir|lete)[\'"]'
    )

    foreach ($pattern in $concatenatedPatterns) {
        if ([regex]::IsMatch($normalized, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
            Write-Log "Tentativa de bypass detectada: $pattern" "ERROR"
            return $true
        }
    }

    return $false
}

# Validar prompt original e prompt seguro
if ((Test-DangerousCommand -Text $Prompt) -or (Test-DangerousCommand -Text $SecurePrompt)) {
    $Result.error = "ERRO DE SEGURANCA: Prompt contem comandos perigosos"
    Write-Log $Result.error "ERROR"

    if ($JsonOutput) {
        $Result | ConvertTo-Json -Depth 10 | Write-Output
    }
    exit 1
}

Write-Log "Validacao de seguranca concluida" "SUCCESS"

# Executar comando com timeout
$job = Start-Job -ScriptBlock {
    param($prompt)

    $output = gh copilot -p $prompt 2>&1
    return @{
        output   = $output
        exitCode = $LASTEXITCODE
    }
} -ArgumentList $SecurePrompt

# Aguardar com timeout
$completed = $job | Wait-Job -Timeout $TimeoutSeconds

if (-not $completed) {
    Stop-Job $job
    Remove-Job $job

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

$Result.executionTime = (Get-Date) - $StartTime

# Processar output
if ($jobResult.exitCode -eq 0) {
    $Result.success = $true
    $Result.output = $jobResult.output | Out-String

    Write-Log "Comando executado com sucesso" "SUCCESS"
    Write-Log "Tempo de execução: $($Result.executionTime.TotalSeconds)s" "INFO"
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
