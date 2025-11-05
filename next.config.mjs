// Configuração do Next.js com suporte opcional para Sentry
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações de performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  // Otimizações para mobile e PWA
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Configurações de compilação
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  // Webpack: ignorar arquivos Expo/React Native
  webpack: (config, { isServer }) => {
    // Ignorar arquivos Expo/React Native no build
    config.resolve.alias = {
      ...config.resolve.alias,
      // Ignorar módulos Expo se tentarem ser importados
      'expo-router': false,
      'expo': false,
      'react-native': false,
    }
    return config
  },
}

// Sentry é configurado via arquivos separados (sentry.client.config.ts, sentry.server.config.ts)
// Não é necessário wrappear nextConfig aqui - o Sentry funciona automaticamente se instalado
export default nextConfig
