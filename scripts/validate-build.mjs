#!/usr/bin/env node

/**
 * Build Validation Script
 * Valida build do Next.js e verifica qualidade do bundle
 */

import { existsSync, statSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Limites de tamanho (em bytes)
const SIZE_LIMITS = {
  // Bundle sizes (em KB)
  mainBundle: 200 * 1024, // 200KB
  chunkBundle: 100 * 1024, // 100KB
  // Total assets (em MB)
  totalAssets: 5 * 1024 * 1024, // 5MB
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

function formatSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Verifica se o diretório .next existe
 */
function checkBuildDirectory() {
  const buildDir = join(rootDir, '.next');
  if (!existsSync(buildDir)) {
    logError('Diretório .next não encontrado. Build não foi executado.');
    return false;
  }
  logSuccess('Diretório .next encontrado');
  return true;
}

/**
 * Verifica tamanho dos bundles principais
 */
function checkBundleSizes() {
  const buildDir = join(rootDir, '.next');
  const staticDir = join(buildDir, 'static');
  const chunksDir = join(staticDir, 'chunks');

  if (!existsSync(staticDir)) {
    logWarning('Diretório .next/static não encontrado');
    return true; // Não falha, apenas avisa
  }

  const errors = [];
  const warnings = [];

  // Verificar chunks principais
  if (existsSync(chunksDir)) {
    const chunkFiles = [];

    // Função recursiva para listar arquivos
    function listFiles(dir) {
      try {
        const files = require('fs').readdirSync(dir);
        for (const file of files) {
          const filePath = join(dir, file);
          const stats = statSync(filePath);
          if (stats.isFile() && file.endsWith('.js')) {
            chunkFiles.push({ path: filePath, size: stats.size });
          } else if (stats.isDirectory()) {
            listFiles(filePath);
          }
        }
      } catch (error) {
        // Ignorar erros de leitura
      }
    }

    listFiles(chunksDir);

    // Verificar tamanho dos maiores chunks
    chunkFiles.sort((a, b) => b.size - a.size);
    const mainChunks = chunkFiles.slice(0, 5);

    for (const chunk of mainChunks) {
      const relativePath = chunk.path.replace(rootDir, '');
      if (chunk.size > SIZE_LIMITS.chunkBundle) {
        errors.push(`Chunk muito grande: ${relativePath} (${formatSize(chunk.size)}, limite: ${formatSize(SIZE_LIMITS.chunkBundle)})`);
      } else if (chunk.size > SIZE_LIMITS.chunkBundle * 0.8) {
        warnings.push(`Chunk próximo do limite: ${relativePath} (${formatSize(chunk.size)})`);
      }
    }

    logInfo(`Chunks principais verificados: ${mainChunks.length}`);
    for (const chunk of mainChunks) {
      const relativePath = chunk.path.replace(rootDir, '');
      logInfo(`  ${relativePath}: ${formatSize(chunk.size)}`);
    }
  }

  if (errors.length > 0) {
    errors.forEach((err) => logError(err));
    return false;
  }

  if (warnings.length > 0) {
    warnings.forEach((warn) => logWarning(warn));
  }

  logSuccess('Tamanhos de bundle verificados');
  return true;
}

/**
 * Verifica se o PWA manifest existe e é válido
 */
function checkPWAManifest() {
  const manifestPath = join(rootDir, 'public', 'manifest.json');

  if (!existsSync(manifestPath)) {
    logWarning('manifest.json não encontrado em public/');
    return true; // Não falha, apenas avisa
  }

  try {
    const manifestContent = readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    // Verificar campos obrigatórios
    const requiredFields = ['name', 'short_name', 'start_url', 'display'];
    const missingFields = requiredFields.filter((field) => !manifest[field]);

    if (missingFields.length > 0) {
      logError(`manifest.json está faltando campos obrigatórios: ${missingFields.join(', ')}`);
      return false;
    }

    logSuccess('PWA manifest válido');
    return true;
  } catch (error) {
    logError(`Erro ao validar manifest.json: ${error.message}`);
    return false;
  }
}

/**
 * Verifica se há erros de build no output
 */
function checkBuildErrors() {
  const buildDir = join(rootDir, '.next');
  const buildManifestPath = join(buildDir, 'build-manifest.json');

  if (!existsSync(buildManifestPath)) {
    logWarning('build-manifest.json não encontrado');
    return true; // Não falha, apenas avisa
  }

  try {
    const manifestContent = readFileSync(buildManifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    // Verificar se há páginas compiladas
    if (!manifest.pages || Object.keys(manifest.pages).length === 0) {
      logError('Nenhuma página foi compilada');
      return false;
    }

    logSuccess(`Build contém ${Object.keys(manifest.pages).length} página(s) compilada(s)`);
    return true;
  } catch (error) {
    logWarning(`Não foi possível verificar build-manifest.json: ${error.message}`);
    return true; // Não falha, apenas avisa
  }
}

/**
 * Validação principal
 */
async function main() {
  log('\n🔍 Validando build...', 'cyan');

  const results = {
    buildDirectory: false,
    bundleSizes: false,
    pwaManifest: false,
    buildErrors: false,
  };

  // 1. Verificar diretório de build
  log('\n📁 Verificando diretório de build...', 'cyan');
  results.buildDirectory = checkBuildDirectory();

  if (!results.buildDirectory) {
    logError('\n❌ Validação de build falhou: Build não foi executado');
    process.exit(1);
  }

  // 2. Verificar tamanhos de bundle
  log('\n📦 Verificando tamanhos de bundle...', 'cyan');
  results.bundleSizes = checkBundleSizes();

  // 3. Verificar PWA manifest
  log('\n📱 Verificando PWA manifest...', 'cyan');
  results.pwaManifest = checkPWAManifest();

  // 4. Verificar erros de build
  log('\n🔍 Verificando erros de build...', 'cyan');
  results.buildErrors = checkBuildErrors();

  // Resumo
  log('\n📊 Resumo:', 'cyan');
  log(`Build Directory: ${results.buildDirectory ? '✅' : '❌'}`, results.buildDirectory ? 'green' : 'red');
  log(`Bundle Sizes: ${results.bundleSizes ? '✅' : '❌'}`, results.bundleSizes ? 'green' : 'red');
  log(`PWA Manifest: ${results.pwaManifest ? '✅' : '⚠️'}`, results.pwaManifest ? 'green' : 'yellow');
  log(`Build Errors: ${results.buildErrors ? '✅' : '⚠️'}`, results.buildErrors ? 'green' : 'yellow');

  const criticalPassed = results.buildDirectory && results.buildErrors;
  const allPassed = criticalPassed && results.bundleSizes && results.pwaManifest;

  if (criticalPassed) {
    log('\n✅ Validação de build: Crítico passou!', 'green');
    if (!allPassed) {
      logWarning('Algumas validações opcionais falharam (ver resumo acima)');
    }
    process.exit(0);
  } else {
    log('\n❌ Validação de build: Falhou!', 'red');
    logError('Validações críticas falharam (Build Directory ou Build Errors)');
    process.exit(1);
  }
}

main().catch((error) => {
  logError(`Erro fatal: ${error.message}`);
  process.exit(1);
});
