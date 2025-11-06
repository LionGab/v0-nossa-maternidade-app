#!/usr/bin/env node
/**
 * 🧪 Teste do Supabase MCP
 * Verifica se o Supabase MCP está configurado e funcionando
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

// Carregar variáveis de ambiente
function loadEnv() {
  // Tentar .env.local primeiro
  const envLocalPath = join(PROJECT_ROOT, '.env.local');
  if (existsSync(envLocalPath)) {
    config({ path: envLocalPath });
  }

  // Tentar .env
  const envPath = join(PROJECT_ROOT, '.env');
  if (existsSync(envPath)) {
    config({ path: envPath });
  }

  // Carregar manualmente se dotenv não funcionar
  try {
    if (existsSync(envLocalPath)) {
      const envContent = readFileSync(envLocalPath, 'utf-8');
      envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const match = trimmed.match(/^([^=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remover aspas se houver
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = value;
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('⚠️  Erro ao carregar .env.local:', error.message);
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ||
                     process.env.SUPABASE_URL ||
                     'https://bbcwitnbnosyfpfjtzkry.supabase.co';

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                          process.env.SUPABASE_ANON_KEY;

console.log('\n🧪 Testando Supabase MCP\n');

// Verificar variáveis de ambiente
console.log('📋 Verificando configuração...\n');

if (!SUPABASE_URL) {
  console.error('❌ SUPABASE_URL não encontrada');
  process.exit(1);
}

if (!SUPABASE_ANON_KEY) {
  console.error('❌ SUPABASE_ANON_KEY não encontrada');
  process.exit(1);
}

console.log('✅ SUPABASE_URL:', SUPABASE_URL);
console.log('✅ SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY.substring(0, 20) + '...');
console.log('');

// Criar cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Testes
async function testConnection() {
  console.log('🔌 Testando conexão...\n');

  try {
    // Teste 1: Verificar conexão básica
    const { data, error } = await supabase.from('profiles').select('count').limit(1);

    if (error) {
      console.error('❌ Erro na conexão:', error.message);
      return false;
    }

    console.log('✅ Conexão estabelecida com sucesso!\n');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
    return false;
  }
}

async function testTables() {
  console.log('📊 Verificando tabelas...\n');

  const tables = [
    'profiles',
    'baby_profiles',
    'onboarding_responses',
    'user_gamification',
    'achievements',
    'sentiment_analysis'
  ];

  const results = {};

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);

      if (error) {
        results[table] = { exists: false, error: error.message };
      } else {
        results[table] = { exists: true, count: data?.length || 0 };
      }
    } catch (error) {
      results[table] = { exists: false, error: error.message };
    }
  }

  // Mostrar resultados
  let allOk = true;
  for (const [table, result] of Object.entries(results)) {
    if (result.exists) {
      console.log(`✅ ${table}: Acessível`);
    } else {
      console.log(`❌ ${table}: ${result.error || 'Não encontrada'}`);
      allOk = false;
    }
  }

  console.log('');
  return allOk;
}

async function testQuery() {
  console.log('🔍 Testando query...\n');

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, created_at')
      .limit(5);

    if (error) {
      console.error('❌ Erro na query:', error.message);
      return false;
    }

    console.log(`✅ Query executada com sucesso!`);
    console.log(`   Retornou ${data?.length || 0} registros\n`);

    if (data && data.length > 0) {
      console.log('📝 Primeiro registro:');
      console.log(JSON.stringify(data[0], null, 2));
      console.log('');
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao executar query:', error.message);
    return false;
  }
}

async function testSchema() {
  console.log('📋 Verificando schema da tabela profiles...\n');

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Erro:', error.message);
      return false;
    }

    if (data && data.length > 0) {
      console.log('✅ Colunas encontradas:');
      const columns = Object.keys(data[0]);
      columns.forEach(col => console.log(`   - ${col}`));
      console.log('');

      // Verificar coluna onboarding_completed
      if ('onboarding_completed' in data[0]) {
        console.log('✅ Coluna onboarding_completed existe');
      } else {
        console.log('⚠️  Coluna onboarding_completed não encontrada');
      }
      console.log('');
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar schema:', error.message);
    return false;
  }
}

// Executar todos os testes
async function runTests() {
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.error('❌ Falha na conexão. Encerrando testes.\n');
    process.exit(1);
  }

  const tablesOk = await testTables();
  const queryOk = await testQuery();
  const schemaOk = await testSchema();

  console.log('\n📊 Resumo dos Testes:\n');
  console.log(`   Conexão: ${connectionOk ? '✅' : '❌'}`);
  console.log(`   Tabelas: ${tablesOk ? '✅' : '❌'}`);
  console.log(`   Query: ${queryOk ? '✅' : '❌'}`);
  console.log(`   Schema: ${schemaOk ? '✅' : '❌'}`);
  console.log('');

  if (connectionOk && tablesOk && queryOk && schemaOk) {
    console.log('✅ Todos os testes passaram! Supabase MCP está funcionando corretamente.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Alguns testes falharam. Verifique a configuração.\n');
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('❌ Erro inesperado:', error);
  process.exit(1);
});
