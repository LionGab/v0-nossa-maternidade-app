#!/usr/bin/env node
/**
 * 🔍 Code Analyzer - Versão Máxima Eficiência v3.0
 * Análise segura de código usando Anthropic SDK
 * Foco: Segurança crítica + Código mínimo necessário
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync, mkdirSync, realpathSync } from 'fs';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ===== CONFIGURAÇÃO =====
const PROJECT_ROOT = join(__dirname, '..');
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ALLOWED_DIRS = ['app', 'components', 'lib', 'hooks', 'scripts'];
const MAX_FILES = 15;
const MAX_CHARS_PER_FILE = 3000;
const SUPPORTED_EXTS = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];

const result = {
  timestamp: new Date().toISOString(),
  success: false,
  filesAnalyzed: 0,
  analysis: null,
  errors: []
};

// ===== SEGURANÇA: VALIDAÇÃO CRÍTICA =====
function validatePath(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Path não existe: ${filePath}`);
  }

  // Resolver path real (previne symlink attacks e path traversal)
  const realPath = realpathSync(filePath).replace(/\\/g, '/');
  const realRoot = realpathSync(PROJECT_ROOT).replace(/\\/g, '/');

  // Path traversal protection
  if (!realPath.startsWith(realRoot + '/') && realPath !== realRoot) {
    throw new Error(`SEGURANÇA: Path fora do repo! ${realPath}`);
  }

  // Directory whitelist
  const rel = relative(PROJECT_ROOT, realPath).replace(/\\/g, '/');
  const firstDir = rel.split('/')[0];

  if (rel.includes('/') && firstDir && !ALLOWED_DIRS.includes(firstDir)) {
    throw new Error(`SEGURANÇA: Diretório proibido: ${firstDir}`);
  }

  return true;
}

// ===== BUSCA DE ARQUIVOS =====
function findFiles(dir, depth = 0) {
  if (depth > 3) return [];

  const files = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.') ||
        ['node_modules', 'dist', '.next', 'coverage'].includes(entry.name)) {
      continue;
    }

    const fullPath = join(dir, entry.name);

    try {
      validatePath(fullPath);
    } catch (error) {
      result.errors.push(error.message);
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...findFiles(fullPath, depth + 1));
    } else if (SUPPORTED_EXTS.includes(extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

// ===== ANÁLISE COM RETRY =====
async function analyze(anthropic, files) {
  // Priorizar por modificação recente (simples e eficaz)
  const sorted = files
    .map(f => ({ file: f, mtime: statSync(f).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, MAX_FILES);

  // Preparar contexto
  const context = sorted
    .map(({ file }) => {
      try {
        validatePath(file);
        const content = readFileSync(file, 'utf-8').substring(0, MAX_CHARS_PER_FILE);
        const rel = relative(PROJECT_ROOT, file);
        return `=== ${rel} ===\n${content}\n`;
      } catch (error) {
        result.errors.push(`Erro ao ler ${file}: ${error.message}`);
        return '';
      }
    })
    .filter(c => c)
    .join('\n\n');

  result.filesAnalyzed = sorted.length;

  const prompt = `Você é um analisador SOMENTE LEITURA.

REGRAS:
- ❌ NÃO modificar arquivos
- ❌ NÃO sugerir comandos write/edit/delete
- ❌ NÃO acessar paths externos
- ✅ APENAS análise

Analise o código e identifique:
1. Bugs e problemas de qualidade
2. Vulnerabilidades de segurança
3. Violações de boas práticas
4. Oportunidades de melhoria

Código:
${context}

Forneça análise estruturada e priorizada.`;

  // Retry com exponential backoff
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`[INFO] Tentativa ${attempt}/3...`);

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      });

      // Validação básica mas crítica
      if (!message.content?.[0]?.text) {
        throw new Error('API retornou resposta vazia');
      }

      const text = message.content[0].text;

      // Detectar violações de segurança
      if (/write\s*\(|edit\s*\(|writeFileSync|unlinkSync/i.test(text)) {
        throw new Error('VIOLAÇÃO: Resposta contém comandos proibidos');
      }

      return {
        text,
        usage: message.usage
      };

    } catch (error) {
      console.error(`[ERROR] ${error.message}`);

      // Não retry em auth errors
      if (error.status === 401 || error.status === 403) throw error;

      if (attempt < 3) {
        const backoff = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoff));
      } else {
        throw error;
      }
    }
  }
}

// ===== MAIN =====
async function main() {
  console.log('[INFO] 🔍 Code Analyzer v3.0 (Máxima Eficiência) iniciando...');

  if (!ANTHROPIC_API_KEY) {
    console.error('[ERROR] ANTHROPIC_API_KEY não configurada');
    process.exit(1);
  }

  const files = findFiles(PROJECT_ROOT);
  console.log(`[INFO] Encontrados ${files.length} arquivos`);

  if (files.length === 0) {
    console.error('[ERROR] Nenhum arquivo encontrado');
    process.exit(1);
  }

  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  try {
    const { text, usage } = await analyze(anthropic, files);

    result.success = true;
    result.analysis = text;
    result.usage = usage;

    console.log('[INFO] ✅ Análise concluída');
    console.log(`[INFO] Tokens: ${usage.input_tokens} in / ${usage.output_tokens} out`);
    console.log(`[INFO] Custo: ~$${((usage.input_tokens * 3 + usage.output_tokens * 15) / 1000000).toFixed(4)}`);

  } catch (error) {
    result.success = false;
    result.errors.push(error.message);
    console.error(`[ERROR] ${error.message}`);
    process.exit(1);
  }

  // Salvar
  const outDir = join(PROJECT_ROOT, 'reports', 'code-analyzer');
  mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, `analysis-${new Date().toISOString().split('T')[0]}.json`);
  writeFileSync(outPath, JSON.stringify(result, null, 2));

  console.log(`[INFO] 💾 Salvo em: ${outPath}`);
  console.log('\n' + JSON.stringify(result, null, 2));
}

main().catch(error => {
  console.error('[FATAL]', error);
  process.exit(1);
});
