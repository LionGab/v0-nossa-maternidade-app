# MAIN.md - Nossa Maternidade
## Documento Central do Projeto - Status e Visão Geral Completa

**Última Atualização:** 2025-11-03
**Versão do Projeto:** 0.1.0
**Status:** 🔴 **NÃO PRONTO PARA PRODUÇÃO** - Issues críticas bloqueiam deploy

---

## 📊 STATUS GERAL DO PROJETO

### Build Status
```
❌ BUILD FAILING - proxy.ts misconfiguration
❌ SECURITY RISK - API keys exposed
⚠️  TEST FAILURES - Path resolution issues
✅ DOCUMENTATION - Excellent (26 files)
✅ ARCHITECTURE - Solid foundation
```

### Scorecard de Prontidão para Produção

| Categoria | Score | Status | Blocker? |
|-----------|-------|--------|----------|
| **Build Success** | 0/10 | ❌ FAILING | SIM |
| **Security** | 2/10 | ❌ CRITICAL | SIM |
| **Documentation** | 10/10 | ✅ EXCELLENT | NÃO |
| **Code Quality** | 7/10 | ⚠️ GOOD | NÃO |
| **Test Coverage** | 2/10 | ❌ POOR | NÃO |
| **Performance** | ?/10 | ⚠️ UNKNOWN | NÃO |
| **Mobile-First** | 8/10 | ✅ GOOD | NÃO |
| **PWA** | 7/10 | ⚠️ GOOD | NÃO |
| **CI/CD** | 7/10 | ⚠️ CONFIGURED | NÃO |
| **Monitoring** | 0/10 | ❌ MISSING | SIM |

**SCORE GERAL: 43/100** - Não pronto para produção

---

## 🚨 ISSUES CRÍTICAS (BLOCKERS)

### 1. Build Failure - proxy.ts Misconfiguration
**Prioridade:** 🔴 CRÍTICA - BLOQUEIA DEPLOY
**Tempo para correção:** 5 minutos
**Arquivo:** `proxy.ts:10`

**Erro:**
```
Error: Turbopack build failed with 1 errors:
./proxy.ts
Proxy is missing expected function export name
```

**Causa:**
Next.js 16 migrou de `middleware` para `proxy`, mas o arquivo ainda exporta função `middleware`.

**Correção:**
```typescript
// ❌ ATUAL (ERRADO):
export async function middleware(request: NextRequest) { ... }

// ✅ CORRETO:
export async function proxy(request: NextRequest) { ... }
// OU
export { middleware as proxy }
```

**Ação Imediata:** Renomear função ou criar alias de export.

---

### 2. API Keys Expostas - SECURITY BREACH
**Prioridade:** 🔴 CRÍTICA - RISCO DE SEGURANÇA
**Tempo para correção:** 1 hora
**Arquivo:** `.env.example`

**Chaves Comprometidas:**
```
✗ SUPABASE_URL: https://bbcwitnbnosyfpfjtzkry.supabase.co
✗ SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIs... (EXPOSTA)
✗ SUPABASE_SERVICE_ROLE_KEY: eyJhbGciOiJIUzI1NiIs... (EXPOSTA - CRÍTICO!)
✗ ANTHROPIC_API_KEY: sk-ant-api03-dNzIjh... (EXPOSTA)
✗ OPENAI_API_KEY: sk-proj-BKCgHpWHXoB... (EXPOSTA)
✗ GOOGLE_AI_API_KEY: AIzaSyC9YVWRmnG... (EXPOSTA)
✗ PERPLEXITY_API_KEY: pplx-3wb2O9eVJiD... (EXPOSTA)
```

**Impacto:**
- ⚠️ Acesso total ao banco de dados Supabase (SERVICE_ROLE_KEY)
- ⚠️ Uso não autorizado de APIs de IA (custo financeiro)
- ⚠️ Possível exfiltração de dados de usuários
- ⚠️ Potencial deleção ou modificação de dados

**Ação Imediata:**
1. ✅ Revogar TODAS as chaves imediatamente
2. ✅ Gerar novas chaves
3. ✅ Atualizar .env.example com placeholders
4. ✅ Verificar logs de uso suspeito
5. ✅ Notificar usuários se dados foram acessados

---

### 3. Supabase 500 Error em Produção
**Prioridade:** 🔴 CRÍTICA - SIGNUP QUEBRADO
**Tempo para investigação:** 30 minutos

**Erro de Console:**
```
POST https://ronpyagsevvugfibemrn.supabase.co/auth/v1/signup 500 (Internal Server Error)
```

**Possíveis Causas:**
1. ❌ Trigger `handle_new_user` falhando
2. ❌ RLS policies bloqueando inserção
3. ❌ Banco de dados não configurado (SQL scripts não executados)
4. ❌ Service Role Key inválida

**Ação Imediata:**
1. Verificar logs do Supabase
2. Executar scripts SQL do diretório `scripts/`
3. Testar trigger manualmente
4. Verificar policies RLS

---

### 4. Manifest.json Syntax Error
**Prioridade:** 🟠 ALTA - PWA QUEBRADO
**Tempo para correção:** 10 minutos

**Erro de Console:**
```
manifest.json:1 Manifest: Line: 1, column: 1, Syntax error.
```

**Ação:** Verificar e corrigir JSON do manifest

---

## 📁 INVENTÁRIO COMPLETO DE ARQUIVOS

### Estrutura de Diretórios

```
v0-nossa-maternidade-app/
├── 📁 .github/              → CI/CD workflows (3 arquivos)
├── 📁 .netlify/             → Netlify config (1 arquivo)
├── 📁 .vscode/              → VS Code settings (1 arquivo)
├── 📁 .claude/              → Claude Code settings (1 arquivo)
├── 📁 app/                  → Next.js App Router (40 arquivos)
│   ├── page.tsx             → Landing page
│   ├── layout.tsx           → Root layout
│   ├── globals.css          → Global styles (maternal design)
│   ├── 📁 api/              → 16 API routes
│   └── 📁 [pages]/          → 18 páginas da aplicação
├── 📁 components/           → React components (27 arquivos)
│   ├── 📁 ui/               → 20 UI components (Shadcn)
│   └── *.tsx                → 7 core components
├── 📁 lib/                  → Utilities & configs (9 arquivos)
│   ├── env.ts               → Env validation
│   ├── 📁 supabase/         → Supabase clients
│   ├── 📁 validations/      → Zod schemas
│   ├── 📁 gamification/     → Gamification logic
│   └── 📁 mcp/              → Memory Context Protocol
├── 📁 hooks/                → Custom React hooks (4 arquivos)
├── 📁 public/               → Static assets (29 arquivos)
│   ├── manifest.json        → PWA manifest
│   ├── sw.js                → Service worker
│   ├── 📁 icons/            → 8 PWA icons
│   └── 📁 images/           → 16 placeholder images
├── 📁 scripts/              → Database scripts (11 arquivos)
├── 📁 tests/                → Test files (3 arquivos)
├── 📁 e2e/                  → E2E tests (1 arquivo)
├── 📄 Documentation/        → 26 markdown files
├── 📄 Config Files/         → 14 configuration files
└── 📄 proxy.ts              → Middleware (BROKEN!)

TOTAL: 171+ arquivos (excluindo node_modules)
```

---

## 📋 RESUMO DE ARQUIVOS POR CATEGORIA

### 1. Páginas da Aplicação (18 arquivos)

| Arquivo | Descrição | Status |
|---------|-----------|--------|
| `app/page.tsx` | Landing page com hero section | ✅ |
| `app/login/page.tsx` | Página de login | ✅ |
| `app/signup/page.tsx` | Página de cadastro | ❌ 500 Error |
| `app/signup-success/page.tsx` | Confirmação de cadastro | ✅ |
| `app/onboarding/page.tsx` | Onboarding (6 perguntas) | ✅ |
| `app/dashboard/page.tsx` | Dashboard principal | ✅ |
| `app/chat/page.tsx` | Chat com NathAI | ✅ |
| `app/perfil-bebe/page.tsx` | Perfil do bebê | ⚠️ TODO: DB save |
| `app/rotina/page.tsx` | Planejador de rotina | ✅ |
| `app/receitas/page.tsx` | Receitas geradas por IA | ✅ |
| `app/autocuidado/page.tsx` | 10 sugestões de autocuidado | ✅ |
| `app/brincadeiras/page.tsx` | 6 atividades sensoriais | ✅ |
| `app/historias-sono/page.tsx` | 5 histórias para dormir | ⚠️ TODO: Audio |
| `app/birras/page.tsx` | Gestão de birras (5 situações) | ✅ |
| `app/maternidade-hoje/page.tsx` | Feed de notícias | ✅ |
| `app/mundo-nath/page.tsx` | Conteúdo exclusivo Nathália | ✅ |

### 2. API Routes (16 arquivos)

| Endpoint | Descrição | Rate Limited? |
|----------|-----------|---------------|
| `/api/onboarding` | Salva respostas do onboarding | ❌ |
| `/api/sentiment-analysis` | Análise de sentimento | ❌ |
| `/api/generate-recipes` | Geração de receitas IA | ❌ |
| `/api/maternal-news` | Agregação de notícias | ❌ |
| `/api/chat-with-memory` | Chat com memória | ❌ |
| `/api/gamification/activity` | Registra atividades | ❌ |
| `/api/gamification/stats` | Estatísticas de gamification | ❌ |
| `/api/multi-ai/chat` | Chat multi-IA | ❌ |
| `/api/multi-ai/sentiment` | Sentiment multi-IA | ❌ |
| `/api/multi-ai/recommendations` | Recomendações IA | ❌ |
| `/api/multi-ai/research` | Pesquisa com IA | ❌ |
| `/api/multi-ai/postpartum-screening` | EPDS screening | ❌ |
| `/api/mcp/conversational-onboarding` | Onboarding conversacional | ❌ |
| `/api/mcp/semantic-search` | Busca semântica | ❌ |
| `/api/mcp/summarize` | Sumarização de conteúdo | ❌ |
| `/api/mcp/transcribe` | Transcrição de áudio | ❌ |

**⚠️ CRÍTICO:** NENHUMA rota tem rate limiting implementado!

### 3. Componentes (27 arquivos)

**Core Components (7):**
- `app-sidebar.tsx` - Navegação lateral com menu
- `bottom-navigation.tsx` - Navegação inferior mobile
- `error-boundary.tsx` - Captura de erros React
- `gamification-widget.tsx` - Widget de pontos/nível
- `multi-ai-chat.tsx` - Interface de chat multi-IA
- `pwa-install-prompt.tsx` - Prompt de instalação PWA
- `theme-provider.tsx` - Provider de tema claro/escuro

**UI Components (20):** Shadcn/ui components (Avatar, Badge, Button, Card, etc.)

### 4. Biblioteca & Utilidades (9 arquivos)

| Arquivo | Descrição | Testes? |
|---------|-----------|---------|
| `lib/env.ts` | Validação de env vars com fallbacks | ⚠️ Failing |
| `lib/utils.ts` | Funções utilitárias (cn, formatters) | ❌ |
| `lib/rate-limit.ts` | Rate limiting (NÃO USADO!) | ❌ |
| `lib/supabase/client.ts` | Cliente Supabase browser | ⚠️ Failing |
| `lib/supabase/server.ts` | Cliente Supabase server | ⚠️ Failing |
| `lib/validations/schemas.ts` | Schemas Zod | ✅ |
| `lib/gamification/gamification-manager.ts` | Sistema de gamification | ❌ |
| `lib/mcp/memory-manager.ts` | Gerenciador de memória MCP | ❌ |

### 5. Hooks Customizados (4 arquivos)

- `hooks/use-data.ts` - Data fetching com SWR
- `hooks/use-mobile.ts` - Detecção de mobile
- `hooks/use-toast.ts` - Sistema de notificações
- `hooks/usePWA.ts` - Gerenciamento de instalação PWA

### 6. Configuração (14 arquivos)

| Arquivo | Descrição | Warnings? |
|---------|-----------|-----------|
| `package.json` | Dependencies manifest | ✅ |
| `pnpm-lock.yaml` | PNPM lockfile | ✅ |
| `package-lock.json` | NPM lockfile (redundante) | ⚠️ |
| `tsconfig.json` | TypeScript config (strict) | ✅ |
| `next.config.mjs` | Next.js config | ⚠️ Invalid turbopack key |
| `netlify.toml` | Netlify deployment | ✅ |
| `components.json` | Shadcn/ui config | ✅ |
| `postcss.config.mjs` | PostCSS + Tailwind | ✅ |
| `eslint.config.mjs` | ESLint 9 config | ✅ |
| `vitest.config.ts` | Vitest configuration | ⚠️ Path resolution |
| `vitest.setup.ts` | Test setup | ✅ |
| `playwright.config.ts` | E2E test config | ✅ |
| `proxy.ts` | Middleware (BROKEN!) | ❌ |
| `.env.example` | Env template (EXPOSED KEYS!) | ❌ |

### 7. Documentação (26 arquivos)

**Principais:**
- `README.md` - Documentação principal (excelente)
- `DOCUMENTATION.md` - Arquitetura detalhada
- `DEPLOY_PRODUCTION.md` - Guia de deploy
- `ARCHITECTURE.md` - Visão geral da arquitetura
- `API_DOCS.md` - Documentação de APIs
- `TROUBLESHOOTING.md` - Solução de problemas
- `IMPLEMENTATION_CHECKLIST.md` - Checklist (100% completo)

**Deploy-Specific:**
- `DEPLOY_GUIDE.md`
- `DEPLOY_NETLIFY.md`
- `NETLIFY_DEPLOY.md`
- `NETLIFY_TROUBLESHOOTING.md`
- `DEPLOYMENT_CHECKLIST.md`

**Outros (15 docs):** Migration guides, checklists, release notes, etc.

### 8. Testes (4 arquivos)

| Arquivo | Testes | Passando | Falhando |
|---------|--------|----------|----------|
| `tests/lib/env.test.tsx` | 4 | 0 | 4 |
| `tests/lib/supabase.test.tsx` | 8 | 1 | 7 |
| `tests/lib/validations/schemas.test.ts` | 15+ | 15+ | 0 |
| `e2e/app.spec.ts` | 3 | ? | ? |

**Coverage Total:** ~5% (apenas schemas validados)

### 9. Database Scripts (11 arquivos)

| Script | Descrição | Ordem |
|--------|-----------|-------|
| `001_create_tables.sql` | Tabelas base | 1 |
| `002_create_profile_trigger.sql` | Trigger de perfil | 2 |
| `003_add_advanced_tables.sql` | Tabelas avançadas | 3 |
| `004_enable_vector_extension.sql` | pgvector para embeddings | 4 |
| `005_gamification_system.sql` | Sistema de gamification | 5 |
| `013_enable_rls_security.sql` | Row Level Security | 6 |
| `014_add_performance_indexes.sql` | Índices de performance | 7 |
| `fix_handle_new_user.sql` | Fix trigger (se falhar) | * |

**Executados?** ❌ Provavelmente não (signup está falhando)

### 10. CI/CD (3 arquivos)

- `.github/workflows/ci-cd.yml` - Pipeline principal (8 jobs)
- `.github/workflows/ci.yml` - CI básico
- `.github/workflows/automerge.yml` - Auto-merge de PRs

**Status:** Configurado mas não testado (build está falhando)

---

## 🏗️ ARQUITETURA DO PROJETO

### Stack Tecnológico

```
┌─────────────────────────────────────────────┐
│         FRONTEND (Next.js 16)               │
├─────────────────────────────────────────────┤
│ • React 19 (Server Components)              │
│ • TypeScript 5.7 (Strict mode)              │
│ • Tailwind CSS 4 (Custom maternal theme)    │
│ • Radix UI (Accessible components)          │
│ • SWR (Data fetching)                       │
│ • Framer Motion (Animations)                │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│         BACKEND (Edge Runtime)              │
├─────────────────────────────────────────────┤
│ • Next.js API Routes (16 endpoints)         │
│ • Supabase (@supabase/ssr)                  │
│ • Row Level Security (RLS)                  │
│ • PostgreSQL with pgvector                  │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│         AI INTEGRATION (Multi-AI)           │
├─────────────────────────────────────────────┤
│ • Anthropic Claude Sonnet 4 (Empathy)      │
│ • OpenAI GPT-4 (Content)                    │
│ • Google Gemini 2.0 (Context)               │
│ • Vercel AI SDK (Orchestration)             │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│         PWA & DEPLOYMENT                    │
├─────────────────────────────────────────────┤
│ • Service Worker (Network-first)            │
│ • Web App Manifest (8 icons)                │
│ • Netlify (Hosting)                         │
│ • GitHub Actions (CI/CD)                    │
└─────────────────────────────────────────────┘
```

### Design System - Maternal Theme

**Paleta de Cores:**
```css
/* Cores acolhedoras e profissionais */
--color-primary: oklch(0.62 0.12 35);   /* Terracotta quente */
--color-secondary: oklch(0.75 0.06 145); /* Sage suave */
--color-accent: oklch(0.88 0.05 295);    /* Lavanda suave */
--color-background: oklch(0.985 0.008 85); /* Creme */
```

**Tipografia:**
- **Sans:** Inter (clareza, legibilidade)
- **Serif:** Lora (calor, elegância)
- **Mono:** Geist Mono (código)

**Mobile-First:**
- Touch targets: mínimo 44px
- Safe area insets (notches)
- Font-size mínimo 16px (evita zoom iOS)
- Bottom navigation

### Database Schema

```sql
profiles
├── id (uuid, PK)
├── email (text)
├── full_name (text)
├── onboarding_completed (boolean)
├── created_at (timestamp)
└── updated_at (timestamp)

onboarding_responses
├── id (uuid, PK)
├── user_id (uuid, FK → profiles)
├── question_number (integer)
├── answer (jsonb)
└── created_at (timestamp)

sentiment_analysis
├── id (uuid, PK)
├── user_id (uuid, FK → profiles)
├── sentiment_score (numeric)
├── emotions (jsonb)
├── context (text)
└── created_at (timestamp)

gamification_data
├── id (uuid, PK)
├── user_id (uuid, FK → profiles)
├── points (integer)
├── level (integer)
├── achievements (jsonb)
└── updated_at (timestamp)

ai_conversations
├── id (uuid, PK)
├── user_id (uuid, FK → profiles)
├── message (text)
├── response (text)
├── model_used (text)
└── created_at (timestamp)

memory_embeddings (pgvector)
├── id (uuid, PK)
├── user_id (uuid, FK → profiles)
├── content (text)
├── embedding (vector(1536))
├── metadata (jsonb)
└── created_at (timestamp)
```

**Segurança:**
- RLS habilitado em todas as tabelas
- Policies baseadas em `auth.uid()`
- Service role key apenas para admin

---

## 📦 DEPENDÊNCIAS

### Production (55 packages)

**Core:**
- next: 16.0.0 (Latest)
- react: 19.2.0 (Latest)
- typescript: 5.7.3 (Latest)

**UI:**
- @radix-ui/*: 20+ components
- tailwindcss: 4.1.9
- lucide-react: Icons
- framer-motion: Animations

**Backend:**
- @supabase/ssr: 0.6.1
- @supabase/supabase-js: 2.48.1

**AI:**
- @anthropic-ai/sdk: ^0.34.1
- openai: ^4.74.0
- @ai-sdk/google: ^1.0.13
- ai: ^4.0.43 (Vercel AI SDK)

**Data Fetching:**
- swr: ^2.3.1
- zod: ^3.24.1

### Development (20 packages)

**Testing:**
- vitest: ^2.1.8
- @playwright/test: ^1.49.1
- @testing-library/react: ^16.1.0
- @vitejs/plugin-react: ^4.3.4

**Linting:**
- eslint: ^9.18.0
- @typescript-eslint/eslint-plugin: ^8.20.0
- eslint-config-next: 16.0.0

**Build:**
- @netlify/plugin-nextjs: ^5.8.3
- autoprefixer: ^10.4.20
- postcss: ^8.4.49

---

## 🔐 REGRAS DE ATUALIZAÇÃO DO PROJETO

### 1. REGRAS DE CÓDIGO

#### 1.1 Controle de Versão (Git)
```bash
# ✅ SEMPRE antes de qualquer mudança
git pull origin main
git checkout -b feature/nome-descritivo

# ❌ NUNCA commitar diretamente na main
git push origin main  # PROIBIDO!

# ✅ SEMPRE usar Pull Requests
git push origin feature/nome-descritivo
# Criar PR no GitHub com descrição detalhada
```

#### 1.2 Commits Semânticos
```bash
# Formato obrigatório:
<tipo>(<escopo>): <descrição curta>

<descrição detalhada (opcional)>

<footer com breaking changes (se aplicável)>

# Tipos permitidos:
feat:     Nova funcionalidade
fix:      Correção de bug
docs:     Mudanças apenas em documentação
style:    Formatação, ponto-e-vírgula, etc (não afeta código)
refactor: Refatoração sem mudar funcionalidade
perf:     Melhoria de performance
test:     Adição/correção de testes
chore:    Mudanças em build, CI, etc
security: Correções de segurança

# Exemplos:
feat(chat): adicionar suporte a anexos de imagem
fix(auth): corrigir loop infinito no middleware
docs(readme): atualizar instruções de setup
security(api): implementar rate limiting
```

#### 1.3 Branches
```
main              → Produção (protegida)
develop           → Desenvolvimento (staging)
feature/*         → Novas funcionalidades
fix/*             → Correções de bugs
hotfix/*          → Correções urgentes em produção
security/*        → Correções de segurança
docs/*            → Documentação
test/*            → Testes
refactor/*        → Refatoração
```

#### 1.4 Code Review Obrigatório
- ✅ Mínimo 1 aprovação antes de merge
- ✅ CI/CD deve passar (todos os checks verdes)
- ✅ Coverage não deve diminuir
- ✅ Build deve passar localmente e no CI
- ❌ Não usar "Auto-merge" sem review

### 2. REGRAS DE SEGURANÇA

#### 2.1 Variáveis de Ambiente
```bash
# ✅ SEMPRE usar variáveis de ambiente
NEXT_PUBLIC_* → Variáveis públicas (cliente)
(sem prefixo)  → Variáveis privadas (servidor)

# ❌ NUNCA commitar chaves reais
.env.local     → GITIGNORED (nunca commitar)
.env.example   → Apenas placeholders

# Template de .env.example:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxx

# ✅ SEMPRE validar variáveis de ambiente
# Usar lib/env.ts para validação com Zod
```

#### 2.2 API Keys
- ❌ NUNCA expor service role keys no cliente
- ✅ SEMPRE revogar chaves comprometidas imediatamente
- ✅ SEMPRE usar diferentes chaves para dev/staging/prod
- ✅ SEMPRE rotacionar chaves a cada 90 dias
- ✅ SEMPRE usar secrets do GitHub para CI/CD

#### 2.3 Rate Limiting
```typescript
// ✅ SEMPRE implementar rate limiting em APIs públicas
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const limiter = rateLimit({
    interval: 60 * 1000, // 1 minuto
    uniqueTokenPerInterval: 500,
  })

  await limiter.check(request, 10) // 10 requests/min
  // ... resto da lógica
}
```

#### 2.4 Input Validation
```typescript
// ✅ SEMPRE validar inputs com Zod
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(1).max(1000),
})

const validated = schema.parse(input) // Throws se inválido
```

### 3. REGRAS DE TESTES

#### 3.1 Coverage Mínimo
- ✅ Unit tests: mínimo 60%
- ✅ API routes: mínimo 80%
- ✅ Critical paths: 100%

#### 3.2 Estrutura de Testes
```
tests/
├── unit/           → Testes unitários
├── integration/    → Testes de integração
└── e2e/            → Testes end-to-end

# Nomenclatura:
component.test.tsx   → Testes de componente
hook.test.ts         → Testes de hooks
api.test.ts          → Testes de API
```

#### 3.3 Antes de Commitar
```bash
# ✅ SEMPRE rodar testes antes de push
npm run test              # Testes unitários
npm run test:e2e          # Testes E2E
npm run build             # Build de produção
npm run lint              # Linting

# ✅ SEMPRE verificar coverage
npm run test:coverage
# Coverage deve estar >= 60%
```

### 4. REGRAS DE DEPLOY

#### 4.1 Pré-Deploy Checklist
```bash
# ✅ SEMPRE verificar antes de deploy:
□ Build local passa sem erros
□ Testes passam (unit + E2E)
□ Linting passa sem warnings
□ Coverage >= 60%
□ .env.example atualizado com novas vars
□ CHANGELOG.md atualizado
□ Versão bumped (package.json)
□ Database migrations aplicadas
□ Secrets configurados no Netlify

# ❌ NUNCA deployar se:
✗ Build está falhando
✗ Testes estão falhando
✗ Secrets não estão configurados
✗ Database não está migrada
```

#### 4.2 Database Migrations
```bash
# ✅ SEMPRE criar migration para mudanças de schema
scripts/
├── XXX_description.sql  # Ordem numérica

# ✅ SEMPRE testar migrations localmente primeiro
# ✅ SEMPRE fazer backup antes de migration em prod
# ✅ SEMPRE ter rollback script

# Exemplo:
006_add_user_preferences.sql     # Migration
006_rollback_user_preferences.sql # Rollback
```

#### 4.3 Deployment Flow
```
1. Desenvolvimento → feature/* branch
2. Pull Request → develop branch
3. Review + Testes → aprovação
4. Merge → develop
5. Deploy automático → Staging (Netlify)
6. QA manual → Staging
7. Pull Request → main
8. Merge → main
9. Deploy automático → Production
10. Smoke tests → Production
11. Monitor logs → 24h
```

### 5. REGRAS DE DOCUMENTAÇÃO

#### 5.1 README.md
- ✅ SEMPRE atualizar README ao adicionar features
- ✅ SEMPRE incluir exemplos de uso
- ✅ SEMPRE documentar breaking changes

#### 5.2 CHANGELOG.md
```markdown
# Changelog

## [Unreleased]
### Added
- Nova funcionalidade X

### Changed
- Mudança na funcionalidade Y

### Fixed
- Correção do bug Z

### Security
- Correção de vulnerabilidade W

## [1.0.0] - 2025-01-15
...
```

#### 5.3 Code Comments
```typescript
// ✅ SEMPRE comentar lógica complexa
// ❌ NUNCA comentar código óbvio

// ✅ BOM:
// Calcula o score de sentimento usando média ponderada
// considerando emoções negativas com peso 2x
const score = calculateWeightedSentiment(emotions)

// ❌ RUIM:
// Define a variável score
const score = 0.5
```

#### 5.4 API Documentation
```typescript
/**
 * POST /api/chat-with-memory
 *
 * Envia mensagem ao chat com contexto de memória.
 *
 * @param {string} message - Mensagem do usuário
 * @param {string} userId - ID do usuário autenticado
 * @returns {object} Resposta da IA com contexto
 *
 * @throws {401} Se usuário não autenticado
 * @throws {429} Se exceder rate limit
 * @throws {500} Se erro ao processar
 *
 * @example
 * POST /api/chat-with-memory
 * Body: { "message": "Como lidar com birras?" }
 *
 * Response: {
 *   "response": "Para lidar com birras...",
 *   "context": [...],
 *   "model": "claude-sonnet-4"
 * }
 */
export async function POST(request: Request) {
  // ...
}
```

### 6. REGRAS DE PERFORMANCE

#### 6.1 Bundle Size
- ✅ SEMPRE verificar bundle size antes de merge
- ❌ NUNCA aumentar bundle >10% sem justificativa
- ✅ SEMPRE usar lazy loading para componentes pesados

```typescript
// ✅ BOM: Lazy loading
const HeavyComponent = dynamic(() => import('./HeavyComponent'))

// ❌ RUIM: Import direto de componente pesado
import HeavyComponent from './HeavyComponent'
```

#### 6.2 Images
- ✅ SEMPRE otimizar imagens (WebP, AVIF)
- ✅ SEMPRE usar next/image
- ✅ SEMPRE definir width/height

```tsx
// ✅ BOM:
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={isAboveFold}
/>

// ❌ RUIM:
<img src="/image.jpg" alt="Description" />
```

#### 6.3 Database Queries
- ✅ SEMPRE usar índices em colunas de busca
- ✅ SEMPRE limitar resultados (.limit())
- ❌ NUNCA fazer queries em loops

```typescript
// ✅ BOM:
const users = await supabase
  .from('profiles')
  .select('id, name')
  .limit(10)
  .order('created_at', { ascending: false })

// ❌ RUIM:
const users = await supabase.from('profiles').select('*')
```

### 7. REGRAS DE MONITORAMENTO

#### 7.1 Error Tracking
```typescript
// ✅ SEMPRE logar erros com contexto
console.error('API Error:', {
  endpoint: '/api/chat',
  userId,
  error: error.message,
  timestamp: new Date().toISOString(),
})

// ❌ NUNCA logar informações sensíveis
console.log('User password:', password) // PROIBIDO!
```

#### 7.2 Analytics
- ✅ SEMPRE rastrear eventos críticos
- ✅ SEMPRE anonimizar dados de usuários
- ❌ NUNCA rastrear dados sensíveis (senhas, tokens, etc.)

---

## 📋 ARQUIVOS E DOCUMENTAÇÃO FALTANTES

### CRÍTICO - Blockers

1. **proxy.ts funcionando** - Atualmente quebrado
2. **Chaves de API válidas** - Todas comprometidas
3. **Error monitoring configurado** - Sentry ou similar
4. **Rate limiting implementado** - Proteção de APIs

### ALTA PRIORIDADE

5. **PWA Screenshots** (2 arquivos)
   - `public/screenshots/home.png` (540x720px)
   - `public/screenshots/chat.png` (540x720px)

6. **Offline Fallback Page**
   - `app/offline/page.tsx`
   - UI quando usuário está sem conexão

7. **Database Migration Guide**
   - `docs/DATABASE_MIGRATIONS.md`
   - Estratégia de versionamento de schema

8. **API Documentation (OpenAPI)**
   - `docs/openapi.yaml` ou `openapi.json`
   - Spec completa de todas as APIs

9. **Component Storybook**
   - `.storybook/` directory
   - Stories para componentes UI

10. **Testing Guide**
    - `docs/TESTING.md`
    - Como escrever/rodar testes

### MÉDIA PRIORIDADE

11. **Performance Budget**
    - `performance-budget.json`
    - Limites de bundle size, LCP, FID, etc.

12. **Security Policy**
    - `SECURITY.md`
    - Como reportar vulnerabilidades

13. **Error Handling Guide**
    - `docs/ERROR_HANDLING.md`
    - Padrões de tratamento de erros

14. **Code of Conduct**
    - `CODE_OF_CONDUCT.md`
    - Regras de conduta para contribuidores

15. **PR Template**
    - `.github/pull_request_template.md`
    - Template para Pull Requests

16. **Issue Templates**
    - `.github/ISSUE_TEMPLATE/bug_report.md`
    - `.github/ISSUE_TEMPLATE/feature_request.md`

17. **GitHub Actions para PR**
    - `.github/workflows/pr-checks.yml`
    - Checks automáticos em PRs

18. **Component Tests** (0 arquivos existem)
    - `tests/components/*.test.tsx`
    - Testes para todos os 27 componentes

19. **Hook Tests** (0 arquivos existem)
    - `tests/hooks/*.test.ts`
    - Testes para os 4 hooks customizados

20. **API Route Tests** (0 arquivos existem)
    - `tests/api/*.test.ts`
    - Testes para as 16 rotas de API

### BAIXA PRIORIDADE

21. **Lighthouse CI Config**
    - `lighthouserc.json`
    - Thresholds para CI

22. **Renovate Config**
    - `renovate.json`
    - Atualizações automáticas de dependências

23. **Docker Setup** (para desenvolvimento local)
    - `Dockerfile`
    - `docker-compose.yml`

24. **VSCode Extensions Recommendations**
    - `.vscode/extensions.json`
    - Extensões recomendadas

25. **Git Hooks (Husky)**
    - `.husky/pre-commit` - Lint + tests
    - `.husky/pre-push` - Build check

---

## 🎯 PLANO DE AÇÃO COMPLETO

### FASE 1: CORREÇÕES CRÍTICAS (Deploy Blockers)
**Prazo:** 2-3 horas
**Objetivo:** Fazer build passar e resolver riscos de segurança

#### 1.1 Fix proxy.ts (5 minutos)
```bash
□ Abrir proxy.ts
□ Renomear função middleware → proxy
□ Testar build local
□ Commit: fix(middleware): rename middleware to proxy for Next.js 16
```

#### 1.2 Revogar API Keys (30 minutos)
```bash
□ Acessar Supabase Dashboard
  □ Revogar anon key atual
  □ Revogar service role key atual
  □ Gerar novas keys

□ Acessar Anthropic Dashboard
  □ Revogar key atual
  □ Gerar nova key

□ Acessar OpenAI Dashboard
  □ Revogar key atual
  □ Gerar nova key

□ Acessar Google AI Studio
  □ Revogar key atual
  □ Gerar nova key

□ Acessar Perplexity Dashboard
  □ Revogar key atual
  □ Gerar nova key
```

#### 1.3 Atualizar .env.example (5 minutos)
```bash
□ Substituir TODAS as chaves por placeholders
□ Adicionar comentários explicativos
□ Commit: security(env): remove exposed API keys, add placeholders
```

#### 1.4 Configurar Novas Keys (20 minutos)
```bash
□ Criar .env.local com novas chaves
□ Testar localmente
□ Configurar secrets no Netlify:
  □ NEXT_PUBLIC_SUPABASE_URL
  □ NEXT_PUBLIC_SUPABASE_ANON_KEY
  □ SUPABASE_SERVICE_ROLE_KEY
  □ ANTHROPIC_API_KEY
  □ OPENAI_API_KEY
  □ GOOGLE_AI_API_KEY
  □ PERPLEXITY_API_KEY
```

#### 1.5 Executar Database Scripts (30 minutos)
```bash
□ Acessar Supabase SQL Editor
□ Executar em ordem:
  □ 001_create_tables.sql
  □ 002_create_profile_trigger.sql
  □ 003_add_advanced_tables.sql
  □ 004_enable_vector_extension.sql
  □ 005_gamification_system.sql
  □ 013_enable_rls_security.sql
  □ 014_add_performance_indexes.sql

□ Testar signup manualmente
□ Verificar que trigger cria perfil automaticamente
```

#### 1.6 Fix Manifest.json (10 minutos)
```bash
□ Abrir public/manifest.json
□ Validar JSON (jsonlint.com)
□ Corrigir erros de sintaxe
□ Testar em localhost
```

#### 1.7 Testar Build Completo (10 minutos)
```bash
□ npm run build
□ Verificar que build passa
□ Verificar que não há warnings críticos
□ Commit: fix(build): resolve all build blocking issues
```

**Checkpoint:** Build deve passar sem erros!

---

### FASE 2: IMPLEMENTAÇÕES CRÍTICAS (Pré-Produção)
**Prazo:** 1-2 dias
**Objetivo:** Implementar segurança e monitoramento essenciais

#### 2.1 Implementar Rate Limiting (3 horas)
```typescript
// Criar lib/rate-limit.ts (já existe, precisa implementar)

// Aplicar em TODAS as 16 rotas de API
// Exemplo: app/api/chat-with-memory/route.ts

import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
  })

  try {
    await limiter.check(request, 10) // 10 req/min
  } catch {
    return new Response('Rate limit exceeded', { status: 429 })
  }

  // ... resto da lógica
}

□ Implementar em /api/chat-with-memory
□ Implementar em /api/multi-ai/chat
□ Implementar em /api/generate-recipes
□ Implementar em /api/sentiment-analysis
□ Implementar em todas as outras 12 rotas
□ Testar rate limiting
□ Commit: feat(security): implement rate limiting on all API routes
```

#### 2.2 Configurar Error Tracking (Sentry) (2 horas)
```bash
□ npm install @sentry/nextjs
□ npx @sentry/wizard -i nextjs
□ Configurar SENTRY_DSN no .env
□ Adicionar error boundary global
□ Testar error tracking
□ Commit: feat(monitoring): add Sentry error tracking
```

#### 2.3 Adicionar PWA Screenshots (20 minutos)
```bash
□ Capturar screenshot da home (540x720px)
□ Capturar screenshot do chat (540x720px)
□ Salvar em public/screenshots/
□ Atualizar manifest.json
□ Testar instalação PWA
□ Commit: feat(pwa): add screenshots for install prompt
```

#### 2.4 Criar Offline Fallback Page (1 hora)
```typescript
// app/offline/page.tsx
export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Você está offline</h1>
      <p>Conecte-se à internet para continuar.</p>
    </div>
  )
}

// Atualizar public/sw.js para usar fallback
□ Criar página offline
□ Atualizar service worker
□ Testar modo offline
□ Commit: feat(pwa): add offline fallback page
```

#### 2.5 Remover Console.logs (2 horas)
```bash
□ Buscar todos os console.log no código
□ Substituir por logger estruturado
□ Configurar logger (pino ou winston)
□ Commit: refactor(logging): replace console.log with structured logging
```

#### 2.6 Fix Test Path Resolution (1 hora)
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  // ... resto
})

□ Atualizar vitest.config.ts
□ Rodar testes
□ Verificar que passam
□ Commit: fix(tests): resolve path resolution issues
```

#### 2.7 Adicionar CORS Configuration (30 minutos)
```typescript
// next.config.mjs
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
      ],
    },
  ]
}

□ Adicionar CORS headers
□ Testar com cliente externo
□ Commit: feat(api): add CORS configuration
```

#### 2.8 Fix Turbopack Warning (5 minutos)
```javascript
// next.config.mjs
experimental: {
  optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  // REMOVER a linha turbopack abaixo:
  // turbopack: { root: process.cwd() },
}

□ Remover linha turbopack inválida
□ Testar build
□ Commit: fix(config): remove invalid turbopack experimental key
```

**Checkpoint:** Segurança implementada, monitoramento ativo!

---

### FASE 3: TESTES E QUALIDADE (Pós-Deploy)
**Prazo:** 3-5 dias
**Objetivo:** Aumentar coverage para 60%+

#### 3.1 Escrever Component Tests (16 horas)
```bash
Prioridade ALTA (core components):
□ tests/components/app-sidebar.test.tsx
□ tests/components/bottom-navigation.test.tsx
□ tests/components/error-boundary.test.tsx
□ tests/components/multi-ai-chat.test.tsx

Prioridade MÉDIA (UI components):
□ tests/components/ui/button.test.tsx
□ tests/components/ui/card.test.tsx
□ tests/components/ui/input.test.tsx
□ (+ 17 outros componentes UI)

Target: 60% coverage em components/
```

#### 3.2 Escrever Hook Tests (4 horas)
```bash
□ tests/hooks/use-data.test.ts
□ tests/hooks/use-mobile.test.ts
□ tests/hooks/use-toast.test.ts
□ tests/hooks/usePWA.test.ts

Target: 80% coverage em hooks/
```

#### 3.3 Escrever API Route Tests (12 horas)
```bash
Prioridade ALTA:
□ tests/api/chat-with-memory.test.ts
□ tests/api/onboarding.test.ts
□ tests/api/sentiment-analysis.test.ts
□ tests/api/multi-ai/chat.test.ts

Prioridade MÉDIA:
□ (+ 12 outras rotas)

Target: 80% coverage em app/api/
```

#### 3.4 Escrever E2E Tests (8 horas)
```bash
Critical User Flows:
□ e2e/signup-onboarding-dashboard.spec.ts
□ e2e/chat-conversation.spec.ts
□ e2e/pwa-installation.spec.ts
□ e2e/offline-mode.spec.ts
□ e2e/gamification.spec.ts
□ e2e/recipe-generation.spec.ts

Target: 20+ critical flows testados
```

#### 3.5 Setup Coverage Reports (1 hora)
```bash
□ Configurar coverage threshold (60%)
□ Adicionar badge de coverage no README
□ Configurar Codecov ou Coveralls
□ Commit: test: add coverage reporting and thresholds
```

**Checkpoint:** Coverage >= 60%!

---

### FASE 4: FEATURES INCOMPLETAS
**Prazo:** 2-3 dias
**Objetivo:** Completar features marcadas com TODO

#### 4.1 Implementar Audio Playback (4 horas)
```typescript
// app/historias-sono/page.tsx
// Linha 41 e 48 - TODOs atuais

import { useState, useRef } from 'react'

const [isPlaying, setIsPlaying] = useState(false)
const audioRef = useRef<HTMLAudioElement>(null)

const handlePlay = () => {
  if (audioRef.current) {
    audioRef.current.play()
    setIsPlaying(true)
  }
}

const handlePause = () => {
  if (audioRef.current) {
    audioRef.current.pause()
    setIsPlaying(false)
  }
}

□ Criar componente AudioPlayer
□ Integrar com histórias
□ Adicionar controles (play/pause/seek)
□ Testar em iOS e Android
□ Commit: feat(stories): implement audio playback
```

#### 4.2 Implementar Baby Profile Persistence (2 horas)
```typescript
// app/perfil-bebe/page.tsx
// Linha 17 - TODO atual

const saveBabyProfile = async (data: BabyProfile) => {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('baby_profiles')
    .upsert({
      user_id: user.id,
      ...data,
    })
    .select()
    .single()

  if (error) throw error
  return profile
}

□ Criar tabela baby_profiles (migration)
□ Implementar save/update
□ Adicionar loading states
□ Testar persistência
□ Commit: feat(baby-profile): add database persistence
```

**Checkpoint:** Todas as features funcionais!

---

### FASE 5: PERFORMANCE OPTIMIZATION
**Prazo:** 1 semana
**Objetivo:** Lighthouse 90+, bundle size otimizado

#### 5.1 Otimizar Bundle Size (8 horas)
```bash
□ Analisar bundle atual
  npm run build -- --analyze

□ Implementar code splitting
  - Lazy load AI SDKs
  - Lazy load Radix components
  - Lazy load heavy pages

□ Remover dependências não usadas
  npm run depcheck

□ Tree-shaking manual
  - Import específico de lodash
  - Import específico de date-fns

□ Objetivo: Reduzir First Load JS < 200KB
□ Commit: perf: optimize bundle size with code splitting
```

#### 5.2 Otimizar Imagens (4 horas)
```bash
□ Converter todas as imagens para WebP
□ Gerar diferentes tamanhos (srcset)
□ Adicionar blur placeholders
□ Lazy load images abaixo da dobra
□ Commit: perf: optimize images with WebP and lazy loading
```

#### 5.3 Adicionar Performance Budget (2 horas)
```json
// performance-budget.json
{
  "budgets": [
    {
      "resourceSizes": [
        { "resourceType": "script", "budget": 200 },
        { "resourceType": "total", "budget": 500 }
      ]
    }
  ],
  "metrics": {
    "LCP": 2500,
    "FID": 100,
    "CLS": 0.1
  }
}

□ Criar performance-budget.json
□ Integrar com Lighthouse CI
□ Adicionar check no CI/CD
□ Commit: perf: add performance budget monitoring
```

#### 5.4 Otimizar Database Queries (4 hours)
```sql
-- Adicionar índices faltantes
CREATE INDEX idx_sentiment_user_created ON sentiment_analysis(user_id, created_at DESC);
CREATE INDEX idx_conversations_user_created ON ai_conversations(user_id, created_at DESC);

-- Adicionar materialized views para queries pesadas
CREATE MATERIALIZED VIEW user_stats AS
SELECT
  user_id,
  COUNT(*) as total_messages,
  AVG(sentiment_score) as avg_sentiment
FROM ai_conversations
GROUP BY user_id;

□ Adicionar índices
□ Criar materialized views
□ Benchmark queries
□ Commit: perf(db): optimize queries with indexes and views
```

**Checkpoint:** Lighthouse 90+!

---

### FASE 6: DOCUMENTAÇÃO E TOOLING
**Prazo:** 3-4 dias
**Objetivo:** Documentação completa e DX otimizado

#### 6.1 OpenAPI Documentation (4 horas)
```yaml
# docs/openapi.yaml
openapi: 3.0.0
info:
  title: Nossa Maternidade API
  version: 1.0.0
paths:
  /api/chat-with-memory:
    post:
      summary: Send message to AI chat
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
      responses:
        200:
          description: Success

□ Documentar todas as 16 rotas
□ Adicionar exemplos
□ Gerar Swagger UI
□ Commit: docs(api): add OpenAPI specification
```

#### 6.2 Component Storybook (12 horas)
```bash
□ npx storybook@latest init
□ Criar stories para 27 components
□ Adicionar controles interativos
□ Deploy Storybook no Chromatic
□ Commit: docs(components): add Storybook stories
```

#### 6.3 Database Migration Guide (2 horas)
```markdown
# docs/DATABASE_MIGRATIONS.md

## Criando Migrations

1. Criar arquivo com prefixo numérico:
   `XXX_description.sql`

2. Sempre criar rollback script:
   `XXX_rollback_description.sql`

3. Testar localmente antes de aplicar

## Aplicando em Produção

1. Backup do banco
2. Executar migration
3. Verificar integridade
4. Se falhar, executar rollback

□ Criar guia completo
□ Adicionar exemplos
□ Commit: docs(db): add migration guide
```

#### 6.4 Testing Guide (2 horas)
```markdown
# docs/TESTING.md

## Rodando Testes

- Unit: `npm run test`
- E2E: `npm run test:e2e`
- Coverage: `npm run test:coverage`

## Escrevendo Testes

### Component Tests
...

### Hook Tests
...

### API Tests
...

□ Criar guia completo
□ Adicionar exemplos
□ Commit: docs(testing): add testing guide
```

#### 6.5 GitHub Templates (1 hora)
```markdown
# .github/pull_request_template.md

## Descrição
...

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change

## Checklist
- [ ] Build passa
- [ ] Testes passam
- [ ] Coverage mantido
- [ ] Docs atualizadas

□ Criar PR template
□ Criar issue templates (bug, feature)
□ Commit: docs(github): add PR and issue templates
```

#### 6.6 Git Hooks (Husky) (1 hora)
```bash
□ npm install -D husky lint-staged
□ npx husky install
□ npx husky add .husky/pre-commit "npm run lint"
□ npx husky add .husky/pre-push "npm run build"
□ Commit: chore(git): add pre-commit and pre-push hooks
```

**Checkpoint:** Documentação completa!

---

### FASE 7: LONG-TERM ENHANCEMENTS
**Prazo:** Ongoing
**Objetivo:** Features avançadas e otimizações contínuas

#### 7.1 Push Notifications
```bash
□ Configurar Web Push API
□ Implementar service worker notifications
□ Criar UI de permissão
□ Testar em iOS/Android
□ Estimativa: 12 horas
```

#### 7.2 Background Sync
```bash
□ Implementar Background Sync API
□ Queue de ações offline
□ Sincronização automática
□ Testar cenários offline
□ Estimativa: 8 horas
```

#### 7.3 Advanced Analytics
```bash
□ Configurar GA4
□ Implementar event tracking
□ Dashboards customizados
□ Funnels de conversão
□ Estimativa: 16 horas
```

#### 7.4 A/B Testing
```bash
□ Configurar ferramenta (Optimizely, VWO)
□ Implementar feature flags
□ Criar experimentos
□ Analisar resultados
□ Estimativa: 12 horas
```

#### 7.5 SEO Optimization
```bash
□ Adicionar metadata completa
□ Implementar sitemap.xml
□ robots.txt otimizado
□ Structured data (JSON-LD)
□ Estimativa: 8 horas
```

#### 7.6 Accessibility Audit
```bash
□ Rodar axe-core audit
□ Corrigir issues de WCAG AA
□ Testar com screen readers
□ Keyboard navigation completa
□ Estimativa: 12 horas
```

---

## 📊 MÉTRICAS DE SUCESSO

### Build & Deploy
- ✅ Build time: < 3 minutos
- ✅ Deploy success rate: > 98%
- ✅ Rollback time: < 5 minutos

### Performance
- ✅ Lighthouse Performance: >= 90
- ✅ Lighthouse Accessibility: >= 95
- ✅ Lighthouse Best Practices: >= 95
- ✅ Lighthouse SEO: >= 90
- ✅ First Load JS: < 200KB
- ✅ LCP (Largest Contentful Paint): < 2.5s
- ✅ FID (First Input Delay): < 100ms
- ✅ CLS (Cumulative Layout Shift): < 0.1

### Quality
- ✅ Test coverage: >= 60%
- ✅ TypeScript errors: 0
- ✅ ESLint warnings: 0
- ✅ Bundle size increase: < 10% per PR

### Security
- ✅ No exposed secrets
- ✅ No critical vulnerabilities
- ✅ Rate limiting implemented
- ✅ Error tracking active
- ✅ HTTPS enforced

### User Experience
- ✅ PWA installable
- ✅ Offline functionality
- ✅ Mobile-first responsive
- ✅ Touch-friendly (44px targets)
- ✅ Loading states em todas as ações
- ✅ Error messages claros

---

## 🚀 CRONOGRAMA RESUMIDO

| Fase | Duração | Inicio | Fim | Blocker? |
|------|---------|--------|-----|----------|
| **Fase 1: Correções Críticas** | 2-3h | Imediato | D+0 | SIM |
| **Fase 2: Implementações Críticas** | 1-2 dias | D+0 | D+2 | SIM |
| **Fase 3: Testes e Qualidade** | 3-5 dias | D+2 | D+7 | NÃO |
| **Fase 4: Features Incompletas** | 2-3 dias | D+3 | D+6 | NÃO |
| **Fase 5: Performance** | 1 semana | D+7 | D+14 | NÃO |
| **Fase 6: Documentação** | 3-4 dias | D+7 | D+11 | NÃO |
| **Fase 7: Long-term** | Ongoing | D+14 | - | NÃO |

**Legenda:**
- D+0 = Hoje (início imediato)
- D+N = N dias após início

**MVP Production-Ready:** D+2 (2 dias)
**Full Production-Ready:** D+7 (1 semana)
**Optimized & Complete:** D+14 (2 semanas)

---

## ✅ PRÓXIMOS PASSOS IMEDIATOS

### Agora (próximas 3 horas)

1. **[URGENTE] Fix proxy.ts** (5 min)
   ```bash
   # Renomear função middleware → proxy
   git checkout -b fix/proxy-migration
   # Editar proxy.ts
   npm run build  # Verificar que passa
   git commit -m "fix(middleware): rename to proxy for Next.js 16"
   ```

2. **[CRÍTICO] Revogar API Keys** (30 min)
   - Supabase → Revogar + gerar novas
   - Anthropic → Revogar + gerar novas
   - OpenAI → Revogar + gerar novas
   - Google AI → Revogar + gerar novas
   - Perplexity → Revogar + gerar novas

3. **[CRÍTICO] Atualizar .env.example** (5 min)
   ```bash
   # Substituir todas as chaves por placeholders
   git commit -m "security: remove exposed API keys"
   ```

4. **[CRÍTICO] Configurar Secrets Netlify** (20 min)
   - Adicionar todas as novas chaves
   - Testar deploy

5. **[ALTO] Executar Database Scripts** (30 min)
   ```sql
   -- No Supabase SQL Editor, executar em ordem:
   -- 001, 002, 003, 004, 005, 013, 014
   ```

6. **[ALTO] Testar Signup** (15 min)
   - Criar conta teste
   - Verificar que trigger funciona
   - Verificar que não dá 500 error

### Hoje (próximas 8 horas)

7. **Implementar Rate Limiting** (3h)
8. **Configurar Sentry** (2h)
9. **Adicionar PWA Screenshots** (20min)
10. **Criar Offline Page** (1h)
11. **Fix Test Path Resolution** (1h)

### Esta Semana (próximos 7 dias)

12. Escrever testes (Component, Hook, API, E2E)
13. Implementar features incompletas (Audio, Baby Profile)
14. Otimizar performance (Bundle, Images, DB)
15. Completar documentação

---

## 🎯 CRITÉRIOS DE ACEITAÇÃO

### Para Deploy em Staging
- ✅ Build passa sem erros
- ✅ Nenhuma chave exposta
- ✅ Database configurado (scripts executados)
- ✅ Signup funciona
- ✅ Manifest.json válido

### Para Deploy em Production
- ✅ Todos os critérios de Staging
- ✅ Rate limiting implementado
- ✅ Error tracking ativo (Sentry)
- ✅ Test coverage >= 40%
- ✅ Lighthouse Performance >= 80
- ✅ Smoke tests passando

### Para "Production-Ready" Completo
- ✅ Todos os critérios de Production
- ✅ Test coverage >= 60%
- ✅ Lighthouse Performance >= 90
- ✅ E2E tests para critical paths
- ✅ Documentação completa
- ✅ Performance budget implementado

---

## 📞 CONTATOS E RECURSOS

### Dashboards
- Supabase: https://app.supabase.com
- Netlify: https://app.netlify.com
- Anthropic: https://console.anthropic.com
- OpenAI: https://platform.openai.com
- Sentry: https://sentry.io (a configurar)

### Documentação Técnica
- Next.js 16: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Vercel AI SDK: https://sdk.vercel.ai/docs

### Suporte
- GitHub Issues: [repositório]/issues
- Email: [seu email]

---

## 📝 CHANGELOG

### [Unreleased]
- CRITICAL: Build failing due to proxy.ts
- CRITICAL: All API keys exposed in .env.example
- CRITICAL: Signup returning 500 error
- HIGH: Manifest.json syntax error
- HIGH: No rate limiting implemented
- HIGH: No error tracking configured
- MEDIUM: Test path resolution issues
- MEDIUM: Missing PWA screenshots

### [0.1.0] - 2025-01-03
- Initial project structure
- 18 pages implemented
- 16 API routes created
- 27 components built
- Multi-AI integration
- Gamification system
- PWA configuration
- Netlify deployment setup
- 26 documentation files
- CI/CD with GitHub Actions

---

**Documento mantido por:** Claude Code
**Última revisão:** 2025-11-03
**Próxima revisão:** Após Fase 1 (correções críticas)

---

