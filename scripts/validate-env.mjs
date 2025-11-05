#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * Valida variáveis de ambiente obrigatórias e opcionais
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Variáveis obrigatórias
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

// Variáveis opcionais (mas recomendadas)
const OPTIONAL_ENV_VARS = [
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY',
  'GOOGLE_AI_API_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

// Padrões de validação
const VALIDATION_PATTERNS = {
  'NEXT_PUBLIC_SUPABASE_URL': /^https:\/\/[a-z0-9-]+\.supabase\.co$/,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': /^eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\./,
  'ANTHROPIC_API_KEY': /^sk-ant-[a-zA-Z0-9_-]+$/,
  'OPENAI_API_KEY': /^sk-[a-zA-Z0-9_-]+$/,
  'GOOGLE_AI_API_KEY': /^[a-zA-Z0-9_-]+$/,
};

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
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

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

/**
 * Valida se uma variável de ambiente está presente e tem formato correto
 */
function validateEnvVar(varName, value, isRequired = false) {
  const errors = [];
  const warnings = [];

  // Verificar se está presente
  if (!value || value.trim() === '') {
    if (isRequired) {
      errors.push(`${varName} é obrigatória mas não está definida`);
    } else {
      warnings.push(`${varName} não está definida (opcional)`);
    }
    return { errors, warnings };
  }

  // Verificar formato se houver padrão
  const pattern = VALIDATION_PATTERNS[varName];
  if (pattern && !pattern.test(value)) {
    errors.push(`${varName} tem formato inválido`);
  }

  // Verificar se não é placeholder
  if (value.includes('placeholder') || value === 'placeholder') {
    if (isRequired) {
      errors.push(`${varName} está usando valor placeholder`);
    } else {
      warnings.push(`${varName} está usando valor placeholder`);
    }
  }

  return { errors, warnings };
}

/**
 * Carrega variáveis de ambiente de arquivo .env.local se existir
 */
function loadEnvFile() {
  const envFile = join(rootDir, '.env.local');
  if (existsSync(envFile)) {
    try {
      const content = readFileSync(envFile, 'utf-8');
      const envVars = {};

      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          }
        }
      });

      // Carregar no process.env se não estiver definido
      Object.entries(envVars).forEach(([key, value]) => {
        if (!process.env[key]) {
          process.env[key] = value;
        }
      });

      return envVars;
    } catch (error) {
      logWarning(`Não foi possível ler .env.local: ${error.message}`);
      return {};
    }
  }
  return {};
}

/**
 * Validação principal
 */
async function main() {
  log('\n🔍 Validando variáveis de ambiente...', 'cyan');

  // Carregar .env.local se existir
  const envFile = loadEnvFile();

  const allErrors = [];
  const allWarnings = [];

  // Validar variáveis obrigatórias
  log('\n📋 Variáveis obrigatórias:', 'cyan');
  for (const varName of REQUIRED_ENV_VARS) {
    const value = process.env[varName];
    const { errors, warnings } = validateEnvVar(varName, value, true);
    allErrors.push(...errors);
    allWarnings.push(...warnings);

    if (errors.length === 0) {
      logSuccess(`${varName} está configurada`);
    } else {
      errors.forEach((err) => logError(err));
    }
  }

  // Validar variáveis opcionais
  log('\n📋 Variáveis opcionais:', 'cyan');
  for (const varName of OPTIONAL_ENV_VARS) {
    const value = process.env[varName];
    const { errors, warnings } = validateEnvVar(varName, value, false);
    allErrors.push(...errors);
    allWarnings.push(...warnings);

    if (value && errors.length === 0) {
      logSuccess(`${varName} está configurada`);
    } else if (warnings.length > 0) {
      warnings.forEach((warn) => logWarning(warn));
    }
  }

  // Resumo
  log('\n📊 Resumo:', 'cyan');
  log(`✅ Variáveis obrigatórias: ${REQUIRED_ENV_VARS.length - allErrors.length}/${REQUIRED_ENV_VARS.length}`);
  log(`⚠️  Avisos: ${allWarnings.length}`);
  log(`❌ Erros: ${allErrors.length}`);

  // Falhar se houver erros em variáveis obrigatórias
  if (allErrors.length > 0) {
    log('\n❌ Validação falhou!', 'red');
    log('Por favor, configure as variáveis de ambiente obrigatórias.', 'red');
    process.exit(1);
  }

  if (allWarnings.length > 0) {
    log('\n⚠️  Validação passou com avisos', 'yellow');
    log('Algumas variáveis opcionais não estão configuradas.', 'yellow');
    process.exit(0);
  }

  log('\n✅ Validação passou!', 'green');
  process.exit(0);
}

main().catch((error) => {
  logError(`Erro fatal: ${error.message}`);
  process.exit(1);
});
