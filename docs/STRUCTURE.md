# Estrutura do Projeto - Nossa Maternidade

## Visão Geral

Este projeto segue uma estrutura **single-repo plano** (tudo na raiz, sem workspaces formais) para manter simplicidade e facilitar o desenvolvimento.

## Estrutura de Diretórios

```
v0-nossa-maternidade-app/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   ├── dashboard/          # Dashboard principal
│   ├── chat/               # Chat com NathAI
│   └── ...                 # Outras páginas
│
├── components/             # Componentes React
│   ├── ui/                 # Componentes base (Shadcn)
│   └── ...                 # Componentes específicos
│
├── lib/                    # Utilities e configs
│   ├── supabase/          # Clientes Supabase
│   ├── validations/        # Schemas Zod
│   ├── gamification/      # Sistema de gamificação
│   ├── env.ts              # Validação de env vars
│   └── ...                 # Outras utilities
│
├── hooks/                  # Custom React hooks
│   └── ...                 # Hooks reutilizáveis
│
├── public/                 # Assets estáticos
│   ├── icons/              # Ícones PWA
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service worker
│
├── __tests__/              # Testes unitários
│   ├── lib/                # Testes de utilities
│   └── ...                 # Outros testes
│
├── e2e/                    # Testes E2E (Playwright)
│   └── ...                 # Testes end-to-end
│
├── scripts/                # Scripts de automação
│   ├── quality-check.mjs   # Validação completa
│   ├── validate-env.mjs    # Validação de env vars
│   ├── validate-build.mjs  # Validação de build
│   └── ...                 # Outros scripts
│
├── docs/                   # Documentação
│   ├── STRUCTURE.md        # Este arquivo
│   ├── QUALITY.md          # Guia de qualidade
│   └── ...                 # Outra documentação
│
├── .github/workflows/      # CI/CD
│   ├── ci-cd.yml           # Pipeline principal
│   └── ...                 # Outros workflows
│
├── .husky/                 # Git hooks (pre-commit)
│   └── pre-commit          # Hook de pre-commit
│
├── package.json            # Scripts de qualidade
├── tsconfig.json           # TypeScript strict
├── eslint.config.mjs       # ESLint configurado
├── vitest.config.ts        # Vitest config
├── playwright.config.ts    # Playwright config
└── next.config.mjs         # Next.js config
```

## Separação de Responsabilidades

### `/app`
- **Next.js App Router** - Páginas e rotas
- **API Routes** - Endpoints da API
- **Layouts** - Layouts compartilhados

### `/components`
- **Componentes React reutilizáveis**
- **UI Components** - Componentes base (Shadcn)
- **Componentes específicos** - Componentes de domínio

### `/lib`
- **Utilities** - Funções auxiliares
- **Configs** - Configurações (Supabase, env vars)
- **Validations** - Schemas Zod
- **Business Logic** - Lógica de negócio (gamificação, etc.)

### `/hooks`
- **Custom React Hooks** - Hooks reutilizáveis
- **Domain Hooks** - Hooks específicos do domínio

### `/public`
- **Assets estáticos** - Imagens, ícones, manifest
- **Service Worker** - PWA support

### `/__tests__`
- **Testes unitários** - Testes de componentes e utilities
- **Vitest** - Framework de testes

### `/e2e`
- **Testes E2E** - Testes end-to-end
- **Playwright** - Framework E2E

### `/scripts`
- **Scripts de automação** - Validação, build, deploy
- **Quality checks** - Scripts de qualidade

### `/docs`
- **Documentação** - Guias, estruturas, processos

### `/.github/workflows`
- **CI/CD** - Pipelines de automação

### `/.husky`
- **Git Hooks** - Pre-commit, pre-push, etc.

## Convenções de Nomenclatura

### Arquivos
- **Componentes:** PascalCase (`UserProfile.tsx`)
- **Hooks:** camelCase com prefixo `use` (`useAuth.ts`)
- **Utilities:** camelCase (`formatDate.ts`)
- **Configs:** kebab-case (`eslint.config.mjs`)

### Diretórios
- **Lowercase** com hífens se necessário (`app/`, `components/`)
- **CamelCase** para diretórios de componentes (`components/UserProfile/`)

## Organização de Código

### Componentes
- Um componente por arquivo
- Componentes relacionados em subdiretórios
- Exemplo: `components/UserProfile/UserProfile.tsx`, `components/UserProfile/index.ts`

### Utilities
- Uma função utilitária por arquivo quando possível
- Agrupar funções relacionadas em módulos
- Exemplo: `lib/utils/date.ts`, `lib/utils/format.ts`

### Testes
- Testes próximos ao código testado quando possível
- Ou em `__tests__/` seguindo a estrutura do código
- Exemplo: `__tests__/lib/utils/date.test.ts`

## Estrutura de Arquivos de Configuração

### Na Raiz
- `package.json` - Scripts e dependências
- `tsconfig.json` - TypeScript config
- `eslint.config.mjs` - ESLint config
- `vitest.config.ts` - Vitest config
- `playwright.config.ts` - Playwright config
- `next.config.mjs` - Next.js config

### Em `.github/workflows`
- `ci-cd.yml` - Pipeline principal de CI/CD

### Em `.husky`
- `pre-commit` - Hook de pre-commit

## Próximos Passos

1. Revisar esta estrutura periodicamente
2. Manter documentação atualizada
3. Adicionar novos diretórios conforme necessário
4. Seguir convenções de nomenclatura

---

**Última atualização:** 2025-01-27
