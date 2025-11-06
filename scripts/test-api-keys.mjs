#!/usr/bin/env node
/**
 * Script de Teste de API Keys
 * Verifica se todas as APIs de IA estão funcionando corretamente
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

async function testApiKey(name, apiKey, testFunction) {
  log(`\n🧪 Testando ${name}...`, 'cyan')

  if (!apiKey) {
    log(`  ⚠️  ${name}: Não configurada`, 'yellow')
    return false
  }

  try {
    const result = await testFunction(apiKey)
    if (result) {
      log(`  ✅ ${name}: Funcionando corretamente`, 'green')
      return true
    } else {
      log(`  ❌ ${name}: Falhou no teste`, 'red')
      return false
    }
  } catch (error) {
    log(`  ❌ ${name}: Erro - ${error.message}`, 'red')
    return false
  }
}

async function testSupabase(url, key) {
  try {
    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
      },
    })
    return response.ok || response.status === 404 // 404 é OK, significa que a URL está correta
  } catch {
    return false
  }
}

async function testAnthropic(key) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    })
    return response.ok
  } catch {
    return false
  }
}

async function testOpenAI(key) {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${key}`,
      },
    })
    return response.ok
  } catch {
    return false
  }
}

async function testGoogleAI(key) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`)
    return response.ok
  } catch {
    return false
  }
}

async function testPerplexity(key) {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10,
      }),
    })
    return response.ok || response.status === 400 // 400 pode ser OK (modelo específico)
  } catch {
    return false
  }
}

async function main() {
  log('\n🔐 Testando API Keys...\n', 'cyan')

  const env = loadEnvFile()
  const envVars = { ...process.env, ...env }

  const results = {
    supabase: false,
    anthropic: false,
    openai: false,
    google: false,
    perplexity: false,
  }

  // Testar Supabase
  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (supabaseUrl && supabaseKey) {
    results.supabase = await testApiKey('Supabase', supabaseKey, () =>
      testSupabase(supabaseUrl, supabaseKey)
    )
  } else {
    log('\n⚠️  Supabase: Não configurado', 'yellow')
  }

  // Testar Anthropic
  const anthropicKey = envVars.ANTHROPIC_API_KEY
  if (anthropicKey) {
    results.anthropic = await testApiKey('Anthropic (Claude)', anthropicKey, () =>
      testAnthropic(anthropicKey)
    )
  }

  // Testar OpenAI
  const openaiKey = envVars.OPENAI_API_KEY
  if (openaiKey) {
    results.openai = await testApiKey('OpenAI', openaiKey, () =>
      testOpenAI(openaiKey)
    )
  }

  // Testar Google AI
  const googleKey = envVars.GOOGLE_AI_API_KEY
  if (googleKey) {
    results.google = await testApiKey('Google AI (Gemini)', googleKey, () =>
      testGoogleAI(googleKey)
    )
  }

  // Testar Perplexity
  const perplexityKey = envVars.PERPLEXITY_API_KEY
  if (perplexityKey) {
    results.perplexity = await testApiKey('Perplexity', perplexityKey, () =>
      testPerplexity(perplexityKey)
    )
  }

  // Resumo
  log('\n📊 Resumo dos Testes:', 'cyan')
  const total = Object.keys(results).length
  const passed = Object.values(results).filter(Boolean).length

  log(`  ✅ APIs Funcionando: ${passed}/${total}`,
    passed === total ? 'green' : passed > 0 ? 'yellow' : 'red')

  if (passed === total) {
    log('\n✅ Todas as APIs estão funcionando corretamente!\n', 'green')
    process.exit(0)
  } else if (passed > 0) {
    log('\n⚠️  Algumas APIs não estão funcionando. Verifique as chaves.\n', 'yellow')
    process.exit(0)
  } else {
    log('\n❌ Nenhuma API está funcionando. Verifique as configurações.\n', 'red')
    process.exit(1)
  }
}

main()
