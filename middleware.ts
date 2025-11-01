import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Middleware para proteção de rotas e autenticação
 *
 * Rotas públicas: /, /login, /signup, /signup-success
 * Rotas protegidas: Todas as outras rotas requerem autenticação
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas públicas que não requerem autenticação
  const publicRoutes = ["/", "/login", "/signup", "/signup-success"]
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/api/public")

  // Se é rota pública, permitir acesso
  if (isPublicRoute) {
    return NextResponse.next()
  }

  try {
    // Verificar autenticação para rotas protegidas
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // Se não autenticado e tentando acessar rota protegida
    if (error || !user) {
      // Se tentando acessar página, redirecionar para login
      if (!pathname.startsWith("/api")) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Para APIs, retornar erro 401
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se usuário completou onboarding
    const { data: profile } = await supabase.from("profiles").select("onboarding_completed").eq("id", user.id).single()

    // Se não completou onboarding e não está na página de onboarding
    if (!profile?.onboarding_completed && pathname !== "/onboarding") {
      // Redirecionar para onboarding
      const onboardingUrl = new URL("/onboarding", request.url)
      return NextResponse.redirect(onboardingUrl)
    }

    // Usuário autenticado e com onboarding completo, permitir acesso
    return NextResponse.next()
  } catch (error) {
    console.error("Middleware: Error", error)

    // Em caso de erro, redirecionar para login (páginas) ou retornar 401 (APIs)
    if (!pathname.startsWith("/api")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.json({ error: "Erro de autenticação" }, { status: 500 })
  }
}

/**
 * Configuração de paths para o middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

