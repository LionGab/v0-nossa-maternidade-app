#!/usr/bin/env node
/**
 * 🔍 Code Analyzer - Análise de Código usando Anthropic SDK
 * Analisa código do projeto usando Claude via Anthropic API
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração
const PROJECT_ROOT = join(__dirname, '..');
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MAX_FILES = 20; // Limitar arquivos para não exceder token limits
const SUPPORTED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];

// Diretórios permitidos (Camada 3 - Restrição de Diretórios)
const ALLOWED_DIRECTORIES = [
  'app',
  'components',
  'lib',
  'hooks',
  'scripts'
];

// Resultado estruturado
const result = {
  timestamp: new Date().toISOString(),
  success: false,
  filesAnalyzed: 0,
  analysis: [],
  errors: [],
  summary: null
};

/**
 * CAMADA 1 - Validação de Path (Segurança)
 * Garante que o path está dentro do repositório
 */
function validatePath(filePath) {
  const normalizedPath = join(filePath).replace(/\\/g, '/');
  const normalizedRoot = join(PROJECT_ROOT).replace(/\\/g, '/');

  if (!normalizedPath.startsWith(normalizedRoot)) {
    throw new Error(`ERRO DE SEGURANÇA: Path está FORA do repositório! ${filePath}`);
  }

  // Verificar se está em diretório permitido (Camada 3)
  const relativePath = relative(PROJECT_ROOT, filePath).replace(/\\/g, '/');
  const pathParts = relativePath.split('/').filter(p => p);
  const firstDir = pathParts[0];

  // Se está na raiz, não precisa validar (arquivos de configuração podem estar na raiz)
  // Mas se tem diretório, deve estar na lista permitida
  if (pathParts.length > 1 && firstDir && !ALLOWED_DIRECTORIES.includes(firstDir)) {
    throw new Error(`ERRO DE SEGURANÇA: Path fora de diretórios permitidos! ${filePath} (primeiro dir: ${firstDir})`);
  }

  return true;
}

/**
 * Busca arquivos relevantes no projeto
 */
function findRelevantFiles(dir, maxDepth = 3, currentDepth = 0) {
  const files = [];

  if (currentDepth >= maxDepth || files.length >= MAX_FILES) {
    return files;
  }

  try {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      // Ignorar node_modules, .git, etc
      if (entry.name.startsWith('.') ||
          entry.name === 'node_modules' ||
          entry.name === 'dist' ||
          entry.name === '.next' ||
          entry.name === 'coverage') {
        continue;
      }

      const fullPath = join(dir, entry.name);

      // CAMADA 1 - Validar path antes de processar
      try {
        validatePath(fullPath);
      } catch (error) {
        result.errors.push(`Path bloqueado: ${error.message}`);
        continue;
      }

      if (entry.isDirectory()) {
        files.push(...findRelevantFiles(fullPath, maxDepth, currentDepth + 1));
      } else if (entry.isFile()) {
        const ext = extname(entry.name);
        if (SUPPORTED_EXTENSIONS.includes(ext)) {
          files.push(fullPath);
        }
      }

      if (files.length >= MAX_FILES) break;
    }
  } catch (error) {
    result.errors.push(`Erro ao ler diretório ${dir}: ${error.message}`);
  }

  return files;
}

/**
 * Lê conteúdo de arquivo com encoding seguro
 * CAMADA 1 - Valida path antes de ler
 */
function readFileSafe(filePath) {
  try {
    // Validar path antes de ler
    validatePath(filePath);

    return readFileSync(filePath, 'utf-8');
  } catch (error) {
    result.errors.push(`Erro ao ler arquivo ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Analisa código usando Anthropic API
 */
async function analyzeCode(anthropic, files) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY não configurada');
  }

  // Preparar contexto
  const fileContents = [];
  for (const file of files.slice(0, MAX_FILES)) {
    const content = readFileSafe(file);
    if (content) {
      const relativePath = relative(PROJECT_ROOT, file);
      fileContents.push(`=== ${relativePath} ===\n${content.substring(0, 5000)}\n`);
    }
  }

  const context = fileContents.join('\n\n');

  // CAMADA 4 - Instruções de Segurança no Prompt
  const prompt = `Você é um analisador de código SOMENTE LEITURA.

REGRAS DE SEGURANÇA OBRIGATÓRIAS:
- ❌ PROIBIDO modificar qualquer arquivo
- ❌ PROIBIDO sugerir comandos de escrita (write, edit, delete)
- ❌ PROIBIDO acessar paths fora do repositório
- ❌ PROIBIDO executar comandos do sistema
- ✅ APENAS análise e relatórios são permitidos
- ✅ APENAS leitura de arquivos dentro do repositório

Analise o código abaixo e identifique:
1. Problemas de qualidade (bugs potenciais, code smells)
2. Oportunidades de melhoria (performance, legibilidade)
3. Problemas de segurança
4. Violações de boas práticas
5. Sugestões de refatoração (apenas sugestões, SEM modificar)

Código para análise:
${context}

Forneça uma análise estruturada e priorizada. Lembre-se: APENAS ANÁLISE, SEM MODIFICAÇÕES.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return message.content[0].text;
  } catch (error) {
    throw new Error(`Erro na API Anthropic: ${error.message}`);
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('🔍 Iniciando análise de código...\n');

  // Validar API key
  if (!ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY não configurada');
    console.error('Configure a variável de ambiente: export ANTHROPIC_API_KEY=sk-...');
    process.exit(1);
  }

  // Inicializar cliente Anthropic
  const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY
  });

  // Buscar arquivos relevantes
  console.log('📁 Buscando arquivos relevantes...');
  const files = findRelevantFiles(PROJECT_ROOT);
  console.log(`   Encontrados ${files.length} arquivos\n`);

  if (files.length === 0) {
    console.error('❌ Nenhum arquivo encontrado para análise');
    process.exit(1);
  }

  result.filesAnalyzed = files.length;

  // Analisar código
  console.log('🤖 Analisando código com Claude...');
  try {
    const analysis = await analyzeCode(anthropic, files);

    result.success = true;
    result.analysis.push({
      type: 'deep_analysis',
      content: analysis,
      timestamp: new Date().toISOString()
    });

    result.summary = {
      totalFiles: files.length,
      issuesFound: analysis.match(/\d+ (problema|issue|bug)/gi)?.length || 0,
      recommendations: analysis.match(/\d+ (sugestão|recommendation|melhoria)/gi)?.length || 0
    };

    console.log('✅ Análise concluída\n');
    console.log('📊 Resumo:');
    console.log(`   Arquivos analisados: ${result.summary.totalFiles}`);
    console.log(`   Problemas encontrados: ${result.summary.issuesFound}`);
    console.log(`   Recomendações: ${result.summary.recommendations}\n`);
  } catch (error) {
    result.success = false;
    result.errors.push(error.message);
    console.error(`❌ Erro na análise: ${error.message}`);
    process.exit(1);
  }

  // Output JSON
  const outputPath = process.argv[2] || join(PROJECT_ROOT, 'reports', 'code-analyzer', `deep-analysis-${new Date().toISOString().split('T')[0]}.json`);

  // Criar diretório se não existir
  const outputDir = join(outputPath, '..');
  try {
    const { mkdirSync } = await import('fs');
    mkdirSync(outputDir, { recursive: true });
  } catch (e) {
    // Diretório já existe
  }

  const { writeFileSync } = await import('fs');
  writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`💾 Relatório salvo em: ${outputPath}`);

  // Output também para stdout
  console.log('\n' + JSON.stringify(result, null, 2));
}

main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
