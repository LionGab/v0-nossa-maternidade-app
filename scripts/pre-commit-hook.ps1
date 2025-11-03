# Pre-commit hook para Windows (PowerShell)
# Instalar: copie para .git/hooks/pre-commit e torne executável
# Ou use: git config core.hooksPath .git/hooks

Write-Host "🔒 Verificando por secrets expostos..." -ForegroundColor Yellow

# Obter arquivos staged
$stagedFiles = git diff --cached --name-only --diff-filter=ACM

# Verificar arquivos .env (exceto .env.example)
$envFiles = $stagedFiles | Where-Object {
    $_ -match '\.env$|\.env\.local$|\.env\.production$|\.env\.development$' -and
    $_ -notmatch '\.env\.example$'
}

if ($envFiles) {
    Write-Host "❌ ERRO: Tentativa de commitar arquivo .env detectado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Arquivos bloqueados:" -ForegroundColor Yellow
    $envFiles | ForEach-Object { Write-Host "  - $_" }
    Write-Host ""
    Write-Host "⚠️  NUNCA commite arquivos .env* com valores reais!" -ForegroundColor Red
    Write-Host "💡 Use .env.example como template e configure variáveis localmente ou em produção." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Verificar por padrões suspeitos
foreach ($file in $stagedFiles) {
    # Pular arquivos de lock e documentação
    if ($file -match '\.(lock|md|txt)$' -or $file -match '(node_modules|\.git|\.next)') {
        continue
    }

    $diff = git diff --cached $file

    # Verificar por JWT tokens
    if ($diff -match 'eyJ[A-Za-z0-9_-]{100,}') {
        Write-Host "⚠️  ATENÇÃO: Possível JWT token detectado em $file" -ForegroundColor Yellow
        Write-Host "   Certifique-se de que não é um secret real!" -ForegroundColor Yellow
    }

    # Verificar por API keys
    if ($diff -match '(sk-|sk_|pk_|AIza|ghp_|xoxb-|xoxa-)') {
        Write-Host "⚠️  ATENÇÃO: Possível API key detectada em $file" -ForegroundColor Yellow
        Write-Host "   Certifique-se de que não é um secret real!" -ForegroundColor Yellow
    }
}

Write-Host "✅ Verificação de segurança concluída" -ForegroundColor Green
exit 0
