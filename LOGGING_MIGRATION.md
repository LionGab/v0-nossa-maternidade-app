# Migração de Console.log para Logger Customizado

## Resumo

Este documento detalha a substituição de todos os `console.log/warn/error/info/debug` por loggers customizados estruturados no projeto.

## Objetivo

- Centralizar o sistema de logging
- Permitir integração futura com serviços de monitoramento (Sentry, Highlight.io)
- Melhorar rastreabilidade e debugging em produção
- Manter logs estruturados com contexto

## Arquivos Alterados

### Server-Side (lib/logger.ts)

#### 1. `lib/metadata.ts`
- **Antes**: `console.warn('generateMetadata: type é "article" mas article metadata não foi fornecido')`
- **Depois**: `logger.warn('generateMetadata: type é "article" mas article metadata não foi fornecido', { route, type })`
- **Impacto**: Logs estruturados com contexto de rota e tipo

#### 2. `proxy.ts` (Middleware)
- **Antes**: `console.error("Middleware: Error fetching profile", profileError)`
- **Depois**: `logger.error("Middleware: Error fetching profile", profileError as Error, { userId: user.id, pathname })`
- **Impacto**: Erros do middleware agora incluem contexto de usuário e pathname para debugging

#### 3. `lib/env.ts`
- **Antes**: Múltiplos `console.warn()`, `console.info()`, `console.log()`
- **Depois**:
  - `logger.warn('Missing required environment variables', { missing: missingRequired })`
  - `logger.info('Environment configuration loaded', { supabase, anthropic, openai, features })`
- **Impacto**: Logs de configuração estruturados e mais úteis para diagnóstico

#### 4. `lib/mcp/memory-manager.ts`
- **Antes**: 5x `console.error()` em diferentes métodos
- **Depois**: `logger.error()` com contexto específico em cada método:
  - `storeMemory`: inclui `userId`, `contentType`
  - `searchMemories`: inclui `userId`, `query`
  - `getMemoriesFromPeriod`: inclui `userId`, `daysAgo`
  - `getComprehensiveContext`: inclui `userId`, `currentQuery`
  - `generatePeriodSummary`: inclui `userId`, `startDate`, `endDate`
- **Impacto**: Erros do MemoryManager agora incluem contexto completo para debugging

### Client-Side (lib/logger-client.ts)

#### 5. `hooks/usePWA.ts`
- **Antes**:
  - `console.log('✅ Service Worker registrado:', registration)`
  - `console.error('❌ Erro ao registrar Service Worker:', error)`
  - `console.log('✅ PWA instalado com sucesso!')`
  - `console.log(`User response to install prompt: ${outcome}`)`
- **Depois**:
  - `clientLogger.info('Service Worker registrado', { scope, active })`
  - `clientLogger.error('Erro ao registrar Service Worker', error)`
  - `clientLogger.info('PWA instalado com sucesso')`
  - `clientLogger.info('User response to install prompt', { outcome })`
- **Impacto**: Logs de PWA estruturados e mais úteis para analytics

#### 6. `components/code-agents-panel.tsx`
- **Antes**:
  - `console.error("Erro ao carregar agentes:", error)`
  - `console.error("Erro ao executar agentes:", error)`
- **Depois**:
  - `clientLogger.error("Erro ao carregar agentes", error)`
  - `clientLogger.error("Erro ao executar agentes", error, { agentCount, mode })`
- **Impacto**: Erros incluem contexto de quantos agentes e modo de execução

#### 7. `components/multi-ai-chat.tsx`
- **Antes**: `console.error("MultiAIChat: Error sending message", error)`
- **Depois**: `clientLogger.error("MultiAIChat: Error sending message", error, { mode })`
- **Impacto**: Erros incluem modo de chat (empathetic/general/research)

#### 8. `components/error-boundary.tsx`
- **Antes**: `console.error("ErrorBoundary caught an error:", error, errorInfo)`
- **Depois**: `clientLogger.error("ErrorBoundary caught an error", error, { componentStack: errorInfo.componentStack })`
- **Impacto**: Erros capturados pelo ErrorBoundary incluem stack trace do componente

## Estatísticas

- **Total de arquivos alterados**: 8
- **Server-side**: 4 arquivos
- **Client-side**: 4 arquivos
- **Total de console.log/warn/error substituídos**: ~20+ instâncias

## Benefícios

1. **Logs Estruturados**: Todos os logs agora incluem contexto relevante (userId, pathname, query, etc.)
2. **Rastreabilidade**: Timestamps e níveis de log padronizados
3. **Preparação para Produção**: Sistema pronto para integração com serviços de monitoramento
4. **Debugging Melhorado**: Contexto adicional facilita identificação de problemas

## Próximos Passos: Integração com Monitoramento

### Opção 1: Sentry (Recomendado)

O projeto já tem configuração básica do Sentry (`sentry.*.config.ts`). Para integrar:

```typescript
// lib/logger.ts - Atualizar método error()
import * as Sentry from '@sentry/nextjs'

error(message: string, error?: Error, context?: LogContext) {
  // ... código existente ...

  // Em produção, enviar para Sentry
  if (!this.isDevelopment && error) {
    Sentry.captureException(error, {
      extra: context,
      tags: {
        logger: 'server',
      },
    })
  }
}
```

```typescript
// lib/logger-client.ts - Atualizar método error()
error(message: string, error?: Error | unknown, context?: LogContext) {
  // ... código existente ...

  // Em produção, enviar para Sentry
  if (typeof window !== 'undefined' && !this.isDevelopment && error) {
    Sentry.captureException(error, {
      extra: context,
      tags: {
        logger: 'client',
      },
    })
  }
}
```

**Configuração necessária**:
1. Adicionar `SENTRY_DSN` no `.env`
2. Verificar se `@sentry/nextjs` está instalado
3. Atualizar `sentry.*.config.ts` se necessário

### Opção 2: Highlight.io

Highlight.io oferece melhor experiência para debugging com replay de sessões:

```typescript
// Instalação
npm install @highlight-run/next

// lib/logger-client.ts
import { H } from '@highlight-run/next/client'

error(message: string, error?: Error | unknown, context?: LogContext) {
  // ... código existente ...

  if (typeof window !== 'undefined' && !this.isDevelopment && error) {
    H.consumeError(error instanceof Error ? error : new Error(String(error)), context)
  }
}
```

**Vantagens**:
- Session replay completo
- Logs de console integrados
- Performance monitoring
- Melhor para debugging UX

### Opção 3: Híbrido (Recomendado para Produção)

- **Sentry**: Para erros críticos e crash reporting
- **Highlight.io**: Para debugging UX e performance
- **Logger customizado**: Para logs estruturados internos

## Checklist de Integração

- [ ] Escolher serviço de monitoramento (Sentry ou Highlight.io)
- [ ] Configurar variáveis de ambiente (DSN/API keys)
- [ ] Atualizar `lib/logger.ts` para enviar erros em produção
- [ ] Atualizar `lib/logger-client.ts` para enviar erros em produção
- [ ] Testar captura de erros em ambiente de staging
- [ ] Configurar alertas (email/Slack) para erros críticos
- [ ] Documentar processo de debugging em produção
- [ ] Treinar equipe no uso das ferramentas de monitoramento

## Notas Importantes

1. **Logs em Desenvolvimento**: Todos os logs continuam aparecendo no console em desenvolvimento
2. **Logs em Produção**: Apenas erros são sempre logados; info/warn/debug são filtrados
3. **Contexto**: Sempre adicione contexto relevante aos logs para facilitar debugging
4. **Performance**: O logger customizado não impacta performance significativamente

## Referências

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Highlight.io Documentation](https://www.highlight.io/docs)
- Logger Server: `lib/logger.ts`
- Logger Client: `lib/logger-client.ts`
