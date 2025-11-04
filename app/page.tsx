import { Button } from "@/components/ui/button"
import { generateMetadata } from "@/lib/metadata"
import Image from "next/image"
import Link from "next/link"

export const metadata = generateMetadata({
  title: 'Nossa Maternidade - Seu espaço de apoio maternal',
  description: 'Seu espaço seguro para apoio emocional, organização da rotina e autocuidado na jornada da maternidade',
  route: '/',
  image: '/og-image-default.png',
})

export default function HomePage() {
  return (
    <div className="min-h-screen maternal-gradient">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Nossa Maternidade"
              width={160}
              height={160}
              className="rounded-full shadow-2xl ring-4 ring-white/50"
              priority
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Nossa Maternidade
            </h1>

            <p className="text-lg md:text-xl text-warm max-w-2xl mx-auto leading-relaxed font-light">
              Seu espaço seguro para apoio emocional, organização da rotina e autocuidado na jornada da maternidade
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              asChild
              size="lg"
              className="text-base px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/signup">Começar Minha Jornada</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base px-8 py-6 rounded-full border-2 hover:bg-white/50 transition-all bg-transparent"
            >
              <Link href="/login">Já Sou Membro</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md card-hover border border-border/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-2xl">
              💕
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Apoio Emocional</h3>
            <p className="text-warm text-sm leading-relaxed">
              Análise de sentimentos com IA e sugestões personalizadas para seu bem-estar emocional
            </p>
          </div>

          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md card-hover border border-border/50">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4 text-2xl">
              📅
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Rotina Organizada</h3>
            <p className="text-warm text-sm leading-relaxed">
              Gerencie alimentação, sono e atividades do seu bebê com facilidade e tranquilidade
            </p>
          </div>

          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md card-hover border border-border/50">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-2xl">
              ✨
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Conteúdo Exclusivo</h3>
            <p className="text-warm text-sm leading-relaxed">
              Acesso a dicas, receitas e estratégias da Nathalia Valente para sua jornada
            </p>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-border/50">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-foreground">
            Por que mães confiam em nós
          </h2>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-2xl">
                🛡️
              </div>
              <h3 className="font-semibold text-base md:text-lg">Seguro e Privado</h3>
              <p className="text-sm text-warm">Seus dados protegidos com criptografia de ponta</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto text-2xl">
                💚
              </div>
              <h3 className="font-semibold text-base md:text-lg">Comunidade Acolhedora</h3>
              <p className="text-sm text-warm">Milhares de mães compartilhando experiências</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto text-2xl">
                📚
              </div>
              <h3 className="font-semibold text-base md:text-lg">Baseado em Evidências</h3>
              <p className="text-sm text-warm">Conteúdo validado por especialistas em maternidade</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
