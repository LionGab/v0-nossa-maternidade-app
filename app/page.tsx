import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen maternal-gradient relative overflow-hidden">
      {/* Ilustração decorativa de fundo */}
      <div className="absolute top-20 right-10 w-64 h-64 opacity-10 hidden lg:block">
        <Image
          src="/logo-family.png"
          alt="Maternidade"
          width={256}
          height={256}
          className="object-contain"
        />
      </div>
      <div className="absolute bottom-20 left-10 w-48 h-48 opacity-10 hidden lg:block">
        <Image
          src="/logo-mother-baby.png"
          alt="Maternidade"
          width={192}
          height={192}
          className="object-contain"
        />
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
        <div className="flex flex-col items-center justify-center text-center space-y-10 max-w-4xl mx-auto">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Nossa Maternidade"
              width={180}
              height={180}
              className="rounded-full shadow-2xl ring-4 ring-white/50"
              priority
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">
              Nossa Maternidade
            </h1>

            <p className="text-xl md:text-2xl text-warm max-w-2xl leading-relaxed font-light">
              Seu espaço seguro para apoio emocional, organização da rotina e autocuidado na jornada da maternidade
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              asChild
              size="lg"
              className="text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/signup">Começar Minha Jornada</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-10 py-6 rounded-full border-2 hover:bg-white/50 transition-all bg-transparent"
            >
              <Link href="/login">Já Sou Membro</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md card-hover border border-border/50 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-24 h-24 opacity-20">
              <Image
                src="/logo-avatar.png"
                alt="Apoio Emocional"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-3xl relative z-10">
              💕
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Apoio Emocional</h3>
            <p className="text-warm text-base leading-relaxed">
              Análise de sentimentos com IA e sugestões personalizadas para seu bem-estar emocional
            </p>
          </div>

          <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md card-hover border border-border/50 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-24 h-24 opacity-20">
              <Image
                src="/logo-mother-baby.png"
                alt="Rotina Organizada"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-6 text-3xl relative z-10">
              📅
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Rotina Organizada</h3>
            <p className="text-warm text-base leading-relaxed">
              Gerencie alimentação, sono e atividades do seu bebê com facilidade e tranquilidade
            </p>
          </div>

          <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md card-hover border border-border/50 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-24 h-24 opacity-20">
              <Image
                src="/logo-family.png"
                alt="Conteúdo Exclusivo"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-6 text-3xl relative z-10">
              ✨
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Conteúdo Exclusivo</h3>
            <p className="text-warm text-base leading-relaxed">
              Acesso a dicas, receitas e estratégias da Nathalia Valente para sua jornada
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-border/50">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Por que mães confiam em nós
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-2xl">
                🛡️
              </div>
              <h3 className="font-semibold text-lg">Seguro e Privado</h3>
              <p className="text-sm text-warm">Seus dados protegidos com criptografia de ponta</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto text-2xl">
                💚
              </div>
              <h3 className="font-semibold text-lg">Comunidade Acolhedora</h3>
              <p className="text-sm text-warm">Milhares de mães compartilhando experiências</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto text-2xl">
                📚
              </div>
              <h3 className="font-semibold text-lg">Baseado em Evidências</h3>
              <p className="text-sm text-warm">Conteúdo validado por especialistas em maternidade</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
