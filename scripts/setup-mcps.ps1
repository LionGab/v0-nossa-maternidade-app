# Script de Configuracao Automatica de MCPs
# Para o projeto v0-nossa-maternidade-app

Write-Host "[*] Configurando MCPs para Claude Desktop..." -ForegroundColor Cyan

# Caminhos
$configPath = "$env:APPDATA\Claude\claude_desktop_config.json"
$examplePath = Join-Path $PSScriptRoot "..\mcp-config-example.json"
$projectRoot = Join-Path $PSScriptRoot ".."

# Verificar se a pasta Claude existe
$claudeDir = "$env:APPDATA\Claude"
if (-not (Test-Path $claudeDir)) {
    Write-Host "[*] Criando diretorio Claude..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $claudeDir -Force | Out-Null
}

# Ler o arquivo de exemplo
if (-not (Test-Path $examplePath)) {
    Write-Host "[ERRO] Arquivo mcp-config-example.json nao encontrado!" -ForegroundColor Red
    Write-Host "   Local esperado: $examplePath" -ForegroundColor Red
    exit 1
}

Write-Host "[*] Lendo configuracao de exemplo..." -ForegroundColor Yellow
$exampleConfig = Get-Content $examplePath -Raw | ConvertFrom-Json

# Se o arquivo de configuracao ja existe, fazer backup
if (Test-Path $configPath) {
    $backupPath = "$configPath.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Write-Host "[*] Fazendo backup do arquivo existente..." -ForegroundColor Yellow
    Copy-Item $configPath $backupPath
    Write-Host "   Backup salvo em: $backupPath" -ForegroundColor Gray

    # Ler configuracao existente
    $existingConfig = Get-Content $configPath -Raw | ConvertFrom-Json

    # Mesclar configuracoes existentes com as novas
    Write-Host "[*] Mesclando configuracoes..." -ForegroundColor Yellow
    foreach ($server in $exampleConfig.mcpServers.PSObject.Properties) {
        $serverName = $server.Name
        $serverConfig = $server.Value

        if ($existingConfig.mcpServers.$serverName) {
            Write-Host "   [OK] Mantendo configuracao existente: $serverName" -ForegroundColor Gray
            # Manter env vars existentes, atualizar outras propriedades
            if ($existingConfig.mcpServers.$serverName.env) {
                $serverConfig.env = $existingConfig.mcpServers.$serverName.env
            }
        } else {
            Write-Host "   [+] Adicionando novo MCP: $serverName" -ForegroundColor Green
        }

        $existingConfig.mcpServers | Add-Member -NotePropertyName $serverName -NotePropertyValue $serverConfig -Force
    }

    $finalConfig = $existingConfig
} else {
    Write-Host "[*] Criando novo arquivo de configuracao..." -ForegroundColor Green
    $finalConfig = $exampleConfig
}

# Atualizar caminhos do projeto
Write-Host "[*] Atualizando caminhos do projeto..." -ForegroundColor Yellow
$projectPath = (Resolve-Path $projectRoot).Path
$parentPath = (Resolve-Path (Split-Path $projectPath)).Path

if ($finalConfig.mcpServers.filesystem) {
    $finalConfig.mcpServers.filesystem.args = @(
        "-y",
        "@modelcontextprotocol/server-filesystem",
        $projectPath,
        $parentPath
    )
}

if ($finalConfig.mcpServers.git) {
    $finalConfig.mcpServers.git.args = @(
        "-y",
        "@modelcontextprotocol/server-git",
        "--repository",
        $projectPath
    )
}

# Validar JSON
Write-Host "[*] Validando JSON..." -ForegroundColor Yellow
try {
    $jsonString = $finalConfig | ConvertTo-Json -Depth 10 -Compress
    $null = $jsonString | ConvertFrom-Json
    Write-Host "   [OK] JSON valido!" -ForegroundColor Green
} catch {
    Write-Host "   [ERRO] Erro ao validar JSON: $_" -ForegroundColor Red
    exit 1
}

# Salvar configuracao
Write-Host "[*] Salvando configuracao em: $configPath" -ForegroundColor Yellow
$finalConfig | ConvertTo-Json -Depth 10 | Set-Content $configPath -Encoding UTF8

Write-Host ""
Write-Host "[OK] Configuracao concluida!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "   1. Edite o arquivo: $configPath" -ForegroundColor White
Write-Host "   2. Substitua os valores de placeholder:" -ForegroundColor White
Write-Host "      - COLE_SEU_TOKEN_GITHUB_AQUI -> Token GitHub (opcional)" -ForegroundColor Gray
Write-Host "      - COLE_SUA_CHAVE_BRAVE_AQUI -> API Key Brave (opcional)" -ForegroundColor Gray
Write-Host "   3. Feche COMPLETAMENTE o Claude Desktop" -ForegroundColor White
Write-Host "   4. Reabra o Claude Desktop" -ForegroundColor White
Write-Host "   5. Aguarde 30-60 segundos para os MCPs carregarem" -ForegroundColor White
Write-Host ""
Write-Host "MCPs configurados:" -ForegroundColor Cyan
foreach ($server in $finalConfig.mcpServers.PSObject.Properties) {
    Write-Host "   [OK] $($server.Name)" -ForegroundColor Green
}
Write-Host ""
