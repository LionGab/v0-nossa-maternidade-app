# Nossa Maternidade - Documentação de Arquitetura

## Visão Geral

O **Nossa Maternidade** é uma aplicação Next.js 15 construída com App Router, focada em oferecer suporte emocional e prático para mães durante a maternidade.

## Stack Tecnológica

### Frontend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Component library baseada em Radix UI
- **SWR** - Data fetching e caching

### Backend
- **Supabase** - BaaS (Backend as a Service)
  - PostgreSQL Database
  - Authentication
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Storage

### IA e Processamento
- **Anthropic Claude** - Chat empático e análise de sentimento
- **OpenAI GPT-4** - Geração de conteúdo e recomendações
- **Google Gemini** - Análise contextual e enriquecimento
- **Perplexity** - Pesquisa informativa com fontes
- **Vercel AI SDK** - Integração com modelos de IA

### Testes
- **Vitest** - Testes unitários
- **Playwright** - Testes E2E
- **Testing Library** - Testes de componentes React

## Arquitetura da Aplicação

### Estrutura de Diretórios

```
app/
├── api/                      # API Routes
│   ├── onboarding/          # Endpoints de onboarding
│   ├── gamification/        # Endpoints de gamificação
│   ├── multi-ai/            # Endpoints multi-modelo
│   ├── mcp/                 # MCP (Memory Context Protocol)
│   ├── generate-recipes/    # Geração de receitas IA
│   ├── maternal-news/       # Notícias maternas
│   ├── sentiment-analysis/  # Análise de sentimento
│   └── chat-with-memory/    # Chat com memória longa
├── dashboard/               # Dashboard principal
├── login/                   # Autenticação
├── signup/                  # Cadastro
├── onboarding/              # Configuração inicial
├── receitas/                # Receitas personalizadas
├── maternidade-hoje/        # Notícias e tendências
├── mundo-nath/              # Conteúdo exclusivo
└── layout.tsx              # Layout raiz

components/
├── app-sidebar.tsx          # Sidebar de navegação
├── error-boundary.tsx       # Error boundary React
├── gamification-widget.tsx  # Widget de gamificação
├── multi-ai-chat.tsx        # Interface de chat IA
└── ui/                      # Componentes Shadcn

lib/
├── gamification/
│   └── gamification-manager.ts  # Manager de gamificação
├── mcp/
│   └── memory-manager.ts        # Manager de memória
├── rate-limit.ts                # Rate limiting
├── supabase/
│   ├── client.ts                # Cliente Supabase browser
│   └── server.ts                # Cliente Supabase server
├── utils.ts                     # Funções utilitárias
└── validations/
    └── schemas.ts               # Schemas Zod

hooks/
├── use-data.ts                  # Hooks SWR customizados
├── use-mobile.ts                # Detecção mobile
└── use-toast.ts                 # Toasts

scripts/
├── 001_create_tables.sql        # Tabelas base
├── 002_create_profile_trigger.sql
├── 003_add_advanced_tables.sql
├── 004_enable_vector_extension.sql
├── 005_gamification_system.sql
├── 013_enable_rls_security.sql
├── 014_add_performance_indexes.sql
└── fix_handle_new_user.sql

__tests__/
└── lib/
    └── validations/
        └── schemas.test.ts       # Testes de validação

e2e/
└── auth.spec.ts                  # Testes E2E de autenticação
```

## Fluxo de Autenticação

1. **Signup** → `app/signup/page.tsx`
   - Usuário cria conta
   - Supabase Auth gera JWT
   - Trigger `handle_new_user()` cria perfil

2. **Login** → `app/login/page.tsx`
   - Autenticação via Supabase
   - Middleware verifica sessão

3. **Onboarding** → `app/onboarding/page.tsx`
   - Coleta informações da mãe
   - Análise de sentimento inicial
   - Configuração de perfil

4. **Middleware** → `middleware.ts`
   - Proteção de rotas
   - Redirecionamento baseado em autenticação
   - Validação de sessão

## Proteção de Rotas

```typescript
// middleware.ts
const publicRoutes = ["/login", "/signup", "/signup-success"]
const protectedRoutes = ["/dashboard", "/onboarding", ...]

// Redireciona não-autenticados para /login
// Redireciona autenticados em rotas públicas para /dashboard
```

## Modelo de Dados

### Tabelas Principais

#### profiles
- Dados do usuário
- Nome, avatar, preferências

#### onboarding_responses
- Respostas do onboarding inicial
- Estado emocional, desafios, necessidades

#### sentiment_analysis
- Análises de sentimento periódicas
- Emoções, risco, recomendações

#### gamification_data
- Pontos, níveis, streaks
- Conquistas e desafios

#### ai_conversations
- Histórico de conversas com IA
- Contexto para respostas personalizadas

#### memory_embeddings
- Memórias vetorizadas
- Busca semântica para contexto

### Row Level Security (RLS)

Todas as tabelas têm RLS habilitado:
- Usuários só acessam seus próprios dados
- Políticas baseadas em `auth.uid()`

## Sistema Multi-IA

### Modelos e Uso

1. **Claude Sonnet 4** (Anthropic)
   - Chat empático e acolhedor
   - Análise psicológica profunda
   - Triagem de depressão pós-parto

2. **GPT-4 Turbo** (OpenAI)
   - Conversação geral
   - Geração de receitas
   - Recomendações personalizadas

3. **Gemini 2.0** (Google)
   - Análise contextual
   - Padrões temporais
   - Enriquecimento de conteúdo

4. **Perplexity Sonar** (Perplexity)
   - Pesquisa informativa
   - Fontes citadas
   - Informações médicas atualizadas

## Gamificação

### Sistema de Pontos
- **Atividades** = Pontos
- **Níveis** = Progressão
- **Streaks** = Consistência
- **Conquistas** = Marcos

### Manager
`GamificationManager` centraliza toda a lógica:
```typescript
const manager = new GamificationManager(supabase, userId)
await manager.recordActivity(activityType, metadata)
const stats = await manager.getStats()
```

## Memória e Contexto

### MemoryManager
Gerencia memórias de longo prazo (>90 dias):
- **Embeddings** = Vetorização de conteúdo
- **Busca Semântica** = Relevância contextual
- **Resumos Periódicos** = Compressão de histórico
- **Contexto Abrangente** = Combina recente + relevante

## Validação de Dados

### Zod Schemas
Todas as APIs validam entrada com Zod:
- `onboardingSchema` - Onboarding
- `chatRequestSchema` - Chat
- `recipeRequestSchema` - Receitas
- `newsRequestSchema` - Notícias
- `gamificationActivitySchema` - Gamificação

## Caching

### SWR Hooks
- `useGamification()` - Stats
- `useProfile()` - Perfil
- `useCommunityPosts()` - Posts
- `useDiaryEntries()` - Diário

Cache automático com revalidação.

## Segurança

### Implementações
1. **Autenticação** - Supabase Auth com JWT
2. **RLS** - Segurança no banco
3. **Middleware** - Proteção de rotas
4. **Validação** - Zod em todas APIs
5. **Rate Limiting** - Prevenção de abuso
6. **Error Handling** - Try-catch em APIs
7. **Sanitização** - Inputs validados

## Performance

### Otimizações
1. **Database Indexes** - Consultas rápidas
2. **SWR Caching** - Menos requisições
3. **Lazy Loading** - Code splitting
4. **Image Optimization** - Next.js Image
5. **Streaming** - Respostas progressivas

## Deploy

### Ambiente
- **Vercel** - Hosting e CDN
- **Supabase** - Backend como serviço
- **GitHub Actions** - CI/CD

### Variáveis de Ambiente
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
PERPLEXITY_API_KEY=
```

## Testes

### Estrutura
```bash
npm run test              # Unit tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage
npm run test:e2e          # E2E tests
npm run test:e2e:ui       # Playwright UI
```

### Cobertura Alvo
- **60%+** cobertura de código
- **Unit** - Schemas, managers, utilities
- **E2E** - Fluxos críticos

## Próximos Passos

### Melhorias Planejadas
1. Adicionar mais testes (componentes, hooks)
2. Implementar ErrorBoundary em rotas críticas
3. Adicionar skeleton loaders em todos componentes
4. Documentar APIs mais detalhadamente
5. Configurar Sentry para error tracking
6. Configurar Vercel Analytics
7. Adicionar mais E2E tests
8. Implementar rate limiting efetivo
9. Adicionar CSRF protection
10. Melhorar acessibilidade (a11y)

