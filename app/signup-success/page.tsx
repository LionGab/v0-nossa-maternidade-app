import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-b from-rose-50 to-white">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="Nossa Maternidade"
              width={120}
              height={120}
              className="rounded-full shadow-md"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Verifique seu email</CardTitle>
              <CardDescription className="text-center">Enviamos um link de confirmação</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Por favor, verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta. Depois
                disso, você poderá fazer login e começar a usar o Nossa Maternidade.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
