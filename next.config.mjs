/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desabilitar erros de TypeScript durante build (temporário)
  typescript: {
    ignoreBuildErrors: false,
  },
  // Otimizações para mobile e PWA
  images: {
    unoptimized: true, // Necessário para Netlify static export
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Otimizações de performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Configuração para Netlify
  output: 'standalone',
  // Headers de segurança e PWA
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ]
  },
  // Configurações de compilação
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
}

export default nextConfig
