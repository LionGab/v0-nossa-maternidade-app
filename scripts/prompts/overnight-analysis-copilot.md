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

Este prompt é automaticamente enviado pelo `copilot-executor.ps1` quando chamado:

```powershell
.\scripts\copilot-executor.ps1 -Prompt "Analise o código..." -OutputFile "reports/copilot/analysis.json"
```

O script adiciona automaticamente as instruções de segurança antes de enviar.

---

## ✅ Garantias de Segurança

- ✅ Validação de paths antes de executar
- ✅ Detecção de comandos perigosos
- ✅ Validação de diretórios permitidos
- ✅ Timeout para evitar execução infinita
- ✅ Output capturado para análise posterior

---

## 📝 Notas

- Este prompt é **somente leitura**
- Todas as validações de segurança são aplicadas ANTES de executar
- Se qualquer validação falhar, o script para ANTES de chamar o Copilot
- O output é salvo em JSON para análise posterior
