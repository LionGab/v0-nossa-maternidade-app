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

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    console.log("[v0] Attempting login with email:", email)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.log("[v0] Login error:", error.message)
        throw error
      }

      console.log("[v0] Login successful, user:", data.user?.id)
      router.push("/dashboard")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer login"
      console.log("[v0] Login catch error:", errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
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
                    />
                  </div>
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                  <Button type="submit" className="w-full h-12 text-base rounded-full" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar"}
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
