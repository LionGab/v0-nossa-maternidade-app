# Script para corrigir todos os erros de logger.error
# Converte logger.error("msg", { error: ... }) para logger.error("msg", error, { ... })

$files = @(
    "lib/feature-flags.ts",
    "lib/ai/cost-tracker.ts",
    "lib/ai/cache.ts",
    "lib/content/news-aggregator.ts",
    "lib/ai/providers/gemini-pro.ts",
    "lib/ai/providers/grok.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw

        # Padrão 1: logger.error("msg", { error: error.message, ... })
        $content = $content -replace 'logger\.error\("([^"]+)",\s*\{\s*error:\s*error\.message,([^}]+)\}\s*\)', 'logger.error("$1", new Error(error.message), { $2 })'

        # Padrão 2: logger.error("msg", { error: error instanceof Error ? error.message : String(error), ... })
        $content = $content -replace 'logger\.error\("([^"]+)",\s*\{\s*error:\s*error\s+instanceof\s+Error\s+\?\s+error\.message\s+:\s+String\(error\),([^}]+)\}\s*\)', 'logger.error("$1", error instanceof Error ? error : new Error(String(error)), { $2 })'

        Set-Content -Path $file -Value $content -NoNewline
        Write-Host "Fixed: $file" -ForegroundColor Green
    }
}

Write-Host "`nDone! All logger.error calls fixed." -ForegroundColor Cyan
