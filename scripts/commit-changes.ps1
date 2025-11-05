# Script para fazer commit das mudanças
# Execute: powershell -ExecutionPolicy Bypass -File scripts/commit-changes.ps1

Write-Host "🔍 Verificando status do Git..." -ForegroundColor Cyan
git status

Write-Host "`n📦 Adicionando todos os arquivos..." -ForegroundColor Cyan
git add -A

Write-Host "`n📝 Criando commit..." -ForegroundColor Cyan
$commitMessage = @"
feat: aplicar melhores práticas single-repo e consolidação de providers AI

- Corrigir Babel config para Next.js (remover Expo Router)
- Adicionar webpack alias para ignorar módulos Expo
- Centralizar providers AI em lib/ai/providers/index.ts
- Refatorar endpoints para usar providers centralizados
- Configurar Husky e pre-commit hooks
- Atualizar configs (TypeScript, ESLint, Vitest) para ignorar Expo
- Adicionar scripts de qualidade e validação
- Criar documentação de melhores práticas
- Atualizar .gitignore para arquivos Expo/React Native

Arquivos modificados:
- babel.config.js (corrigido para next/babel)
- next.config.mjs (webpack alias para Expo)
- tsconfig.json (excluir arquivos Expo)
- eslint.config.mjs (ignorar arquivos Expo)
- vitest.config.ts (excluir arquivos Expo)
- package.json (scripts prepare/postinstall para Husky)
- .gitignore (padrões Expo/React Native)
- app/api/multi-ai/chat/route.ts (usar providers centralizados)
- app/api/ai/smart-chat/route.ts (usar providers centralizados)
- lib/agents/code-agents-manager.ts (usar providers centralizados)

Arquivos criados:
- lib/ai/providers/index.ts (providers centralizados)
- scripts/setup-husky.mjs (setup automático Husky)
- docs/BEST_PRACTICES_APPLIED.md (documentação)
- ANALISE-ESTRUTURA-REPOSITORIO.md (análise do repositório)
- scripts/commit-changes.ps1 (este script)
"@

git commit -m $commitMessage

Write-Host "`n✅ Commit criado com sucesso!" -ForegroundColor Green
Write-Host "`n📤 Para fazer push, execute: git push origin main" -ForegroundColor Yellow
