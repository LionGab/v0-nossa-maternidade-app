# 🔍 Análise do Problema - Playwright MCP

**Data:** 2025-11-02
**Severidade:** Média-Alta
**Status:** Identificado na Auditoria

---

## 📋 Resumo do Problema

Os logs do Playwright MCP mostram vários erros ao tentar executar o servidor MCP:

```
[error] Client error for command A system error occurred (spawn cmd.exe ENOENT)
[error] No server info found
```

---

## 🔍 Problemas Identificados

### 1. Erro "spawn cmd.exe ENOENT"
**Causa:** O sistema não consegue encontrar `cmd.exe` no PATH do Windows

**Possíveis Causas:**
- PATH do Windows não configurado corretamente
- Problema com a configuração do MCP server no Cursor
- Permissões de execução

**Localização:** `.cursor/mcp.json` (fora do workspace)
```json
{
  "Playwright": {
    "command": "npx -y @playwright/mcp@latest"  // ❌ Usa "@latest"
  }
}
```

### 2. Uso de "@latest" no MCP
**Problema:** Relacionado ao **Problema Crítico #1** da auditoria
- Dependências com versão "latest" são perigosas
- Pode quebrar com atualizações inesperadas
- Comportamento inconsistente entre ambientes

**Recomendação:** Fixar versão específica:
```json
{
  "Playwright": {
    "command": "npx -y @playwright/mcp@1.0.0"  // ✅ Versão fixa
  }
}
```

### 3. Configuração de Playwright Vazia
**Problema:** `playwright.config.ts` estava vazio (Problema #21 da auditoria)

**Status:** ✅ **CORRIGIDO**
- Arquivo `playwright.config.ts` configurado
- Testes E2E básicos criados em `e2e/auth.spec.ts`

### 4. Testes E2E Vazios
**Problema:** `e2e/auth.spec.ts` estava vazio

**Status:** ✅ **CORRIGIDO**
- Testes básicos de autenticação criados
- Cobertura de rotas protegidas

---

## ✅ Soluções Implementadas

### 1. Configuração do Playwright
**Arquivo:** `playwright.config.ts`

Configurado com:
- ✅ Múltiplos browsers (Chrome, Firefox, Safari)
- ✅ Mobile viewports
- ✅ Web server automático
- ✅ Trace para debug
- ✅ Screenshots e vídeos em falhas
- ✅ Configuração para CI/CD

### 2. Testes E2E Básicos
**Arquivo:** `e2e/auth.spec.ts`

Testes criados:
- ✅ Página de login
- ✅ Página de signup
- ✅ Redirecionamento de rotas protegidas
- ✅ Validação de campos
- ✅ Proteção de rotas

---

## 🔧 Soluções Recomendadas para MCP

### Opção 1: Fixar Versão do MCP (Recomendado)
Editar `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "Playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@1.0.0"]  // Versão fixa
    }
  }
}
```

### Opção 2: Usar Instalação Local
```json
{
  "mcpServers": {
    "Playwright": {
      "command": "node",
      "args": ["./node_modules/@playwright/mcp/dist/index.js"]
    }
  }
}
```

### Opção 3: Instalar Globalmente
```bash
npm install -g @playwright/mcp@1.0.0
```

E configurar:
```json
{
  "mcpServers": {
    "Playwright": {
      "command": "playwright-mcp"
    }
  }
}
```

### Opção 4: Verificar PATH do Windows
Se o problema persistir:
1. Verificar se `cmd.exe` está no PATH
2. Verificar permissões de execução
3. Reiniciar o Cursor após mudanças

---

## 📊 Relação com Auditoria

Este problema está relacionado a:

1. **Problema Crítico #1:** Dependências com "latest"
   - O MCP usa `@playwright/mcp@latest`
   - Deve ser fixado para versão específica

2. **Problema #21 (Média Prioridade):** Configuração de Playwright vazia
   - ✅ **RESOLVIDO** - Configuração criada

3. **Problema #13 (Alta Prioridade):** Testes insuficientes
   - ✅ **PARCIALMENTE RESOLVIDO** - Testes básicos criados
   - Ainda precisa de mais cobertura

---

## 🎯 Próximos Passos

### Imediatos
1. ✅ Configurar `playwright.config.ts` - **FEITO**
2. ✅ Criar testes E2E básicos - **FEITO**
3. ⏳ Fixar versão do MCP no `.cursor/mcp.json`
4. ⏳ Verificar PATH do Windows

### Curto Prazo
5. Expandir testes E2E para:
   - Onboarding completo
   - Gamificação
   - Chat com IA
   - Comunidade

### Médio Prazo
6. Integrar testes E2E no CI/CD
7. Adicionar testes de performance
8. Configurar visual regression testing

---

## 📝 Notas

- O erro do MCP **não impede** o uso do Playwright diretamente
- Os testes podem ser executados com `pnpm test:e2e`
- O MCP é apenas para integração com Cursor
- A funcionalidade principal do Playwright está funcionando

---

## 🔗 Referências

- [Playwright Documentation](https://playwright.dev)
- [MCP Server Issues](https://github.com/playwright-community/playwright-mcp/issues)
- [Cursor MCP Setup](https://docs.cursor.com/mcp)

---

**Status Atual:** Parcialmente Resolvido
**Última Atualização:** 2025-11-02
