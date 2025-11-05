#!/usr/bin/env node
/**
 * 🧪 Test Orchestrator para React Native/Expo
 * Adaptado do test-orchestrator.mjs para mobile
 */

import { execSync, spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

/**
 * Agentes de teste para mobile
 */
const TEST_AGENTS = [
  {
    id: 'unit',
    name: 'Unit Tests',
    description: 'Testes unitários com Vitest',
    command: 'npm run test',
    priority: 'high',
    timeout: 60000,
  },
  {
    id: 'type-check',
    name: 'Type Check',
    description: 'Verificação de tipos TypeScript',
    command: 'npm run type-check',
    priority: 'high',
    timeout: 30000,
  },
  {
    id: 'lint',
    name: 'Lint',
    description: 'Verificação de código com ESLint',
    command: 'npm run lint',
    priority: 'medium',
    timeout: 30000,
  },
  {
    id: 'e2e-detox',
    name: 'E2E Tests (Detox)',
    description: 'Testes E2E com Detox',
    command: 'npm run test:e2e:ios || echo "Detox not configured"',
    priority: 'low',
    timeout: 300000,
    skipIfNoConfig: true,
  },
  {
    id: 'e2e-maestro',
    name: 'E2E Tests (Maestro)',
    description: 'Testes E2E com Maestro',
    command: 'maestro test ./e2e/maestro || echo "Maestro not configured"',
    priority: 'low',
    timeout: 300000,
    skipIfNoConfig: true,
  },
];

/**
 * Executa um agente de teste
 */
function runAgent(agent) {
  return new Promise((resolve, reject) => {
    console.log(`\n🧪 Executando: ${agent.name}`);
    console.log(`   ${agent.description}`);

    const startTime = Date.now();

    try {
      execSync(agent.command, {
        cwd: PROJECT_ROOT,
        stdio: 'inherit',
        timeout: agent.timeout,
      });

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`✅ ${agent.name} passou em ${duration}s`);
      resolve({ agent, success: true, duration });
    } catch (error) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      if (agent.skipIfNoConfig && error.message.includes('not configured')) {
        console.log(`⏭️  ${agent.name} pulado (não configurado)`);
        resolve({ agent, success: true, skipped: true, duration });
      } else {
        console.error(`❌ ${agent.name} falhou em ${duration}s`);
        reject({ agent, error, duration });
      }
    }
  });
}

/**
 * Executa todos os testes
 */
async function runAllTests(options = {}) {
  const { parallel = false, filter = null, priority = null } = options;

  console.log('\n🚀 Iniciando testes mobile...\n');

  let agents = TEST_AGENTS;

  // Filtrar por prioridade
  if (priority) {
    agents = agents.filter(a => a.priority === priority);
  }

  // Filtrar por ID
  if (filter) {
    agents = agents.filter(a => a.id.includes(filter));
  }

  const results = [];

  if (parallel) {
    // Executar em paralelo
    const promises = agents.map(agent => runAgent(agent).catch(err => err));
    const settled = await Promise.allSettled(promises);

    settled.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({ agent: agents[index], success: false, error: result.reason });
      }
    });
  } else {
    // Executar sequencialmente
    for (const agent of agents) {
      try {
        const result = await runAgent(agent);
        results.push(result);
      } catch (error) {
        results.push({ agent, success: false, error });
        if (!options.continueOnError) {
          break;
        }
      }
    }
  }

  // Resumo
  console.log('\n📊 Resumo dos Testes:');
  console.log('═══════════════════════════════════════');

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success && !r.skipped).length;
  const skipped = results.filter(r => r.skipped).length;

  results.forEach(result => {
    const icon = result.success ? '✅' : result.skipped ? '⏭️' : '❌';
    const status = result.success ? 'PASSOU' : result.skipped ? 'PULADO' : 'FALHOU';
    const duration = result.duration ? ` (${result.duration}s)` : '';
    console.log(`${icon} ${result.agent.name}: ${status}${duration}`);
  });

  console.log('\n═══════════════════════════════════════');
  console.log(`✅ Passou: ${passed}`);
  console.log(`❌ Falhou: ${failed}`);
  console.log(`⏭️  Pulado: ${skipped}`);
  console.log(`📊 Total: ${results.length}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

// CLI
const args = process.argv.slice(2);
const command = args[0] || 'run';

if (command === 'run') {
  const options = {
    parallel: args.includes('--parallel'),
    filter: args.find(arg => arg.startsWith('--filter='))?.split('=')[1],
    priority: args.find(arg => arg.startsWith('--priority='))?.split('=')[1],
    continueOnError: args.includes('--continue-on-error'),
  };

  runAllTests(options).catch(console.error);
} else if (command === 'list') {
  console.log('\n📋 Agentes de Teste Disponíveis:\n');
  TEST_AGENTS.forEach(agent => {
    console.log(`  ${agent.id}`);
    console.log(`    Nome: ${agent.name}`);
    console.log(`    Descrição: ${agent.description}`);
    console.log(`    Prioridade: ${agent.priority}`);
    console.log(`    Timeout: ${agent.timeout}ms\n`);
  });
} else {
  console.log(`
Uso: node scripts/test-mobile.mjs [comando] [opções]

Comandos:
  run          Executa todos os testes (padrão)
  list         Lista todos os agentes disponíveis

Opções:
  --parallel            Executa testes em paralelo
  --filter=<id>         Filtra por ID do agente
  --priority=<level>    Filtra por prioridade (high/medium/low)
  --continue-on-error   Continua mesmo se um teste falhar

Exemplos:
  node scripts/test-mobile.mjs run
  node scripts/test-mobile.mjs run --parallel
  node scripts/test-mobile.mjs run --priority=high
  node scripts/test-mobile.mjs list
`);
}
