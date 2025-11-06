#!/usr/bin/env node
/**
 * 🚀 Orquestrador Paralelo de Testes - Nossa Maternidade
 * Executa todos os testes em paralelo usando agentes independentes
 * Integrado com Claude Code CLI e Playwright
 */

import { execSync, spawn } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

/**
 * Agentes de teste independentes
 */
const TEST_AGENTS = [
  {
    id: 'performance',
    name: 'Performance & Core Web Vitals',
    description: 'Testa métricas de performance, LCP, FID, CLS, TTI',
    file: 'e2e/performance.spec.ts',
    priority: 'high',
    timeout: 60000,
  },
  {
    id: 'pwa',
    name: 'PWA & Service Worker',
    description: 'Testa instalação PWA, Service Worker, offline, cache',
    file: 'e2e/mobile-first-pwa.spec.ts',
    suite: 'Fase 1: Fundação Mobile-First',
    priority: 'high',
    timeout: 90000,
  },
  {
    id: 'mobile-first',
    name: 'Mobile-First & Responsividade',
    description: 'Testa responsividade, touch targets, mobile navigation',
    file: 'e2e/mobile-first-pwa.spec.ts',
    suite: 'Fase 2: Fluxo Crítico do Usuário',
    priority: 'high',
    timeout: 60000,
  },
  {
    id: 'auth',
    name: 'Autenticação Mobile',
    description: 'Testa login/signup mobile, validação, feedback visual',
    file: 'e2e/browser-auth.spec.ts',
    priority: 'high',
    timeout: 60000,
  },
  {
    id: 'chat-ia',
    name: 'Chat IA & Features Core',
    description: 'Testa chat NathAI, streaming, timeout, respostas concisas',
    file: 'e2e/mobile-first-pwa.spec.ts',
    suite: 'Fase 3: Features Core com IA',
    priority: 'medium',
    timeout: 120000,
  },
  {
    id: 'features',
    name: 'Features Secundárias',
    description: 'Testa Mundo Nath, Autocuidado, Rotina, Histórias',
    file: 'e2e/mobile-first-pwa.spec.ts',
    suite: 'Fase 4: Features Secundárias',
    priority: 'medium',
    timeout: 90000,
  },
  {
    id: 'offline',
    name: 'PWA Offline & Cache',
    description: 'Testa funcionalidade offline, cache, sync',
    file: 'e2e/mobile-first-pwa.spec.ts',
    suite: 'Fase 5: PWA Avançado',
    priority: 'high',
    timeout: 60000,
  },
  {
    id: 'accessibility',
    name: 'Acessibilidade & UX',
    description: 'Testa ARIA labels, contraste WCAG, navegação teclado',
    file: 'e2e/mobile-first-pwa.spec.ts',
    suite: 'Fase 6: Acessibilidade e UX',
    priority: 'high',
    timeout: 60000,
  },
  {
    id: 'edge-cases',
    name: 'Edge Cases & Robustez',
    description: 'Testa error handling, timeouts, navegação, estado',
    file: 'e2e/mobile-first-pwa.spec.ts',
    suite: 'Fase 7: Edge Cases e Robustez',
    priority: 'medium',
    timeout: 60000,
  },
  {
    id: 'rotina',
    name: 'Rotina Semanal',
    description: 'Testa página de rotina, categorias, botões, filtros',
    file: 'e2e/rotina-mobile-first.spec.ts',
    priority: 'medium',
    timeout: 60000,
  },
  {
    id: 'complete',
    name: 'Testes Completos',
    description: 'Testes gerais de navegação, estrutura, integração',
    file: 'e2e/browser-complete.spec.ts',
    priority: 'low',
    timeout: 120000,
  },
];

/**
 * Executa um agente de teste em paralelo
 */
async function runTestAgent(agent, options = {}) {
  const { parallel = true, verbose = false, browser = 'chromium' } = options;

  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    console.log(`\n🚀 [${agent.id}] Iniciando: ${agent.name}`);
    console.log(`   📝 ${agent.description}`);

    // Comando Playwright
    let command = 'npx playwright test';
    let args = [
      agent.file,
      '--project', browser,
      '--timeout', String(agent.timeout),
    ];

    // Se houver suite específica, filtrar
    if (agent.suite) {
      // Usar grep para filtrar suite
      args.push('--grep', agent.suite);
    }

    if (verbose) {
      args.push('--reporter', 'list');
    } else {
      args.push('--reporter', 'json');
    }

    // Executar em paralelo se permitido
    if (parallel) {
      args.push('--workers', '1'); // Um worker por agente
    }

    const fullCommand = `${command} ${args.join(' ')}`;
    console.log(`   ⚡ Executando: ${command} ${args.join(' ')}`);

    const child = spawn(command, args, {
      cwd: PROJECT_ROOT,
      stdio: verbose ? 'inherit' : 'pipe',
      shell: true,
    });

    let stdout = '';
    let stderr = '';

    if (!verbose) {
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
    }

    child.on('close', (code) => {
      const duration = Date.now() - startTime;

      const result = {
        agent: agent.id,
        name: agent.name,
        success: code === 0,
        exitCode: code,
        duration,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
      };

      if (code === 0) {
        console.log(`   ✅ [${agent.id}] Concluído em ${duration}ms`);
      } else {
        console.log(`   ❌ [${agent.id}] Falhou com código ${code} (${duration}ms)`);
      }

      resolve(result);
    });

    child.on('error', (error) => {
      const duration = Date.now() - startTime;
      console.log(`   ❌ [${agent.id}] Erro: ${error.message} (${duration}ms)`);
      reject({
        agent: agent.id,
        name: agent.name,
        success: false,
        error: error.message,
        duration,
      });
    });
  });
}

/**
 * Executa todos os agentes em paralelo
 */
async function runAllAgentsParallel(options = {}) {
  const { filter = null, priority = null, verbose = false, browser = 'chromium' } = options;

  // Filtrar agentes
  let agents = TEST_AGENTS;

  if (filter) {
    agents = agents.filter(a => a.id.includes(filter) || a.name.toLowerCase().includes(filter.toLowerCase()));
  }

  if (priority) {
    agents = agents.filter(a => a.priority === priority);
  }

  if (agents.length === 0) {
    console.error('❌ Nenhum agente encontrado com os filtros especificados');
    process.exit(1);
  }

  console.log(`\n🎯 Executando ${agents.length} agentes de teste em paralelo\n`);
  console.log('📊 Agentes configurados:');
  agents.forEach(agent => {
    console.log(`   • ${agent.id}: ${agent.name} (${agent.priority})`);
  });

  const startTime = Date.now();

  // Executar todos os agentes em paralelo
  const promises = agents.map(agent => runTestAgent(agent, { parallel: true, verbose, browser }));

  try {
    const results = await Promise.allSettled(promises);

    const duration = Date.now() - startTime;

    // Processar resultados
    const successful = [];
    const failed = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        if (result.value.success) {
          successful.push(result.value);
        } else {
          failed.push(result.value);
        }
      } else {
        failed.push({
          agent: agents[index].id,
          name: agents[index].name,
          success: false,
          error: result.reason?.error || 'Erro desconhecido',
        });
      }
    });

    // Gerar relatório
    generateReport({
      agents,
      successful,
      failed,
      duration,
      options,
    });

    // Retornar código de saída
    const exitCode = failed.length > 0 ? 1 : 0;

    if (exitCode === 0) {
      console.log(`\n✅ Todos os testes passaram! (${duration}ms)`);
    } else {
      console.log(`\n❌ ${failed.length} agente(s) falharam (${duration}ms)`);
    }

    return exitCode;
  } catch (error) {
    console.error('❌ Erro ao executar agentes:', error);
    return 1;
  }
}

/**
 * Gera relatório consolidado
 */
function generateReport({ agents, successful, failed, duration, options }) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 RELATÓRIO CONSOLIDADO DE TESTES');
  console.log('='.repeat(80));

  console.log(`\n⏱️  Duração total: ${duration}ms`);
  console.log(`📈 Agentes executados: ${agents.length}`);
  console.log(`✅ Sucessos: ${successful.length}`);
  console.log(`❌ Falhas: ${failed.length}`);

  if (successful.length > 0) {
    console.log('\n✅ Agentes bem-sucedidos:');
    successful.forEach(result => {
      console.log(`   • ${result.name} (${result.duration}ms)`);
    });
  }

  if (failed.length > 0) {
    console.log('\n❌ Agentes com falhas:');
    failed.forEach(result => {
      console.log(`   • ${result.name}`);
      if (result.error) {
        console.log(`     Erro: ${result.error}`);
      }
      if (result.stderr) {
        console.log(`     Stderr: ${result.stderr.substring(0, 200)}...`);
      }
    });
  }

  // Salvar relatório JSON
  const reportPath = join(PROJECT_ROOT, 'test-results', 'report.json');
  const reportDir = join(PROJECT_ROOT, 'test-results');

  try {
    if (!existsSync(reportDir)) {
      require('fs').mkdirSync(reportDir, { recursive: true });
    }

    const report = {
      timestamp: new Date().toISOString(),
      duration,
      agents: agents.length,
      successful: successful.length,
      failed: failed.length,
      results: {
        successful,
        failed,
      },
      options,
    };

    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Relatório salvo em: ${reportPath}`);
  } catch (error) {
    console.warn(`⚠️  Não foi possível salvar relatório: ${error.message}`);
  }

  console.log('\n' + '='.repeat(80));
}

/**
 * Executa agentes sequencialmente (para debug)
 */
async function runAllAgentsSequential(options = {}) {
  const { filter = null, priority = null, verbose = false, browser = 'chromium' } = options;

  let agents = TEST_AGENTS;

  if (filter) {
    agents = agents.filter(a => a.id.includes(filter) || a.name.toLowerCase().includes(filter.toLowerCase()));
  }

  if (priority) {
    agents = agents.filter(a => a.priority === priority);
  }

  console.log(`\n🎯 Executando ${agents.length} agentes sequencialmente\n`);

  const results = [];

  for (const agent of agents) {
    try {
      const result = await runTestAgent(agent, { parallel: false, verbose, browser });
      results.push(result);

      if (!result.success) {
        console.log(`\n⚠️  Parando execução devido a falha em ${agent.id}`);
        break;
      }
    } catch (error) {
      console.error(`❌ Erro ao executar ${agent.id}:`, error);
      results.push({
        agent: agent.id,
        name: agent.name,
        success: false,
        error: error.message,
      });
      break;
    }
  }

  return results.every(r => r.success) ? 0 : 1;
}

/**
 * Lista agentes disponíveis
 */
function listAgents() {
  console.log('\n📋 Agentes de Teste Disponíveis:\n');

  TEST_AGENTS.forEach(agent => {
    console.log(`   ${agent.id.padEnd(20)} ${agent.name}`);
    console.log(`   ${' '.repeat(22)} ${agent.description}`);
    console.log(`   ${' '.repeat(22)} Prioridade: ${agent.priority} | Timeout: ${agent.timeout}ms`);
    if (agent.suite) {
      console.log(`   ${' '.repeat(22)} Suite: ${agent.suite}`);
    }
    console.log('');
  });
}

/**
 * CLI
 */
const command = process.argv[2];
const args = process.argv.slice(3);

async function main() {
  switch (command) {
    case 'run':
    case 'parallel':
      {
        const options = {
          filter: args.includes('--filter') ? args[args.indexOf('--filter') + 1] : null,
          priority: args.includes('--priority') ? args[args.indexOf('--priority') + 1] : null,
          verbose: args.includes('--verbose') || args.includes('-v'),
          browser: args.includes('--browser') ? args[args.indexOf('--browser') + 1] : 'chromium',
        };

        const exitCode = await runAllAgentsParallel(options);
        process.exit(exitCode);
      }
      break;

    case 'sequential':
    case 'seq':
      {
        const options = {
          filter: args.includes('--filter') ? args[args.indexOf('--filter') + 1] : null,
          priority: args.includes('--priority') ? args[args.indexOf('--priority') + 1] : null,
          verbose: args.includes('--verbose') || args.includes('-v'),
          browser: args.includes('--browser') ? args[args.indexOf('--browser') + 1] : 'chromium',
        };

        const exitCode = await runAllAgentsSequential(options);
        process.exit(exitCode);
      }
      break;

    case 'agent':
      {
        const agentId = args[0];
        const agent = TEST_AGENTS.find(a => a.id === agentId);

        if (!agent) {
          console.error(`❌ Agente '${agentId}' não encontrado`);
          listAgents();
          process.exit(1);
        }

        const options = {
          verbose: args.includes('--verbose') || args.includes('-v'),
          browser: args.includes('--browser') ? args[args.indexOf('--browser') + 1] : 'chromium',
        };

        const result = await runTestAgent(agent, options);
        process.exit(result.success ? 0 : 1);
      }
      break;

    case 'list':
      listAgents();
      break;

    default:
      console.log(`
🚀 Orquestrador Paralelo de Testes - Nossa Maternidade

Uso:
  node scripts/test-orchestrator.mjs <comando> [opções]

Comandos:
  run, parallel        Executa todos os agentes em paralelo
  sequential, seq      Executa agentes sequencialmente
  agent <id>           Executa um agente específico
  list                 Lista todos os agentes disponíveis

Opções:
  --filter <text>      Filtrar agentes por nome ou ID
  --priority <level>   Filtrar por prioridade (high, medium, low)
  --verbose, -v        Modo verbose
  --browser <name>    Navegador (chromium, firefox, webkit)

Exemplos:
  node scripts/test-orchestrator.mjs run
  node scripts/test-orchestrator.mjs run --priority high
  node scripts/test-orchestrator.mjs run --filter pwa
  node scripts/test-orchestrator.mjs agent performance --verbose
  node scripts/test-orchestrator.mjs list
`);
      process.exit(0);
  }
}

main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
