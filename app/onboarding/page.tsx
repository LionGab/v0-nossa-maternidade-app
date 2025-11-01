"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

const questions = [
  {
    id: "emotionalState",
    question: "Como você está se sentindo hoje?",
    type: "radio",
    options: [
      { value: "exausta", label: "😫 Exausta e sobrecarregada" },
      { value: "ansiosa", label: "😰 Ansiosa e preocupada" },
      { value: "feliz", label: "😊 Feliz e realizada" },
      { value: "confusa", label: "😕 Confusa e insegura" },
      { value: "equilibrada", label: "😌 Equilibrada" },
    ],
  },
  {
    id: "mainChallenges",
    question: "Quais são seus principais desafios? (selecione todos que se aplicam)",
    type: "checkbox",
    options: [
      { value: "sono", label: "Sono do bebê" },
      { value: "amamentacao", label: "Amamentação" },
      { value: "tempo", label: "Falta de tempo para mim" },
      { value: "ansiedade", label: "Ansiedade e preocupação" },
      { value: "rotina", label: "Organizar a rotina" },
      { value: "apoio", label: "Falta de apoio" },
    ],
  },
  {
    id: "sleepQuality",
    question: "Como está a qualidade do seu sono?",
    type: "radio",
    options: [
      { value: "pessima", label: "Péssima - acordo várias vezes" },
      { value: "ruim", label: "Ruim - durmo pouco" },
      { value: "regular", label: "Regular - poderia ser melhor" },
      { value: "boa", label: "Boa - durmo razoavelmente bem" },
    ],
  },
  {
    id: "selfCareFrequency",
    question: "Com que frequência você consegue fazer algo para você?",
    type: "radio",
    options: [
      { value: "nunca", label: "Nunca ou quase nunca" },
      { value: "raramente", label: "Raramente (1x por semana)" },
      { value: "as-vezes", label: "Às vezes (2-3x por semana)" },
      { value: "frequentemente", label: "Frequentemente (diariamente)" },
    ],
  },
  {
    id: "babyAge",
    question: "Qual a idade do seu bebê? (em meses)",
    type: "number",
  },
  {
    id: "specificNeeds",
    question: "O que você mais precisa agora? (selecione até 3)",
    type: "checkbox",
    options: [
      { value: "descanso", label: "Descanso e recuperação" },
      { value: "organizacao", label: "Organização da rotina" },
      { value: "apoio-emocional", label: "Apoio emocional" },
      { value: "dicas-praticas", label: "Dicas práticas" },
      { value: "comunidade", label: "Conexão com outras mães" },
      { value: "autocuidado", label: "Tempo para autocuidado" },
    ],
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentQuestion = questions[currentStep]
  const isLastStep = currentStep === questions.length - 1

  const handleNext = async () => {
    if (isLastStep) {
      setIsLoading(true)
      setError(null)
      console.log("[v0] Onboarding: Submitting responses", responses)

      try {
        const onboardingResponse = await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(responses),
        })

        console.log("[v0] Onboarding: API response status", onboardingResponse.status)

        if (!onboardingResponse.ok) {
          const errorData = await onboardingResponse.json()
          console.error("[v0] Onboarding: API error", errorData)
          throw new Error(errorData.error || "Erro ao salvar respostas")
        }

        const onboardingData = await onboardingResponse.json()
        console.log("[v0] Onboarding: Saved successfully", onboardingData)

        const sentimentResponse = await fetch("/api/sentiment-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ responses, analysisType: "onboarding" }),
        })

        if (!sentimentResponse.ok) {
          console.warn("[v0] Onboarding: Sentiment analysis failed, but continuing")
        }

        toast({
          title: "Bem-vinda!",
          description: "Seu perfil foi configurado com sucesso.",
        })

        console.log("[v0] Onboarding: Redirecting to dashboard")
        router.push("/dashboard")
      } catch (error) {
        console.error("[v0] Onboarding: Error", error)
        const errorMessage = error instanceof Error ? error.message : "Erro ao processar onboarding"
        setError(errorMessage)
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleRadioChange = (value: string) => {
    setResponses({ ...responses, [currentQuestion.id]: value })
  }

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const current = responses[currentQuestion.id] || []
    if (checked) {
      setResponses({ ...responses, [currentQuestion.id]: [...current, value] })
    } else {
      setResponses({
        ...responses,
        [currentQuestion.id]: current.filter((v: string) => v !== value),
      })
    }
  }

  const handleNumberChange = (value: string) => {
    setResponses({ ...responses, [currentQuestion.id]: Number.parseInt(value) || 0 })
  }

  const canProceed = () => {
    const answer = responses[currentQuestion.id]
    if (currentQuestion.type === "checkbox") {
      return answer && answer.length > 0
    }
    return answer !== undefined && answer !== ""
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-b from-rose-50 to-white">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col gap-6">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="Nossa Maternidade"
              width={100}
              height={100}
              className="rounded-full shadow-md"
            />
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Pergunta {currentStep + 1} de {questions.length}
                </span>
                <span className="text-sm font-medium text-primary">
                  {Math.round(((currentStep + 1) / questions.length) * 100)}%
                </span>
              </div>
              <CardTitle className="text-2xl">{currentQuestion.question}</CardTitle>
              <CardDescription>Suas respostas nos ajudam a personalizar sua experiência</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">{error}</div>
              )}

              <div className="space-y-4">
                {currentQuestion.type === "radio" && (
                  <RadioGroup value={responses[currentQuestion.id]} onValueChange={handleRadioChange}>
                    {currentQuestion.options?.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.type === "checkbox" && (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={responses[currentQuestion.id]?.includes(option.value)}
                          onCheckedChange={(checked) => handleCheckboxChange(option.value, checked as boolean)}
                        />
                        <Label htmlFor={option.value} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "number" && (
                  <Input
                    type="number"
                    min="0"
                    max="60"
                    placeholder="Ex: 6"
                    value={responses[currentQuestion.id] || ""}
                    onChange={(e) => handleNumberChange(e.target.value)}
                  />
                )}
              </div>

              <div className="flex gap-3 mt-6">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent" disabled={isLoading}>
                    Voltar
                  </Button>
                )}
                <Button onClick={handleNext} disabled={!canProceed() || isLoading} className="flex-1">
                  {isLoading ? "Processando..." : isLastStep ? "Finalizar" : "Próxima"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
