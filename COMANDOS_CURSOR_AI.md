# 🎯 Comandos para Cursor AI

## Como Executar Testes no Chat do Cursor AI

Agora você pode pedir diretamente no chat do Cursor AI para executar os testes. Basta falar em português natural!

## Comandos Disponíveis

### Executar Todos os Testes

**No chat do Cursor AI, digite:**

```
Execute todos os testes em paralelo
```

ou

```
Rode todos os testes
```

ou

```
Teste tudo
```

**O que acontece:**
- Executa `npm run test:all`
- Roda todos os 11 agentes de teste em paralelo
- Gera relatório em `test-results/report.json`
- Mostra resultados no chat

### Executar Testes Críticos

```
Execute apenas os testes críticos
```

ou

```
Teste tudo que é de alta prioridade
```

**O que acontece:**
- Executa `npm run test:priority`
- Roda apenas testes de alta prioridade
- Mais rápido que executar tudo

### Executar Testes Específicos

#### Testes de PWA
```
Execute testes de PWA
```

ou

```
Teste PWA e Service Worker
```

#### Testes Mobile-First
```
Execute testes mobile-first
```

ou

```
Teste responsividade mobile
```

#### Testes de Performance
```
Execute testes de performance
```

ou

```
Teste Core Web Vitals
```

#### Testes de Autenticação
```
Execute testes de autenticação mobile
```

#### Testes de Chat IA
```
Execute testes do chat IA
```

#### Testes de Acessibilidade
```
Execute testes de acessibilidade
```

#### Testes Offline
```
Execute testes de funcionalidade offline
```

#### Testes de Edge Cases
```
Execute testes de edge cases
```

### Executar Workflow

```
Execute o workflow test-all-parallel
```

ou

```
Rode o workflow test-priority-high
```

## Exemplos de Conversação

### Exemplo 1: Teste Completo
**Você:** "Execute todos os testes em paralelo e me mostre o relatório"

**Sistema:** Executa todos os testes e mostra o relatório consolidado

### Exemplo 2: Teste Rápido
**Você:** "Execute apenas os testes críticos"

**Sistema:** Executa apenas testes de alta prioridade (mais rápido)

### Exemplo 3: Teste Específico
**Você:** "Teste a funcionalidade PWA: instalação, offline e cache"

**Sistema:** Executa testes de PWA relacionados

### Exemplo 4: Teste de Performance
**Você:** "Execute testes de performance e Core Web Vitals"

**Sistema:** Executa agente de performance

### Exemplo 5: Debug
**Você:** "Execute os testes de mobile-first com verbose"

**Sistema:** Executa testes mobile-first com output detalhado

## Comandos Alternativos (Variações)

O sistema reconhece várias variações dos comandos:

- "Execute" / "Rode" / "Teste" / "Roda"
- "todos" / "tudo" / "all"
- "testes" / "teste" / "tests"
- "paralelo" / "paralelamente"
- "críticos" / "alta prioridade" / "high priority"
- "PWA" / "pwa" / "Progressive Web App"
- "mobile" / "mobile-first" / "responsividade"
- "performance" / "Core Web Vitals" / "métricas"
- "autenticação" / "auth" / "login"
- "acessibilidade" / "a11y" / "WCAG"

## Como Funciona

1. Você pede no chat do Cursor AI em português natural
2. O sistema identifica o comando e traduz para:
   - `npm run test:all` (todos os testes)
   - `npm run test:priority` (alta prioridade)
   - `npm run test:pwa` (PWA)
   - `npm run test:mobile` (mobile-first)
   - `npm run test:performance` (performance)
   - Ou comandos diretos do orquestrador
3. Executa o comando via terminal
4. Mostra resultados no chat

## Execução via Terminal (Alternativa)

Se preferir, também pode executar via terminal:

```bash
# Todos os testes
npm run test:all

# Testes críticos
npm run test:priority

# Testes específicos
npm run test:pwa
npm run test:mobile
npm run test:performance

# Listar agentes
npm run test:list
```

## Integração com Claude Code CLI

O sistema também funciona com Claude Code CLI:

```bash
# Via CLI helper
node scripts/claude-cursor.mjs test:all
node scripts/claude-cursor.mjs test:priority
node scripts/claude-cursor.mjs test:pwa
node scripts/claude-cursor.mjs test:mobile
node scripts/claude-cursor.mjs test:performance
```

## Próximos Passos

Agora você pode simplesmente pedir no chat do Cursor AI para executar qualquer teste!

**Dica:** Use comandos em português natural, o sistema entende várias variações.
