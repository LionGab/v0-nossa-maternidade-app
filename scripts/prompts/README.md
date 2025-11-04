# 📋 Prompts para Automação Noturna

## 🎯 Visão Geral

Este diretório contém os prompts seguros para cada componente do sistema de automação noturna.

**⚠️ IMPORTANTE: Todos os prompts são SOMENTE LEITURA - sem modificações!**

---

## 📁 Arquivos

### **1. overnight-analysis-copilot.md**
- Prompt para GitHub Copilot CLI
- Usado pelo `copilot-executor.ps1`
- Análise de código via Copilot CLI

### **2. overnight-analysis-anthropic.md**
- Prompt para Anthropic SDK
- Usado pelo `code-analyzer.mjs`
- Análise profunda de código via Claude API

### **3. overnight-review-cursor.md**
- Prompt para revisão matinal no Cursor
- Você usa pela manhã para revisar relatórios
- Análise e priorização de problemas

---

## 🚀 Como Usar

### **Durante a Noite (Automático):**

O sistema executa automaticamente:

1. **Copilot CLI** usa `overnight-analysis-copilot.md` (via `copilot-executor.ps1`)
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

## 📝 Notas

- Os prompts são **templates** - podem ser ajustados conforme necessário
- Os prompts são **seguros** - todas as validações são aplicadas
- Os prompts são **testados** - sistema validado antes de usar

---

**Status:** ✅ Prompts seguros e prontos para uso!

