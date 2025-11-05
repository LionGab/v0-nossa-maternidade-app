#!/usr/bin/env node

/**
 * Setup Husky Script
 * Configura Husky e pre-commit hooks
 */

import { existsSync, mkdirSync, chmodSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Criar diretório .husky se não existir
const huskyDir = join(rootDir, '.husky');
if (!existsSync(huskyDir)) {
  mkdirSync(huskyDir, { recursive: true });
  console.log('✅ Criado diretório .husky');
}

// Criar diretório .husky/_ se não existir
const huskyUnderscoreDir = join(huskyDir, '_');
if (!existsSync(huskyUnderscoreDir)) {
  mkdirSync(huskyUnderscoreDir, { recursive: true });
  console.log('✅ Criado diretório .husky/_');
}

// Criar .husky/_/husky.sh se não existir
const huskyShPath = join(huskyUnderscoreDir, 'husky.sh');
if (!existsSync(huskyShPath)) {
  const huskyShContent = `#!/usr/bin/env sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    if [ "$HUSKY_DEBUG" = "1" ]; then
      echo "husky (debug) - $1"
    fi
  }

  readonly hook_name="$(basename -- "$0")"
  debug "starting $hook_name..."

  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi

  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi

  readonly husky_skip_init=1
  export husky_skip_init
  sh -e "$0" "$@"
  exitcode="$?"

  if [ $exitcode != 0 ]; then
    echo "husky - $hook_name hook exited with code $exitcode (error)"
  fi

  if [ $exitcode = 127 ]; then
    echo "husky - command not found in PATH=$PATH"
  fi

  exit $exitcode
fi
`;

  writeFileSync(huskyShPath, huskyShContent, 'utf-8');

  // Dar permissão de execução (Unix/Linux/Mac)
  try {
    chmodSync(huskyShPath, '755');
  } catch (error) {
    // Windows não precisa de chmod
    console.log('⚠️  Permissões não configuradas (Windows não precisa)');
  }

  console.log('✅ Criado .husky/_/husky.sh');
}

// Verificar se .husky/pre-commit existe
const preCommitPath = join(huskyDir, 'pre-commit');
if (existsSync(preCommitPath)) {
  console.log('✅ .husky/pre-commit já existe');
} else {
  console.log('⚠️  .husky/pre-commit não encontrado (será criado pelo Husky)');
}

console.log('\n✅ Husky setup completo!');
console.log('📝 Para instalar Husky, execute: npx husky install');
