# 📋 Plano de Integração Robusta - Sistema de Automação Noturna v2

## 🎯 Visão Geral

Sistema completo e robusto de automação noturna que executa testes, análises de código, builds e gera relatórios estruturados enquanto você dorme.

---

## 📁 Estrutura de Arquivos

```
scripts/
  ├── overnight-automation-v2.ps1    # Script principal
  ├── validate-tools.ps1             # Validação de ferramentas
  ├── copilot-executor.ps1           # Wrapper para GitHub Copilot CLI
  ├── code-analyzer.mjs              # Análise de código (Anthropic SDK)
  └── report-generator.mjs           # Gerador de relatórios combinados

reports/
  └── YYYYMMDD/
      ├── copilot/
      │   └── analysis-YYYYMMDD-HHMMSS.json
      ├── code-analyzer/
      │   └── deep-analysis-YYYYMMDD-HHMMSS.json
      ├── tests/
      │   └── test-results-YYYYMMDD.json
      ├── combined-report.json       # Relatório combinado (JSON)
      └── combined-report.md         # Relatório legível (Markdown)

logs/
  └── overnight-v2-YYYYMMDD-HHMMSS.log
```

---

## 🔄 Fluxo de Trabalho

### **FASE 1: Validação (00:00 - 00:15)**

- Executa `validate-tools.ps1`
- Verifica:
  - ✅ GitHub CLI instalado e autenticado
  - ✅ Copilot CLI configurado (`gh copilot --version`)
  - ✅ Node.js e npm disponíveis
  - ✅ Ferramentas de teste (Playwright, Vitest)
  - ✅ Anthropic SDK instalado
- **Falha cedo** se algo não estiver disponível
- Retorna status detalhado em JSON

### **FASE 2: Testes e Qualidade (00:15 - 01:30)**

- Executa testes E2E (`npm run test:all`)
- Gera cobertura (`npm run test:coverage`)
- Executa auditoria de segurança (`npm audit`)
- Salva resultados em `reports/YYYYMMDD/tests/`

### **FASE 3: Análise de Código (01:30 - 03:00)**

#### **GitHub Copilot CLI**
- Executa `copilot-executor.ps1`
- Análise e sugestões via `gh copilot -p "Analyze code..."`
- Gera relatório em `reports/YYYYMMDD/copilot/`

#### **Anthropic SDK**
- Executa `code-analyzer.mjs`
- Análise profunda usando Anthropic API
- Lê arquivos do projeto
- Gera relatório em `reports/YYYYMMDD/code-analyzer/`

### **FASE 4: Build e Validação (03:00 - 04:00)**

- Verifica tipos TypeScript (`npx tsc --noEmit`)
- Executa build (`npm run build`)
- Valida output
- Registra erros se houver

### **FASE 5: Geração de Relatórios (04:00 - 04:30)**

- Executa `report-generator.mjs`
- Combina todos os relatórios:
  - Relatórios do Copilot
  - Relatórios de análise de código
  - Resultados de testes
- Gera relatório combinado:
  - `reports/YYYYMMDD/combined-report.json` (para parsing)
  - `reports/YYYYMMDD/combined-report.md` (para leitura humana)
- Prioriza problemas encontrados

### **FASE 6: Revisão Manual (MANHÃ - você faz isso)**

1. Abrir Cursor
2. Pedir para revisar: **"Revisa o relatório em reports/YYYYMMDD/combined-report.md"**
3. Priorizar problemas e sugerir ações
4. Decidir o que fazer

---

## 🛠️ Componentes Detalhados

### **1. validate-tools.ps1**

Valida todas as ferramentas necessárias:

```powershell
.\scripts\validate-tools.ps1
.\scripts\validate-tools.ps1 -JsonOutput
```

**Retorna:**
- Status de cada ferramenta (disponível/não disponível)
- Versões instaladas
- Status de autenticação (GitHub CLI)
- Status de configuração (Copilot CLI)

**Exit Code:**
- `0` = Todas as ferramentas disponíveis
- `1` = Alguma ferramenta faltando

### **2. copilot-executor.ps1**

Wrapper seguro para GitHub Copilot CLI:

```powershell
.\scripts\copilot-executor.ps1 -Prompt "Analyze code..." -TimeoutSeconds 300 -OutputFile "report.json"
```

**Características:**
- Valida comando antes de executar
- Executa com timeout (evita scripts presos)
- Captura output estruturado
- Gera relatórios em formato padronizado
- Tratamento de erros específicos do Copilot

### **3. code-analyzer.mjs**

Análise de código usando Anthropic SDK:

```bash
node scripts/code-analyzer.mjs [output-path]
```

**Características:**
- Lê arquivos do projeto (TypeScript, JavaScript)
- Usa Anthropic API para análise profunda
- Gera relatórios estruturados
- Configurável via variáveis de ambiente (`ANTHROPIC_API_KEY`)
- Limita arquivos para não exceder token limits

### **4. report-generator.mjs**

Combina relatórios de múltiplas fontes:

```bash
node scripts/report-generator.mjs [YYYYMMDD]
```

**Características:**
- Lê relatórios do Copilot
- Lê relatórios de análise de código
- Lê resultados de testes
- Gera relatório combinado:
  - JSON (para parsing)
  - Markdown (para leitura humana)
- Prioriza problemas encontrados

### **5. overnight-automation-v2.ps1**

Script principal que orquestra tudo:

```powershell
.\scripts\overnight-automation-v2.ps1
.\scripts\overnight-automation-v2.ps1 -DryRun
.\scripts\overnight-automation-v2.ps1 -SkipTests
.\scripts\overnight-automation-v2.ps1 -SkipBuild
.\scripts\overnight-automation-v2.ps1 -SkipAnalysis
```

**Parâmetros:**
- `-DryRun`: Executa sem fazer alterações
- `-SkipTests`: Pula fase de testes
- `-SkipBuild`: Pula fase de build
- `-SkipAnalysis`: Pula fase de análise de código

**Sistema de Logs:**
- Logs estruturados com timestamps
- Arquivo de log em `logs/overnight-v2-YYYYMMDD-HHMMSS.log`
- Níveis de log: INFO, WARN, ERROR, SUCCESS, PHASE

---

## 📊 Estrutura de Relatórios

### **Relatório Combinado (JSON)**

```json
{
  "timestamp": "2024-01-15T04:30:00.000Z",
  "dateStamp": "20240115",
  "overallStatus": "success",
  "sources": {
    "tests": { ... },
    "copilot": { ... },
    "codeAnalysis": { ... }
  },
  "summary": {
    "tests": {
      "passed": 150,
      "failed": 0,
      "total": 150
    },
    "analyses": {
      "total": 20
    },
    "issues": {
      "total": 5
    }
  },
  "issues": [ ... ],
  "recommendations": [ ... ]
}
```

### **Relatório Combinado (Markdown)**

Relatório legível em Markdown com:
- Resumo executivo
- Resultados dos testes
- Análise de código
- Análise do GitHub Copilot
- Problemas priorizados
- Recomendações

---

## 🔧 Configuração

### **1. Variáveis de Ambiente**

```bash
# Anthropic API Key (obrigatória para code-analyzer.mjs)
export ANTHROPIC_API_KEY=sk-ant-...

# Ou no PowerShell:
$env:ANTHROPIC_API_KEY = "sk-ant-..."
```

### **2. GitHub CLI**

```bash
# Instalar (Windows)
winget install GitHub.cli

# Autenticar
gh auth login

# Configurar Copilot
gh copilot setup
```

### **3. Node.js e npm**

Verificar instalação:
```bash
node --version
npm --version
```

---

## 🚀 Como Usar

### **1. Configurar Ferramentas**

```powershell
# Verificar ferramentas
.\scripts\validate-tools.ps1

# Configurar GitHub Copilot (se necessário)
gh copilot setup
```

### **2. Executar (Dry Run)**

```powershell
# Teste sem fazer alterações
.\scripts\overnight-automation-v2.ps1 -DryRun
```

### **3. Executar (Real)**

```powershell
# Execução completa
.\scripts\overnight-automation-v2.ps1
```

### **4. Agendar Execução (Windows Task Scheduler)**

```powershell
# Criar tarefa agendada para executar às 00:00 todo dia
schtasks /create /tn "NossaMaternidade-Overnight-v2" /tr "powershell -ExecutionPolicy Bypass -File scripts/overnight-automation-v2.ps1" /sc daily /st 00:00
```

### **5. Revisar pela Manhã**

1. Abrir Cursor
2. Pedir: **"Revisa o relatório em reports/YYYYMMDD/combined-report.md"**
3. Priorizar problemas e sugerir ações
4. Decidir o que fazer

---

## 🎯 Melhores Práticas Implementadas

### **✅ Validação Antecipada**
- Falhar cedo se ferramentas não estiverem disponíveis
- Validar antes de executar qualquer fase

### **✅ Tratamento de Erros**
- Try-catch em todas as operações
- Retry para falhas transientes
- Continuar mesmo se uma ferramenta falhar (soft fail)

### **✅ Logs Estruturados**
- JSON logs + logs legíveis
- Timestamps em todas as entradas
- Níveis de log (INFO, WARN, ERROR, SUCCESS, PHASE)

### **✅ Relatórios Estruturados**
- JSON para parsing automático
- Markdown para leitura humana
- Priorização de problemas

### **✅ Timeout em Comandos**
- Evitar scripts que ficam presos
- Timeout configurável (padrão: 300s)

### **✅ Fallbacks**
- Continuar mesmo se uma ferramenta falhar
- Status parcial quando houver avisos

---

## 🔍 Troubleshooting

### **Problema: GitHub CLI não encontrado**

**Solução:**
```powershell
winget install GitHub.cli
gh auth login
```

### **Problema: Copilot CLI não configurado**

**Solução:**
```powershell
gh copilot setup
```

### **Problema: ANTHROPIC_API_KEY não configurada**

**Solução:**
```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-..."
# Ou adicionar ao perfil do PowerShell
```

### **Problema: Timeout em comandos**

**Solução:**
- Aumentar timeout em `copilot-executor.ps1`
- Verificar se há processos presos

### **Problema: Relatórios não gerados**

**Solução:**
- Verificar se diretórios `reports/` existem
- Verificar permissões de escrita
- Verificar logs em `logs/`

---

## 📝 Exemplos de Uso

### **Execução Completa**

```powershell
# Executar tudo
.\scripts\overnight-automation-v2.ps1
```

### **Pular Testes**

```powershell
# Pular fase de testes (útil se já rodou testes antes)
.\scripts\overnight-automation-v2.ps1 -SkipTests
```

### **Pular Build**

```powershell
# Pular fase de build (útil se build já foi feito)
.\scripts\overnight-automation-v2.ps1 -SkipBuild
```

### **Pular Análise**

```powershell
# Pular fase de análise (útil se só quer testes e build)
.\scripts\overnight-automation-v2.ps1 -SkipAnalysis
```

### **Dry Run Completo**

```powershell
# Testar sem fazer alterações
.\scripts\overnight-automation-v2.ps1 -DryRun
```

---

## 🎉 Resultado Esperado

Ao acordar pela manhã, você terá:

- ✅ **Relatórios estruturados** em `reports/YYYYMMDD/`
- ✅ **Relatório combinado** em Markdown legível
- ✅ **Logs completos** em `logs/overnight-v2-YYYYMMDD-HHMMSS.log`
- ✅ **Status de todas as fases** em JSON
- ✅ **Problemas priorizados** por severidade
- ✅ **Recomendações** de ações

---

## 📚 Diferenças do Plano Original

### **✅ Removido:**
- "Claude Code CLI" (não existe como ferramenta standalone)

### **✅ Adicionado:**
- Anthropic SDK via Node.js para análise de código
- Sistema robusto de validação de ferramentas
- Gerador de relatórios combinados
- Logs estruturados com timestamps

### **✅ Ajustado:**
- "Cursor AI" é revisão manual pela manhã, não automática
- Fluxo mais realista e executável

### **✅ Mantido:**
- GitHub Copilot CLI (funciona perfeitamente)
- Estrutura robusta de validação e tratamento de erros
- Sistema de relatórios estruturados

---

## 🚀 Próximos Passos

1. **Configurar ferramentas** (GitHub CLI, Anthropic API Key)
2. **Testar em dry-run** (`.\scripts\overnight-automation-v2.ps1 -DryRun`)
3. **Executar pela primeira vez** (`.\scripts\overnight-automation-v2.ps1`)
4. **Agendar execução automática** (Windows Task Scheduler)
5. **Revisar relatórios pela manhã** no Cursor

---

**Status:** ✅ Sistema completo e pronto para uso!
