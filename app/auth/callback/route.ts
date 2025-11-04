/**
 * OAuth Callback Handler
 * Processa o retorno do OAuth (Google/Apple) e redireciona o usuário
 */

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/dashboard"

  if (code) {
    const supabase = await createClient()

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        logger.error(
          "OAuth callback error",
          error instanceof Error ? error : new Error(String(error)),
          {
            code: code.substring(0, 10) + "...",
          },
        )

        // Redirecionar para login com erro
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("error", "oauth_failed")
        return NextResponse.redirect(loginUrl)
      }

      // Sucesso - redirecionar para dashboard ou onboarding
      logger.info("OAuth callback success", {
        redirectTo: next,
      })

      return NextResponse.redirect(new URL(next, request.url))
    } catch (error) {
      logger.error(
        "OAuth callback exception",
        error instanceof Error ? error : new Error(String(error)),
      )

      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("error", "oauth_exception")
      return NextResponse.redirect(loginUrl)
    }
  }

  // Sem code - redirecionar para login
  return NextResponse.redirect(new URL("/login", request.url))
}
