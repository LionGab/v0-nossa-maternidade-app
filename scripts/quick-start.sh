#!/bin/bash

# Nossa Maternidade - Script de Início Rápido
# Automatiza todo o processo de setup e verificação

echo "🚀 Nossa Maternidade - Quick Start"
echo "==================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar Node.js
echo "📦 Verificando Node.js..."
if command_exists node; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js instalado: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js não encontrado. Por favor, instale Node.js 18+${NC}"
    exit 1
fi

# Verificar pnpm
echo "📦 Verificando pnpm..."
if command_exists pnpm; then
    PNPM_VERSION=$(pnpm -v)
    echo -e "${GREEN}✓ pnpm instalado: $PNPM_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ pnpm não encontrado. Instalando...${NC}"
    npm install -g pnpm
fi

# Instalar dependências
echo ""
echo "📥 Instalando dependências..."
pnpm install

# Verificar variáveis de ambiente
echo ""
echo "🔐 Verificando variáveis de ambiente..."
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠ Arquivo .env.local não encontrado${NC}"
    echo "Copiando .env.example para .env.local..."
    cp .env.example .env.local
    echo -e "${YELLOW}⚠ Por favor, edite .env.local com suas credenciais${NC}"
fi

# Executar testes
echo ""
echo "🧪 Executando testes..."
pnpm test

# Build de verificação
echo ""
echo "🏗️  Executando build de verificação..."
pnpm build

echo ""
echo -e "${GREEN}✅ Setup completo!${NC}"
echo ""
echo "Próximos passos:"
echo "1. Configure suas variáveis de ambiente em .env.local"
echo "2. Execute 'pnpm dev' para iniciar o servidor de desenvolvimento"
echo "3. Execute 'pnpm check' antes de fazer commit"
echo ""
echo "Documentação completa:"
echo "- README.md"
echo "- AUTOMATION.md"
echo "- ARCHITECTURE.md"
echo ""
