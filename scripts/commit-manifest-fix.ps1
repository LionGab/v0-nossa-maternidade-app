# Script para fazer commit da correção do manifest.json
# Execute: .\scripts\commit-manifest-fix.ps1

Write-Host "🔧 Preparando commit da correção do manifest.json..." -ForegroundColor Cyan

# Adicionar arquivos
Write-Host "📦 Adicionando arquivos ao stage..." -ForegroundColor Yellow
git add app/manifest.json/route.ts
git add public/manifest.json
git add CORRIGIR_MANIFEST_JSON.md
git add FIX_MANIFEST_ERROS.md
git add USAR_PREVIEW_SERVER.md
git add QUAL_SITE_USAR.md
git add EXPLICACAO_SITES_NETLIFY.md
git add CORRIGIR_SIGNUP_AGORA.md
git add DELETAR_VARIAVEIS_EXPO.md
git add FIX_SUPABASE_URL_ERR_NAME_NOT_RESOLVED.md
git add DIAGNOSTICO_SUPABASE_URL.md
git add CORRIGIR_URL_NETLIFY_AGORA.md
git add FIX_DEBUGBEAR_PLUGIN.md
git add scripts/commit-manifest-fix.ps1
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
- Add API route for manifest.json to serve correctly
- Fix manifest.json syntax errors
- Add comprehensive documentation for troubleshooting

Files updated:
- public/manifest.json: Removed .webp icons and screenshots
- app/manifest.json/route.ts: Removed .webp icons and screenshots

Fixes:
- PWA manifest validation failures
- Missing resource errors in browsers
- Manifest: Line: 1, column: 1, Syntax error
- Supabase URL ERR_NAME_NOT_RESOLVED
- Signup Failed to fetch errors"

# Mostrar último commit
Write-Host "`n✅ Commit realizado com sucesso!" -ForegroundColor Green
Write-Host "`n📝 Último commit:" -ForegroundColor Yellow
git log -1 --oneline

Write-Host "`n🚀 Próximo passo: git push origin main" -ForegroundColor Cyan
