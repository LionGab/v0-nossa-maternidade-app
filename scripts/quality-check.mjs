#!/usr/bin/env node

/**
 * Quality Check Script
 * Executa todas as validações de qualidade do projeto
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Parse arguments
const args = process.argv.slice(2);
const fastMode = args.includes('--fast');
const allMode = args.includes('--all');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n[${step}] ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function runCommand(command, description, options = {}) {
  try {
    logStep(description, `Executando: ${command}`);
    execSync(command, {
      stdio: 'inherit',
      cwd: rootDir,
      ...options,
    });
    logSuccess(`${description} passou`);
    return true;
  } catch (error) {
    logError(`${description} falhou`);
    if (!options.continueOnError) {
      process.exit(1);
    }
    return false;
  }
}

// Main quality check
async function main() {
  log('\n🚀 Iniciando Quality Check...', 'blue');
  log(`Modo: ${fastMode ? 'Fast (skip E2E)' : allMode ? 'All (inclui E2E)' : 'Padrão'}`, 'cyan');

  const results = {
    typeCheck: false,
    lint: false,
    test: false,
    e2e: false,
    env: false,
    build: false,
  };

  // 1. Type Check
  logStep('1/6', 'Type Check (TypeScript)');
  results.typeCheck = runCommand('npm run type-check', 'Type Check');

  // 2. Lint
  logStep('2/6', 'Lint (ESLint)');
  results.lint = runCommand('npm run lint', 'Lint');

  // 3. Unit Tests
  logStep('3/6', 'Unit Tests (Vitest)');
  results.test = runCommand('npm run test', 'Unit Tests');

  // 4. E2E Tests (opcional)
  if (!fastMode) {
    if (allMode) {
      logStep('4/6', 'E2E Tests (Playwright)');
      results.e2e = runCommand('npm run test:e2e', 'E2E Tests', { continueOnError: true });
    } else {
      logWarning('E2E Tests pulados (use --all para incluir)');
    }
  } else {
    logWarning('E2E Tests pulados (modo fast)');
  }

  // 5. Validate Env Vars
  logStep('5/6', 'Validate Env Vars');
  if (existsSync(join(rootDir, 'scripts/validate-env.mjs'))) {
    results.env = runCommand('node scripts/validate-env.mjs', 'Env Vars Validation', { continueOnError: true });
  } else {
    logWarning('Script de validação de env vars não encontrado (será criado)');
  }

  // 6. Build Check
  logStep('6/6', 'Build Check (Next.js)');
  if (existsSync(join(rootDir, 'scripts/validate-build.mjs'))) {
    results.build = runCommand('node scripts/validate-build.mjs', 'Build Validation', { continueOnError: true });
  } else {
    logWarning('Script de validação de build não encontrado (será criado)');
    // Fallback: run build directly
    results.build = runCommand('npm run build', 'Build Check', { continueOnError: true });
  }

  // Summary
  log('\n📊 Resumo:', 'blue');
  log(`Type Check: ${results.typeCheck ? '✅' : '❌'}`, results.typeCheck ? 'green' : 'red');
  log(`Lint: ${results.lint ? '✅' : '❌'}`, results.lint ? 'green' : 'red');
  log(`Tests: ${results.test ? '✅' : '❌'}`, results.test ? 'green' : 'red');
  log(`E2E: ${allMode && !fastMode ? (results.e2e ? '✅' : '⚠️') : '⏭️'}`, allMode && !fastMode ? (results.e2e ? 'green' : 'yellow') : 'yellow');
  log(`Env: ${results.env ? '✅' : '⚠️'}`, results.env ? 'green' : 'yellow');
  log(`Build: ${results.build ? '✅' : '⚠️'}`, results.build ? 'green' : 'yellow');

  const criticalPassed = results.typeCheck && results.lint && results.test;
  const allPassed = criticalPassed && (allMode ? results.e2e : true) && results.env && results.build;

  if (criticalPassed) {
    log('\n✅ Quality Check: Crítico passou!', 'green');
    if (!allPassed) {
      logWarning('Algumas validações opcionais falharam (ver resumo acima)');
    }
    process.exit(0);
  } else {
    log('\n❌ Quality Check: Falhou!', 'red');
    logError('Validações críticas falharam (Type Check, Lint, ou Tests)');
    process.exit(1);
  }
}

main().catch((error) => {
  logError(`Erro fatal: ${error.message}`);
  process.exit(1);
});
