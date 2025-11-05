import { logger } from "@/lib/logger"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

/**
 * Proxy middleware para proteção de rotas e autenticação
 * (Atualizado para Next.js 16 - substitui middleware.ts)
 *
 * Rotas públicas: /, /login, /signup, /signup-success, /offline
 * Rotas protegidas: Todas as outras rotas requerem autenticação
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const { pathname } = request.nextUrl

  // Validar variáveis de ambiente críticas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    logger.error("Middleware: Variáveis de ambiente do Supabase não configuradas", undefined, {
      pathname,
    })
    // Permitir acesso mesmo sem env vars (pode ser desenvolvimento)
    return response
  }

  // Rotas públicas que não requerem autenticação
  const publicRoutes = ["/", "/login", "/signup", "/signup-success", "/offline"]
  const isPublicRoute =
    publicRoutes.includes(pathname) || pathname.startsWith("/api/public")

  // Se é rota pública, não precisa verificar autenticação
  if (isPublicRoute) {
    return response
  }

  // Verificar autenticação para rotas protegidas
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
        })
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options as CookieOptions)
        })
      },
    },
  })

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    // Se não estiver autenticado e tentar acessar rota protegida, redirecionar para login
    if (!user && !isPublicRoute) {
      // Se tentando acessar página, redirecionar para login
      if (!pathname.startsWith("/api")) {
        const url = request.nextUrl.clone()
        url.pathname = "/login"
        url.searchParams.set("redirect", pathname)
        return NextResponse.redirect(url)
      }

      // Para APIs, retornar erro 401
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se usuário precisa completar onboarding
    if (user && !pathname.startsWith("/onboarding")) {
      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single()

        // Se houver erro específico de coluna não encontrada, permitir acesso
        // (a coluna será criada pela migration)
        if (profileError && profileError.code === "PGRST116") {
          // Coluna não existe - permitir acesso (migration precisa ser executada)
          if (process.env.NODE_ENV === "development") {
            logger.debug("Middleware: Coluna onboarding_completed não existe ainda", { pathname })
          }
          return response
        }

        // ⭐ Permitir acesso à API de onboarding mesmo sem perfil ou sem completar onboarding
        if (pathname === "/api/onboarding") {
          return response
        }

        // Se profile não existe ou onboarding não foi completado, redirecionar
        if (!profile || !profile.onboarding_completed) {
          // Para APIs (exceto onboarding), retornar JSON em vez de redirecionar
          if (pathname.startsWith("/api")) {
            return NextResponse.json(
              {
                error: profile
                  ? "Onboarding não completo. Complete o onboarding para acessar esta funcionalidade."
                  : "Perfil não encontrado. Complete o onboarding primeiro.",
              },
              { status: 403 },
            )
          }

          // Para páginas, redirecionar para onboarding
          if (pathname !== "/onboarding") {
            const url = request.nextUrl.clone()
            url.pathname = "/onboarding"
            return NextResponse.redirect(url)
          }
        }
      } catch (error) {
        // Se houver erro ao buscar profile, permitir acesso (pode ser problema temporário)
        // Não logar em produção para não poluir logs
        if (process.env.NODE_ENV === "development") {
          logger.debug("Middleware: Erro ao verificar profile", {
            pathname,
            error: error instanceof Error ? error.message : String(error),
          })
        }
        // Permitir acesso mesmo com erro (fail-safe)
        return response
      }
    }

    // Usuário autenticado e com onboarding completo, permitir acesso
    return response
  } catch (error) {
    // Se houver erro crítico na autenticação, permitir acesso (fail-safe)
    if (process.env.NODE_ENV === "development") {
      logger.debug("Middleware: Erro crítico na autenticação", {
        pathname,
        error: error instanceof Error ? error.message : String(error),
      })
    }

    // Em caso de erro, redirecionar para login (páginas) ou retornar 500 (APIs)
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
