#!/usr/bin/env node

/**
 * Script de Testes Antes do Commit
 * Executa build e testes completos
 */

import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = join(__dirname, '..')

console.log('🧪 Iniciando testes completos do app...\n')

try {
  // 1. Executar build
  console.log('📦 Executando build...')
  execSync('npm run build', {
    cwd: PROJECT_ROOT,
    encoding: 'utf-8',
    stdio: 'inherit',
  })
  console.log('✅ Build concluído!\n')

  // 2. Executar testes E2E completos
  console.log('🧪 Executando testes E2E completos...')
  execSync('npx playwright test e2e/complete-app-test.spec.ts --reporter=list', {
    cwd: PROJECT_ROOT,
    encoding: 'utf-8',
    stdio: 'inherit',
  })

  console.log('\n✅ Todos os testes passaram!')
  console.log('🚀 Pronto para commit!')
  process.exit(0)
} catch (error) {
  console.error('\n❌ Erro durante os testes:', error.message)
  console.error('❌ Revise antes de fazer commit.')
  process.exit(1)
}

