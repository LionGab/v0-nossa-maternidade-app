# 📋 Prompts Completos para Cada IA

## 🎯 Resumo dos 3 Prompts Principais

1. **GitHub Copilot CLI** - Análise noturna via `copilot-executor.ps1`
2. **Anthropic SDK** - Análise profunda via `code-analyzer.mjs`
3. **Cursor AI** - Revisão matinal (você usa manualmente)

---

## 1. 🤖 GitHub Copilot CLI - Prompt Completo

**Arquivo:** `scripts/prompts/overnight-analysis-copilot.md`

**Usado por:** `scripts/copilot-executor.ps1`

### Prompt Completo:

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

### Como é usado:

```powershell
# O script copilot-executor.ps1 carrega este prompt do arquivo
# e adiciona instruções de segurança antes de enviar para o Copilot CLI
.\scripts\copilot-executor.ps1 -Prompt "Analise o código..." -OutputFile "reports/copilot/analysis.json"
```

### Segurança adicional:

O `copilot-executor.ps1` adiciona automaticamente estas instruções ANTES do prompt:

```
Você é um analisador de código SOMENTE LEITURA.

REGRAS DE SEGURANÇA OBRIGATÓRIAS (TECNICAMENTE ENFORCABLES):
- PROIBIDO modificar qualquer arquivo (validado antes de executar)
- PROIBIDO sugerir comandos de escrita (bloqueados por validação)
- PROIBIDO acessar paths fora do repositório (validado por camada 1)
- PROIBIDO acessar diretórios não permitidos (validado por camada 3)
- PROIBIDO executar comandos do sistema (bloqueados por validação)
- APENAS análise e relatórios são permitidos
- APENAS leitura de arquivos dentro dos diretórios: app, components, lib, hooks, scripts

[PROMPT ORIGINAL AQUI]

IMPORTANTE: Forneça apenas análise e sugestões. NÃO modifique arquivos.
Todas as tentativas de modificação serão bloqueadas por validações técnicas.
```

---

## 2. 🔍 Anthropic SDK - Prompt Completo

**Arquivo:** `scripts/code-analyzer.mjs` (implementado no código)

**Usado por:** `scripts/code-analyzer.mjs`

### Prompt Completo:

```
Você é um analisador de código SOMENTE LEITURA.

REGRAS DE SEGURANÇA OBRIGATÓRIAS:
- ❌ PROIBIDO modificar qualquer arquivo
- ❌ PROIBIDO sugerir comandos de escrita (write, edit, delete)
- ❌ PROIBIDO acessar paths fora do repositório
- ❌ PROIBIDO executar comandos do sistema
- ✅ APENAS análise e relatórios são permitidos
- ✅ APENAS leitura de arquivos dentro do repositório

Analise o código abaixo e identifique:
1. Problemas de qualidade (bugs potenciais, code smells)
2. Oportunidades de melhoria (performance, legibilidade)
3. Problemas de segurança
4. Violações de boas práticas
5. Sugestões de refatoração (apenas sugestões, SEM modificar)

Código para análise:
[CÓDIGO DO PROJETO É INJETADO AQUI - até 20 arquivos, 5000 chars cada]

Forneça uma análise estruturada e priorizada. Lembre-se: APENAS ANÁLISE, SEM MODIFICAÇÕES.
```

### Como é usado:

```bash
# O script code-analyzer.mjs:
# 1. Lê arquivos do projeto (apenas diretórios permitidos)
# 2. Valida todos os paths antes de ler
# 3. Injeta o código no prompt
# 4. Envia para Anthropic API (model: claude-3-5-sonnet-20241022)
# 5. Gera relatório estruturado em JSON

node scripts/code-analyzer.mjs [output-path]
```

### Segurança:

- ✅ Validação de paths antes de ler qualquer arquivo
- ✅ Apenas diretórios permitidos: app, components, lib, hooks, scripts
- ✅ Limite de arquivos (20 por padrão) para não exceder token limits
- ✅ Limite de 5000 caracteres por arquivo
- ✅ Apenas leitura, sem modificações

---

## 3. 🌙 Cursor AI - Prompt Completo para Revisão Matinal

**Arquivo:** `scripts/prompts/overnight-review-cursor.md`

**Usado por:** Você manualmente pela manhã

### Prompt Completo:

```
Revisa o relatório de análise noturna em reports/YYYYMMDD/combined-report.md

Por favor:

1. PRIORIZE os problemas encontrados:
   - Quais são críticos e precisam ser corrigidos HOJE?
   - Quais são importantes mas podem esperar?
   - Quais são sugestões de melhoria para depois?

2. ANALISE o relatório:
   - Há problemas de segurança que precisam atenção imediata?
   - Há bugs críticos que podem quebrar a aplicação?
   - Há problemas de performance que afetam usuários?

3. SUGIRA AÇÕES:
   - Quais problemas você quer que eu corrija AGORA?
   - Quais podem ser tratados depois?
   - Há algo que precisa mais contexto para decidir?

4. VALIDE o relatório:
   - Os problemas identificados fazem sentido?
   - Há falsos positivos?
   - Há algo importante que foi perdido?

IMPORTANTE:
- NÃO modifique arquivos ainda
- APENAS análise e priorização
- Eu decidirei o que fazer após sua revisão

Use o formato:
- 🔴 CRÍTICO: [problema] - precisa correção imediata
- 🟠 ALTO: [problema] - importante, corrigir hoje
- 🟡 MÉDIO: [problema] - pode esperar, mas importante
- 🟢 BAIXO: [problema] - melhoria, fazer quando tiver tempo
```

### Como usar (pela manhã):

1. **Abra o Cursor**
2. **Copie o prompt acima** (substitua `YYYYMMDD` pela data do relatório)
3. **Cole no chat do Cursor**
4. **Aguarde minha análise e priorização**
5. **Decida o que fazer** baseado na minha recomendação

### Exemplo de uso:

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

## 📊 Comparação dos 3 Prompts

| Aspecto | Copilot CLI | Anthropic SDK | Cursor AI |
|---------|-------------|---------------|-----------|
| **Uso** | Automático (noturna) | Automático (noturna) | Manual (manhã) |
| **Formato Output** | JSON obrigatório | Texto estruturado | Análise priorizada |
| **Schema** | Definido e validado | Flexível | Formato de lista |
| **Limites** | 50 por categoria | 20 arquivos, 5000 chars | Sem limites |
| **Validação** | Automática no script | Manual no output | Pela revisão |
| **Segurança** | 4 camadas técnicas | 4 camadas técnicas | Somente leitura |

---

## ✅ Garantias de Segurança (Todos os Prompts)

1. **Camada 1 - Validação de Path**
   - Bloqueia acesso fora do repositório
   - Valida antes de processar

2. **Camada 2 - Restrição de Ferramentas**
   - Detecta comandos perigosos
   - Bloqueia antes de executar

3. **Camada 3 - Diretórios Permitidos**
   - Apenas: app, components, lib, hooks, scripts
   - Bloqueia outros diretórios

4. **Camada 4 - Instruções no Prompt**
   - Proibições explícitas
   - Reforço de segurança

---

## 🚀 Fluxo Completo

```
00:00 - overnight-automation-v2.ps1 inicia
       ↓
00:15 - Copilot CLI executa (prompt 1)
       ↓
01:30 - Anthropic SDK executa (prompt 2)
       ↓
04:30 - Relatórios combinados gerados
       ↓
MANHÃ - Você usa Cursor (prompt 3)
       ↓
MANHÃ - Você decide ações
```

---

**Status:** ✅ Todos os prompts prontos e seguros para uso!
