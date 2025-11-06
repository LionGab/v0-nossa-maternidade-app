# Script para commitar mudanças pendentes organizadas
# Execute: .\scripts\commit-pendentes.ps1

Write-Host "📋 Organizando mudanças pendentes..." -ForegroundColor Cyan

# 1. Scripts de qualidade (alta prioridade)
Write-Host "`n✅ Adicionando scripts de qualidade..." -ForegroundColor Green
git add package.json package-lock.json vitest.config.ts
git add scripts/quality-check.mjs scripts/validate-*.mjs scripts/validate-*.js
git add eslint.config.mjs

if (git diff --cached --quiet) {
    Write-Host "   ℹ️  Nenhuma mudança para scripts de qualidade" -ForegroundColor Yellow
} else {
    git commit -m "feat: adicionar scripts de qualidade e validação

- Adicionar scripts quality, quality:fast, quality:all
- Adicionar scripts validate, validate:e2e
- Adicionar scripts type-check, lint, lint:fix
- Atualizar configurações ESLint e Vitest
- Adicionar scripts de validação de build e env"
    Write-Host "   ✅ Commit de scripts realizado!" -ForegroundColor Green
}

# 2. Workflows GitHub Actions
Write-Host "`n✅ Adicionando workflows GitHub Actions..." -ForegroundColor Green
git add .github/workflows/ci-cd.yml
git add .github/workflows/*.yml

if (git diff --cached --quiet) {
    Write-Host "   ℹ️  Nenhuma mudança para workflows" -ForegroundColor Yellow
} else {
    git commit -m "ci: adicionar workflows de CI/CD mobile e validação

- Adicionar workflow CI/CD mobile otimizado
- Adicionar workflow de validação pós-merge
- Adicionar workflow de preview mobile
- Adicionar workflow de alertas Sentry
- Adicionar workflow de build inteligente
- Adicionar workflow de sincronização de envs
- Atualizar workflow CI/CD principal"
    Write-Host "   ✅ Commit de workflows realizado!" -ForegroundColor Green
}

# 3. APIs e bibliotecas
Write-Host "`n✅ Adicionando mudanças em APIs..." -ForegroundColor Green
git add app/api/ai/smart-chat/route.ts
git add app/api/multi-ai/chat/route.ts
git add lib/agents/code-agents-manager.ts
git add lib/ai/providers/index.ts

if (git diff --cached --quiet) {
    Write-Host "   ℹ️  Nenhuma mudança para APIs" -ForegroundColor Yellow
} else {
    git commit -m "feat: melhorar APIs de IA e gerenciamento de agentes

- Atualizar API de chat inteligente
- Atualizar API de chat multi-IA
- Melhorar gerenciador de agentes de código
- Adicionar provedores de IA indexados"
    Write-Host "   ✅ Commit de APIs realizado!" -ForegroundColor Green
}

# 4. Documentação DevOps
Write-Host "`n✅ Adicionando documentação DevOps..." -ForegroundColor Green
git add docs/QUALITY.md
git add docs/CHECKLIST_POS_MERGE.md
git add docs/DIAGNOSTICO_DEVOPS.md
git add docs/MELHORIAS_DEVOPS.md
git add docs/RESUMO_IMPLEMENTACAO_DEVOPS.md
git add docs/REVIEW_CHECKLIST.md
git add docs/STRUCTURE.md
git add docs/UX_DEBT_LOG.md
git add docs/A11Y_CHECKLIST.md
git add docs/COMPONENT_STATUS.md
git add docs/DESIGN_SYSTEM_V1.md
git add docs/design-system-microcopy.md
git add docs/user-testing-plan.md
git add docs/user-testing-results.md

if (git diff --cached --quiet) {
    Write-Host "   ℹ️  Nenhuma mudança para documentação DevOps" -ForegroundColor Yellow
} else {
    git commit -m "docs: adicionar documentação de DevOps, qualidade e design

- Adicionar guia de qualidade (QUALITY.md)
- Adicionar checklists de review e acessibilidade
- Adicionar documentação de design system
- Adicionar planos de testes de usuário
- Adicionar diagnósticos e melhorias DevOps"
    Write-Host "   ✅ Commit de documentação realizado!" -ForegroundColor Green
}

# 5. Documentação adicional
Write-Host "`n✅ Adicionando documentação adicional..." -ForegroundColor Green
git add COMMIT_AGORA.md STATUS_PENDENTE.md
git add ANALISE-ESTRUTURA-REPOSITORIO.md
git add GUIA_EXECUCAO_CURSOR_2.0.md
git add INDICE_DOCUMENTOS.md
git add MIGRATION_GUIDE.md
git add PLANO_DESIGN_SYSTEM_V1.md
git add README.mobile.md
git add SETUP_COMPLETE.md

if (git diff --cached --quiet) {
    Write-Host "   ℹ️  Nenhuma mudança para documentação adicional" -ForegroundColor Yellow
} else {
    git commit -m "docs: adicionar documentação adicional e guias

- Adicionar guias de execução e migração
- Adicionar análise de estrutura
- Adicionar plano de design system
- Adicionar README mobile
- Adicionar scripts de commit"
    Write-Host "   ✅ Commit de documentação adicional realizado!" -ForegroundColor Green
}

# 6. Scripts
Write-Host "`n✅ Adicionando scripts..." -ForegroundColor Green
git add scripts/commit-consolidacao.ps1
git add scripts/commit-pendentes.ps1
git add scripts/check-sentry-errors.js
git add scripts/migrate-to-mobile.sh
git add scripts/test-mobile.mjs

if (git diff --cached --quiet) {
    Write-Host "   ℹ️  Nenhuma mudança para scripts" -ForegroundColor Yellow
} else {
    git commit -m "chore: adicionar scripts auxiliares

- Adicionar script de commit de consolidação
- Adicionar script de commit de pendentes
- Adicionar script de verificação Sentry
- Adicionar script de migração mobile
- Adicionar script de testes mobile"
    Write-Host "   ✅ Commit de scripts realizado!" -ForegroundColor Green
}

# 7. Configurações Mobile (opcional - comentar se não quiser commitar ainda)
Write-Host "`n⚠️  Configurações Mobile (pular por enquanto)..." -ForegroundColor Yellow
Write-Host "   ℹ️  Use git add manualmente se quiser commitar configurações mobile" -ForegroundColor Yellow

# Status final
Write-Host "`n📊 Status final:" -ForegroundColor Cyan
git status --short

Write-Host "`n✅ Organização de commits concluída!" -ForegroundColor Green
Write-Host "`n📝 Para ver o log dos commits:" -ForegroundColor Cyan
Write-Host "   git log --oneline -10" -ForegroundColor Gray
