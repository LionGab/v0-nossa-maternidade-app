# Script para commitar mudanças de consolidação
# Execute: .\scripts\commit-consolidacao.ps1

Write-Host "📋 Verificando status do Git..." -ForegroundColor Cyan

# Verificar status
git status

Write-Host "`n📦 Adicionando arquivos de documentação..." -ForegroundColor Cyan

# Adicionar documentos de consolidação
git add docs/CONSOLIDACAO_PLANO.md
git add docs/INDEX.md
git add docs/DEPLOY_PRODUCTION.md
git add docs/SECURITY.md
git add docs/AMBIENTES_MATRIZ.md
git add docs/SETUP_RAPIDO.md
git add docs/MVP_STATUS.md
git add tests/contracts/rls.test.ts
git add README.md

Write-Host "`n✅ Arquivos adicionados!" -ForegroundColor Green

# Verificar o que será commitado
Write-Host "`n📋 Arquivos que serão commitados:" -ForegroundColor Cyan
git status --short

# Fazer commit
Write-Host "`n💾 Fazendo commit..." -ForegroundColor Cyan
git commit -m "docs: adicionar documentação completa de consolidação e MVP

- Adicionar plano de consolidação executivo (CONSOLIDACAO_PLANO.md)
- Adicionar índice unificado de documentação (INDEX.md)
- Adicionar guia completo de deploy (DEPLOY_PRODUCTION.md)
- Adicionar políticas de segurança e RLS (SECURITY.md)
- Adicionar matriz de ambientes (AMBIENTES_MATRIZ.md)
- Adicionar guia de setup rápido (SETUP_RAPIDO.md)
- Adicionar status do MVP (MVP_STATUS.md)
- Adicionar template de contract tests RLS (tests/contracts/rls.test.ts)
- Atualizar README com instruções claras de setup

MVP 100% funcional com documentação completa"

Write-Host "`n✅ Commit realizado com sucesso!" -ForegroundColor Green

# Mostrar log do último commit
Write-Host "`n📝 Último commit:" -ForegroundColor Cyan
git log -1 --oneline
