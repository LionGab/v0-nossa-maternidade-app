"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingOAuth, setIsLoadingOAuth] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      toast.success("Login realizado com sucesso! 💚")
      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer login"
      setError(errorMessage)
      toast.error("Erro ao fazer login", {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    const supabase = createClient()
    setIsLoadingOAuth(provider)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      // OAuth redireciona automaticamente, então não precisamos fazer nada aqui
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer login"
      setError(errorMessage)
      setIsLoadingOAuth(null)
      toast.error("Erro ao fazer login", {
        description: errorMessage,
      })
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 maternal-gradient">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-8">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="Nossa Maternidade"
              width={140}
              height={140}
              className="rounded-full shadow-xl ring-4 ring-white/50"
            />
          </div>

          <Card className="border-border/50 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-3xl text-center font-serif">Bem-vinda de volta</CardTitle>
              <CardDescription className="text-center text-base">
                Entre com seu email e senha para continuar sua jornada
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Botões OAuth */}
              <div className="flex flex-col gap-3 mb-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base rounded-full border-2 hover:bg-muted/50"
                  onClick={() => handleOAuthLogin("google")}
                  disabled={isLoadingOAuth !== null || isLoading}
                >
                  {isLoadingOAuth === "google" ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continuar com Google
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base rounded-full border-2 hover:bg-muted/50"
                  onClick={() => handleOAuthLogin("apple")}
                  disabled={isLoadingOAuth !== null || isLoading}
                >
                  {isLoadingOAuth === "apple" ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                      Continuar com Apple
                    </>
                  )}
                </Button>
              </div>

              {/* Separador */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-background px-2 text-muted-foreground">Ou continue com email</span>
                </div>
              </div>

              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email" className="text-base">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-base"
                      disabled={isLoadingOAuth !== null}
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-base">
                        Senha
                      </Label>
                      <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                        Esqueceu?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 text-base"
                      disabled={isLoadingOAuth !== null}
                    />
                  </div>
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full h-12 text-base rounded-full"
                    disabled={isLoading || isLoadingOAuth !== null}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </div>
                <div className="mt-6 text-center text-base">
                  <span className="text-muted-foreground">Ainda não tem conta? </span>
                  <Link href="/signup" className="text-primary font-medium hover:underline">
                    Criar conta gratuita
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
