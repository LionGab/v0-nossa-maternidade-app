import { generateMetadata } from "@/lib/metadata"
import type { Metadata } from "next"

// Exemplo de página tipo "article" (blog)
export const metadata: Metadata = generateMetadata({
  title: 'Maternidade Hoje - Notícias e Tendências',
  description: 'Notícias, tendências e informações atualizadas sobre maternidade, gestação e criação de filhos',
  route: '/maternidade-hoje',
  type: 'article',
  image: '/og-image-default.png', // Substituir por imagem específica quando disponível
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
