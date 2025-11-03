/**
 * Sistema de Metadados Open Graph
 * Gera metadados completos para compartilhamento social (Facebook, Instagram, WhatsApp, Twitter)
 * Compatível com Next.js 16 App Router
 */

import type { Metadata } from 'next'
import { getEnvConfig } from './env'
import { logger } from './logger'

// Configuração padrão da aplicação
const APP_CONFIG = {
  name: 'Nossa Maternidade',
  defaultDescription: 'Apoio emocional, organização da rotina e autocuidado na jornada da maternidade com IA e gamificação',
  defaultImage: '/og-image-default.png', // 1200x630px
  locale: 'pt_BR',
  siteName: 'Nossa Maternidade',
  creator: 'Nossa Maternidade Team',
} as const

/**
 * Tipo para configuração de metadados de artigo (blog)
 */
export interface ArticleMetadata {
  publishedTime?: string // ISO 8601 format
  modifiedTime?: string // ISO 8601 format
  authors?: string[]
  tags?: string[]
}

/**
 * Tipo principal para configuração de metadados
 */
export interface MetadataConfig {
  /** Título da página (obrigatório) */
  title: string
  /** Descrição da página (obrigatório) */
  description: string
  /** Rota da página (ex: '/dashboard', '/chat') - usado para URL canonical */
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

/**
 * Obtém a URL base da aplicação
 */
function getBaseUrl(): string {
  const env = getEnvConfig()
  return env.app.url || 'https://nossa-maternidade.app'
}

/**
 * Normaliza a rota para URL completa
 */
function buildCanonicalUrl(route: string): string {
  const baseUrl = getBaseUrl()
  // Remove trailing slash do baseUrl se existir
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')
  // Garante que route comece com /
  const cleanRoute = route.startsWith('/') ? route : `/${route}`
  return `${cleanBaseUrl}${cleanRoute}`
}

/**
 * Normaliza o caminho da imagem
 */
function buildImageUrl(imagePath: string): string {
  // Se já é URL completa, retorna como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  // Se começa com /, usa baseUrl
  if (imagePath.startsWith('/')) {
    return `${getBaseUrl()}${imagePath}`
  }
  // Caso contrário, adiciona / no início
  return `${getBaseUrl()}/${imagePath}`
}

/**
 * Gera metadados completos para uma página
 *
 * @param config - Configuração de metadados
 * @returns Metadata compatível com Next.js 16
 *
 * @example
 * ```ts
 * export const metadata = generateMetadata({
 *   title: 'Dashboard - Nossa Maternidade',
 *   description: 'Gerencie sua jornada maternal',
 *   route: '/dashboard',
 *   image: '/og-dashboard.png'
 * })
 * ```
 */
export function generateMetadata(config: MetadataConfig): Metadata {
  const {
    title,
    description,
    route,
    image,
    type = 'website',
    article,
    keywords = [],
    noindex = false,
    nofollow = false,
  } = config

  // Validação
  if (!title || !description || !route) {
    throw new Error('generateMetadata: title, description e route são obrigatórios')
  }

  if (type === 'article' && !article) {
    logger.warn('generateMetadata: type é "article" mas article metadata não foi fornecido', {
      route,
      type,
    })
  }

  // URLs
  const canonicalUrl = buildCanonicalUrl(route)
  const ogImage = buildImageUrl(image || APP_CONFIG.defaultImage)

  // Título completo (página + site)
  const fullTitle = title.includes(APP_CONFIG.name)
    ? title
    : `${title} | ${APP_CONFIG.name}`

  // Keywords combinadas
  const allKeywords = [
    'maternidade',
    'mães',
    'pós-parto',
    'saúde mental',
    'suporte maternal',
    'IA',
    'NathAI',
    ...keywords,
  ]

  // Robots
  const robots = {
    index: !noindex,
    follow: !nofollow,
    googleBot: {
      index: !noindex,
      follow: !nofollow,
    },
  }

  // Metadata base
  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: APP_CONFIG.creator }],
    creator: APP_CONFIG.creator,
    publisher: APP_CONFIG.name,
    robots,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      locale: APP_CONFIG.locale,
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: APP_CONFIG.siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      // Adiciona metadados de artigo se necessário
      ...(type === 'article' && article
        ? {
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
          authors: article.authors?.map(name => ({ name })),
          tags: article.tags,
        }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@nossa_maternidade', // Ajustar quando tiver Twitter
    },
    other: {
      'theme-color': '#FF69B4',
    },
  }

  return metadata
}

/**
 * Tipo de retorno da função generateMetadata
 */
export type GeneratedMetadata = ReturnType<typeof generateMetadata>
