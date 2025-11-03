# Sistema de Múltiplos Agentes de Código Automatizado

## Visão Geral

Sistema completo e eficiente para executar múltiplos agentes especializados de código de forma coordenada e paralela.

## Características

- ✅ **8 Agentes Especializados**: Análise, Refatoração, Testes, Documentação, Otimização, Detecção de Bugs, Geração de Componentes, Validação
- ✅ **3 Modos de Execução**: Paralelo, Sequencial, Orquestrado
- ✅ **Integração Multi-IA**: Claude (Anthropic), GPT-4 (OpenAI), Gemini (Google)
- ✅ **Interface Intuitiva**: Painel visual para seleção e execução de agentes
- ✅ **Rate Limiting**: Proteção contra abuso de recursos
- ✅ **Validação Completa**: Schemas Zod para todas as requisições

## Agentes Disponíveis

### 1. **Analisador de Código** (`analyzer`)
Analisa código e identifica:
- Problemas e bugs potenciais
- Code smells e más práticas
- Oportunidades de melhoria
- Complexidade e qualidade do código
- Padrões e antipadrões

### 2. **Refatorador de Código** (`refactor`)
Refatora código seguindo:
- Princípios SOLID
- Clean Code e boas práticas
- Melhor legibilidade e manutenibilidade
- Padrões de projeto apropriados
- TypeScript/JavaScript moderno

### 3. **Gerador de Testes** (`test-generator`)
Cria testes completos:
- Testes unitários abrangentes
- Testes de edge cases
- Testes de integração quando apropriado
- Cobertura completa das funcionalidades
- Usando Vitest ou Jest

### 4. **Documentador de Código** (`documenter`)
Gera documentação clara:
- Documentação de funções/métodos
- Exemplos de uso
- Documentação de tipos e interfaces
- README quando apropriado
- Comentários JSDoc/TSDoc

### 5. **Otimizador de Performance** (`optimizer`)
Otimiza código para:
- Melhor performance e velocidade
- Menor uso de memória
- Otimizações de algoritmos
- Bundle size e tree-shaking
- Otimizações específicas para React/Next.js

### 6. **Detector de Bugs** (`bug-detector`)
Identifica:
- Bugs e erros potenciais
- Vulnerabilidades de segurança
- Race conditions e problemas de concorrência
- Memory leaks potenciais
- Problemas de tipagem e lógica

### 7. **Gerador de Componentes** (`component-generator`)
Cria componentes React/Next.js:
- Componentes funcionais com TypeScript
- Props tipadas corretamente
- Hooks e estado quando necessário
- Acessibilidade (a11y)
- Responsividade e design system

### 8. **Validador de Código** (`validator`)
Valida código contra:
- Padrões de código (ESLint, Prettier)
- Convenções e boas práticas
- TypeScript strict mode
- Acessibilidade (a11y)
- Performance e otimizações

## Modos de Execução

### Paralelo (`parallel`)
Executa todos os agentes simultaneamente. **Melhor para desempenho.**

### Sequencial (`sequential`)
Executa agentes um por vez, na ordem especificada. **Melhor para dependências.**

### Orquestrado (`orchestrated`)
Executa agentes com base em prioridades e dependências. **Melhor para fluxos complexos.**

## Como Usar

### Via Interface Web

1. Acesse `/code-agents`
2. Selecione os agentes desejados
3. Cole ou digite o código a processar
4. Escolha o modo de execução
5. Clique em "Executar Agentes"

### Via API

#### Executar Múltiplos Agentes

```bash
POST /api/code-agents
```

**Request:**
```json
{
  "tasks": [
    {
      "agentType": "analyzer",
      "input": "const x = 1;\nconsole.log(x);",
      "filePath": "example.ts"
    },
    {
      "agentType": "refactor",
      "input": "const x = 1;\nconsole.log(x);",
      "priority": 1
    }
  ],
  "mode": "parallel",
  "context": {
    "codebase": "...",
    "dependencies": ["react", "typescript"]
  }
}
```

**Response:**
```json
{
  "results": [
    {
      "taskId": "task-123",
      "agentType": "analyzer",
      "status": "completed",
      "output": "Análise completa...",
      "suggestions": ["Sugestão 1", "Sugestão 2"],
      "duration": 1234
    }
  ],
  "summary": "Execução de 2 agentes concluída...",
  "totalDuration": 2345,
  "successCount": 2,
  "errorCount": 0
}
```

#### Listar Agentes Disponíveis

```bash
GET /api/code-agents
```

**Response:**
```json
{
  "agents": [
    {
      "type": "analyzer",
      "name": "Analisador de Código",
      "description": "Analisa código e identifica problemas...",
      "available": true
    }
  ],
  "total": 8,
  "available": 7
}
```

## Estrutura de Arquivos

```
lib/
  agents/
    types.ts                    # Tipos e interfaces
    code-agents-manager.ts      # Gerenciador de agentes

app/
  api/
    code-agents/
      route.ts                  # API endpoints

components/
  code-agents-panel.tsx         # Interface do painel

app/
  code-agents/
    page.tsx                    # Página do sistema
```

## Configuração

### Variáveis de Ambiente

O sistema requer pelo menos uma das seguintes APIs de IA:

```env
# Anthropic (Claude) - Recomendado para análise crítica
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI (GPT-4) - Recomendado para geração de código
OPENAI_API_KEY=sk-...

# Google (Gemini) - Recomendado para documentação
GOOGLE_AI_API_KEY=...
```

### Seleção Automática de Modelos

O sistema seleciona automaticamente o melhor modelo para cada tipo de agente:

- **Agentes Críticos** (analyzer, refactor, bug-detector): Claude Sonnet 4
- **Agentes de Geração** (test-generator, component-generator, optimizer): GPT-4 Turbo
- **Agentes de Documentação** (documenter, validator): Gemini Flash

## Exemplos de Uso

### Exemplo 1: Análise Completa de Código

```typescript
const response = await fetch("/api/code-agents", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    tasks: [
      { agentType: "analyzer", input: code },
      { agentType: "bug-detector", input: code },
      { agentType: "validator", input: code },
    ],
    mode: "parallel",
  }),
})
```

### Exemplo 2: Refatoração e Otimização

```typescript
const response = await fetch("/api/code-agents", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    tasks: [
      { agentType: "refactor", input: code, priority: 1 },
      { agentType: "optimizer", input: code, priority: 2 },
      { agentType: "documenter", input: code, priority: 3 },
    ],
    mode: "orchestrated",
  }),
})
```

### Exemplo 3: Geração Completa de Componente

```typescript
const response = await fetch("/api/code-agents", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    tasks: [
      { agentType: "component-generator", input: requirements },
      { agentType: "test-generator", input: requirements },
      { agentType: "documenter", input: requirements },
    ],
    mode: "sequential",
  }),
})
```

## Rate Limiting

O sistema usa rate limiting para proteção:

- **HEAVY** (POST): 10 requisições por minuto
- **AUTHENTICATED** (GET): 60 requisições por minuto

## Segurança

- ✅ Autenticação obrigatória via Supabase
- ✅ Validação completa de inputs (Zod)
- ✅ Rate limiting
- ✅ Headers de segurança
- ✅ Tratamento de erros robusto

## Performance

- ⚡ Execução paralela para máxima eficiência
- 🔄 Fallback automático entre modelos de IA
- 📊 Métricas de performance (duração, sucesso, erros)
- 🎯 Priorização de tarefas no modo orquestrado

## Melhores Práticas

1. **Use Paralelo** para agentes independentes
2. **Use Sequencial** quando há dependências
3. **Use Orquestrado** para fluxos complexos
4. **Forneça Contexto** (codebase, dependências) para melhores resultados
5. **Selecione Agentes Específicos** em vez de executar todos
6. **Revise Sugestões** antes de aplicar mudanças

## Troubleshooting

### Agentes Indisponíveis

Se todos os agentes aparecem como indisponíveis:
1. Verifique se pelo menos uma API de IA está configurada
2. Verifique as variáveis de ambiente
3. Verifique os logs do servidor

### Erros de Execução

1. Verifique o formato do código de entrada
2. Verifique se o código não está muito longo (>4096 tokens)
3. Verifique os logs para detalhes do erro
4. Tente executar agentes individualmente

## Roadmap

- [ ] Suporte para mais linguagens (Python, Go, Rust)
- [ ] Cache de resultados de agentes
- [ ] Histórico de execuções
- [ ] Agendamento de tarefas
- [ ] Integração com CI/CD
- [ ] Agentes customizados pelo usuário
