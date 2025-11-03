# 🤖 PROMPTS PARA ASSISTENTES IA - Implementação das Melhorias

**Projeto:** Nossa Maternidade PWA
**Última auditoria:** 2025-11-03
**Branch:** `claude/audit-pwa-app-011CUkeqiytGAY9hJnwJXV93`

---

## 🎯 QUAL ASSISTENTE USAR?

Após análise profunda, recomendo:

### 🥇 OPÇÃO 1: Claude Code (Claude Sonnet 4.5) - **RECOMENDADO**

**Por quê?**
- ✅ Já conhece todo o projeto (fez a auditoria)
- ✅ Excelente para tarefas multi-arquivo complexas
- ✅ Context window de 200k tokens
- ✅ Especialista em Next.js + React + TypeScript
- ✅ Pode ler, editar, testar e commitar tudo
- ✅ Integrado com git

**Melhor para:**
- Implementações grandes (SEO completo, testes, acessibilidade)
- Refatorações estruturais
- Tarefas que envolvem 5+ arquivos
- Análises complexas

**Custo:** Incluído na assinatura Claude Pro

---

### 🥈 OPÇÃO 2: Cursor 2.0 (Claude Sonnet 3.5 integrado)

**Por quê?**
- ✅ Interface VSCode familiar
- ✅ Edição inline super rápida
- ✅ Bom para iterações rápidas
- ✅ Composer mode para múltiplos arquivos
- ✅ Aceita @web para research

**Melhor para:**
- Quick wins (loading states, error pages)
- Refinamentos pontuais
- Debugging específico
- Implementações isoladas (1-3 arquivos)

**Custo:** $20/mês

---

### ❌ NÃO RECOMENDADO PARA ESTE PROJETO:

- **ChatGPT o1/Codex**: Mais lento, menos especializado em código web
- **Gemini 2.5 Pro**: Ainda imaturo para coding, pode alucinar
- **Copilot Pro**: Melhor para autocompletar, não para tasks complexas

---

## 📋 PROMPTS OTIMIZADOS POR TAREFA

---

## 🔴 PRIORIDADE 1: SEO COMPLETO (5h, $0, ROI ⭐⭐⭐⭐⭐)

### Para Claude Code:

```markdown
--ultrathink

Você é um especialista em SEO e Next.js 16. Seu objetivo é implementar SEO completo para o projeto "Nossa Maternidade PWA".

CONTEXTO:
- Projeto: Next.js 16 + React 19 + TypeScript 5.7
- 19 páginas existentes (lista no ROADMAP-TO-PERFECTION.md)
- Deployment: Netlify
- Domínio: nossamaternidade.netlify.app
- Público: Mães brasileiras (pt-BR)
- Palavras-chave: maternidade, pós-parto, IA maternal, NathAI, apoio emocional mães

TAREFAS A IMPLEMENTAR:

1. Criar robots.txt em public/
   - Permitir todos os crawlers
   - Disallow /api/
   - Incluir sitemap

2. Criar app/sitemap.ts (sitemap dinâmico Next.js 16)
   - Incluir todas as 19 páginas
   - lastModified dinâmico
   - changeFrequency apropriado
   - priority por importância

3. Adicionar Open Graph metadata em TODAS as páginas:
   - title, description otimizados para SEO
   - og:image (criar depois)
   - og:type = website
   - twitter:card = summary_large_image
   - locale = pt_BR

4. Adicionar metadata base no layout.tsx:
   - metadataBase
   - alternates.canonical
   - robots (index: true, follow: true)
   - verificação estruturada

5. Otimizar titles e descriptions por página:
   - Landing: "Nossa Maternidade - Apoio IA para Mães | Suporte Emocional 24/7"
   - Chat: "Chat NathAI - Assistente Maternal com Inteligência Artificial"
   - Dashboard: "Diário Maternal - Acompanhe sua Jornada na Maternidade"
   - (etc para todas)

6. Criar lista de keywords por página

REQUISITOS:
- Seguir padrões Next.js 16 (app router)
- TypeScript strict
- SEO keywords brasileiros (pt-BR)
- Verificar que não quebra build

OUTPUT ESPERADO:
- Arquivos criados/modificados com código completo
- Lista de páginas com metadata implementada
- Teste: npm run build deve passar
- Commit: "feat: implementa SEO completo com sitemap e Open Graph"

ANÁLISE PROFUNDA:
Pense cuidadosamente sobre:
1. Quais keywords são mais importantes para mães brasileiras?
2. Como estruturar descriptions para maximizar CTR?
3. Qual changeFrequency é apropriado para cada tipo de página?
4. Como garantir que Google indexe bem páginas dinâmicas?

Execute tudo de forma metódica e commit ao final.
```

---

### Para Cursor 2.0:

```markdown
Implementar SEO completo para projeto Next.js 16 PWA maternal.

Tasks:
1. robots.txt em public/
2. app/sitemap.ts dinâmico com 19 páginas
3. Open Graph em todas as páginas (title, description, og:image, twitter:card)
4. Metadata base no layout.tsx
5. Otimizar titles/descriptions SEO-friendly (pt-BR, keywords: maternidade, IA, pós-parto)

Páginas principais:
- / (landing)
- /chat (NathAI)
- /dashboard (diário)
- /onboarding
- /receitas
- (ver lista completa no código)

Requisitos:
- TypeScript strict
- Next.js 16 app router patterns
- locale pt_BR
- Build deve passar

@web buscar best practices Next.js 16 SEO
```

---

## 🔴 PRIORIDADE 2: ERROR TRACKING (2h, $0, ROI ⭐⭐⭐⭐⭐)

### Para Claude Code:

```markdown
--ultrathink

Você é um especialista em observabilidade e error tracking. Seu objetivo é implementar Highlight.io (grátis) no projeto "Nossa Maternidade PWA".

CONTEXTO:
- Projeto: Next.js 16 + React 19 + TypeScript 5.7
- Deployment: Netlify
- Necessidade: Capturar erros em produção + session replay
- Orçamento: $0 (usar tier gratuito Highlight.io)

ANÁLISE PROFUNDA:
Antes de implementar, considere:
1. Highlight.io vs Sentry: Por que Highlight para este projeto?
   - Grátis até 1k sessões
   - Session replay incluído
   - Console logs capturados
   - Menos setup que Sentry

2. Quais erros são críticos para este app?
   - Falhas em API calls (multi-AI)
   - Erros no chat (experiência principal)
   - Problemas de autenticação Supabase
   - Service Worker registration failures

3. Como integrar sem impactar performance?
   - Lazy load do script
   - Apenas em produção
   - Evitar PII (dados sensíveis de mães)

TAREFAS A IMPLEMENTAR:

1. Instalar Highlight.io:
   ```bash
   npm install --save @highlight-run/next
   ```

2. Criar lib/highlight.ts:
   - Inicialização com Next.js 16
   - Configurar projectId (criar conta Highlight)
   - enableStrictPrivacy: true (LGPD compliance)
   - Exportar H

3. Integrar no app/layout.tsx:
   - Adicionar <HighlightInit />
   - Apenas em produção (process.env.NODE_ENV)
   - Envolver com error boundary

4. Adicionar error tracking em pontos críticos:
   - app/api/chat-with-memory/route.ts
   - app/api/multi-ai/*/route.ts
   - components/multi-ai-chat.tsx
   - hooks/usePWA.ts

5. Configurar no Netlify:
   - Env var: NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID

6. Substituir TODOs no error-boundary.tsx:
   - Integrar com Highlight para enviar errors

7. Criar documentação em /docs/monitoring.md:
   - Como acessar dashboard
   - Como debugar com session replay
   - Exemplos de erros comuns

REQUISITOS:
- NUNCA logar dados sensíveis (mensagens do chat, emails, etc)
- enableStrictPrivacy: true
- Compliance com LGPD
- Performance: < 50ms overhead
- TypeScript strict

OUTPUT ESPERADO:
- Highlight.io funcionando em produção
- Errors sendo capturados
- Session replay ativo
- Dashboard acessível
- Commit: "feat: adiciona error tracking com Highlight.io"

Execute com atenção à privacidade e performance.
```

---

### Para Cursor 2.0:

```markdown
Implementar Highlight.io para error tracking.

Steps:
1. npm install @highlight-run/next
2. Criar lib/highlight.ts com init config
3. Integrar em app/layout.tsx (apenas produção)
4. Adicionar H.consumeError() nos try-catches:
   - app/api/chat-with-memory
   - components/multi-ai-chat.tsx
   - hooks/usePWA.ts
5. Config no Netlify: NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID

Importante:
- enableStrictPrivacy: true (LGPD)
- Não logar dados sensíveis
- Lazy load em produção

@web docs Highlight.io Next.js 16 setup
```

---

## 🟡 PRIORIDADE 3: ACESSIBILIDADE WCAG AA (8h, $0, ROI ⭐⭐⭐⭐)

### Para Claude Code:

```markdown
--ultrathink

Você é um especialista em acessibilidade web (WCAG 2.1 AA) e Next.js. Seu objetivo é tornar "Nossa Maternidade PWA" totalmente acessível para mães com deficiências.

CONTEXTO:
- Projeto: PWA maternal para mães brasileiras
- Público-alvo inclui: mães com deficiência visual, motora, cognitiva
- Status atual: 7 aria-labels apenas
- Meta: WCAG 2.1 AA compliance (Lighthouse Accessibility > 95)

ANÁLISE PROFUNDA:
Considere profundamente:
1. Por que acessibilidade é crítica para este projeto?
   - Depressão pós-parto pode causar fadiga cognitiva
   - Mães podem ter deficiências temporárias (lesão, cirurgia)
   - Inclusão é valor fundamental da maternidade

2. Quais são as barreiras mais comuns?
   - Botões sem labels
   - Imagens sem alt
   - Contraste de cores insuficiente
   - Navegação por teclado quebrada
   - Forms sem labels associadas

3. Como testar efetivamente?
   - Lighthouse audit
   - axe DevTools
   - Screen reader (NVDA/VoiceOver)
   - Navegação apenas por teclado

TAREFAS A IMPLEMENTAR:

FASE 1 - AUDITORIA (30 min)
1. Rodar Lighthouse em todas as páginas principais
2. Instalar axe DevTools extension
3. Listar top 10 problemas por severidade
4. Priorizar correções por impacto

FASE 2 - CORREÇÕES ESTRUTURAIS (3h)
1. Adicionar Skip Links no layout.tsx:
   ```tsx
   <a href="#main-content" className="sr-only focus:not-sr-only">
     Pular para conteúdo principal
   </a>
   ```

2. Corrigir hierarquia de headings:
   - Toda página deve ter h1
   - Não pular níveis (h1 → h3)
   - Estrutura lógica

3. Adicionar landmarks ARIA:
   - <header role="banner">
   - <nav role="navigation" aria-label="Menu principal">
   - <main id="main-content" role="main">
   - <footer role="contentinfo">

4. Corrigir forms (TODOS):
   - Associar <Label htmlFor> com <Input id>
   - Adicionar aria-invalid em erros
   - Mensagens de erro com aria-live

5. Melhorar botões e links:
   - Todos devem ter aria-label descritivo
   - Estados focus visíveis
   - Mínimo 44x44px (touch target)

FASE 3 - COMPONENTES INTERATIVOS (2h)
1. Chat (/app/chat):
   - Input com aria-label="Digite sua mensagem para NathAI"
   - Mensagens com role="log" aria-live="polite"
   - Loading state com aria-busy

2. Dashboard (/app/dashboard):
   - Botão adicionar: aria-label="Adicionar nova entrada no diário"
   - Cards com aria-labelledby
   - Navegação de datas acessível

3. Modais/Dialogs:
   - Verificar que shadcn/ui Dialog tem role="dialog"
   - Focus trap implementado
   - ESC para fechar
   - Focus retorna ao trigger

FASE 4 - CONTRASTE E CORES (1h)
1. Verificar contraste mínimo 4.5:1:
   - Usar WebAIM Contrast Checker
   - Cores do tema em globals.css
   - Corrigir cores que falharem

2. Não depender apenas de cor:
   - Estados de erro com ícones
   - Sucesso com checkmark
   - Loading com spinner + texto

FASE 5 - IMAGENS E MÍDIA (1h)
1. Alt text descritivo em TODAS as imagens:
   - Decorativas: alt=""
   - Funcionais: alt descritivo
   - Logo: alt="Nossa Maternidade"

2. Ícones:
   - Se clicáveis: aria-label
   - Se decorativos: aria-hidden="true"

FASE 6 - TECLADO E FOCUS (1h)
1. Testar navegação por Tab:
   - Ordem lógica
   - Todos os interativos alcançáveis
   - Skip links funcionando

2. Estados focus visíveis:
   - outline: 2px solid var(--ring)
   - Nunca outline: none sem alternativa

3. Atalhos de teclado importantes:
   - Chat: Ctrl+/ para focus no input
   - Dashboard: N para nova entrada

FASE 7 - TESTES (30 min)
1. Lighthouse: > 95 em Accessibility
2. axe DevTools: 0 issues críticas
3. Screen reader: Testar fluxos principais
4. Teclado: Navegação completa

REQUISITOS:
- Manter design visual intacto
- Performance não pode degradar
- TypeScript strict
- Documentar decisões no código
- Criar docs/accessibility.md

OUTPUT ESPERADO:
- WCAG 2.1 AA compliant
- Lighthouse Accessibility > 95
- Todos os fluxos críticos acessíveis
- Documentação completa
- Commit: "feat: implementa acessibilidade WCAG 2.1 AA completa"

ATENÇÃO ESPECIAL:
Este é um app para mães em momentos vulneráveis. Acessibilidade não é "nice to have", é ESSENCIAL.

Execute com empatia e rigor técnico.
```

---

### Para Cursor 2.0:

```markdown
Melhorar acessibilidade WCAG 2.1 AA no app.

Fase 1 - Auditoria:
1. Lighthouse em 5 páginas principais
2. Listar top issues

Fase 2 - Correções:
1. Skip links no layout
2. aria-labels em botões sem texto
3. alt text em todas as imagens
4. Associar labels com inputs (htmlFor/id)
5. Focus states visíveis
6. Contraste 4.5:1 mínimo

Páginas críticas:
- /chat (principal)
- /dashboard
- /onboarding

Testar com:
- Lighthouse (> 95)
- Navegação por Tab
- Screen reader (se possível)

@web WCAG 2.1 AA checklist
```

---

## 🟡 PRIORIDADE 4: PERFORMANCE + LAZY LOADING (4h, $0, ROI ⭐⭐⭐⭐)

### Para Claude Code:

```markdown
--ultrathink

Você é um especialista em performance web e otimização Next.js. Seu objetivo é reduzir o First Load JS em 30% através de lazy loading e code splitting.

CONTEXTO:
- Projeto: Next.js 16 + React 19 + TypeScript 5.7
- Build atual: 87MB (.next)
- Meta: First Load JS < 200KB, TTI < 3s
- Estratégia: Lazy loading de componentes pesados

ANÁLISE PROFUNDA:
1. Quais componentes são os mais pesados?
   - Recharts (gráficos) ~200KB
   - Componentes AI (multi-provider)
   - Calendar components
   - Code editors (se existirem)

2. Quando lazy loading NÃO deve ser usado?
   - Above the fold content
   - Componentes críticos para FCP
   - Componentes pequenos (< 20KB)

3. Como medir impacto?
   - Antes: npm run build (anotar sizes)
   - Depois: npm run build (comparar)
   - Lighthouse antes/depois

TAREFAS A IMPLEMENTAR:

FASE 1 - ANÁLISE DO BUNDLE (30 min)
1. Instalar bundle analyzer:
   ```bash
   npm install --save-dev @next/bundle-analyzer
   ```

2. Configurar next.config.mjs:
   ```js
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   })
   module.exports = withBundleAnalyzer(nextConfig)
   ```

3. Rodar análise:
   ```bash
   ANALYZE=true npm run build
   ```

4. Identificar top 5 maiores imports

FASE 2 - LAZY LOAD COMPONENTES PESADOS (2h)

1. MultiAIChat (app/chat):
   ```tsx
   const MultiAIChat = dynamic(() => import('@/components/multi-ai-chat'), {
     loading: () => <ChatSkeleton />,
     ssr: false
   })
   ```

2. CodeAgentsPanel (app/code-agents):
   ```tsx
   const CodeAgentsPanel = dynamic(() => import('@/components/code-agents-panel'), {
     loading: () => <Skeleton className="h-screen" />,
     ssr: false
   })
   ```

3. Recharts (se usado em dashboard):
   ```tsx
   const Chart = dynamic(() => import('@/components/chart'), {
     loading: () => <Skeleton className="h-[400px]" />,
     ssr: false
   })
   ```

4. Calendar/DatePicker (onde usado):
   ```tsx
   import dynamic from 'next/dynamic'
   const Calendar = dynamic(() => import('@/components/ui/calendar'))
   ```

FASE 3 - OTIMIZAR IMPORTS (1h)

1. Lucide React icons:
   ```tsx
   // ❌ Ruim
   import { Calendar, Send, Heart } from 'lucide-react'

   // ✅ Bom
   import Calendar from 'lucide-react/dist/esm/icons/calendar'
   import Send from 'lucide-react/dist/esm/icons/send'
   ```

2. Criar helper lib/icons.ts se muitos ícones

3. Verificar tree-shaking em shadcn/ui components

FASE 4 - SUSPENSE BOUNDARIES (30 min)

1. Envolver componentes críticos:
   ```tsx
   <Suspense fallback={<ChatSkeleton />}>
     <ChatComponent />
   </Suspense>
   ```

2. Múltiplos Suspense por página (granular)

FASE 5 - PREFETCH ESTRATÉGICO (30 min)

1. Links críticos com prefetch:
   ```tsx
   <Link href="/chat" prefetch={true}>Chat</Link>
   ```

2. Outros links sem prefetch:
   ```tsx
   <Link href="/settings" prefetch={false}>Config</Link>
   ```

FASE 6 - MEDIÇÕES (30 min)

1. Lighthouse antes/depois:
   - Performance score
   - First Contentful Paint
   - Time to Interactive
   - Total Blocking Time

2. Bundle size antes/depois:
   - First Load JS
   - Per-page bundle sizes

3. Documentar ganhos

REQUISITOS:
- Não quebrar funcionalidades
- Loading states sempre visíveis
- TypeScript strict
- Build deve passar

OUTPUT ESPERADO:
- First Load JS reduzido em 30%
- TTI < 3s
- Lighthouse Performance > 90
- Bundle analyzer report documentado
- Commit: "perf: implementa lazy loading e reduz bundle em 30%"

MÉTRICAS ESPERADAS:
- Before: First Load JS ~250KB
- After: First Load JS ~175KB
- Saving: ~75KB (30%)

Execute com foco em métricas mensuráveis.
```

---

### Para Cursor 2.0:

```markdown
Otimizar performance com lazy loading.

Steps:
1. Instalar @next/bundle-analyzer
2. Analisar bundle: ANALYZE=true npm run build
3. Lazy load componentes pesados:
   - MultiAIChat (ssr: false)
   - CodeAgentsPanel
   - Recharts/Charts
   - Calendar

4. Otimizar imports lucide-react:
   - Individual imports ao invés de barrel

5. Adicionar Suspense com skeletons

6. Medir com Lighthouse antes/depois

Target: -30% First Load JS

@web Next.js 16 dynamic imports best practices
```

---

## 🟢 PRIORIDADE 5: TESTES E2E (12h, $0, ROI ⭐⭐⭐⭐)

### Para Claude Code:

```markdown
--ultrathink

Você é um especialista em testes automatizados com Playwright. Seu objetivo é criar uma suite robusta de testes E2E para os fluxos críticos do app.

CONTEXTO:
- Projeto: PWA maternal com 19 páginas
- Framework: Playwright (já instalado)
- Status atual: 1 teste E2E básico
- Meta: 15+ testes cobrindo fluxos críticos

ANÁLISE PROFUNDA:
1. Quais fluxos são críticos para o negócio?
   - Signup → Onboarding → Dashboard (funnel conversão)
   - Chat com IA (feature principal)
   - Criar entrada no diário
   - PWA installation
   - Offline mode

2. Como garantir testes estáveis (não flaky)?
   - Esperas explícitas (waitFor)
   - Data-testid ao invés de selectors frágeis
   - Estado limpo entre testes
   - Mocks de APIs externas

3. Como integrar no CI/CD?
   - GitHub Actions
   - Rodar em pull requests
   - Screenshots em failures
   - Vídeos de testes

TAREFAS A IMPLEMENTAR:

FASE 1 - SETUP (1h)

1. Configurar playwright.config.ts:
   - baseURL: http://localhost:3000
   - 3 browsers: chromium, firefox, webkit
   - screenshots on failure
   - video on first retry
   - timeout: 30s

2. Criar fixtures helpers:
   - e2e/fixtures/auth.ts (login helper)
   - e2e/fixtures/database.ts (limpar DB)
   - e2e/fixtures/intercept.ts (mock APIs)

3. Adicionar data-testid nos componentes críticos:
   - Buttons de signup/login
   - Inputs de forms
   - Chat input/send

FASE 2 - TESTES DE AUTENTICAÇÃO (2h)

1. e2e/auth/signup.spec.ts:
   - Signup com sucesso
   - Signup com email duplicado
   - Validação de senha fraca
   - Redirecionamento para onboarding

2. e2e/auth/login.spec.ts:
   - Login com sucesso
   - Login com credenciais inválidas
   - Esqueci senha
   - Persistência de sessão

FASE 3 - TESTES DE ONBOARDING (2h)

1. e2e/onboarding/flow.spec.ts:
   - Fluxo completo step-by-step
   - Validação de campos obrigatórios
   - Voltar/Avançar funcionando
   - Salvar profile ao final
   - Redirecionamento para dashboard

FASE 4 - TESTES DO CHAT IA (3h)

1. e2e/chat/basic.spec.ts:
   - Enviar mensagem e receber resposta
   - Streaming de resposta funciona
   - Histórico persistido
   - Sugestões de perguntas clicáveis

2. e2e/chat/multimodal.spec.ts (se aplicável):
   - Upload de imagem (se houver)
   - Diferentes modos (empático, técnico)

3. Mock da API Claude:
   - Usar playwright route.fulfill()
   - Resposta fixa para testes consistentes

FASE 5 - TESTES DO DASHBOARD (2h)

1. e2e/dashboard/diary.spec.ts:
   - Criar nova entrada
   - Editar entrada existente
   - Deletar entrada
   - Filtros funcionando
   - Mood tracking

2. e2e/dashboard/stats.spec.ts:
   - Gráficos carregam
   - Dados corretos exibidos

FASE 6 - TESTES PWA (2h)

1. e2e/pwa/install.spec.ts:
   - Manifest acessível
   - Service Worker registra
   - Install prompt aparece (complexo)
   - Ícones corretos

2. e2e/pwa/offline.spec.ts:
   - Funciona offline (simular)
   - Cache serving
   - Sync quando volta online

FASE 7 - CI/CD INTEGRATION (1h)

1. Criar .github/workflows/e2e.yml:
   ```yaml
   name: E2E Tests
   on: [pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
         - run: npm ci --legacy-peer-deps
         - run: npx playwright install --with-deps
         - run: npm run build
         - run: npm run test:e2e
         - uses: actions/upload-artifact@v3
           if: failure()
           with:
             name: playwright-report
   ```

2. Configurar secrets no GitHub

REQUISITOS:
- Testes devem ser determinísticos
- Tempo total < 10 minutos
- Cobertura > 80% dos fluxos críticos
- Screenshots em failures
- Documentar em docs/testing.md

OUTPUT ESPERADO:
- 15+ testes E2E robustos
- CI/CD com gate de qualidade
- Relatórios HTML do Playwright
- Documentação completa
- Commit: "test: adiciona suite completa de testes E2E"

Execute com foco em estabilidade e manutenibilidade.
```

---

### Para Cursor 2.0:

```markdown
Criar testes E2E com Playwright.

Fluxos críticos:
1. Signup → Onboarding → Dashboard
2. Login e logout
3. Chat: enviar mensagem e receber resposta
4. Dashboard: criar/editar/deletar entrada
5. PWA: service worker registra

Estrutura:
- e2e/auth/signup.spec.ts
- e2e/auth/login.spec.ts
- e2e/onboarding/flow.spec.ts
- e2e/chat/basic.spec.ts
- e2e/dashboard/diary.spec.ts
- e2e/pwa/install.spec.ts

Setup:
- playwright.config.ts (3 browsers)
- fixtures para auth
- data-testid nos elementos críticos

CI/CD:
- .github/workflows/e2e.yml
- Rodar em PRs

@web Playwright Next.js 16 best practices
```

---

## 🚀 QUICK WINS (1-2h total, faça HOJE)

### Para Claude Code ou Cursor:

```markdown
Implementar quick wins de UX em 2 horas.

Tasks:
1. Adicionar loading.tsx em todas as páginas:
   - app/chat/loading.tsx
   - app/dashboard/loading.tsx
   - app/onboarding/loading.tsx
   - (todas as 19)
   - Usar <Skeleton /> apropriado

2. Adicionar error.tsx em todas as páginas:
   - Template padrão com reset
   - Mensagem amigável

3. Adicionar metadata completa no layout.tsx:
   - metadataBase
   - alternates.canonical
   - robots

4. Criar favicons faltando:
   - 32x32
   - 16x16
   - apple-touch-icon

5. Melhorar estados loading do chat:
   - Skeleton para mensagens
   - Indicador de typing

Tempo estimado: 2h
ROI: ⭐⭐⭐⭐ UX imediatamente melhor

Execute rapidamente e commit.
```

---

## 📊 COMO USAR ESTES PROMPTS

### 🎯 Estratégia Recomendada:

#### Semana 1:
1. **Claude Code**: SEO Completo (5h)
2. **Claude Code**: Error Tracking (2h)
3. **Cursor**: Quick Wins (2h)

#### Semana 2:
4. **Claude Code**: Acessibilidade (8h)
5. **Claude Code**: Performance (4h)

#### Semana 3-4:
6. **Claude Code**: Testes E2E (12h)

### 💡 Dicas de Uso:

**Com Claude Code (Terminal):**
```bash
# Cole o prompt completo e ele vai:
# 1. Analisar profundamente (--ultrathink)
# 2. Implementar todos os arquivos
# 3. Testar (npm run build)
# 4. Commitar automaticamente
```

**Com Cursor (IDE):**
```
# No Cursor Composer (Cmd+K):
# 1. Cole o prompt
# 2. Selecione arquivos relevantes
# 3. Revise mudanças inline
# 4. Aceite/rejeite por arquivo
# 5. Commit manual
```

---

## 🎯 PROMPT UNIVERSAL (Para qualquer tarefa)

```markdown
--ultrathink

Contexto do projeto:
- Nome: Nossa Maternidade PWA
- Tech: Next.js 16 + React 19 + TypeScript 5.7
- Deploy: Netlify
- Público: Mães brasileiras (pt-BR)
- Branch: claude/audit-pwa-app-011CUkeqiytGAY9hJnwJXV93

Você é um especialista em [ÁREA]. Seu objetivo é [TAREFA ESPECÍFICA].

ANÁLISE PROFUNDA (--ultrathink):
Antes de implementar, considere:
1. [Pergunta estratégica 1]
2. [Pergunta estratégica 2]
3. [Pergunta estratégica 3]

TAREFAS A IMPLEMENTAR:
[Lista numerada detalhada]

REQUISITOS:
- TypeScript strict
- Build deve passar (npm run build)
- Não quebrar funcionalidades existentes
- Documentar decisões importantes
- Performance não pode degradar

OUTPUT ESPERADO:
- [Resultado específico mensurável]
- [Métricas de sucesso]
- Commit: "type(scope): descrição clara"

Execute com [valores importantes: empatia/performance/segurança/etc].
```

---

## 🏆 CONCLUSÃO

### Melhor Workflow:

1. **Tarefas grandes e complexas** (SEO, Acessibilidade, Testes)
   → **Claude Code** com prompts --ultrathink

2. **Refinamentos rápidos** (Quick wins, bugs pontuais)
   → **Cursor 2.0** com Composer

3. **Review de código** e **análises**
   → **Claude Code** (já conhece todo o contexto)

### Custos Totais:

- **Claude Pro:** $20/mês (já tem)
- **Cursor Pro:** $20/mês (opcional mas recomendado)
- **Total:** $20-40/mês para produtividade máxima

### ROI Estimado:

Sem IA: ~60 horas de trabalho manual
Com Claude Code + Cursor: ~25 horas
**Economia: 35 horas (58%)**

---

**Pronto para começar? Escolha uma prioridade e cole o prompt!** 🚀
