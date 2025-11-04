import { SWRProvider } from "@/components/providers/swr-provider"
import type { Metadata } from "next"
import type React from "react"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "Nossa Maternidade - Seu espaço de apoio maternal",
  description: "Apoio emocional, organização da rotina e autocuidado na jornada da maternidade",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Lora:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased min-h-screen touch-manipulation">
        <SWRProvider>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </SWRProvider>
      </body>
    </html>
  )
}
