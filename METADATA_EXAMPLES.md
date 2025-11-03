# 📝 Exemplos de Implementação - Metadados Open Graph

## ✅ Exemplos Implementados

### 1. Página Home (Server Component)

**Arquivo**: `app/page.tsx`

```tsx
import { generateMetadata } from "@/lib/metadata"

export const metadata = generateMetadata({
  title: 'Nossa Maternidade - Seu espaço de apoio maternal',
  description: 'Seu espaço seguro para apoio emocional, organização da rotina e autocuidado na jornada da maternidade',
  route: '/',
  image: '/og-image-default.png',
})
```

### 2. Login (Client Component via Layout)

**Arquivo**: `app/login/layout.tsx`

```tsx
import { generateMetadata } from "@/lib/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = generateMetadata({
  title: 'Login - Nossa Maternidade',
  description: 'Entre com seu email e senha para continuar sua jornada de apoio emocional e organização da rotina maternal',
  route: '/login',
  image: '/og-image-default.png',
})

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
```

### 3. Artigo de Blog (Client Component via Layout)

**Arquivo**: `app/maternidade-hoje/layout.tsx`

```tsx
import { generateMetadata } from "@/lib/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = generateMetadata({
  title: 'Maternidade Hoje - Notícias e Tendências',
  description: 'Notícias, tendências e informações atualizadas sobre maternidade, gestação e criação de filhos',
  route: '/maternidade-hoje',
  type: 'article',
  image: '/og-image-default.png',
  keywords: ['notícias', 'maternidade', 'gestação', 'tendências', 'informações'],
  article: {
    publishedTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
    authors: ['Nossa Maternidade Team'],
    tags: ['maternidade', 'notícias', 'gestação', 'criação'],
  },
})

export default function MaternidadeHojeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
```

## 📋 Lista de Imagens OG Necessárias

Todas as imagens devem ser **1200x630px** (aspect ratio 1.91:1) e estar em `/public/`.

### Imagens Obrigatórias

1. ✅ **`og-image-default.png`** - Imagem padrão (fallback)
   - **Dimensões**: 1200x630px
   - **Uso**: Usada quando nenhuma imagem específica é fornecida

### Imagens por Página

2. **`og-home.png`** - Página inicial (`/`)
3. **`og-dashboard.png`** - Dashboard (`/dashboard`)
4. **`og-chat.png`** - Chat com NathAI (`/chat`)
5. **`og-mundo-nath.png`** - Mundo Nath (`/mundo-nath`)
6. **`og-receitas.png`** - Receitas do Coração (`/receitas`)
7. **`og-maternidade-hoje.png`** - Maternidade Hoje (`/maternidade-hoje`)
8. **`og-rotina.png`** - Rotina Semanal (`/rotina`)
9. **`og-autocuidado.png`** - Autocuidado (`/autocuidado`)
10. **`og-brincadeiras.png`** - Brincadeiras (`/brincadeiras`)
11. **`og-historias-sono.png`** - Histórias de Sono (`/historias-sono`)
12. **`og-birras.png`** - Lidando com Birras (`/birras`)
13. **`og-perfil-bebe.png`** - Perfil do Bebê (`/perfil-bebe`)
14. **`og-login.png`** - Login (`/login`)
15. **`og-signup.png`** - Criar Conta (`/signup`)
16. **`og-onboarding.png`** - Onboarding (`/onboarding`)

**Total: 16 imagens** (1 padrão + 15 específicas)

### Template para Criar Imagens

Cada imagem deve incluir:
- Logo/título "Nossa Maternidade"
- Título da página/feature
- Imagem representativa da feature
- Cores da marca (#FF69B4)
- Dimensões: 1200x630px

**Ferramentas recomendadas**:
- Canva (template 1200x630px)
- Figma
- Photoshop

## 🎨 Estrutura de Cada Imagem

```
┌─────────────────────────────────────────┐
│                                         │
│  [Logo]  Nossa Maternidade             │
│                                         │
│  [Imagem representativa da feature]   │
│                                         │
│  Título da Página                      │
│  Descrição breve                       │
│                                         │
└─────────────────────────────────────────┘
      1200px × 630px
```

## 🔍 Como Usar

### Passo 1: Criar a Imagem

1. Use Canva, Figma ou Photoshop
2. Crie um canvas de 1200x630px
3. Adicione logo, título, imagem e descrição
4. Exporte como PNG ou JPG
5. Salve em `/public/og-nome-da-pagina.png`

### Passo 2: Implementar na Página

```tsx
// app/nome-da-pagina/layout.tsx (ou page.tsx para Server Components)
import { generateMetadata } from "@/lib/metadata"

export const metadata = generateMetadata({
  title: 'Título da Página',
  description: 'Descrição da página',
  route: '/nome-da-pagina',
  image: '/og-nome-da-pagina.png', // ← Use a imagem criada
})
```

### Passo 3: Testar

1. **Facebook**: https://developers.facebook.com/tools/debug/
2. **Twitter**: https://cards-dev.twitter.com/validator
3. **WhatsApp**: Compartilhe a URL e veja o preview

## ⚙️ Configuração de Ambiente

Certifique-se de definir a URL base no `.env.local`:

```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Produção (.env.production)
NEXT_PUBLIC_APP_URL=https://nossa-maternidade.app
```

## 📚 Referências

- [Documentação Completa](./METADATA_DOCUMENTATION.md)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
