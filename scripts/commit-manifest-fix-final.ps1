# Script para fazer commit das correções do manifest.json
# Execute: .\scripts\commit-manifest-fix-final.ps1

Write-Host "🔧 Preparando commit das correções do manifest.json..." -ForegroundColor Cyan

# Adicionar arquivos modificados
Write-Host "📦 Adicionando arquivos ao stage..." -ForegroundColor Yellow
git add app/manifest.json/route.ts
git add public/manifest.json
git add scripts/commit-manifest-fix-final.ps1

# Verificar status
Write-Host "`n📋 Status do repositório:" -ForegroundColor Yellow
git status --short

# Fazer commit
Write-Host "`n💾 Fazendo commit..." -ForegroundColor Yellow
git commit -m "Fix: Remove non-existent .webp icons and screenshots from manifest

- Remove all .webp icon references (files don't exist)
- Remove screenshots section (directory doesn't exist)
- Keep only .png icons that exist in public/icons/
- Fixes PWA manifest validation failures
- Prevents missing resource errors in browsers

Files updated:
- public/manifest.json: Removed .webp icons and screenshots
- app/manifest.json/route.ts: Removed .webp icons and screenshots

All manifest entries now reference only existing files."

# Mostrar último commit
Write-Host "`n✅ Commit realizado com sucesso!" -ForegroundColor Green
Write-Host "`n📝 Último commit:" -ForegroundColor Yellow
git log -1 --oneline

Write-Host "`n🚀 Próximo passo: git push origin main" -ForegroundColor Cyan
