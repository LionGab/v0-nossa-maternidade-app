import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Validar variáveis de ambiente críticas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Middleware: Variáveis de ambiente do Supabase não configuradas")
    // Permitir acesso mesmo sem env vars (pode ser desenvolvimento)
    return response
  }

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ["/", "/login", "/signup", "/signup-success", "/offline"]
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname === route)

  // Se for rota pública, não precisa verificar autenticação
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
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Verificar se usuário precisa completar onboarding
    if (user && !request.nextUrl.pathname.startsWith("/onboarding")) {
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
            console.warn("Middleware: Coluna onboarding_completed não existe ainda")
          }
          return response
        }

        // Se profile não existe ou onboarding não foi completado, redirecionar
        if (!profile || !profile.onboarding_completed) {
          if (request.nextUrl.pathname !== "/onboarding") {
            const url = request.nextUrl.clone()
            url.pathname = "/onboarding"
            return NextResponse.redirect(url)
          }
        }
      } catch (error) {
        // Se houver erro ao buscar profile, permitir acesso (pode ser problema temporário)
        // Não logar em produção para não poluir logs
        if (process.env.NODE_ENV === "development") {
          console.error("Middleware: Erro ao verificar profile", error)
        }
        // Permitir acesso mesmo com erro (fail-safe)
        return response
      }
    }
  } catch (error) {
    // Se houver erro crítico na autenticação, permitir acesso (fail-safe)
    if (process.env.NODE_ENV === "development") {
      console.error("Middleware: Erro crítico na autenticação", error)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
