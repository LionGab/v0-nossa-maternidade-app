# Script para criar arquivo .env.local com as variáveis corretas para Next.js
# Execute: .\scripts\create-env-local.ps1

$projectRoot = Split-Path -Parent $PSScriptRoot
$envLocalPath = Join-Path $projectRoot ".env.local"

Write-Host "[INFO] Criando arquivo .env.local..." -ForegroundColor Cyan

$envContent = @"
# Variáveis de Ambiente - Nossa Maternidade (Next.js)
# ⚠️ NUNCA commitar este arquivo no Git (já está no .gitignore)

# ========================================
# SUPABASE
# ========================================
NEXT_PUBLIC_SUPABASE_URL=https://mnszbkeuerjcevjvdqme.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTY3ODEsImV4cCI6MjA3NzQ5Mjc4MX0.f2jPp6KLzzrJPTt63FKNyDanh_0uw9rJ1-gbSvQFueo

# ⚠️ SERVICE_ROLE_KEY - NÃO USAR NO FRONTEND (apenas para referência)
# Esta chave deve ser usada APENAS em Edge Functions do Supabase (backend)
# NUNCA exponha esta chave no código cliente
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTkxNjc4MSwiZXhwIjoyMDc3NDkyNzgxfQ.zOb5c5HhJhOF3-tWAkfo9HxKoUpA2JbsKFS939IPnd4

# ========================================
# APIs DE IA
# ========================================
GOOGLE_AI_API_KEY=AIzaSyC9YVWRmnGyGu4c9y7g-mNkkipDqb5JBZg
ANTHROPIC_API_KEY=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
OPENAI_API_KEY=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
PERPLEXITY_API_KEY=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

# ========================================
# URLs DA APLICAÇÃO
# ========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/onboarding

# ========================================
# FEATURE FLAGS
# ========================================
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_GAMIFICATION=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# ========================================
# AMBIENTE
# ========================================
NODE_ENV=development
"@

try {
    $envContent | Out-File -FilePath $envLocalPath -Encoding UTF8 -Force
    Write-Host "[OK] Arquivo .env.local criado com sucesso!" -ForegroundColor Green
    Write-Host "   Localizacao: $envLocalPath" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Proximos passos:" -ForegroundColor Cyan
    Write-Host "   1. Validar variaveis: npm run validate:env" -ForegroundColor Yellow
    Write-Host "   2. Testar API keys: npm run test:api-keys" -ForegroundColor Yellow
    Write-Host "   3. Iniciar servidor: npm run dev" -ForegroundColor Yellow
} catch {
    Write-Host "[ERRO] Erro ao criar arquivo .env.local: $_" -ForegroundColor Red
    exit 1
}
