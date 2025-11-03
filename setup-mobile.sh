#!/bin/bash

# Script de Setup Completo para o Projeto Mobile
# Este script configura tudo o que é necessário para rodar o app mobile

echo "🚀 Configurando projeto Nossa Maternidade Mobile..."
echo ""

# Verificar Node.js
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 20+ de https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "⚠️  Versão do Node.js muito antiga ($NODE_VERSION). Recomendado: 20+"
fi

echo "✅ Node.js instalado: $(node -v)"
echo ""

# Entrar no diretório mobile
cd "$(dirname "$0")/mobile" || exit 1

# Instalar dependências
echo "📥 Instalando dependências do app mobile..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo ""
echo "✅ Dependências instaladas com sucesso!"
echo ""

# Criar assets básicos se não existirem
echo "🎨 Verificando assets..."

# Criar diretório de ícones se não existir
mkdir -p assets/icons

# Criar README nos assets
cat > assets/README.md << 'EOF'
# Assets do App Mobile

## Estrutura

- **icons/**: Ícones do app em vários tamanhos
- **fonts/**: Fontes customizadas (opcional)
- **images/**: Imagens e ilustrações

## Para Produção

Substitua os placeholders por assets profissionais:

1. **icon.png** (1024x1024): Ícone principal
2. **adaptive-icon.png** (1024x1024): Ícone Android
3. **splash.png** (1242x2436): Splash screen
4. **favicon.png** (48x48): Favicon web

Ferramentas recomendadas:
- Figma: https://figma.com
- Canva: https://canva.com
- Asset Generator: https://appicon.co
EOF

echo "✅ Assets configurados"
echo ""

# Verificar se Expo CLI está disponível
echo "🔍 Verificando Expo CLI..."
if ! command -v expo &> /dev/null; then
    echo "⚠️  Expo CLI não encontrado globalmente"
    echo "   Você pode instalá-lo com: npm install -g expo-cli"
    echo "   Ou usar via npx (mais lento): npx expo start"
else
    echo "✅ Expo CLI disponível"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Setup concluído com sucesso!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Próximos passos:"
echo ""
echo "1. Testar no celular (RECOMENDADO):"
echo "   • Instale o Expo Go no seu celular"
echo "   • Execute: npm start"
echo "   • Escaneie o QR code"
echo ""
echo "2. Testar no navegador:"
echo "   • Execute: npm run web"
echo ""
echo "3. Build de produção:"
echo "   • Instale EAS CLI: npm install -g eas-cli"
echo "   • Configure: eas build:configure"
echo "   • Build: npm run build:android"
echo ""
echo "📚 Documentação completa: ../MOBILE_BUILD_GUIDE.md"
echo ""
