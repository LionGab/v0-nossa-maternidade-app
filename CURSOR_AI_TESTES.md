# 🚀 Executar Testes no Cursor AI

## Como Usar

Agora você pode pedir diretamente no chat do Cursor AI para executar os testes. Use os comandos abaixo:

## Comandos Disponíveis no Chat

### Executar Todos os Testes

```
Execute todos os testes em paralelo
```

ou

```
Teste tudo usando o orquestrador
```

### Executar Testes por Prioridade

```
Execute apenas os testes de alta prioridade
```

```
Teste tudo que é crítico (high priority)
```

### Executar Testes Específicos

```
Execute testes de PWA
```

```
Teste a funcionalidade offline
```

```
Teste a performance e Core Web Vitals
```

```
Teste mobile-first e responsividade
```

```
Teste autenticação mobile
```

```
Teste o chat IA
```

```
Teste acessibilidade
```

### Executar Agente Específico

```
Execute o agente de performance
```

```
Execute o agente de PWA
```

```
Execute o agente de mobile-first
```

### Executar Workflow

```
Execute o workflow test-all-parallel
```

```
Execute o workflow test-priority-high
```

```
Execute o workflow test-pwa-mobile
```

## Exemplos de Uso

### Exemplo 1: Teste Completo
```
Execute todos os testes em paralelo e me mostre o relatório
```

### Exemplo 2: Teste Rápido
```
Execute apenas os testes críticos (high priority)
```

### Exemplo 3: Teste Específico
```
Teste a funcionalidade PWA: instalação, offline e cache
```

### Exemplo 4: Teste de Performance
```
Execute testes de performance e Core Web Vitals
```

### Exemplo 5: Teste de Mobile
```
Teste tudo relacionado a mobile-first e responsividade
```

## Integração com Claude Code CLI

O sistema usa automaticamente o Claude Code CLI quando você pede para executar testes. Os comandos são traduzidos para:

```bash
# Todos os testes
npm run test:all

# Testes de alta prioridade
npm run test:priority

# Testes específicos
npm run test:pwa
npm run test:mobile
npm run test:performance
```

## Como Funciona

1. Você pede no chat: "Execute todos os testes"
2. O sistema identifica o comando
3. Executa via `npm run test:all` ou `node scripts/test-orchestrator.mjs run`
4. Gera relatório em `test-results/report.json`
5. Mostra resultados no chat

## Comandos Alternativos

Você também pode usar variações:

- "Rode os testes"
- "Execute os testes"
- "Teste tudo"
- "Rode os testes de performance"
- "Teste PWA"
- "Verifique se os testes passam"

## Próximos Passos

Agora você pode simplesmente pedir no chat do Cursor AI para executar qualquer teste!
