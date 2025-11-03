import { MetadataRoute } from 'next'

/**
 * Gera o sitemap.xml dinâmico para SEO
 *
 * Prioridades:
 * - 1.0: Página inicial (home)
 * - 0.8: Páginas principais (conteúdo importante e acessado frequentemente)
 * - 0.7: Páginas secundárias (conteúdo estático ou menos prioritário)
 *
 * ChangeFreq:
 * - 'weekly': Conteúdo dinâmico que muda frequentemente (chat, dashboard, receitas)
 * - 'monthly': Conteúdo estático ou que muda raramente (sobre, termos, privacidade)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Obtém a URL base do site da variável de ambiente ou usa o domínio padrão
  // Domínio real: https://nossamaternidade.netlify.app
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nossamaternidade.netlify.app'

  // Remove trailing slash se existir para manter URLs consistentes
  const siteUrl = baseUrl.replace(/\/$/, '')

  /**
   * Define todas as rotas públicas indexáveis do projeto
   * Organizadas por prioridade e frequência de mudança
   *
   * NOTA: Rotas excluídas (privadas/temporárias):
   * - /login, /signup, /signup-success (autenticação)
   * - /offline (página de erro offline)
   * - /code-agents (ferramenta interna)
   */
  const routes: MetadataRoute.Sitemap = [
    // === PÁGINA INICIAL ===
    // Prioridade máxima: ponto de entrada principal
    {
      url: `${siteUrl}/`,
      priority: 1.0,
      changeFrequency: 'weekly',
      lastModified: new Date(),
    },

    // === PÁGINAS PRINCIPAIS (Prioridade: 0.8) ===
    // Conteúdo dinâmico e interativo, atualizado regularmente

    // Chat: Chat com NathAI, conteúdo dinâmico, atualizações frequentes
    {
      url: `${siteUrl}/chat`,
      priority: 0.8,
      changeFrequency: 'weekly',
      lastModified: new Date(),
    },

    // Dashboard: Dashboard principal, área do usuário, dados atualizados
    {
      url: `${siteUrl}/dashboard`,
      priority: 0.8,
      changeFrequency: 'weekly',
      lastModified: new Date(),
    },

    // Maternidade Hoje: Feed de notícias maternas, atualizado diariamente
    {
      url: `${siteUrl}/maternidade-hoje`,
      priority: 0.8,
      changeFrequency: 'daily',
      lastModified: new Date(),
    },

    // Receitas: Receitas geradas por IA, conteúdo atualizado regularmente
    {
      url: `${siteUrl}/receitas`,
      priority: 0.8,
      changeFrequency: 'weekly',
      lastModified: new Date(),
    },

    // Mundo Nath: Conteúdo exclusivo da Nathália
    {
      url: `${siteUrl}/mundo-nath`,
      priority: 0.8,
      changeFrequency: 'weekly',
      lastModified: new Date(),
    },

    // === PÁGINAS SECUNDÁRIAS (Prioridade: 0.7) ===
    // Conteúdo mais estático ou informacional

    // Onboarding: Primeira experiência do usuário
    {
      url: `${siteUrl}/onboarding`,
      priority: 0.7,
      changeFrequency: 'monthly',
      lastModified: new Date(),
    },

    // Perfil do Bebê: Perfil e informações do bebê
    {
      url: `${siteUrl}/perfil-bebe`,
      priority: 0.7,
      changeFrequency: 'weekly',
      lastModified: new Date(),
    },

    // Rotina: Planejador de rotina semanal
    {
      url: `${siteUrl}/rotina`,
      priority: 0.7,
      changeFrequency: 'weekly',
      lastModified: new Date(),
    },

    // Autocuidado: 10 sugestões de autocuidado
    {
      url: `${siteUrl}/autocuidado`,
      priority: 0.7,
      changeFrequency: 'monthly',
      lastModified: new Date(),
    },

    // Brincadeiras: 6 atividades sensoriais
    {
      url: `${siteUrl}/brincadeiras`,
      priority: 0.7,
      changeFrequency: 'monthly',
      lastModified: new Date(),
    },

    // Histórias de Sono: 5 histórias para dormir
    {
      url: `${siteUrl}/historias-sono`,
      priority: 0.7,
      changeFrequency: 'monthly',
      lastModified: new Date(),
    },

    // Birras: Gestão de birras (5 situações)
    {
      url: `${siteUrl}/birras`,
      priority: 0.7,
      changeFrequency: 'monthly',
      lastModified: new Date(),
    },
  ]

  // Retorna o sitemap no formato esperado pelo Next.js 16
  return routes
}
