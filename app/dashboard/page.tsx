"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GamificationWidget } from "@/components/gamification-widget"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

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
        console.warn("Dashboard: Could not fetch profile", error)
      }
    } catch (error) {
      console.error("Dashboard: Unexpected error", error)
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
          <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 p-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-serif font-bold">Olá, {userName}! 💕</h1>
                  <p className="text-sm text-muted-foreground">Bem-vinda de volta à sua jornada</p>
                </div>
              </div>
            </header>

            <main className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Cards de Acesso Rápido */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" asChild>
                      <Link href="/mundo-nath">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                            🎥
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">Mundo Nath</h3>
                            <p className="text-sm text-muted-foreground">
                              Vídeos virais e conteúdo exclusivo da Nathália
                            </p>
                          </div>
                        </div>
                      </Link>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" asChild>
                      <Link href="/receitas">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-2xl">
                            👨‍🍳
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">Receitas do Coração</h3>
                            <p className="text-sm text-muted-foreground">Receitas personalizadas com IA</p>
                          </div>
                        </div>
                      </Link>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" asChild>
                      <Link href="/maternidade-hoje">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-2xl">
                            📰
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">Maternidade Hoje</h3>
                            <p className="text-sm text-muted-foreground">Notícias e tendências atuais</p>
                          </div>
                        </div>
                      </Link>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" asChild>
                      <Link href="/chat">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                            ✨
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">NathIA</h3>
                            <p className="text-sm text-muted-foreground">Sua assistente maternal com IA</p>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  </div>

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
                        <Button variant="outline" asChild>
                          <Link href="/autocuidado">Ver Mais Sugestões</Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Sidebar com Gamificação */}
                <div className="space-y-6">
                  <GamificationWidget />
                </div>
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
