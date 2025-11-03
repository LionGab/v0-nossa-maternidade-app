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
