# Script para criar arquivos .env.example e .env.local
# Execute: .\scripts\create-env-files.ps1

$envContent = @"
# ============================================
# Variáveis de Ambiente - Nossa Maternidade
# ============================================
#
# INSTRUÇÕES:
# 1. Copie este arquivo para .env.local (desenvolvimento local)
# 2. Preencha os valores com suas credenciais reais
# 3. NUNCA commite o arquivo .env.local no Git!
#
# Para produção (Netlify), configure via interface web:
# Site settings > Environment variables
# ============================================

# ============================================
# SUPABASE (Obrigatório)
# ============================================
# Obtenha estas informações em: https://app.supabase.com/project/seu-projeto/settings/api

NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui

# ============================================
# APIs de IA (Opcional, mas recomendado)
# ============================================

# Anthropic Claude
# Obtenha em: https://console.anthropic.com/settings/keys
ANTHROPIC_API_KEY=sk-ant-sua-chave-aqui

# OpenAI
# Obtenha em: https://platform.openai.com/api-keys
OPE
NAI_API_KEY=sk-sua-chave-aqui

# Google AI (Gemini)
# Obtenha em: https://aistudio.google.com/app/apikey
GOOGLE_AI_API_KEY=sua-chave-gemini-aqui

# Perplexity (Opcional)
PERPLEXITY_API_KEY=sua-chave-perplexity-aqui

# ============================================
# URLs da Aplicação
# ============================================

# URL da aplicação em produção
NEXT_PUBLIC_APP_URL=https://seu-app.netlify.app

# URL de redirecionamento do Supabase (produção)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://seu-app.netlify.app/onboarding

# ============================================
# Feature Flags (Opcional)
# ============================================

# Habilitar recursos de IA (padrão: true)
NEXT_PUBLIC_ENABLE_AI_FEATURES=true

# Habilitar gamificação (padrão: true)
NEXT_PUBLIC_ENABLE_GAMIFICATION=true

# Habilitar analytics (padrão: false)
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# ============================================
# Sentry (Opcional - Error Tracking)
# ============================================

# Obtenha em: https://sentry.io/settings/seu-projeto/keys
SENTRY_DSN=sua-dsn-do-sentry-aqui
NEXT_PUBLIC_SENTRY_DSN=sua-dsn-publica-do-sentry-aqui

# ============================================
# Ambiente
# ============================================

# Ambiente atual (development, production, test)
NODE_ENV=development
"@

# Criar .env.example
$envExamplePath = Join-Path $PSScriptRoot ".." ".env.example"
Set-Content -Path $envExamplePath -Value $envContent -Encoding UTF8 -NoNewline
Write-Host "✅ Arquivo .env.example criado com sucesso!" -ForegroundColor Green

# Criar .env.local (se não existir)
$envLocalPath = Join-Path $PSScriptRoot ".." ".env.local"
if (-not (Test-Path $envLocalPath)) {
    Copy-Item $envExamplePath $envLocalPath
    Write-Host "✅ Arquivo .env.local criado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: Edite o arquivo .env.local com suas credenciais reais!" -ForegroundColor Yellow
}
else {
    Write-Host "⚠️  Arquivo .env.local já existe. Não foi sobrescrito." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Edite o arquivo .env.local com suas credenciais reais" -ForegroundColor Cyan
Write-Host "   2. Configure variáveis no Netlify para produção" -ForegroundColor Cyan
Write-Host "   3. Consulte ENV_SETUP_GUIDE.md para instruções detalhadas" -ForegroundColor Cyan
