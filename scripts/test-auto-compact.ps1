# 🧪 Teste de Auto Compact - Claude Code CLI
# Testa se o Claude Code CLI realmente compacta quando solicitado

param(
    [switch]$Verbose
)

$ErrorActionPreference = "Continue"
$ProjectRoot = Join-Path $PSScriptRoot ".."
$TestDir = Join-Path $ProjectRoot "test-auto-compact"
$TestReport = Join-Path $TestDir "test-result.json"

# Criar diretório de teste
if (!(Test-Path $TestDir)) {
    New-Item -ItemType Directory -Path $TestDir -Force | Out-Null
}

function Write-Test {
    param([string]$Message, [string]$Color = "Cyan")
    Write-Host "  [TEST] $Message" -ForegroundColor $Color
}

function Write-Success {
    param([string]$Message)
    Write-Host "  [OK] $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "  [ERRO] $Message" -ForegroundColor Red
}

Write-Host ""
Write-Host "🧪 TESTE DE AUTO COMPACT - Claude Code CLI" -ForegroundColor Magenta
Write-Host ""

# Verificar Claude Code CLI
Write-Test "Verificando Claude Code CLI..."
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

# Criar arquivo de teste com muito código
Write-Test "Criando arquivo de teste grande..."
$TestFile = Join-Path $TestDir "large-file.ts"
$LargeCode = @"
// Arquivo de teste para auto compact
// Este arquivo tem MUITO código para testar se o Claude compacta

export class TestClass1 {
    private prop1: string = "test";
    private prop2: number = 42;
    private prop3: boolean = true;

    method1() {
        console.log("Method 1");
        return this.prop1 + this.prop2;
    }

    method2() {
        console.log("Method 2");
        return this.prop3;
    }
}

export class TestClass2 {
    private prop1: string = "test";
    private prop2: number = 42;
    private prop3: boolean = true;

    method1() {
        console.log("Method 1");
        return this.prop1 + this.prop2;
    }

    method2() {
        console.log("Method 2");
        return this.prop3;
    }
}

// Repetir padrões para criar arquivo grande
"@

# Criar múltiplas classes repetidas para arquivo grande
for ($i = 1; $i -le 50; $i++) {
    $LargeCode += @"

export class TestClass$i {
    private prop1: string = "test-$i";
    private prop2: number = $i;
    private prop3: boolean = true;

    method1() {
        console.log("Method 1 - Class $i");
        return this.prop1 + this.prop2;
    }

    method2() {
        console.log("Method 2 - Class $i");
        return this.prop3;
    }

    method3() {
        console.log("Method 3 - Class $i");
        return "result-$i";
    }
}

"@
}

$LargeCode | Out-File -FilePath $TestFile -Encoding UTF8

# Contar linhas do arquivo
$LineCount = (Get-Content $TestFile).Count
Write-Test "Arquivo criado com $LineCount linhas"

# Prompt de teste EXPLÍCITO sobre auto compact
$TestPrompt = @"
TESTE DE AUTO COMPACT - Claude Code CLI

Você DEVE analisar este arquivo usando AUTO COMPACT.

Instruções OBRIGATÓRIAS:
1. Você tem acesso a 200.000 tokens de contexto
2. Este arquivo tem $LineCount linhas
3. Você DEVE compactar este arquivo para caber em 60.000-70.000 tokens
4. Após compactar, analise o código
5. NÃO pode pular linhas - deve compactar mas manter contexto

CRÍTICO: Você DEVE confirmar que usou auto compact no seu relatório.

Analise o arquivo: $TestFile

Responda em JSON com:
{
  "used_auto_compact": true/false,
  "compaction_method": "descreva como compactou",
  "original_lines": $LineCount,
  "compacted_lines": "quantas linhas após compactar",
  "analysis": "análise do código",
  "files_analyzed": ["$TestFile"],
  "files_skipped": []
}

"@

Write-Test "Executando Claude Code CLI com prompt de auto compact..."
Write-Host "  Prompt: $($TestPrompt.Substring(0, [Math]::Min(200, $TestPrompt.Length)))..." -ForegroundColor Gray
Write-Host ""

try {
    Push-Location $ProjectRoot

    # Executar Claude Code CLI
    Write-Test "Executando comando (pode demorar alguns minutos)..."
    $StartTime = Get-Date

    # Salvar prompt em arquivo temporário para evitar problemas com aspas
    $TempPromptFile = Join-Path $env:TEMP "claude-test-prompt-$([guid]::NewGuid().ToString()).txt"
    $TestPrompt | Out-File -FilePath $TempPromptFile -Encoding UTF8

    # Usar modelo sonnet-4.5 para melhor auto compact
    # Ler prompt do arquivo para evitar problemas de escape
    if ($Verbose) {
        Write-Host "  Prompt salvo em: $TempPromptFile" -ForegroundColor DarkGray
        Write-Host "  Executando: npx claude -p (lendo de arquivo) --model claude-sonnet-4-5-20250929 --output-format json --print --allowed-tools Read" -ForegroundColor DarkGray
    }

    # Executar lendo prompt do arquivo
    $PromptContent = Get-Content $TempPromptFile -Raw
    $Output = $PromptContent | npx claude -p @('--model', 'claude-sonnet-4-5-20250929', '--output-format', 'json', '--print', '--allowed-tools', 'Read') 2>&1 | Out-String

    $EndTime = Get-Date
    $Duration = ($EndTime - $StartTime).TotalSeconds

    Write-Success "Execução concluída em $([Math]::Round($Duration, 2)) segundos"

    # Salvar output
    $Output | Out-File -FilePath $TestReport -Encoding UTF8

    # Analisar resultado
    Write-Test "Analisando resultado..."

    if (Test-Path $TestReport) {
        $Content = Get-Content $TestReport -Raw

        # Tentar parsear JSON
        try {
            # Extrair JSON do output (pode ter texto antes/depois)
            $JsonMatch = $Content | Select-String -Pattern '\{.*\}' -AllMatches
            if ($JsonMatch) {
                $JsonContent = $JsonMatch.Matches[0].Value
                $Result = $JsonContent | ConvertFrom-Json

                Write-Host ""
                Write-Host "════════════════════════════════════════" -ForegroundColor Gray
                Write-Host "RESULTADO DO TESTE" -ForegroundColor Yellow
                Write-Host "════════════════════════════════════════" -ForegroundColor Gray

                if ($Result.used_auto_compact) {
                    Write-Success "✅ AUTO COMPACT FOI USADO!"
                    Write-Host "  Método: $($Result.compaction_method)" -ForegroundColor Cyan
                    Write-Host "  Linhas originais: $($Result.original_lines)" -ForegroundColor Gray
                    Write-Host "  Linhas compactadas: $($Result.compacted_lines)" -ForegroundColor Gray
                    Write-Host "  Arquivos analisados: $($Result.files_analyzed.Count)" -ForegroundColor Gray
                    Write-Host "  Arquivos pulados: $($Result.files_skipped.Count)" -ForegroundColor $(if ($Result.files_skipped.Count -eq 0) { "Green" } else { "Red" })
                }
                else {
                    Write-Error-Custom "❌ AUTO COMPACT NÃO FOI USADO!"
                    Write-Host "  O Claude não confirmou uso de auto compact" -ForegroundColor Red
                }

                # Verificar se mencionou compactação
                if ($Content -match "compact|comprimir|resumir|summarize") {
                    Write-Success "✅ Mencionou compactação no texto"
                }
                else {
                    Write-Host "  ⚠️  Não mencionou compactação explicitamente" -ForegroundColor Yellow
                }

                Write-Host ""
                Write-Host "  Relatório completo: $TestReport" -ForegroundColor Cyan
            }
            else {
                Write-Host "  [AVISO] Não encontrou JSON no output" -ForegroundColor Yellow
                Write-Host "  Output salvo em: $TestReport" -ForegroundColor Gray

                # Verificar se mencionou compactação no texto
                if ($Content -match "compact|comprimir|resumir|summarize") {
                    Write-Success "✅ Mencionou compactação no texto"
                }
                else {
                    Write-Error-Custom "❌ Não mencionou compactação"
                }
            }
        }
        catch {
            Write-Host "  [AVISO] Erro ao parsear JSON: $_" -ForegroundColor Yellow
            Write-Host "  Output salvo em: $TestReport" -ForegroundColor Gray

            # Verificar se mencionou compactação
            if ($Content -match "compact|comprimir|resumir|summarize") {
                Write-Success "✅ Mencionou compactação no texto"
            }
            else {
                Write-Error-Custom "❌ Não mencionou compactação"
            }
        }
    }
    else {
        Write-Error-Custom "Arquivo de relatório não foi criado"
    }

    Pop-Location
}
catch {
    Write-Error-Custom "Erro ao executar teste: $_"
    Pop-Location
    exit 1
}

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Gray
Write-Host "TESTE CONCLUÍDO" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Gray
Write-Host ""
Write-Host "  Arquivo de teste: $TestFile" -ForegroundColor Gray
Write-Host "  Relatório: $TestReport" -ForegroundColor Gray
Write-Host ""

exit 0
