# Script de Instalação e Configuração de MCPs para Cursor
# Execute este script para instalar todos os pacotes MCP necessários

echo "🚀 Instalando MCPs para Cursor..."
echo ""

# MCPs Essenciais
echo "📦 Instalando MCPs Essenciais..."
npm install -g supabase-mcp
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-git

# MCPs Opcionais
echo ""
echo "📦 Instalando MCPs Opcionais..."
npm install -g @modelcontextprotocol/server-brave-search
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-postgres
npm install -g @modelcontextprotocol/server-sqlite
npm install -g @modelcontextprotocol/server-puppeteer
npm install -g @modelcontextprotocol/server-fetch
npm install -g @modelcontextprotocol/server-memory
npm install -g @modelcontextprotocol/server-sequential-thinking
npm install -g @modelcontextprotocol/server-slack
npm install -g @modelcontextprotocol/server-everart
npm install -g @modelcontextprotocol/server-gmail

echo ""
echo "✅ Instalação concluída!"
echo ""
echo "📝 Próximos passos:"
echo "1. Configure as variáveis de ambiente no arquivo .env"
echo "2. Importe o arquivo .cursor/mcp-config.json no Cursor"
echo "3. Reinicie o Cursor"
echo ""
echo "📚 Veja CURSOR_MCP_SETUP.md para mais detalhes"
