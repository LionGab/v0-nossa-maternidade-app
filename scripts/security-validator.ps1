# 🔒 Validador de Segurança - Limites de Acesso
# Garante que scripts só trabalham dentro do repositório

param(
    [string]$Path = ".",
    [string[]]$AllowedDirs = @()
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..") -ErrorAction Stop

function Test-PathInRepository {
    param([string]$TestPath)

    $ResolvedPath = Resolve-Path $TestPath -ErrorAction SilentlyContinue
    if ($null -eq $ResolvedPath) {
        $ResolvedPath = Join-Path $ProjectRoot $TestPath
        $ResolvedPath = Resolve-Path $ResolvedPath -ErrorAction SilentlyContinue
    }

    if ($null -eq $ResolvedPath) {
        return $false
    }

    $ResolvedPathStr = $ResolvedPath.Path
    $ProjectRootStr = $ProjectRoot.Path

    # Verificar se está dentro do repositório
    if ($ResolvedPathStr -notlike "$ProjectRootStr*") {
        return $false
    }

    # Se há diretórios permitidos, verificar se está em um deles
    if ($AllowedDirs.Count -gt 0) {
        $InAllowedDir = $false
        foreach ($AllowedDir in $AllowedDirs) {
            $AllowedDirResolved = Resolve-Path $AllowedDir -ErrorAction SilentlyContinue
            if ($null -ne $AllowedDirResolved -and $ResolvedPathStr -like "$($AllowedDirResolved.Path)*") {
                $InAllowedDir = $true
                break
            }
        }

        if (-not $InAllowedDir) {
            return $false
        }
    }

    return $true
}

# Validar path
if (-not (Test-PathInRepository -TestPath $Path)) {
    Write-Host ""
    Write-Host "❌ ERRO DE SEGURANÇA: Path está FORA do repositório!" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Repositório: $ProjectRoot" -ForegroundColor Yellow
    Write-Host "  Path tentado: $Path" -ForegroundColor Yellow
    if ($AllowedDirs.Count -gt 0) {
        Write-Host "  Diretórios permitidos:" -ForegroundColor Yellow
        $AllowedDirs | ForEach-Object { Write-Host "    - $_" -ForegroundColor Gray }
    }
    Write-Host ""
    exit 1
}

# Validar diretórios permitidos
if ($AllowedDirs.Count -gt 0) {
    foreach ($AllowedDir in $AllowedDirs) {
        if (-not (Test-PathInRepository -TestPath $AllowedDir)) {
            Write-Host ""
            Write-Host "❌ ERRO DE SEGURANÇA: Diretório permitido está FORA do repositório!" -ForegroundColor Red
            Write-Host ""
            Write-Host "  Repositório: $ProjectRoot" -ForegroundColor Yellow
            Write-Host "  Diretório: $AllowedDir" -ForegroundColor Yellow
            Write-Host ""
            exit 1
        }
    }
}

Write-Host ""
Write-Host "✅ Validação de segurança passou" -ForegroundColor Green
Write-Host "  Repositório: $ProjectRoot" -ForegroundColor Gray
Write-Host "  Path: $Path" -ForegroundColor Gray
if ($AllowedDirs.Count -gt 0) {
    Write-Host "  Diretórios permitidos:" -ForegroundColor Gray
    $AllowedDirs | ForEach-Object { Write-Host "    - $_" -ForegroundColor Gray }
}
Write-Host ""

exit 0
