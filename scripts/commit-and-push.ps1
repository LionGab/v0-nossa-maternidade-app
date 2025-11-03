# Script para fazer commit e push das mudanças
# Execute: .\scripts\commit-and-push.ps1

Write-Host "🔄 Verificando status do Git..." -ForegroundColor Cyan
git status

Write-Host "`n📦 Adicionando arquivos..." -ForegroundColor Cyan
git add -A

Write-Host "`n💾 Fazendo commit..." -ForegroundColor Cyan
git commit -m "fix: atualizar credenciais do Supabase e corrigir configuracoes

- Atualizar URL do Supabase para mnszbkeuerjcevjvdqme.supabase.co
- Adicionar scripts e documentacao para atualizar variaveis no Netlify
- Criar guias de correcao para signup e configuracoes
- Testes confirmam que credenciais estao funcionando corretamente"

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
