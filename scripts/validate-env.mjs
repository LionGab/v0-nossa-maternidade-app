#!/usr/bin/env node
/**
 * Script de Validação de Variáveis de Ambiente
 * Verifica se todas as variáveis necessárias estão configuradas
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Variáveis obrigatórias
const REQUIRED_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
]

// Variáveis opcionais (mas recomendadas)
const OPTIONAL_VARS = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY',
  'GOOGLE_AI_API_KEY',
  'PERPLEXITY_API_KEY',
  'GROK_API_KEY',
]

function loadEnvFile() {
  try {
    const envPath = join(__dirname, '..', '.env.local')
    const content = readFileSync(envPath, 'utf-8')
    const env = {}

    content.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim()
        }
      }
    })

    return env
  } catch (error) {
    return {}
  }
}

function validateUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function validateApiKey(key, prefix) {
  if (!key) return false
  if (prefix && !key.startsWith(prefix)) {
    return false
  }
  return key.length > 10 // Mínimo de caracteres
}

function main() {
  log('\n🔍 Validando Variáveis de Ambiente...\n', 'cyan')

  const env = loadEnvFile()
  const envVars = { ...process.env, ...env }

  let hasErrors = false
  let hasWarnings = false

  // Validar variáveis obrigatórias
  log('📋 Variáveis Obrigatórias:', 'blue')
  for (const varName of REQUIRED_VARS) {
    const value = envVars[varName]
    if (!value) {
      log(`  ❌ ${varName}: NÃO CONFIGURADA`, 'red')
      hasErrors = true
    } else {
      // Validações específicas
      if (varName.includes('URL') && !validateUrl(value)) {
        log(`  ⚠️  ${varName}: URL inválida`, 'yellow')
        hasWarnings = true
      } else {
        log(`  ✅ ${varName}: Configurada`, 'green')
      }
    }
  }

  // Validar variáveis opcionais
  log('\n📋 Variáveis Opcionais (Recomendadas):', 'blue')
  for (const varName of OPTIONAL_VARS) {
    const value = envVars[varName]
    if (!value) {
      log(`  ⚠️  ${varName}: Não configurada (opcional)`, 'yellow')
      hasWarnings = true
    } else {
      // Validações específicas
      let isValid = true
      if (varName.includes('API_KEY')) {
        if (varName.includes('ANTHROPIC') && !validateApiKey(value, 'sk-ant-')) {
          isValid = false
        } else if (varName.includes('OPENAI') && !validateApiKey(value, 'sk-')) {
          isValid = false
        } else if (varName.includes('PERPLEXITY') && !validateApiKey(value, 'pplx-')) {
          isValid = false
        } else if (varName.includes('GOOGLE') && !validateApiKey(value, 'AIza')) {
          isValid = false
        } else if (!validateApiKey(value)) {
          isValid = false
        }
      }

      if (isValid) {
        log(`  ✅ ${varName}: Configurada`, 'green')
      } else {
        log(`  ⚠️  ${varName}: Formato pode estar incorreto`, 'yellow')
        hasWarnings = true
      }
    }
  }

  // Resumo
  log('\n📊 Resumo:', 'cyan')
  const requiredCount = REQUIRED_VARS.filter(v => envVars[v]).length
  const optionalCount = OPTIONAL_VARS.filter(v => envVars[v]).length

  log(`  ✅ Variáveis obrigatórias: ${requiredCount}/${REQUIRED_VARS.length}`,
    requiredCount === REQUIRED_VARS.length ? 'green' : 'red')
  log(`  ✅ Variáveis opcionais: ${optionalCount}/${OPTIONAL_VARS.length}`,
    optionalCount === OPTIONAL_VARS.length ? 'green' : 'yellow')

  if (hasErrors) {
    log('\n❌ ERROS ENCONTRADOS! Configure as variáveis obrigatórias.', 'red')
    log('   Crie o arquivo .env.local com as variáveis necessárias.\n', 'yellow')
    process.exit(1)
  }

  if (hasWarnings) {
    log('\n⚠️  AVISOS: Algumas variáveis opcionais não estão configuradas.', 'yellow')
    log('   Algumas funcionalidades podem não estar disponíveis.\n', 'yellow')
  } else {
    log('\n✅ Todas as variáveis estão configuradas corretamente!\n', 'green')
  }

  process.exit(0)
}

main()
