import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FEFBFB] relative overflow-hidden">
      {/* Hero Section - Ilustração, Título e Descrição */}
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 relative z-10">
        <div className="flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 max-w-4xl mx-auto">
          {/* Ilustração Circular - Mãe e Bebê */}
          <div className="relative mb-2">
            <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] rounded-full shadow-md overflow-hidden bg-[#F5F0E8]">
              <Image
                src="/logo.png"
                alt="Mãe segurando bebê dormindo"
                width={200}
                height={200}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>

          {/* Título Principal - Serif Bold */}
          <div className="space-y-3 md:space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3D2E2A] tracking-tight font-serif leading-tight">
              Nossa Maternidade
            </h1>

            {/* Descrição - Texto Marrom/Cinza Claro */}
            <p className="text-base md:text-lg text-[#6B5B57] max-w-2xl mx-auto leading-relaxed font-sans px-4">
              Seu espaço seguro para apoio emocional, organização da rotina e autocuidado na jornada da maternidade
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-8 w-full sm:w-auto px-4">
            {/* Botão Primário - Marrom Acolhedor */}
            <Button
              asChild
              size="lg"
              className="text-base md:text-lg px-8 py-6 rounded-xl shadow-md hover:shadow-lg transition-all bg-[#C87A5F] hover:bg-[#B86A4F] text-white font-semibold w-full sm:w-auto"
            >
              <Link href="/signup">Começar Minha Jornada</Link>
            </Button>

            {/* Botão Secundário - Branco com Borda */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base md:text-lg px-8 py-6 rounded-xl border border-[#D4C8C0] bg-white hover:bg-[#FEFBFB] transition-all text-[#6B5B57] font-semibold shadow-sm hover:shadow-md w-full sm:w-auto"
            >
              <Link href="/login">Já Sou Membro</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Seção de Funcionalidades - Layout Vertical */}
      <div className="container mx-auto px-4 pb-8 md:pb-12">
        <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
          {/* Card Apoio Emocional */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D8] p-6 md:p-8">
            <div className="flex items-start gap-4">
              {/* Ícone Corações Rosa */}
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#F5E8F0] flex items-center justify-center flex-shrink-0">
                <span className="text-2xl md:text-3xl">💕</span>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-[#3D2E2A] font-sans">Apoio Emocional</h3>
                <p className="text-sm md:text-base text-[#6B5B57] leading-relaxed font-sans">
                  Análise de sentimentos com IA e sugestões personalizadas para seu bem-estar emocional
                </p>
              </div>
            </div>
          </div>

          {/* Card Rotina Organizada */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D8] p-6 md:p-8">
            <div className="flex items-start gap-4">
              {/* Ícone Calendário */}
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#E8F0F5] flex items-center justify-center flex-shrink-0">
                <span className="text-2xl md:text-3xl">📅</span>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-[#3D2E2A] font-sans">Rotina Organizada</h3>
                <p className="text-sm md:text-base text-[#6B5B57] leading-relaxed font-sans">
                  Gerencie alimentação, sono e atividades do seu bebê com facilidade e tranquilidade
                </p>
              </div>
            </div>
          </div>

          {/* Card Conteúdo Exclusivo */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D8] p-6 md:p-8">
            <div className="flex items-start gap-4">
              {/* Ícone Estrela */}
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#FFF5E8] flex items-center justify-center flex-shrink-0">
                <span className="text-2xl md:text-3xl">✨</span>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-[#3D2E2A] font-sans">Conteúdo Exclusivo</h3>
                <p className="text-sm md:text-base text-[#6B5B57] leading-relaxed font-sans">
                  Acesso a dicas, receitas e estratégias da Nathalia Valente para sua jornada
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Confiança */}
      <div className="container mx-auto px-4 pb-12 md:pb-20">
        <div className="max-w-2xl mx-auto text-center space-y-4 md:space-y-6">
          {/* Título Serif */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3D2E2A] font-serif">
            Por que mães confiam em nós
          </h2>

          {/* Ícone e Texto */}
          <div className="flex flex-col items-center justify-center space-y-3 md:space-y-4 pt-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#E8F0F5] flex items-center justify-center">
              <span className="text-2xl md:text-3xl">🛡️</span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-[#3D2E2A] font-sans">Seguro e Privado</h3>
          </div>
        </div>
      </div>
    </div>
  )
}
