#!/usr/bin/env node
/**
 * 🚀 CLI Helper - Claude Code + Cursor
 * Comandos rápidos para workflow automatizado
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

// Comandos disponíveis
const COMMANDS = {
  'analyze': {
    description: 'Analisa código com Claude',
    usage: 'claude-cursor analyze <arquivo|diretorio>',
    action: analyzeCode,
  },
  'refactor': {
    description: 'Refatora código com Claude',
    usage: 'claude-cursor refactor <arquivo>',
    action: refactorCode,
  },
  'test': {
    description: 'Gera testes com Claude',
    usage: 'claude-cursor test <arquivo>',
    action: generateTests,
  },
  'doc': {
    description: 'Gera documentação com Claude',
    usage: 'claude-cursor doc <arquivo>',
    action: generateDocs,
  },
  'optimize': {
    description: 'Otimiza código com Claude',
    usage: 'claude-cursor optimize <arquivo>',
    action: optimizeCode,
  },
  'quick-fix': {
    description: 'Correção rápida de bugs',
    usage: 'claude-cursor quick-fix <arquivo>',
    action: quickFix,
  },
  'component': {
    description: 'Gera componente React completo',
    usage: 'claude-cursor component <nome> [props...]',
    action: generateComponent,
  },
  'api': {
    description: 'Gera API route completa',
    usage: 'claude-cursor api <nome> [method]',
    action: generateApi,
  },
  'workflow': {
    description: 'Executa workflow',
    usage: 'claude-cursor workflow <nome>',
    action: runWorkflow,
  },
  'test:all': {
    description: 'Executa todos os testes em paralelo',
    usage: 'claude-cursor test:all',
    action: runAllTests,
  },
  'test:priority': {
    description: 'Executa testes de alta prioridade',
    usage: 'claude-cursor test:priority',
    action: runPriorityTests,
  },
  'test:pwa': {
    description: 'Executa testes de PWA',
    usage: 'claude-cursor test:pwa',
    action: runPWATests,
  },
  'test:mobile': {
    description: 'Executa testes mobile-first',
    usage: 'claude-cursor test:mobile',
    action: runMobileTests,
  },
  'test:performance': {
    description: 'Executa testes de performance',
    usage: 'claude-cursor test:performance',
    action: runPerformanceTests,
  },
};

/**
 * Analisa código
 */
async function analyzeCode(args) {
  if (args.length === 0) {
    console.error('❌ Especifique um arquivo ou diretório');
    return;
  }

  const target = args[0];
  console.log(`🔍 Analisando: ${target}\n`);

  try {
    const result = execSync(`npx claude analyze "${target}"`, {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: 'inherit',
    });
    console.log('\n✅ Análise concluída!');
  } catch (error) {
    console.error('❌ Erro na análise:', error.message);
    process.exit(1);
  }
}

/**
 * Refatora código
 */
async function refactorCode(args) {
  if (args.length === 0) {
    console.error('❌ Especifique um arquivo');
    return;
  }

  const file = args[0];
  console.log(`🔧 Refatorando: ${file}\n`);

  try {
    const result = execSync(`npx claude refactor "${file}"`, {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: 'inherit',
    });
    console.log('\n✅ Refatoração concluída!');
  } catch (error) {
    console.error('❌ Erro na refatoração:', error.message);
    process.exit(1);
  }
}

/**
 * Gera testes
 */
async function generateTests(args) {
  if (args.length === 0) {
    console.error('❌ Especifique um arquivo');
    return;
  }

  const file = args[0];
  console.log(`🧪 Gerando testes para: ${file}\n`);

  try {
    const result = execSync(`npx claude test "${file}"`, {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: 'inherit',
    });
    console.log('\n✅ Testes gerados!');
  } catch (error) {
    console.error('❌ Erro ao gerar testes:', error.message);
    process.exit(1);
  }
}

/**
 * Gera documentação
 */
async function generateDocs(args) {
  if (args.length === 0) {
    console.error('❌ Especifique um arquivo');
    return;
  }

  const file = args[0];
  console.log(`📚 Gerando documentação para: ${file}\n`);

  try {
    const result = execSync(`npx claude document "${file}"`, {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: 'inherit',
    });
    console.log('\n✅ Documentação gerada!');
  } catch (error) {
    console.error('❌ Erro ao gerar documentação:', error.message);
    process.exit(1);
  }
}

/**
 * Otimiza código
 */
async function optimizeCode(args) {
  if (args.length === 0) {
    console.error('❌ Especifique um arquivo');
    return;
  }

  const file = args[0];
  console.log(`⚡ Otimizando: ${file}\n`);

  try {
    const result = execSync(`npx claude optimize "${file}"`, {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: 'inherit',
    });
    console.log('\n✅ Otimização concluída!');
  } catch (error) {
    console.error('❌ Erro na otimização:', error.message);
    process.exit(1);
  }
}

/**
 * Correção rápida
 */
async function quickFix(args) {
  if (args.length === 0) {
    console.error('❌ Especifique um arquivo');
    return;
  }

  const file = args[0];
  console.log(`🔧 Corrigindo: ${file}\n`);

  // Usa múltiplos agentes em paralelo
  const workflowsPath = join(PROJECT_ROOT, 'workflows.json');
  if (existsSync(workflowsPath)) {
    try {
      execSync(`node scripts/orchestrator.mjs run quick-fix --file="${file}"`, {
        cwd: PROJECT_ROOT,
        encoding: 'utf-8',
        stdio: 'inherit',
      });
    } catch {
      // Fallback para comando direto
      await analyzeCode([file]);
      await refactorCode([file]);
    }
  } else {
    await analyzeCode([file]);
    await refactorCode([file]);
  }
}

/**
 * Gera componente React
 */
async function generateComponent(args) {
  if (args.length === 0) {
    console.error('❌ Especifique o nome do componente');
    return;
  }

  const componentName = args[0];
  const props = args.slice(1);

  console.log(`⚛️  Gerando componente: ${componentName}\n`);

  // Usa workflow de geração de componente
  const workflowsPath = join(PROJECT_ROOT, 'workflows.json');
  if (existsSync(workflowsPath)) {
    try {
      const propsStr = props.join(',');
      execSync(`node scripts/orchestrator.mjs run new-component --name="${componentName}" --props="${propsStr}"`, {
        cwd: PROJECT_ROOT,
        encoding: 'utf-8',
        stdio: 'inherit',
      });
    } catch (error) {
      console.error('❌ Erro ao gerar componente:', error.message);
      process.exit(1);
    }
  } else {
    console.error('❌ Workflows não configurados. Execute: npm run setup:workflows');
    process.exit(1);
  }
}

/**
 * Gera API route
 */
async function generateApi(args) {
  if (args.length === 0) {
    console.error('❌ Especifique o nome da API');
    return;
  }

  const apiName = args[0];
  const method = args[1] || 'GET';

  console.log(`🌐 Gerando API: ${apiName} (${method})\n`);

  // Usa workflow de geração de API
  const workflowsPath = join(PROJECT_ROOT, 'workflows.json');
  if (existsSync(workflowsPath)) {
    try {
      execSync(`node scripts/orchestrator.mjs run new-api --name="${apiName}" --method="${method}"`, {
        cwd: PROJECT_ROOT,
        encoding: 'utf-8',
        stdio: 'inherit',
      });
    } catch (error) {
      console.error('❌ Erro ao gerar API:', error.message);
      process.exit(1);
    }
  } else {
    console.error('❌ Workflows não configurados. Execute: npm run setup:workflows');
    process.exit(1);
  }
}

/**
 * Executa workflow
 */
async function runWorkflow(args) {
  if (args.length === 0) {
    console.error('❌ Especifique o nome do workflow');
    console.log('\nWorkflows disponíveis:');
    // Listar workflows
    return;
  }

  const workflowName = args[0];
  console.log(`🚀 Executando workflow: ${workflowName}\n`);

  try {
    execSync(`powershell -ExecutionPolicy Bypass -File scripts/orchestrator.ps1 run "${workflowName}"`, {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('❌ Erro ao executar workflow:', error.message);
    process.exit(1);
  }
}

/**
 * Executa todos os testes em paralelo
 */
async function runAllTests(args) {
  console.log('🧪 Executando todos os testes em paralelo...\n');

  try {
    execSync('node scripts/test-orchestrator.mjs run', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: 'inherit',
    });
    console.log('\n✅ Todos os testes concluídos!');
  } catch (error) {
    console.error('❌ Erro ao executar testes:', error.message);
    process.exit(1);
  }
}

/**
 * Executa testes de alta prioridade
 */
async function runPriorityTests(args) {
  console.log('🧪 Executando testes de alta prioridade...\n');

  try {
    execSync('node scripts/test-orchestrator.mjs run --priority high', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: 'inherit',
    });
    console.log('\n✅ Testes de alta prioridade concluídos!');
  } catch (error) {
    console.error('❌ Erro ao executar testes:', error.message);
    process.exit(1);
  }
}

/**
 * Executa testes de PWA
 */
async function runPWATests(args) {
  console.log('🧪 Executando testes de PWA...\n');

  try {
    execSync('node scripts/test-orchestrator.mjs run --filter pwa', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: 'inherit',
    });
    console.log('\n✅ Testes de PWA concluídos!');
  } catch (error) {
    console.error('❌ Erro ao executar testes:', error.message);
    process.exit(1);
  }
}

/**
 * Executa testes mobile-first
 */
async function runMobileTests(args) {
  console.log('🧪 Executando testes mobile-first...\n');

  try {
    execSync('node scripts/test-orchestrator.mjs run --filter mobile-first', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: 'inherit',
    });
    console.log('\n✅ Testes mobile-first concluídos!');
  } catch (error) {
    console.error('❌ Erro ao executar testes:', error.message);
    process.exit(1);
  }
}

/**
 * Executa testes de performance
 */
async function runPerformanceTests(args) {
  console.log('🧪 Executando testes de performance...\n');

  try {
    execSync('node scripts/test-orchestrator.mjs agent performance', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: 'inherit',
    });
    console.log('\n✅ Testes de performance concluídos!');
  } catch (error) {
    console.error('❌ Erro ao executar testes:', error.message);
    process.exit(1);
  }
}

/**
 * Mostra ajuda
 */
function showHelp() {
  console.log('\n🚀 Claude Code + Cursor CLI\n');
  console.log('Uso: claude-cursor <comando> [argumentos]\n');
  console.log('Comandos disponíveis:\n');

  Object.entries(COMMANDS).forEach(([cmd, info]) => {
    console.log(`  ${cmd.padEnd(15)} ${info.description}`);
    console.log(`                  ${info.usage}`);
    console.log('');
  });
}

// Main
const command = process.argv[2];
const args = process.argv.slice(3);

if (!command || command === 'help' || command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

const cmdInfo = COMMANDS[command];
if (!cmdInfo) {
  console.error(`❌ Comando desconhecido: ${command}`);
  console.log('\nExecute "claude-cursor help" para ver comandos disponíveis');
  process.exit(1);
}

cmdInfo.action(args).catch(error => {
  console.error('❌ Erro:', error.message);
  process.exit(1);
});
