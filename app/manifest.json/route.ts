import { NextResponse } from 'next/server'

// Força revalidação dinâmica para evitar cache
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const manifest = {
    name: "Nossa Maternidade",
    short_name: "N.Maternidade",
    description: "Aplicativo de suporte emocional e prático para mães - com IA, gamificação e comunidade",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#FF69B4",
    orientation: "portrait-primary",
    scope: "/",
    icons: [
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable any"
      }
    ],
    categories: ["health", "lifestyle", "medical"],
    shortcuts: [
      {
        name: "Chat com NathAI",
        short_name: "Chat",
        description: "Converse com a assistente virtual",
        url: "/chat",
        icons: [
          {
            src: "/icons/icon-96x96.png",
            sizes: "96x96"
          }
        ]
      },
      {
        name: "Diário",
        short_name: "Diário",
        description: "Registre seus sentimentos",
        url: "/dashboard",
        icons: [
          {
            src: "/icons/icon-96x96.png",
            sizes: "96x96"
          }
        ]
      }
    ],
    related_applications: [],
    prefer_related_applications: false
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
