# 🔍 Prompt de Análise Profunda - Claude Code CLI

## Contexto do Projeto
Você está analisando o código do **Nossa Maternidade** - um app PWA Next.js 15 para gestantes e mães, com integração multi-IA (Claude, GPT-4, Gemini), Supabase, gamificação e recursos de acolhimento emocional.

## ⚠️ LIMITES DE SEGURANÇA - CRÍTICO

**IMPORTANTE**: Você está trabalhando em um repositório específico. Você DEVE:

1. **Trabalhar APENAS no repositório atual**: Não acesse arquivos ou diretórios fora do repositório
2. **APENAS LEITURA**: Você está apenas ANALISANDO código, não MODIFICANDO
3. **Auto Compact apenas para análise**: Use auto compact para ler e analisar, não para modificar
4. **Não modificar arquivos**: Você NÃO tem permissão para modificar, deletar ou criar arquivos
5. **Gerar apenas relatórios**: Sua saída deve ser apenas relatórios JSON/Markdown, não mudanças em código

**PROIBIDO**:
- ❌ Modificar arquivos do código
- ❌ Executar comandos que alteram o sistema
- ❌ Acessar diretórios fora do repositório
- ❌ Deletar ou mover arquivos

**PERMITIDO**:
- ✅ Ler e analisar código dentro do repositório
- ✅ Usar auto compact para ler código grande
- ✅ Gerar relatórios de análise
- ✅ Identificar problemas e sugerir melhorias

## Instruções de Análise

Execute uma análise PROFUNDA e EXAUSTIVA do código, linha por linha. Esta análise deve demorar HORAS para ser completa. Seja BRUTAL, DIRETO e ESPECÍFICO.

### 1. ANÁLISE DE ARQUITETURA (Prioridade: CRÍTICA)

Analise TODOS os diretórios e arquivos:
- `app/` - Todas as rotas, páginas e API routes
- `components/` - Todos os componentes React
- `lib/` - Todas as bibliotecas e utilitários
- `hooks/` - Todos os custom hooks
- `scripts/` - Scripts SQL e automação

Para cada arquivo, identifique:
- **Padrões de arquitetura**: Está seguindo Next.js App Router corretamente?
- **Separação de responsabilidades**: Há lógica de negócio em componentes?
- **Dependências circulares**: Há imports circulares?
- **Estrutura de pastas**: A organização faz sentido?
- **Escalabilidade**: O código escala bem?

### 2. QUALIDADE DE CÓDIGO (Prioridade: ALTA)

Para CADA função, componente e módulo:
- **Complexidade ciclomática**: Funções > 10 são complexas demais
- **Tamanho de funções**: > 100 linhas = refatorar
- **Código duplicado**: DRY violado? Onde?
- **Nomes**: Variáveis/funções claras e descritivas?
- **Comentários**: Código auto-explicativo ou precisa de docs?
- **TypeScript**: Uso de `any`? Tipos fracos?

### 3. SEGURANÇA (Prioridade: CRÍTICA)

Busque por:
- **SQL Injection**: Queries não parametrizadas
- **XSS**: Inputs não sanitizados
- **Secrets expostos**: API keys, tokens em código
- **Autenticação**: RLS do Supabase configurado?
- **Autorização**: Verificações de permissão faltando?
- **Rate limiting**: APIs protegidas contra abuse?
- **CSRF**: Tokens CSRF implementados?
- **Validação de input**: Zod schemas em todos os endpoints?

### 4. PERFORMANCE (Prioridade: ALTA)

Identifique:
- **N+1 queries**: Loops com queries dentro
- **Bundle size**: Imports desnecessários de bibliotecas pesadas
- **Re-renders**: Componentes re-renderizando sem necessidade
- **Lazy loading**: Componentes pesados não lazy-loaded?
- **Imagens**: Otimizadas? WebP? Responsive?
- **Caching**: SWR/configuração de cache adequada?
- **Code splitting**: Routes não lazy-loaded?

### 5. TESTES (Prioridade: MÉDIA)

Avalie:
- **Cobertura**: Qual % do código está testado?
- **Testes faltando**: Quais funcionalidades críticas não têm testes?
- **Testes de integração**: E2E tests cobrem fluxos principais?
- **Mocks**: Mocks adequados para APIs externas?

### 6. ACESSIBILIDADE (Prioridade: MÉDIA)

Verifique:
- **ARIA labels**: Componentes acessíveis?
- **Keyboard navigation**: Tudo acessível via teclado?
- **Contraste**: Cores atendem WCAG?
- **Screen readers**: Compatível com leitores de tela?

### 7. DESIGN E UX (Prioridade: MÉDIA)

Para app materno-infantil, considere:
- **Design emocional**: Interface acolhedora e empática?
- **Mobile-first**: Funciona bem em mobile?
- **PWA**: Service worker funcionando? Offline?
- **Loading states**: Feedback visual adequado?
- **Error handling**: Mensagens de erro claras e úteis?

### 8. INTEGRAÇÃO COM IA (Prioridade: ALTA)

Avalie rotas de IA em `app/api/multi-ai/`:
- **Error handling**: Tratamento de erros de APIs de IA?
- **Rate limiting**: Proteção contra custos excessivos?
- **Fallbacks**: Se uma IA falha, tem fallback?
- **Contexto**: Contexto suficiente para IAs funcionarem?
- **Custos**: Uso eficiente de tokens?

### 9. GAMIFICAÇÃO (Prioridade: BAIXA)

Analise sistema de gamificação:
- **Lógica de pontos**: Correta e justa?
- **Prevenção de fraude**: Pode ser gamed?
- **Performance**: Queries de pontos eficientes?

### 10. SUPABASE (Prioridade: ALTA)

Verifique:
- **RLS policies**: Todas as tabelas protegidas?
- **Queries**: Otimizadas? Índices adequados?
- **Migrations**: Scripts SQL bem estruturados?
- **Triggers**: Funcionam corretamente?

## Formato do Relatório

Gere um relatório estruturado em JSON com:

```json
{
  "timestamp": "ISO 8601",
  "analysis_version": "2.0",
  "summary": {
    "total_files_analyzed": 0,
    "total_issues": 0,
    "critical_issues": 0,
    "high_priority": 0,
    "medium_priority": 0,
    "low_priority": 0
  },
  "issues": [
    {
      "file": "app/api/example/route.ts",
      "line": 42,
      "type": "security|performance|quality|architecture",
      "severity": "critical|high|medium|low",
      "title": "Título claro do problema",
      "description": "Descrição detalhada",
      "impact": "Impacto no app",
      "suggestion": "Solução sugerida",
      "code_example": "Exemplo de código corrigido"
    }
  ],
  "architecture_recommendations": [],
  "security_vulnerabilities": [],
  "performance_bottlenecks": [],
  "test_coverage_gaps": [],
  "next_steps": []
}
```

## Critérios de Sucesso

- ✅ Análise de TODOS os arquivos `.ts`, `.tsx`, `.js`, `.jsx`
- ✅ Identificação de TODOS os problemas críticos
- ✅ Sugestões CONCRETAS com código de exemplo
- ✅ Priorização CLARA de ações
- ✅ Relatório JSON válido e estruturado

## Tempo Esperado

Esta análise deve demorar **2-4 horas** para ser completa. Não pule nenhum arquivo. Seja minucioso.

## Modelo e Auto Compact OBRIGATÓRIO

**IMPORTANTE**: Você DEVE usar auto compact para analisar TODO o código. Não pode pular arquivos.

### Configuração Obrigatória:
- **Modelo**: `claude-opus` ou `claude-sonnet-4-5-20250929` (modelos mais recentes)
- **Context Window**: 200.000 tokens (máximo)
- **Auto Compact Target**: 60.000 - 70.000 tokens
- **Modo**: `--print` (não-interativo) com `--output-format json`

### Como Funciona o Auto Compact:
1. Leia TODOS os arquivos do projeto
2. Compacte informações relevantes mantendo contexto
3. Analise código compactado linha por linha
4. Expanda análise quando necessário
5. NÃO pule nenhum arquivo - se precisar, compacte mais mas analise tudo

### Validação de Auto Compact:
Após análise, verifique:
- ✅ TODOS os arquivos `.ts`, `.tsx` foram analisados
- ✅ TODOS os diretórios foram cobertos
- ✅ Relatório contém referências a arquivos específicos
- ✅ Nenhum arquivo foi pulado por "limite de tokens"

**Se você não conseguir analisar tudo, compacte mais agressivamente, mas NÃO pule arquivos.**
