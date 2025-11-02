# 👶 Nossa Maternidade App

> Um aplicativo de maternidade acolhedor, construído com Next.js 15, Supabase e IA, oferecendo suporte emocional, rastreamento de bem-estar e uma comunidade para mães.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-3EF7-green?style=for-the-badge&logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Recursos](#-recursos)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Desenvolvimento](#-desenvolvimento)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Arquitetura](#-arquitetura)

---

## 🎯 Visão Geral

O **Nossa Maternidade** é uma plataforma digital que oferece suporte emocional e prático para mães durante a maternidade. Com inteligência artificial integrada, gamificação acolhedora e uma comunidade dedicada, o app ajuda mães a navegar pela jornada materna com confiança e bem-estar.

### Características Principais

- 🤖 **Assistente IA Empática**: NathAI fornece suporte personalizado 24/7
- 📊 **Gamificação**: Sistema de conquistas e desafios para manter motivação
- 📝 **Diário Digital**: Registro de sentimentos e experiências
- 🎥 **Conteúdo Exclusivo**: Mundo Nath com vídeos e dicas
- 👨‍🍳 **Receitas IA**: Sugestões personalizadas baseadas no humor e necessidades
- 📰 **Notícias Atualizadas**: Conteúdo relevante sobre maternidade
- 🏥 **Triagens de Saúde**: Acompanhamento de bem-estar mental

---

## 🚀 Recursos

### Autenticação e Perfis
- ✅ Autenticação via Supabase com OAuth
- ✅ Perfis personalizados com onboarding
- ✅ Middleware de proteção de rotas
- ✅ RLS (Row Level Security) no banco de dados

### Inteligência Artificial
- ✅ Chat empático com Claude (Anthropic)
- ✅ Geração de conteúdo com GPT-4
- ✅ Análise de sentimento multi-modelo
- ✅ Recomendações personalizadas

### Gamificação
- ✅ Sistema de níveis e pontos
- ✅ Sequências (streaks) de atividades
- ✅ Conquistas desbloqueáveis
- ✅ Desafios semanais

### Performance e Segurança
- ✅ Caching com TanStack Query (migrado de SWR)
- ✅ State management com Zustand
- ✅ Rate limiting
- ✅ Validação com Zod
- ✅ Indexes otimizados no banco
- ✅ Error tracking com Sentry
- ✅ Health data schemas baseados em FHIR

---

## 🛠 Tecnologias

### Frontend
- **Next.js 16** - React framework com App Router
- **React 19** - Library UI
- **TypeScript 5** - Type safety
- **Tailwind CSS v4** - Styling e design system
- **Shadcn/ui** - Component library (Radix UI)
- **TanStack Query** - Data fetching, caching e sincronização
- **Zustand** - State management global
- **SWR** - Data fetching (being migrated to TanStack Query)

### Backend & Database
- **Supabase** - Authentication, Database, Storage, Realtime
- **PostgreSQL** - Relational database
- **Row Level Security (RLS)** - Segurança a nível de banco de dados
- **Supabase Edge Functions** - Serverless functions

### IA e Processamento
- **Anthropic Claude** - Chat empático e assistência personalizada
- **OpenAI GPT-4** - Geração de conteúdo e análises
- **Google Generative AI** - Recursos complementares de IA
- **Vercel AI SDK** - Integração unificada com modelos de IA

### Validação e Forms
- **Zod** - Schema validation
- **React Hook Form** - Form handling e validação

### Testes
- **Vitest** - Testes unitários e de integração
- **Playwright** - Testes E2E
- **Testing Library** - Testes de componentes React
- **jsdom** - DOM simulation para testes

### DevOps & Monitoramento
- **Vercel** - Hosting, CI/CD e Analytics
- **GitHub Actions** - CI/CD pipelines
- **Sentry** - Error tracking e performance monitoring
- **Vercel Analytics** - Web analytics e performance

### Ferramentas de Desenvolvimento
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

---

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ ou superior
- pnpm (ou npm/yarn)
- Conta no Supabase
- Chaves de API (Anthropic, OpenAI)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/nossa-maternidade-app.git
cd nossa-maternidade-app
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica

# IA
ANTHROPIC_API_KEY=sua-chave-anthropic
OPENAI_API_KEY=sua-chave-openai

# URLs
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/onboarding
```

4. **Configure o banco de dados**

Execute os scripts SQL na ordem:

```bash
# No Supabase Dashboard > SQL Editor
scripts/001_create_tables.sql
scripts/002_create_profile_trigger.sql
scripts/003_add_advanced_tables.sql
scripts/004_enable_vector_extension.sql
scripts/005_gamification_system.sql
scripts/013_enable_rls_security.sql
scripts/014_add_performance_indexes.sql
scripts/fix_handle_new_user.sql
```

---

## ⚙️ Configuração

### Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Configure autenticação:
   - Email/Password
   - Providers OAuth (opcional)
3. Execute os scripts SQL acima
4. Configure storage buckets (se necessário)

### Configuração de APIs de IA

1. **Anthropic**: Crie conta em [anthropic.com](https://anthropic.com)
2. **OpenAI**: Crie conta em [platform.openai.com](https://platform.openai.com)

---

## 💻 Desenvolvimento

### Rodar em desenvolvimento

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Estrutura do Projeto

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard principal
│   ├── login/             # Página de login
│   ├── signup/            # Página de cadastro
│   ├── onboarding/        # Fluxo de onboarding
│   └── ...
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── providers.tsx     # Context providers
│   └── ...
├── lib/                   # Bibliotecas e utilities
│   ├── gamification/     # Sistema de gamificação
│   ├── mcp/              # Memory management
│   ├── supabase/         # Clientes Supabase
│   ├── validations/      # Schemas Zod
│   ├── schemas/          # Health data schemas (FHIR)
│   ├── query-client.ts   # TanStack Query config
│   └── ...
├── stores/                # Zustand global stores
│   ├── user-store.ts     # User state
│   ├── ui-store.ts       # UI state
│   └── health-data-store.ts  # Health data state
├── hooks/                 # Custom React hooks
├── scripts/               # Scripts SQL e utilitários
├── e2e/                   # Testes E2E (Playwright)
├── __tests__/             # Testes unitários (Vitest)
├── public/                # Assets estáticos
├── .github/               # GitHub Actions workflows
│   └── workflows/        # CI/CD pipelines
├── sentry.*.config.ts     # Sentry configuration
└── ...
```

### Padrões de Código

#### Estrutura de Componentes
```typescript
// components/my-component.tsx
'use client'; // Se necessário

import { useState } from 'react';
import { useMyHook } from '@/hooks/use-my-hook';

interface MyComponentProps {
  title: string;
  // Props tipadas
}

export function MyComponent({ title }: MyComponentProps) {
  // Hooks
  const [state, setState] = useState();
  
  // Lógica
  
  // Render
  return <div>{title}</div>;
}
```

#### API Routes
```typescript
// app/api/my-route/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Lógica
    return NextResponse.json({ data: 'success' });
  } catch (error) {
    return NextResponse.json({ error: 'Message' }, { status: 500 });
  }
}
```

#### Data Fetching com TanStack Query
```typescript
// hooks/use-my-data.ts
import { useQuery } from '@tanstack/react-query';

export function useMyData(id: string) {
  return useQuery({
    queryKey: ['my-data', id],
    queryFn: async () => {
      const response = await fetch(`/api/data/${id}`);
      return response.json();
    },
  });
}
```

#### Global State com Zustand
```typescript
// stores/my-store.ts
import { create } from 'zustand';

interface MyState {
  count: number;
  increment: () => void;
}

export const useMyStore = create<MyState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

---

## 🧪 Testes

### Testes Unitários

```bash
# Rodar testes
pnpm test

# Modo watch
pnpm test:watch

# Interface visual
pnpm test:ui

# Coverage
pnpm test:coverage
```

### Testes E2E

```bash
# Rodar testes E2E
pnpm test:e2e

# Interface visual
pnpm test:e2e:ui

# Rodar em modo debug
DEBUG=pw:api pnpm test:e2e
```

---

## 🚀 Deploy

### Deploy na Vercel (Recomendado)

1. **Conecte seu repositório**
   - Vá para [vercel.com](https://vercel.com)
   - Importe o projeto do GitHub

2. **Configure variáveis de ambiente**
   - Adicione todas as variáveis do `.env.local` na Vercel

3. **Deploy automático**
   - Cada push para `main` gera um novo deploy

### Build local

```bash
pnpm build
pnpm start
```

---

## 🏗 Arquitetura

### Fluxo de Autenticação

```
1. Usuário acessa app
2. Middleware verifica autenticação
3. Não autenticado → redireciona /login
4. Autenticado → permite acesso
5. Rotas protegidas validadas
```

### Fluxo de Dados

```
Frontend (Next.js)
    ↓ TanStack Query
API Routes
    ↓
Supabase Client
    ↓
PostgreSQL + RLS
```

### Cache Strategy

- **TanStack Query**: Frontend caching com revalidação inteligente
- **Zustand**: State management global persistente
- **Deduplicação**: Requisições duplicadas deduplicadas automaticamente
- **Revalidação**: Automática em foco, reconexão e por intervalo

---

## 📚 Documentação Adicional

- [Repositórios de Referência](REFERENCES.md) - Recursos e exemplos organizados
- [Arquitetura Detalhada](ARCHITECTURE.md) - Documentação de arquitetura
- [API Docs](API_DOCS.md) - Documentação das APIs
- [Guia de Contribuição](CONTRIBUTING.md) - Como contribuir para o projeto
- [Guia de Troubleshooting](TROUBLESHOOTING.md) - Solução de problemas
- [Status da Migração](MIGRATION_STATUS.md) - Progresso atual

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [Guia de Contribuição](CONTRIBUTING.md) para detalhes sobre o processo de desenvolvimento e como submeter pull requests.

### Passos Rápidos

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript para todo código novo
- Siga as configurações do ESLint e Prettier
- Escreva testes para novas funcionalidades
- Documente APIs e funções públicas
- Use commits semânticos (Conventional Commits)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👥 Autores

- **Time Nossa Maternidade** - Desenvolvimento e Design

---

## 🙏 Agradecimentos

- [Supabase](https://supabase.com) pela infraestrutura
- [Anthropic](https://anthropic.com) e [OpenAI](https://openai.com) pelas APIs de IA
- [Shadcn](https://ui.shadcn.com) pelos componentes
- [Vercel](https://vercel.com) pelo hosting

---

**Feito com ❤️ para mães de todo o Brasil**
