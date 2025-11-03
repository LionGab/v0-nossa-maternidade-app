import { generateMetadata } from "@/lib/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = generateMetadata({
  title: 'Criar Conta - Nossa Maternidade',
  description: 'Comece sua jornada conosco e tenha acesso a apoio emocional, organização da rotina e autocuidado na maternidade',
  route: '/signup',
  image: '/og-image-default.png',
})

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
