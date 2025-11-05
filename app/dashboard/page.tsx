"use client"

import { useEffect, useState, useMemo, memo } from "react"
import { useRouter } from "next/navigation"
import { GamificationWidget } from "@/components/gamification-widget"
import { InsightsWidget } from "@/components/insights-widget"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/bottom-navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { clientLogger } from "@/lib/logger-client"

// Componente memoizado para cards do dashboard
const DashboardCards = memo(() => {
  const dashboardCards = useMemo(() => [
    { href: "/mundo-nath", icon: "🎥", title: "Mundo Nath", desc: "Vídeos virais e conteúdo exclusivo da Nathália", bg: "bg-primary/10" },
    { href: "/receitas", icon: "👨‍🍳", title: "Receitas do Coração", desc: "Receitas personalizadas com IA", bg: "bg-accent/10" },
    { href: "/maternidade-hoje", icon: "📰", title: "Maternidade Hoje", desc: "Notícias e tendências atuais", bg: "bg-secondary/10" },
    { href: "/chat", icon: "✨", title: "NathAI", desc: "Sua assistente maternal com IA", bg: "bg-primary/10" },
    { href: "/rotina", icon: "📅", title: "Rotina Semanal", desc: "Organize suas atividades", bg: "bg-[hsl(var(--info))]/10" },
    { href: "/autocuidado", icon: "💝", title: "Autocuidado", desc: "10 minutos para você", bg: "bg-primary/10" },
    { href: "/brincadeiras", icon: "🎨", title: "Brincadeiras", desc: "Atividades sensoriais", bg: "bg-accent/10" },
    { href: "/historias-sono", icon: "🌙", title: "Histórias de Sono", desc: "Para adormecer tranquilo", bg: "bg-[hsl(var(--emotion-cansada))]/10" },
    { href: "/birras", icon: "🤗", title: "Lidando com Birras", desc: "Respostas empáticas", bg: "bg-[hsl(var(--emotion-estressada))]/10" },
    { href: "/perfil-bebe", icon: "👶", title: "Perfil do Bebê", desc: "Acompanhe o crescimento", bg: "bg-[hsl(var(--emotion-feliz))]/10" },
  ], [])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {dashboardCards.map((card, index) => (
        <Card
          key={card.href}
          className="p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 group animate-in fade-in slide-in-from-bottom-4"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <Link href={card.href} className="block">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl ${card.bg} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  )
})

DashboardCards.displayName = "DashboardCards"

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("Mãe")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push("/login")
        return
      }

      try {
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()

        if (profile?.full_name) {
          setUserName(profile.full_name)
        }
      } catch (error) {
        clientLogger.warn("Dashboard: Não foi possível buscar perfil", { userId: user?.id })
      }
    } catch (error) {
      clientLogger.error("Dashboard: Erro inesperado", error, { userId: "unknown" })
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 pb-20 md:pb-0">
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 p-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="flex items-center gap-4 flex-1">
                  <div className="hidden md:block w-16 h-16 relative">
                    <Image
                      src="/logo-avatar.png"
                      alt="Bem-vinda"
                      width={64}
                      height={64}
                      className="object-contain opacity-80"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-serif font-bold">Olá, {userName}! 💕</h1>
                    <p className="text-sm text-muted-foreground">Bem-vinda de volta à sua jornada</p>
                  </div>
                </div>
              </div>
            </header>

            <main className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Cards de Acesso Rápido */}
                  <DashboardCards />

                  {/* Sugestão do Dia */}
                  <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0 mt-1">✨</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Sugestão do Dia</h3>
                        <p className="text-muted-foreground mb-4">
                          Que tal dedicar 10 minutos hoje para um momento de autocuidado? Experimente uma respiração
                          profunda ou uma xícara de chá quentinho.
                        </p>
                        <Button variant="outline">
                          <Link href="/autocuidado">Ver Mais Sugestões</Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Sidebar com Gamificação e Insights */}
                <div className="space-y-6">
                  <InsightsWidget />
                  <GamificationWidget />
                </div>
              </div>
            </main>
          </div>
          <BottomNavigation />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
