# 🔥 Modo Noturno Brutal - Claude Code CLI

## 🎯 Configuração Auto Compact 60-70k Tokens

### **O que é Auto Compact?**
Sistema que comprime automaticamente o contexto do código para 60-70k tokens, permitindo análise de projetos grandes mantendo qualidade e assertividade.

### **Configuração:**
- **Min Tokens**: 60.000
- **Max Tokens**: 70.000
- **Target**: 65.000 tokens
- **Context Window**: 200.000 tokens (compactado para 60-70k)
- **Compression Ratio**: ~32.5%

---

## 🚀 Como Usar

### **1. Análise Brutal Individual:**
```bash
npm run claude:brutal
```

### **2. Automação Noturna Completa (Modo Brutal):**
```bash
# Teste primeiro (dry-run)
npm run overnight:brutal:dry-run

# Executar de verdade
npm run overnight:brutal
```

### **3. Com Parâmetros Customizados:**
```powershell
.\scripts\overnight-brutal-mode.ps1 -MaxTokens 70000 -MinTokens 60000
```

---

## 📊 O que Faz

### **FASE 1: Validação**
- Verifica Claude Code CLI
- Verifica GitHub CLI (opcional)
- Valida Node.js

### **FASE 2: Análise Brutal**
- Análise assertiva de código
- Zero tolerância para problemas
- Identifica código ruim, arquitetura ruim, segurança, performance

### **FASE 3: Refatoração Automática**
- Refatora código automaticamente
- Melhora performance
- Remove code smells
- Auto compact 60-70k tokens

### **FASE 4: Análise de Segurança**
- Scan de vulnerabilidades
- Verificação de secrets expostos
- SQL injection, XSS
- Auto compact 60-70k tokens

### **FASE 5: Análise de Performance**
- Análise de bundle
- Otimização de assets
- Identifica dependências pesadas
- Auto compact 60-70k tokens

### **FASE 6: Testes**
- Executa todos os testes E2E
- Valida que nada quebrou

### **FASE 7: Build**
- Validação TypeScript
- Build de produção

---

## 🔥 Análise Brutal - O que Procura

### **1. Código Ruim:**
- ✅ Código duplicado
- ✅ Funções > 100 linhas
- ✅ Complexidade ciclomática > 10
- ✅ Acoplamento excessivo
- ✅ Baixa coesão

### **2. Arquitetura:**
- ✅ Violação SOLID
- ✅ Dependências circulares
- ✅ Responsabilidades misturadas
- ✅ Over/under-engineering

### **3. Segurança:**
- ✅ SQL injection
- ✅ XSS
- ✅ Secrets expostos
- ✅ Falta de validação
- ✅ Race conditions

### **4. Performance:**
- ✅ Queries N+1
- ✅ Bundle size grande
- ✅ Re-renders desnecessários
- ✅ Código não lazy-loaded

### **5. Qualidade:**
- ✅ Falta de testes
- ✅ Código morto
- ✅ TypeScript `any`
- ✅ Error handling ruim

---

## 📁 Relatórios Gerados

Todos os relatórios são salvos em `reports/`:

1. **`brutal-analysis-YYYYMMDD.md`** - Análise brutal completa
2. **`refactor-YYYYMMDD.md`** - Sugestões de refatoração
3. **`security-YYYYMMDD.md`** - Scan de segurança
4. **`performance-YYYYMMDD.md`** - Análise de performance

Logs completos em `logs/overnight-brutal-YYYYMMDD.log`

---

## ⚙️ Configuração Avançada

### **Arquivo: `scripts/claude-code-config.json`**
```json
{
  "claudeCode": {
    "autoCompact": {
      "enabled": true,
      "minTokens": 60000,
      "maxTokens": 70000,
      "targetTokens": 65000
    },
    "analysis": {
      "mode": "brutal",
      "assertiveness": "extreme",
      "tolerance": "zero"
    }
  }
}
```

---

## 🎯 Resultado Esperado

Ao acordar, você terá:
- ✅ Análise brutal completa do código
- ✅ Lista de problemas priorizados
- ✅ Soluções concretas com código
- ✅ Métricas de qualidade
- ✅ Relatórios detalhados
- ✅ Código melhorado (se aplicado)

---

**Status**: ✅ Configurado e pronto para execução!

