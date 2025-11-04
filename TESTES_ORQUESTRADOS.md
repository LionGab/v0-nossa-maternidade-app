# 🚀 Testes Orquestrados em Paralelo - Nossa Maternidade

## Visão Geral

Sistema de execução de testes paralelos usando agentes independentes. Cada agente executa uma suíte de testes específica em paralelo, maximizando eficiência e velocidade.

## Como Usar

### Executar Todos os Testes em Paralelo

```bash
# Via npm script
npm run test:all

# Via orquestrador direto
node scripts/test-orchestrator.mjs run

# Via workflow Claude Code
npm run orchestrate run test-all-parallel
```

### Executar Testes por Prioridade

```bash
# Apenas testes de alta prioridade
npm run test:priority

# Apenas testes de média prioridade
node scripts/test-orchestrator.mjs run --priority medium

# Apenas testes de baixa prioridade
node scripts/test-orchestrator.mjs run --priority low
```

### Executar Testes Específicos

```bash
# Testes de PWA
npm run test:pwa

# Testes Mobile-First
npm run test:mobile

# Testes de Performance
npm run test:performance

# Testes de Autenticação
node scripts/test-orchestrator.mjs run --filter auth

# Testes de Chat IA
node scripts/test-orchestrator.mjs run --filter chat-ia
```

### Executar um Agente Específico

```bash
# Executar apenas agente de performance
node scripts/test-orchestrator.mjs agent performance --verbose

# Executar apenas agente de PWA
node scripts/test-orchestrator.mjs agent pwa --verbose
```

### Executar Sequencialmente (Debug)

```bash
# Executar todos os testes em sequência
node scripts/test-orchestrator.mjs sequential

# Executar sequencialmente com verbose
node scripts/test-orchestrator.mjs sequential --verbose
```

### Listar Agentes Disponíveis

```bash
npm run test:list
# ou
node scripts/test-orchestrator.mjs list
```

## Agentes de Teste

### 1. Performance & Core Web Vitals
- **ID**: `performance`
- **Prioridade**: Alta
- **Arquivo**: `e2e/performance.spec.ts`
- **Descrição**: Testa métricas de performance, LCP, FID, CLS, TTI
- **Timeout**: 60s

### 2. PWA & Service Worker
- **ID**: `pwa`
- **Prioridade**: Alta
- **Arquivo**: `e2e/mobile-first-pwa.spec.ts`
- **Suite**: `Fase 1: Fundação Mobile-First`
- **Descrição**: Testa instalação PWA, Service Worker, offline, cache
- **Timeout**: 90s

### 3. Mobile-First & Responsividade
- **ID**: `mobile-first`
- **Prioridade**: Alta
- **Arquivo**: `e2e/mobile-first-pwa.spec.ts`
- **Suite**: `Fase 2: Fluxo Crítico do Usuário`
- **Descrição**: Testa responsividade, touch targets, mobile navigation
- **Timeout**: 60s

### 4. Autenticação Mobile
- **ID**: `auth`
- **Prioridade**: Alta
- **Arquivo**: `e2e/browser-auth.spec.ts`
- **Descrição**: Testa login/signup mobile, validação, feedback visual
- **Timeout**: 60s

### 5. Chat IA & Features Core
- **ID**: `chat-ia`
- **Prioridade**: Média
- **Arquivo**: `e2e/mobile-first-pwa.spec.ts`
- **Suite**: `Fase 3: Features Core com IA`
- **Descrição**: Testa chat NathAI, streaming, timeout, respostas concisas
- **Timeout**: 120s

### 6. Features Secundárias
- **ID**: `features`
- **Prioridade**: Média
- **Arquivo**: `e2e/mobile-first-pwa.spec.ts`
- **Suite**: `Fase 4: Features Secundárias`
- **Descrição**: Testa Mundo Nath, Autocuidado, Rotina, Histórias
- **Timeout**: 90s

### 7. PWA Offline & Cache
- **ID**: `offline`
- **Prioridade**: Alta
- **Arquivo**: `e2e/mobile-first-pwa.spec.ts`
- **Suite**: `Fase 5: PWA Avançado`
- **Descrição**: Testa funcionalidade offline, cache, sync
- **Timeout**: 60s

### 8. Acessibilidade & UX
- **ID**: `accessibility`
- **Prioridade**: Alta
- **Arquivo**: `e2e/mobile-first-pwa.spec.ts`
- **Suite**: `Fase 6: Acessibilidade e UX`
- **Descrição**: Testa ARIA labels, contraste WCAG, navegação teclado
- **Timeout**: 60s

### 9. Edge Cases & Robustez
- **ID**: `edge-cases`
- **Prioridade**: Média
- **Arquivo**: `e2e/mobile-first-pwa.spec.ts`
- **Suite**: `Fase 7: Edge Cases e Robustez`
- **Descrição**: Testa error handling, timeouts, navegação, estado
- **Timeout**: 60s

### 10. Rotina Semanal
- **ID**: `rotina`
- **Prioridade**: Média
- **Arquivo**: `e2e/rotina-mobile-first.spec.ts`
- **Descrição**: Testa página de rotina, categorias, botões, filtros
- **Timeout**: 60s

### 11. Testes Completos
- **ID**: `complete`
- **Prioridade**: Baixa
- **Arquivo**: `e2e/browser-complete.spec.ts`
- **Descrição**: Testes gerais de navegação, estrutura, integração
- **Timeout**: 120s

## Workflows Claude Code

### test-all-parallel
Executa todos os testes em paralelo e gera relatório consolidado.

```bash
npm run orchestrate run test-all-parallel
```

### test-priority-high
Executa apenas testes de alta prioridade.

```bash
npm run orchestrate run test-priority-high
```

### test-pwa-mobile
Executa testes específicos de PWA e Mobile-First.

```bash
npm run orchestrate run test-pwa-mobile
```

### test-performance
Executa testes de performance e gera relatório.

```bash
npm run orchestrate run test-performance
```

## Opções de Execução

### Modo Verbose
Mostra output detalhado de cada agente.

```bash
node scripts/test-orchestrator.mjs run --verbose
```

### Navegador Específico
Executa testes em um navegador específico.

```bash
node scripts/test-orchestrator.mjs run --browser chromium
node scripts/test-orchestrator.mjs run --browser firefox
node scripts/test-orchestrator.mjs run --browser webkit
```

### Filtrar por Nome
Executa apenas agentes que correspondem ao filtro.

```bash
node scripts/test-orchestrator.mjs run --filter pwa
node scripts/test-orchestrator.mjs run --filter mobile
```

## Relatórios

Os relatórios são salvos automaticamente em `test-results/report.json` após cada execução.

### Estrutura do Relatório

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "duration": 123456,
  "agents": 11,
  "successful": 10,
  "failed": 1,
  "results": {
    "successful": [...],
    "failed": [...]
  },
  "options": {...}
}
```

## Integração com Claude Code CLI

Você pode usar o Claude Code CLI para executar testes via `/ide`:

```
/ide Execute todos os testes em paralelo usando o orquestrador
```

Ou via workflow:

```
/ide Execute o workflow test-all-parallel
```

## Vantagens da Execução Paralela

1. **Velocidade**: Testes executam em paralelo, reduzindo tempo total
2. **Isolamento**: Cada agente é independente, falhas não afetam outros
3. **Flexibilidade**: Execute apenas o que precisa
4. **Relatórios**: Relatório consolidado de todos os testes
5. **Integração**: Funciona com Claude Code CLI e workflows

## Troubleshooting

### Testes falhando
Execute com `--verbose` para ver detalhes:

```bash
node scripts/test-orchestrator.mjs run --verbose
```

### Testes muito lentos
Execute apenas testes de alta prioridade:

```bash
npm run test:priority
```

### Erro ao executar
Verifique se o Playwright está instalado:

```bash
npx playwright install
```

### Limpar resultados anteriores
```bash
rm -rf test-results/
```

## Próximos Passos

1. Adicionar mais agentes conforme necessário
2. Integrar com CI/CD
3. Adicionar notificações (Slack, email)
4. Criar dashboard de testes
5. Adicionar métricas de cobertura

