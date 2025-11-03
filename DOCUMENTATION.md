# 📚 Nossa Maternidade - Documentação Completa

## 🎯 Visão Geral

Nossa Maternidade é um aplicativo mobile-first (PWA) desenvolvido com Next.js 16, Supabase e IA, oferecendo suporte emocional, rastreamento de bem-estar e uma comunidade para mães.

---

## 🏗️ Arquitetura

### Stack Tecnológico

```
Frontend:
├── Next.js 16 (App Router + Turbopack)
├── React 19
├── TypeScript 5.7
├── Tailwind CSS 4
└── Shadcn/ui Components

Backend:
├── Supabase (Auth + Database + Storage)
├── PostgreSQL (com RLS)
└── Edge Functions

IA:
├── Anthropic Claude (Chat empático)
├── OpenAI GPT-4 (Conteúdo e recomendações)
└── Google Gemini (Análise contextual)

Infraestrutura:
├── Netlify (Hosting + CDN)
├── GitHub Actions (CI/CD)
└── PWA (Service Worker)
```

### Fluxo de Dados

```
┌─────────────┐
│   Client    │ ←→ SWR Cache
│  (Browser)  │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Next.js    │ ←→ Server Cache
│  API Routes │
└──────┬──────┘
       │
       ├──→ Supabase (Auth, DB)
       ├──→ Anthropic API
       ├──→ OpenAI API
       └──→ Google AI API
```

---

## 📁 Estrutura do Projeto

```
nossa-maternidade-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── gamification/         # Sistema de gamificação
│   │   ├── multi-ai/            # Endpoints de IA
│   │   └── mcp/                  # Memory & Context
│   ├── dashboard/                # Dashboard principal
│   ├── login/                    # Autenticação
│   ├── signup/                   # Cadastro
│   ├── chat/                     # Chat com NathAI
│   └── ...                       # Outras páginas
│
├── components/                   # Componentes React
│   ├── ui/                      # Componentes base (shadcn)
│   ├── error-boundary.tsx       # Error handling
│   ├── pwa-install-prompt.tsx   # PWA install
│   └── ...
│
├── lib/                         # Bibliotecas e utilitários
│   ├── supabase/               # Clientes Supabase
│   │   ├── server.ts          # Server-side (@supabase/ssr)
│   │   └── client.ts          # Client-side
│   ├── gamification/          # Sistema de pontos
│   ├── validations/           # Schemas Zod
│   ├── env.ts                 # Validação de env vars
│   └── utils.ts               # Funções auxiliares
│
├── hooks/                      # Custom React Hooks
│   └── usePWA.ts              # Hook PWA
│
├── public/                     # Assets estáticos
│   ├── icons/                 # Ícones PWA
│   ├── manifest.json          # PWA Manifest
│   └── sw.js                  # Service Worker
│
├── scripts/                    # Scripts SQL Supabase
│   ├── 001_create_tables.sql
│   ├── 002_create_profile_trigger.sql
│   └── ...
│
├── __tests__/                  # Testes
│   ├── lib/                   # Testes de bibliotecas
│   └── e2e/                   # Testes E2E (Playwright)
│
├── .github/                    # GitHub Actions
│   └── workflows/
│       └── ci-cd.yml          # Pipeline CI/CD
│
├── .env.example               # Template de variáveis
├── netlify.toml               # Config Netlify
├── next.config.mjs            # Config Next.js
└── tsconfig.json              # Config TypeScript
```

---

## 🔐 Autenticação

### Implementação com @supabase/ssr

#### Server-side (lib/supabase/server.ts)

```typescript
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => 
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

#### Client-side (lib/supabase/client.ts)

```typescript
import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client
  
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  return client
}
```

#### Middleware (middleware.ts)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(...)
  const { data: { user } } = await supabase.auth.getUser()
  
  // Proteger rotas
  if (!user && isProtectedRoute) {
    return NextResponse.redirect('/login')
  }
  
  return response
}
```

### Fluxo de Autenticação

```
1. Usuário acessa /signup
   ↓
2. Preenche formulário
   ↓
3. supabase.auth.signUp()
   ↓
4. Trigger cria perfil automaticamente
   ↓
5. Redirect para /onboarding
   ↓
6. Completa onboarding
   ↓
7. Redirect para /dashboard
```

---

## 🤖 Integração com IA

### Validação de API Keys

Todas as APIs usam validação segura:

```typescript
import { getApiKey, hasApiKey } from '@/lib/env'

// Inicialização condicional
let anthropic: Anthropic | null = null

if (hasApiKey('anthropic')) {
  anthropic = new Anthropic({
    apiKey: getApiKey('anthropic')!,
  })
}

// Uso com fallback
if (!anthropic) {
  return NextResponse.json({ 
    error: "API não disponível" 
  }, { status: 503 })
}
```

### APIs Disponíveis

#### 1. Chat Multi-AI (`/api/multi-ai/chat`)
- **Claude**: Modo empático
- **GPT-4**: Conversação geral
- **Streaming**: Respostas em tempo real

#### 2. Análise de Sentimento (`/api/multi-ai/sentiment`)
- **Claude**: Análise empática profunda
- **Gemini**: Padrões contextuais
- **Output**: Risk score + recomendações

#### 3. Recomendações (`/api/multi-ai/recommendations`)
- **GPT-4**: Geração personalizada
- **Gemini**: Enriquecimento contextual
- **Input**: Categoria + histórico

#### 4. Triagem Pós-Parto (`/api/multi-ai/postpartum-screening`)
- **Claude**: Análise psicológica
- **Gemini**: Padrões temporais
- **Output**: EPDS score + alertas

---

## 🎮 Sistema de Gamificação

### Estrutura

```typescript
interface Gamification {
  user_id: string
  level: number
  points: number
  streak_days: number
  total_activities: number
  achievements: string[]
}
```

### Mecânicas

- **Pontos**: +10 por atividade
- **Níveis**: A cada 100 pontos
- **Streaks**: Dias consecutivos
- **Conquistas**: Desbloqueáveis

### Uso

```typescript
import { GamificationManager } from '@/lib/gamification'

const manager = new GamificationManager(userId, supabase)
await manager.recordActivity('chat_session')
```

---

## 📱 PWA (Progressive Web App)

### Configuração

#### manifest.json
- Nome: "Nossa Maternidade"
- Tema: #FF69B4 (Rosa maternal)
- Ícones: 72x72 até 512x512
- Display: standalone
- Orientação: portrait

#### Service Worker (sw.js)
- Estratégia: Network First
- Cache: Runtime + Precache
- Offline: Fallback para cache

### Instalação

```typescript
import { usePWA } from '@/hooks/usePWA'

function MyComponent() {
  const { isInstallable, promptInstall } = usePWA()
  
  return (
    isInstallable && (
      <button onClick={promptInstall}>
        Instalar App
      </button>
    )
  )
}
```

---

## 🧪 Testes

### Testes Unitários (Vitest)

```bash
npm run test              # Executar testes
npm run test:watch        # Modo watch
npm run test:coverage     # Com coverage
```

### Testes E2E (Playwright)

```bash
npm run test:e2e          # Executar E2E
npm run test:e2e:ui       # Interface visual
```

### Coverage Mínima

- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

---

## 🚀 Deploy

### Desenvolvimento

```bash
npm install --legacy-peer-deps
npm run dev
```

### Produção

```bash
npm run build
npm start
```

### Netlify

```bash
# Automático via Git
git push origin main

# Manual via CLI
netlify deploy --prod
```

---

## 🔍 Monitoramento

### Métricas

- **Performance**: Lighthouse CI
- **Errors**: Console + Sentry (opcional)
- **Analytics**: Vercel Analytics (opcional)
- **Logs**: Netlify Logs

### Web Vitals

- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

---

## 🛠️ Desenvolvimento

### Convenções de Código

```typescript
// Componentes: PascalCase
export function MyComponent() {}

// Funções: camelCase
export function myFunction() {}

// Constantes: UPPER_SNAKE_CASE
export const API_KEY = '...'

// Tipos: PascalCase com sufixo
export type UserProfile = {}
export interface ApiResponse {}
```

### Git Workflow

```bash
main          # Produção
  ↑
develop       # Staging
  ↑
feature/*     # Novas features
bugfix/*      # Correções
hotfix/*      # Urgente
```

### Commits Convencionais

```
feat: Nova funcionalidade
fix: Correção de bug
docs: Documentação
style: Formatação
refactor: Refatoração
test: Testes
chore: Manutenção
```

---

## 📞 Suporte

- **Documentação**: Este arquivo + outros `.md`
- **Issues**: GitHub Issues
- **Email**: suporte@nossamaternidade.com

---

**Desenvolvido com ❤️ para mães do Brasil**
