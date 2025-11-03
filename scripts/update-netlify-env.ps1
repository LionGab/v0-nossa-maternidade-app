# Script para atualizar variáveis de ambiente no Netlify
# Execute: .\scripts\update-netlify-env.ps1

Write-Host "🔧 Atualizando variáveis de ambiente no Netlify..." -ForegroundColor Cyan

# Verificar se Netlify CLI está instalado
$netlifyInstalled = Get-Command netlify -ErrorAction SilentlyContinue

if (-not $netlifyInstalled) {
    Write-Host "❌ Netlify CLI não está instalado!" -ForegroundColor Red
    Write-Host "📦 Instalando Netlify CLI..." -ForegroundColor Yellow
    npm install netlify-cli -g
    Write-Host "✅ Netlify CLI instalado!" -ForegroundColor Green
}

# Variáveis de ambiente corretas
$envVars = @{
    "NEXT_PUBLIC_SUPABASE_URL" = "https://mnszbkeuerjcevjvdqme.supabase.co"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTY3ODEsImV4cCI6MjA3NzQ5Mjc4MX0.f2jPp6KLzzrJPTt63FKNyDanh_0uw9rJ1-gbSvQFueo"
    "SUPABASE_SERVICE_ROLE_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTkxNjc4MSwiZXhwIjoyMDc3NDkyNzgxfQ.zOb5c5HhJhOF3-tWAkfo9HxKoUpA2JbsKFS939IPnd4"
}

Write-Host "`n🔐 Atualizando variáveis..." -ForegroundColor Cyan

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "  ✓ $key" -ForegroundColor Gray
    netlify env:set $key "$value"
}

Write-Host "`n✅ Variáveis atualizadas!" -ForegroundColor Green
Write-Host "`n📝 Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Faça um novo deploy: netlify deploy --prod" -ForegroundColor White
Write-Host "  2. Ou force um redeploy no dashboard: https://app.netlify.com/sites/nossamaternidade/deploys" -ForegroundColor White
Write-Host "  3. Teste o signup novamente após o deploy" -ForegroundColor White
