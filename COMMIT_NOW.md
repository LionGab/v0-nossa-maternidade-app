# 💾 Commitar Mudanças na Main

## Comandos para Executar

Execute no PowerShell na raiz do projeto:

```powershell
# Opção 1: Usar o script automatizado
.\scripts\commit-and-push.ps1

# Opção 2: Comandos manuais
git add .cursor/mcp-config.json
git add FIX_URGENTE.md
git add FIX_SIGNUP_URGENTE.md
git add SECURITY_AUDIT_REPORT.md
git add MAIN.md
git add SECRETS_ROTATION_GUIDE.md
git add SECRETS_MIGRATION_CHECKLIST.md
git add scripts/commit-fix-url.ps1

git commit -m "fix: remover referências à URL antiga do Supabase e adicionar URL correta

- Removidas todas as menções à URL antiga mnszbkeuerjcevjvdqme.supabase.co
- Atualizado .cursor/mcp-config.json para usar variáveis de ambiente
- Adicionada URL correta (mnszbkeuerjcevjvdqme.supabase.co) em arquivos de documentação
- Corrigidos arquivos de configuração e scripts relacionados"
git push origin main
```

## Arquivos Modificados

- `.cursor/mcp-config.json` - Configuração MCP usa variáveis de ambiente
- `FIX_URGENTE.md` - Atualizado com URL correta
- `FIX_SIGNUP_URGENTE.md` - Removidas referências à URL antiga
- `SECURITY_AUDIT_REPORT.md` - URL removida por segurança
- `MAIN.md` - URL removida
- `SECRETS_ROTATION_GUIDE.md` - Referências atualizadas
- `SECRETS_MIGRATION_CHECKLIST.md` - Referências atualizadas
- `scripts/commit-fix-url.ps1` - Novo script criado
