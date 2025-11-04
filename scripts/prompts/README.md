# 📋 Prompts para Automação Noturna

## 🎯 Visão Geral

Este diretório contém os prompts seguros para cada componente do sistema de automação noturna.

**⚠️ IMPORTANTE: Todos os prompts são SOMENTE LEITURA - sem modificações!**

---

## 📁 Arquivos

### **1. copilot-analysis-prompt.md** ⭐ (Versão Completa)
- Prompt completo para GitHub Copilot CLI
- Documentação extensa (Troubleshooting, Melhores Práticas, KPIs, CI/CD)
- Schema TypeScript incluído
- Exemplos de uso detalhados
- **645 linhas** - Versão completa recomendada

### **2. overnight-analysis-copilot.md** (Versão Simples)
- Prompt otimizado para GitHub Copilot CLI
- Versão focada apenas no prompt
- **224 linhas** - Versão mais enxuta
- Usado como fallback se o arquivo completo não existir

### **3. overnight-analysis-anthropic.md**
- Prompt para Anthropic SDK
- Usado pelo `code-analyzer.mjs`
- Análise profunda de código via Claude API

### **4. overnight-review-cursor.md**
- Prompt para revisão matinal no Cursor
- Você usa pela manhã para revisar relatórios
- Análise e priorização de problemas

### **5. PROMPTS_COMPLETOS.md**
- Documentação completa de todos os prompts
- Comparação entre os 3 prompts principais
- Garantias de segurança

---

## 🚀 Como Usar

### **Durante a Noite (Automático):**

O sistema executa automaticamente:

1. **Copilot CLI** usa `copilot-analysis-prompt.md` (versão completa) ou `overnight-analysis-copilot.md` (fallback)
2. **Anthropic SDK** usa `overnight-analysis-anthropic.md` (via `code-analyzer.mjs`)
3. **Relatórios** são gerados em `reports/YYYYMMDD/`

### **Pela Manhã (Manual):**

Você abre o Cursor e usa `overnight-review-cursor.md`:

```
Revisa o relatório de análise noturna em reports/20240115/combined-report.md

Por favor:
1. PRIORIZE os problemas encontrados
2. ANALISE o relatório
3. SUGIRA AÇÕES
4. VALIDE o relatório

IMPORTANTE: NÃO modifique arquivos ainda, apenas análise e priorização.
```

---

## ✅ Garantias de Segurança

Todos os prompts são:

- ✅ **Somente leitura** - sem modificações
- ✅ **Validados** antes de executar
- ✅ **Escopados** a diretórios permitidos
- ✅ **Monitorados** para comandos perigosos

---

## 📊 Comparação dos Arquivos do Copilot

| Aspecto | copilot-analysis-prompt.md | overnight-analysis-copilot.md |
|---------|----------------------------|-------------------------------|
| **Tamanho** | 645 linhas | 224 linhas |
| **Prompt** | ✅ Mesmo prompt otimizado | ✅ Mesmo prompt otimizado |
| **Documentação** | ✅ Extensa (Troubleshooting, KPIs, CI/CD) | ✅ Básica |
| **Schema TypeScript** | ✅ Incluído | ❌ Não incluído |
| **Exemplos** | ✅ Múltiplos exemplos | ✅ Básico |
| **Uso Recomendado** | ⭐ **Produção** | Fallback |

---

## 📝 Notas

- Os prompts são **templates** - podem ser ajustados conforme necessário
- Os prompts são **seguros** - todas as validações são aplicadas
- Os prompts são **testados** - sistema validado antes de usar
- **Prioridade:** Use `copilot-analysis-prompt.md` se disponível (versão completa)

---

**Status:** ✅ Prompts seguros e prontos para uso!
