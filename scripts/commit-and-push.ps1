# Script para fazer commit e push das mudanças
# Execute: .\scripts\commit-and-push.ps1

Write-Host "🔄 Verificando status do Git..." -ForegroundColor Cyan
git status

Write-Host "`n📦 Verificando arquivos não rastreados..." -ForegroundColor Cyan
$untracked = git ls-files --others --exclude-standard
if ($untracked) {
    Write-Host "Arquivos não rastreados encontrados:" -ForegroundColor Yellow
    $untracked | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
}

Write-Host "`n📦 Adicionando TODOS os arquivos (incluindo novos)..." -ForegroundColor Cyan
git add -A

Write-Host "`n🔍 Verificando o que será commitado..." -ForegroundColor Cyan
git status --short

Write-Host "`n💾 Fazendo commit..." -ForegroundColor Cyan
$hasChanges = git diff --cached --name-only
if ($hasChanges -or $untracked) {
    git commit -m "fix: remover referências à URL antiga do Supabase e adicionar URL correta

- Removidas todas as menções à URL antiga bbcwitnbnosyfpjtzkr.supabase.co
- Atualizado .cursor/mcp-config.json para usar variáveis de ambiente
- Adicionada URL correta (mnszbkeuerjcevjvdqme.supabase.co) em arquivos de documentação
- Corrigidos arquivos de configuração e scripts relacionados"
}
else {
    Write-Host "⚠️  Nenhuma mudança para commitar!" -ForegroundColor Yellow
    Write-Host "Todos os arquivos já estão commitados ou não há mudanças." -ForegroundColor Gray
    exit 0
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit realizado com sucesso!" -ForegroundColor Green

    Write-Host "`n🚀 Fazendo push para origin/main..." -ForegroundColor Cyan
    git push origin main

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
        Write-Host "`n📝 Próximos passos:" -ForegroundColor Yellow
        Write-Host "   1. Atualizar variáveis de ambiente no Netlify Dashboard" -ForegroundColor White
        Write-Host "   2. Fazer redeploy no Netlify" -ForegroundColor White
    }
    else {
        Write-Host "❌ Erro ao fazer push!" -ForegroundColor Red
    }
}
else {
    Write-Host "❌ Erro ao fazer commit!" -ForegroundColor Red
}
