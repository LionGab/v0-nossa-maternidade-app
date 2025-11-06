# 🤖 Prompt para GitHub Copilot CLI - Análise Noturna

## ⚠️ IMPORTANTE: Este prompt é SOMENTE LEITURA

Este prompt é usado pelo `copilot-executor.ps1` e deve ser **100% análise**, sem modificações.

---

## 📋 Prompt Completo (Versão Otimizada)

```
# 🤖 Análise de Código - Somente Leitura

## ⚠️ REGRAS OBRIGATÓRIAS DE SEGURANÇA
- ❌ NÃO modifique nenhum arquivo
- ❌ NÃO sugira comandos de escrita (write, edit, delete, mv, rm)
- ❌ NÃO acesse paths fora de: app/, components/, lib/, hooks/, scripts/
- ❌ NÃO execute comandos do sistema
- ✅ APENAS leitura e análise
- ✅ APENAS sugestões (sem implementar)

---

## 📊 ESCOPO DA ANÁLISE

### Priorizar:
1. Arquivos modificados recentemente (últimos 7 dias)
2. Arquivos >300 linhas sem testes
3. Componentes React complexos (>50 linhas)

### Ignorar:
- node_modules/, .next/, coverage/, dist/
- *.config.js, *.config.ts
- Arquivos em /experimental/, /draft/

---

## 🔍 CATEGORIAS DE ANÁLISE

### 1. PROBLEMAS DE QUALIDADE (Severidade: critical/high/medium/low)

**Bugs potenciais:**
- Divisão por zero sem validação
- Array operations sem keys únicas
- Promises não aguardadas (missing await)
- Race conditions em estado assíncrono
- Null/undefined não tratados

**Code smells:**
- Funções >50 linhas (threshold: 50=medium, 100=high, 200=critical)
- Duplicação: código idêntico em 3+ lugares
- Complexidade ciclomática: >10=medium, >15=high, >20=critical
- Parâmetros: >5=medium, >7=high
- Aninhamento: >4=medium, >6=critical

**Performance:**
- useEffect sem dependencies ou com dependencies incorretas
- Componentes sem React.memo quando renderizam >5x
- Loops O(n²) que poderiam ser O(n)
- Re-criação desnecessária de objetos/arrays em render

---

### 2. PROBLEMAS DE SEGURANÇA (Sempre critical ou high)

- Dados sensíveis expostos (API keys, tokens no código)
- Inputs sem validação ou sanitização
- XSS: dangerouslySetInnerHTML sem sanitização
- CSRF: falta de tokens em mutations
- SQL injection (se usar queries dinâmicas)
- Autenticação: rotas protegidas sem verificação
- Autorização: permissões não validadas no backend

---

### 3. VIOLAÇÕES DE BOAS PRÁTICAS

**TypeScript:**
- Uso de `any` sem justificativa
- Type assertions desnecessários (as unknown as Type)
- Interfaces vazias
- Enums quando deveria usar union types

**React:**
- Componentes >200 linhas (deveria ser quebrado)
- Lógica de negócio em componentes (deveria estar em hooks/utils)
- useState para dados que deveriam ser computados
- useEffect que deveria ser handlers

**Next.js:**
- Fetch em client quando deveria ser server
- Metadados faltando (SEO)
- Loading/error states não implementados

---

### 4. OPORTUNIDADES DE MELHORIA (medium/low)

**Refatorações:**
- Extrair funções utilitárias comuns
- Criar hooks customizados para lógica reutilizada
- Unificar padrões inconsistentes

**Otimizações:**
- Implementar lazy loading
- Adicionar memoização
- Otimizar bundle size

**UX:**
- Adicionar loading states
- Melhorar mensagens de erro
- Adicionar feedback visual

---

### 5. PROBLEMAS DE TESTES

- Arquivos sem testes (>100 linhas)
- Testes frágeis (dependem de timing, ordem)
- Cobertura <70%=low, <50%=high
- Mocks mal implementados
- Testes não testam edge cases

---

## 📋 FORMATO DE OUTPUT OBRIGATÓRIO

Formato de resposta OBRIGATÓRIO: JSON estruturado com o seguinte schema:

```json
{
  "analysis": {
    "quality_issues": [
      {
        "severity": "critical",
        "category": "bug",
        "file": "app/api/route.ts",
        "line": 42,
        "description": "Divisão por zero sem validação",
        "suggestion": "Adicionar: if (divisor === 0) throw new Error(...)",
        "impact": "App crash em runtime"
      }
    ],
    "security_issues": [],
    "best_practices_violations": [],
    "improvements": [],
    "testing_issues": []
  },
  "summary": {
    "total_issues": 0,
    "by_severity": {
      "critical": 0,
      "high": 0,
      "medium": 0,
      "low": 0
    },
    "by_category": {
      "quality": 0,
      "security": 0,
      "best_practices": 0,
      "improvements": 0,
      "testing": 0
    }
  },
  "metadata": {
    "analyzed_at": "2025-11-04T03:00:00Z",
    "files_analyzed": 0,
    "total_lines": 0
  }
}
```

## 📏 LIMITES

- Máximo 50 problemas por categoria (total: 250)
- Se >50 em uma categoria, priorize os mais críticos
- Descrição: máx 200 chars
- Sugestão: máx 300 chars

## 🚫 IGNORAR FALSOS POSITIVOS

- any types com comentário // @ts-expect-error: reason
- useEffect com [] se comentado // intended empty deps
- TODOs com link para issue (// TODO: #123)

---

IMPORTANTE:
- Retorne APENAS JSON válido, sem markdown adicional ou comentários
- Se o JSON estiver dentro de markdown (```json...```), extraia apenas o JSON
- O JSON deve ser parseável diretamente (sem formatação adicional)
- Valide o JSON antes de retornar (sintaxe correta, campos obrigatórios presentes)
```

---

## 🎯 Como Usar

### **Opção 1: Uso Direto**

```powershell
# Copiar prompt do arquivo
$prompt = Get-Content "scripts\prompts\copilot-analysis-prompt.md" -Raw

# Executar com copilot-executor (seguro)
.\scripts\copilot-executor.ps1 `
    -Prompt $prompt `
    -OutputFile "reports\copilot\analysis-$(Get-Date -Format 'yyyy-MM-dd-HHmmss').json" `
    -JsonOutput `
    -TimeoutSeconds 600
```

### **Opção 2: Script de Análise Automatizado**

```powershell
# analyze-with-copilot.ps1
param(
    [string]$Directory = "app",
    [string]$OutputDir = "reports\copilot"
)

# Carregar prompt
$promptTemplate = Get-Content "scripts\prompts\copilot-analysis-prompt.md" -Raw

# Customizar para diretório específico
$prompt = $promptTemplate -replace "app/, components/, lib/", "$Directory/"

# Criar output directory
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

# Executar análise
$result = .\scripts\copilot-executor.ps1 `
    -Prompt $prompt `
    -OutputFile "$OutputDir\$Directory-analysis.json" `
    -JsonOutput `
    -TimeoutSeconds 600 | ConvertFrom-Json

# Processar resultado
if ($result.success) {
    Write-Host "✅ Análise concluída!" -ForegroundColor Green
    
    $analysis = $result.output | ConvertFrom-Json
    Write-Host "📊 Issues encontrados: $($analysis.summary.total_issues)"
    Write-Host "🔴 Critical: $($analysis.summary.by_severity.critical)"
    Write-Host "🟠 High: $($analysis.summary.by_severity.high)"
} else {
    Write-Host "❌ Erro: $($result.error)" -ForegroundColor Red
}
```

### **Opção 3: Análise Batch (Múltiplos Diretórios)**

```powershell
# batch-analysis.ps1
$directories = @('app', 'components', 'lib', 'hooks')

$allResults = foreach ($dir in $directories) {
    Write-Host "`n📂 Analisando $dir..." -ForegroundColor Cyan
    
    .\scripts\analyze-with-copilot.ps1 -Directory $dir
}

# Consolidar resultados
$consolidatedReport = @{
    timestamp = Get-Date -Format "o"
    directories = $directories
    results = $allResults
}

$consolidatedReport | ConvertTo-Json -Depth 10 | 
    Out-File "reports\copilot\consolidated-analysis.json"
```

---

## ✅ Garantias de Segurança

O `copilot-executor.ps1` aplica automaticamente:

| Camada | Proteção | Status |
|--------|----------|--------|
| **1. Path Validation** | Valida paths no prompt | ✅ Ativa |
| **2. Command Detection** | Detecta comandos perigosos | ✅ Ativa |
| **3. Directory Whitelist** | Restringe a diretórios permitidos | ✅ Ativa |
| **4. Security Prompt** | Adiciona instruções de segurança | ✅ Ativa |
| **5. Timeout Protection** | Limita tempo de execução (600s) | ✅ Ativa |
| **6. Job Isolation** | Executa em processo separado | ✅ Ativa |

### **Fluxo de Execução Seguro:**

```
1. Prompt carregado do arquivo
   ↓
2. VALIDAÇÃO: Paths no prompt (CAMADA 1)
   ↓
3. VALIDAÇÃO: Comandos perigosos (CAMADA 2)
   ↓
4. VALIDAÇÃO: Diretórios permitidos (CAMADA 3)
   ↓
5. INJEÇÃO: Instruções de segurança (CAMADA 4)
   ↓
6. EXECUÇÃO: Copilot CLI em processo isolado
   ↓ (timeout: 600s)
7. OUTPUT: JSON estruturado salvo
```

---

## 📊 Schema de Output

### **Estrutura Completa:**

```typescript
interface CopilotAnalysis {
  analysis: {
    quality_issues: Issue[]
    security_issues: Issue[]
    best_practices_violations: Issue[]
    improvements: Issue[]
    testing_issues: Issue[]
  }
  summary: {
    total_issues: number
    by_severity: {
      critical: number
      high: number
      medium: number
      low: number
    }
    by_category: {
      quality: number
      security: number
      best_practices: number
      improvements: number
      testing: number
    }
  }
  metadata: {
    analyzed_at: string  // ISO 8601
    files_analyzed: number
    total_lines: number
  }
}

interface Issue {
  severity: "critical" | "high" | "medium" | "low"
  category: string
  file: string
  line: number
  description: string  // max 200 chars
  suggestion: string   // max 300 chars
  impact: string
}
```

### **Exemplo de Output:**

```json
{
  "analysis": {
    "quality_issues": [
      {
        "severity": "high",
        "category": "performance",
        "file": "app/dashboard/page.tsx",
        "line": 23,
        "description": "useEffect re-renders infinitely due to missing dependencies",
        "suggestion": "Add [data, setData] to useEffect dependencies or use useCallback",
        "impact": "Causes performance degradation and potential memory leak"
      }
    ],
    "security_issues": [
      {
        "severity": "critical",
        "category": "xss",
        "file": "components/UserComment.tsx",
        "line": 45,
        "description": "dangerouslySetInnerHTML used without sanitization",
        "suggestion": "Use DOMPurify: dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}",
        "impact": "XSS vulnerability - attackers can inject malicious scripts"
      }
    ],
    "best_practices_violations": [],
    "improvements": [],
    "testing_issues": []
  },
  "summary": {
    "total_issues": 2,
    "by_severity": {
      "critical": 1,
      "high": 1,
      "medium": 0,
      "low": 0
    },
    "by_category": {
      "quality": 1,
      "security": 1,
      "best_practices": 0,
      "improvements": 0,
      "testing": 0
    }
  },
  "metadata": {
    "analyzed_at": "2025-11-04T09:24:00Z",
    "files_analyzed": 42,
    "total_lines": 3580
  }
}
```

---

## 🔧 Troubleshooting

### **Problema 1: JSON Inválido no Output**

**Sintoma:**
```
ConvertFrom-Json : Invalid JSON primitive
```

**Solução:**
```powershell
# O Copilot pode retornar JSON wrapped em markdown
# Extrair JSON do markdown:
$rawOutput = $result.output

# Remover markdown code fences
if ($rawOutput -match '```json\s*([\s\S]*?)\s*```') {
    $jsonContent = $Matches[1]
} else {
    $jsonContent = $rawOutput
}

# Parse JSON
$analysis = $jsonContent | ConvertFrom-Json
```

### **Problema 2: Timeout Muito Curto**

**Sintoma:**
```
Timeout após 300 segundos
```

**Solução:**
```powershell
# Aumentar timeout para análises complexas
.\scripts\copilot-executor.ps1 `
    -Prompt $prompt `
    -TimeoutSeconds 900  # 15 minutos
```

### **Problema 3: Muitos Issues Retornados**

**Sintoma:**
Output gigante com >250 issues

**Solução:**
```powershell
# O prompt já limita a 50 por categoria
# Se ainda muito grande, filtrar por severidade:
$analysis = $result.output | ConvertFrom-Json
$criticalOnly = $analysis.analysis.quality_issues | 
                Where-Object { $_.severity -eq "critical" }
```

### **Problema 4: Falsos Positivos**

**Sintoma:**
Issues reportados em código comentado como intencional

**Solução:**
```powershell
# Adicionar comentários especiais no código:
// @ts-expect-error: legacy code, will refactor in #123
// intended empty deps
// TODO: #456
```

---

## 📝 Customização do Prompt

### **Adicionar Categorias Personalizadas**

```markdown
### 6. ACESSIBILIDADE

- Elementos sem aria-label
- Foco não gerenciado
- Contraste de cores <4.5:1
- Formulários sem labels
```

### **Ajustar Thresholds**

```markdown
**Code smells:**
- Funções >30 linhas (seu threshold)
- Complexidade >8
- Parâmetros >3
```

### **Ignorar Patterns Específicos**

```markdown
## 🚫 IGNORAR

- Arquivos em /legacy/
- TODOs com "WONTFIX"
- Comentários com "HACK:"
```

---

## 🎯 Melhores Práticas

### **✅ DO: Sempre faça isso**

1. **Salvar output em arquivo**
   ```powershell
   -OutputFile "reports\analysis-$(Get-Date -Format 'yyyy-MM-dd').json"
   ```

2. **Usar timeout adequado**
   ```powershell
   -TimeoutSeconds 600  # 10 minutos para análises grandes
   ```

3. **Revisar critical/high primeiro**
   ```powershell
   $critical = $analysis.analysis | ForEach-Object { 
       $_.quality_issues + $_.security_issues 
   } | Where-Object { $_.severity -in @('critical', 'high') }
   ```

4. **Versionar outputs**
   ```powershell
   git add reports/copilot/
   git commit -m "chore: copilot analysis $(Get-Date -Format 'yyyy-MM-dd')"
   ```

### **❌ DON'T: Evite fazer isso**

1. ❌ Executar sem timeout
2. ❌ Aplicar sugestões sem revisar
3. ❌ Ignorar security issues
4. ❌ Analisar node_modules/
5. ❌ Confiar 100% nas sugestões

---

## 📈 Métricas e KPIs

### **Análise de Tendências:**

```powershell
# trend-analysis.ps1
$reports = Get-ChildItem "reports\copilot\*.json" | 
           ForEach-Object { Get-Content $_ | ConvertFrom-Json }

$trend = $reports | ForEach-Object {
    [PSCustomObject]@{
        Date = $_.metadata.analyzed_at
        TotalIssues = $_.summary.total_issues
        Critical = $_.summary.by_severity.critical
        High = $_.summary.by_severity.high
    }
} | Sort-Object Date

# Visualizar tendência
$trend | Format-Table -AutoSize
```

### **KPIs Sugeridos:**

| Métrica | Target | Status |
|---------|--------|--------|
| Critical Issues | 0 | 🎯 |
| High Issues | <5 | ⚠️ |
| Security Issues | 0 | 🎯 |
| Code Coverage | >80% | ✅ |
| Avg Complexity | <10 | ✅ |

---

## 🔄 Integração com CI/CD

### **GitHub Actions Example:**

```yaml
name: Copilot Code Analysis

on:
  schedule:
    - cron: '0 3 * * *'  # 3 AM diário
  workflow_dispatch:

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup GitHub CLI
        run: |
          gh auth login --with-token <<< "${{ secrets.GH_TOKEN }}"
          gh extension install github/gh-copilot
      
      - name: Run Analysis
        run: |
          pwsh -File scripts/copilot-executor.ps1 `
            -Prompt "$(cat scripts/prompts/copilot-analysis-prompt.md)" `
            -OutputFile "reports/copilot/analysis.json" `
            -JsonOutput
      
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: copilot-analysis
          path: reports/copilot/
      
      - name: Check for Critical Issues
        run: |
          $analysis = Get-Content reports/copilot/analysis.json | ConvertFrom-Json
          if ($analysis.summary.by_severity.critical -gt 0) {
            Write-Error "❌ Critical issues found!"
            exit 1
          }
```

---

## 📚 Recursos Relacionados

- [`copilot-executor.ps1`](../copilot-executor.ps1) - Executor seguro
- [`COPILOT_EXECUTOR_SECURITY_FIXES.md`](../COPILOT_EXECUTOR_SECURITY_FIXES.md) - Documentação de segurança
- [`SECURITY_LAYERS.md`](../SECURITY_LAYERS.md) - Arquitetura de segurança

---

**Status:** ✅ Prompt otimizado e pronto para uso!  
**Versão:** 1.0  
**Última Atualização:** 2025-11-04
