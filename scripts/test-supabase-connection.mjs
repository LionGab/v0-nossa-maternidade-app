#!/usr/bin/env node
/**
 * Teste de Conexão com Supabase
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = join(__dirname, '..')

// Carregar variáveis de ambiente
config({ path: join(PROJECT_ROOT, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('\n🔗 Testando Conexão com Supabase\n')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? '✓ Configurada' : '✗ Não configurada')

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Credenciais Supabase não configuradas em .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('\n📊 Testando query básica...\n')

    // Testar listagem de tabelas via query
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(10)

    if (tablesError) {
      // Se não tiver permissão, testar uma tabela específica
      console.log('ℹ️  Sem permissão para information_schema, testando tabela específica...\n')

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)

      if (profilesError) {
        throw profilesError
      }

      console.log('✅ Conexão bem-sucedida!')
      console.log('✓ Acesso à tabela "profiles" confirmado')
      return true
    }

    console.log('✅ Conexão bem-sucedida!')
    console.log('\n📋 Tabelas encontradas:')
    if (tables && tables.length > 0) {
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`)
      })
    } else {
      console.log('  (Nenhuma tabela encontrada ou sem permissão de leitura)')
    }

    return true
  } catch (error) {
    console.error('\n❌ Erro ao conectar com Supabase:')
    console.error(error.message)
    return false
  }
}

testConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ Teste concluído com sucesso!\n')
      process.exit(0)
    } else {
      console.log('\n❌ Teste falhou\n')
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('\n❌ Erro inesperado:', error)
    process.exit(1)
  })
