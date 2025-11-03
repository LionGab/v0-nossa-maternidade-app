# Script para fazer commit das correções de URL do Supabase
# Execute: .\scripts\commit-fix-url.ps1

Write-Host "🔧 Preparando commit das correções de URL do Supabase..." -ForegroundColor Cyan

# Verificar se estamos no diretório correto
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erro: Não está em um repositório Git!" -ForegroundColor Red
    exit 1
}

# Adicionar arquivos modificados
Write-Host "`n📝 Adicionando arquivos modificados..." -ForegroundColor Yellow

git add .cursor/mcp-config.json
git add FIX_URGENTE.md
git add FIX_SIGNUP_URGENTE.md
git add SECURITY_AUDIT_REPORT.md
git add MAIN.md
git add SECRETS_ROTATION_GUIDE.md
git add SECRETS_MIGRATION_CHECKLIST.md

Write-Host "✅ Arquivos adicionados" -ForegroundColor Green

# Verificar status
Write-Host "`n📊 Status do repositório:" -ForegroundColor Yellow
git status --short

# Fazer commit
Write-Host "`n💾 Fazendo commit..." -ForegroundColor Yellow
$commitMessage = @"
fix: remover referências à URL antiga do Supabase e adicionar URL correta

- Removidas todas as menções à URL antiga bbcwitnbnosyfpjtzkr.supabase.co
- Atualizado .cursor/mcp-config.json para usar variáveis de ambiente
- Adicionada URL correta (mnszbkeuerjcevjvdqme.supabase.co) em arquivos de documentação
- Corrigidos arquivos de configuração e scripts

A URL correta agora está configurada em todos os lugares necessários.
"@

git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Commit realizado com sucesso!" -ForegroundColor Green
    Write-Host "`n📤 Para fazer push para a main:" -ForegroundColor Cyan
    Write-Host "   git push origin main" -ForegroundColor White
}
else {
    Write-Host "`n❌ Erro ao fazer commit" -ForegroundColor Red
    exit 1
}
