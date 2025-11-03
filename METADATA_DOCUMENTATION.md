# 📋 Documentação: Sistema de Metadados Open Graph

Sistema completo de metadados para compartilhamento social (Facebook, Instagram, WhatsApp, Twitter) no Next.js 16 App Router.

## 📁 Arquivo Principal

**`lib/metadata.ts`** - Função `generateMetadata()` reutilizável com tipos TypeScript completos.

## 🚀 Uso Básico

### Para Páginas Server Components

```tsx
// app/page.tsx
import { generateMetadata } from "@/lib/metadata"

export const metadata = generateMetadata({
  title: 'Título da Página',
  description: 'Descrição da página',
  route: '/rota',
  image: '/og-image-custom.png', // opcional
})
```

### Para Páginas Client Components

Como metadados só podem ser exportados de Server Components, use um `layout.tsx`:

```tsx
// app/rota/layout.tsx
import { generateMetadata } from "@/lib/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = generateMetadata({
  title: 'Título da Página',
  description: 'Descrição da página',
  route: '/rota',
})

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
```

## 📝 Interface TypeScript

```typescript
interface MetadataConfig {
  /** Título da página (obrigatório) */
  title: string
  /** Descrição da página (obrigatório) */
  description: string
  /** Rota da página (ex: '/dashboard') - usado para URL canonical (obrigatório) */
  route: string
  /** Imagem Open Graph específica (opcional - usa padrão se não fornecido) */
  image?: string
  /** Tipo Open Graph (default: 'website', pode ser 'article' para blog) */
  type?: 'website' | 'article'
  /** Metadados de artigo (obrigatório se type === 'article') */
  article?: ArticleMetadata
  /** Palavras-chave adicionais (opcional) */
  keywords?: string[]
  /** Se não indexar a página (opcional) */
  noindex?: boolean
  /** Se não seguir links (opcional) */
  nofollow?: boolean
}

interface ArticleMetadata {
  publishedTime?: string // ISO 8601 format
  modifiedTime?: string // ISO 8601 format
  authors?: string[]
  tags?: string[]
}
```

## 📚 Exemplos Completos

### Exemplo 1: Página Inicial (Server Component)

```tsx
// app/page.tsx
import { generateMetadata } from "@/lib/metadata"

export const metadata = generateMetadata({
  title: 'Nossa Maternidade - Seu espaço de apoio maternal',
  description: 'Seu espaço seguro para apoio emocional, organização da rotina e autocuidado na jornada da maternidade',
  route: '/',
  image: '/og-image-default.png',
})
```

### Exemplo 2: Layout para Client Component

```tsx
// app/dashboard/layout.tsx
import { generateMetadata } from "@/lib/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = generateMetadata({
  title: 'Dashboard - Nossa Maternidade',
  description: 'Gerencie sua jornada maternal com apoio emocional, rotina organizada e autocuidado',
  route: '/dashboard',
  image: '/og-dashboard.png', // Imagem específica
})

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
```

### Exemplo 3: Artigo de Blog

```tsx
// app/blog/post/[slug]/layout.tsx
import { generateMetadata } from "@/lib/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = generateMetadata({
  title: '5 Dicas para o Pós-Parto - Nossa Maternidade',
  description: 'Descubra 5 dicas essenciais para lidar com o período pós-parto de forma mais tranquila e saudável',
  route: '/blog/post/5-dicas-pos-parto',
  type: 'article',
  image: '/og-blog-pos-parto.png',
  keywords: ['pós-parto', 'maternidade', 'dicas', 'saúde'],
  article: {
    publishedTime: '2024-01-15T10:00:00Z',
    modifiedTime: '2024-01-20T14:30:00Z',
    authors: ['Nathália Valente'],
    tags: ['pós-parto', 'maternidade', 'saúde', 'dicas'],
  },
})
```

### Exemplo 4: Página com SEO Personalizado

```tsx
// app/receitas/layout.tsx
import { generateMetadata } from "@/lib/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = generateMetadata({
  title: 'Receitas do Coração - Nossa Maternidade',
  description: 'Receitas personalizadas baseadas no seu estado emocional e ingredientes disponíveis',
  route: '/receitas',
  image: '/og-receitas.png',
  keywords: ['receitas', 'culinária', 'nutrição', 'maternidade'],
})
```

## 🎨 Metadados Gerados

A função `generateMetadata()` cria automaticamente:

### Open Graph (Facebook, Instagram, WhatsApp)
- `og:title` - Título completo (página + site)
- `og:description` - Descrição fornecida
- `og:image` - Imagem (1200x630px recomendado)
- `og:url` - URL canonical
- `og:type` - Tipo (website ou article)
- `og:locale` - pt_BR
- `og:site_name` - Nossa Maternidade

### Twitter Cards
- `twitter:card` - summary_large_image
- `twitter:title` - Título completo
- `twitter:description` - Descrição
- `twitter:image` - Imagem
- `twitter:creator` - @nossa_maternidade

### Article Metadata (quando type === 'article')
- `article:published_time` - Data de publicação (ISO 8601)
- `article:modified_time` - Data de modificação (ISO 8601)
- `article:author` - Autores
- `article:tag` - Tags

### SEO Básico
- `title` - Título completo para SEO
- `description` - Meta description
- `keywords` - Palavras-chave (incluindo padrões)
- `canonical` - URL canonical
- `robots` - Configuração de indexação

### PWA
- `theme-color` - #FF69B4

## 🖼️ Imagens Open Graph

### Dimensões Recomendadas

- **Tamanho padrão**: 1200x630px (aspect ratio 1.91:1)
- **Formato**: PNG ou JPG
- **Localização**: `/public/`

### Imagem Padrão

A imagem padrão é definida em `lib/metadata.ts`:

```typescript
const APP_CONFIG = {
  defaultImage: '/og-image-default.png', // 1200x630px
  // ...
}
```

### Lista de Imagens OG Necessárias

Crie as seguintes imagens em `/public/`:

1. **`og-image-default.png`** (1200x630px) - Imagem padrão
2. **`og-home.png`** (1200x630px) - Página inicial
3. **`og-dashboard.png`** (1200x630px) - Dashboard
4. **`og-chat.png`** (1200x630px) - Chat com NathAI
5. **`og-mundo-nath.png`** (1200x630px) - Mundo Nath
6. **`og-receitas.png`** (1200x630px) - Receitas do Coração
7. **`og-maternidade-hoje.png`** (1200x630px) - Maternidade Hoje
8. **`og-rotina.png`** (1200x630px) - Rotina Semanal
9. **`og-autocuidado.png`** (1200x630px) - Autocuidado
10. **`og-brincadeiras.png`** (1200x630px) - Brincadeiras
11. **`og-historias-sono.png`** (1200x630px) - Histórias de Sono
12. **`og-birras.png`** (1200x630px) - Lidando com Birras
13. **`og-perfil-bebe.png`** (1200x630px) - Perfil do Bebê
14. **`og-login.png`** (1200x630px) - Login
15. **`og-signup.png`** (1200x630px) - Criar Conta
16. **`og-onboarding.png`** (1200x630px) - Onboarding

**Total: 16 imagens** (incluindo padrão)

### Template para Criar Imagens

Cada imagem deve incluir:
- Logo/título "Nossa Maternidade"
- Título da página/feature
- Imagem representativa
- Cores da marca (#FF69B4)

Ferramentas recomendadas:
- **Canva** (template 1200x630px)
- **Figma**
- **Photoshop**

## 🔧 Configuração da URL Base

A URL base é obtida de `lib/env.ts`:

```typescript
// lib/env.ts
export function getEnvConfig(): EnvConfig {
  return {
    app: {
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      // ...
    }
  }
}
```

Defina a variável de ambiente:

```bash
# .env.local (desenvolvimento)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# .env.production
NEXT_PUBLIC_APP_URL=https://nossa-maternidade.app
```

## 📋 Checklist de Implementação

### Para Cada Página Nova

- [ ] Importar `generateMetadata` de `@/lib/metadata`
- [ ] Exportar `metadata` usando `generateMetadata()`
- [ ] Definir `title`, `description` e `route`
- [ ] Adicionar `image` específica (ou usar padrão)
- [ ] Adicionar `keywords` relevantes
- [ ] Se for blog, adicionar `type: 'article'` e metadados de artigo
- [ ] Criar imagem OG específica (1200x630px)
- [ ] Testar compartilhamento no Facebook Debugger
- [ ] Testar compartilhamento no Twitter Card Validator
- [ ] Verificar preview no WhatsApp

### Para Páginas Client Components

- [ ] Criar arquivo `layout.tsx` na mesma pasta
- [ ] Exportar `metadata` no layout (não na página)
- [ ] Retornar `{children}` no layout

## 🧪 Testar Metadados

### Facebook / Instagram

1. Acesse: https://developers.facebook.com/tools/debug/
2. Cole a URL da página
3. Clique em "Debugar"
4. Verifique preview de Open Graph

### Twitter

1. Acesse: https://cards-dev.twitter.com/validator
2. Cole a URL da página
3. Verifique preview do card

### WhatsApp

1. Compartilhe a URL no WhatsApp
2. Verifique se aparece preview com imagem e descrição

## 📖 Exemplos por Tipo de Página

### Landing Page

```tsx
generateMetadata({
  title: 'Nossa Maternidade - Seu espaço de apoio maternal',
  description: 'Apoio emocional, organização da rotina e autocuidado na jornada da maternidade',
  route: '/',
})
```

### Dashboard / Área Logada

```tsx
generateMetadata({
  title: 'Dashboard - Nossa Maternidade',
  description: 'Gerencie sua jornada maternal',
  route: '/dashboard',
  noindex: true, // Não indexar páginas privadas
})
```

### Artigo de Blog

```tsx
generateMetadata({
  title: 'Título do Artigo - Nossa Maternidade',
  description: 'Descrição do artigo',
  route: '/blog/artigo-slug',
  type: 'article',
  article: {
    publishedTime: '2024-01-15T10:00:00Z',
    authors: ['Autor'],
    tags: ['tag1', 'tag2'],
  },
})
```

### Página de Login

```tsx
generateMetadata({
  title: 'Login - Nossa Maternidade',
  description: 'Entre para continuar sua jornada',
  route: '/login',
  noindex: true, // Não indexar páginas de login
})
```

## ⚠️ Observações Importantes

1. **Client Components**: Metadados só funcionam em Server Components. Use `layout.tsx` para client components.

2. **Imagens**: Sempre use imagens absolutas (começando com `/` ou URL completa). As imagens são convertidas automaticamente para URLs completas.

3. **URL Base**: Certifique-se de definir `NEXT_PUBLIC_APP_URL` corretamente em produção.

4. **Títulos**: O título é automaticamente combinado com o nome do site: `Título | Nossa Maternidade`. Se já incluir "Nossa Maternidade", não duplica.

5. **Keywords**: Keywords padrão são sempre incluídas. Adicione apenas palavras-chave específicas da página.

## 🔗 Links Úteis

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

---

**Desenvolvido para Nossa Maternidade** 💕
