# Script para fazer commit das correções de testes
cd $PSScriptRoot\..

Write-Host "Adicionando arquivos modificados..." -ForegroundColor Green
git add tsconfig.json playwright.config.ts next.config.mjs
git add e2e/netlify.spec.ts e2e/api.spec.ts e2e/security.spec.ts e2e/performance.spec.ts

Write-Host "Verificando status..." -ForegroundColor Green
git status

Write-Host "Fazendo commit..." -ForegroundColor Green
git commit -m "fix: corrigir build Netlify excluindo testes E2E do build

- Excluir pasta e2e e arquivos de teste do tsconfig.json
- Corrigir playwright.config.ts para usar npm ao invés de pnpm
- Simplificar next.config.mjs removendo configuração webpack desnecessária
- Adicionar testes robustos para Netlify (E2E, API, segurança, performance)"

Write-Host "Commit realizado com sucesso!" -ForegroundColor Green
Write-Host "Execute 'git push' para enviar as alterações" -ForegroundColor Yellow
