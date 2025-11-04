"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/page-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { clientLogger } from "@/lib/logger-client"
import { ChefHat, Clock, Flame, Sparkles, Users } from "lucide-react"
import { useState } from "react"

const moodOptions = [
  { value: "energizada", label: "😊 Energizada e motivada", color: "bg-green-100 text-green-800" },
  { value: "cansada", label: "😴 Cansada e sem energia", color: "bg-blue-100 text-blue-800" },
  { value: "estressada", label: "😰 Estressada e ansiosa", color: "bg-orange-100 text-orange-800" },
  { value: "feliz", label: "🥰 Feliz e relaxada", color: "bg-pink-100 text-pink-800" },
  { value: "triste", label: "😢 Triste ou desanimada", color: "bg-purple-100 text-purple-800" },
]

export default function ReceitasPage() {
  const [mood, setMood] = useState("")
  const [preferences, setPreferences] = useState("")
  const [ingredients, setIngredients] = useState("")
  const [recipes, setRecipes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateRecipes = async () => {
    if (!mood || !preferences || !ingredients) {
      setError("Por favor, preencha todos os campos")
      return
    }

    setIsLoading(true)
    setError(null)

    // Criar AbortController para timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 segundos timeout

    try {
      const response = await fetch("/api/generate-recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood, preferences, ingredients }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Verificar se a resposta foi recebida
      if (!response.ok) {
        // Tentar ler mensagem de erro da API
        let errorMessage = "Erro ao gerar receitas"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch {
          // Se não conseguir ler JSON, usar status
          errorMessage = `Erro ${response.status}: ${response.statusText || "Erro ao gerar receitas"}`
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()

      // Validar se receitas foram retornadas
      if (!data.recipes || !Array.isArray(data.recipes) || data.recipes.length === 0) {
        throw new Error("Nenhuma receita foi gerada. Tente novamente com ingredientes diferentes.")
      }

      setRecipes(data.recipes)
    } catch (error) {
      const errorObj = error as Error

      // Detectar tipo de erro específico
      let errorMessage = "Erro ao gerar receitas. Tente novamente."

      if (errorObj.name === 'AbortError' || errorObj.message.includes('timeout')) {
        errorMessage = "A requisição demorou muito. Verifique sua conexão e tente novamente."
      } else if (
        errorObj.message.includes('Failed to fetch') ||
        errorObj.message.includes('ERR_INTERNET_DISCONNECTED') ||
        errorObj.message.includes('network error') ||
        errorObj.message.includes('NetworkError')
      ) {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente."
      } else if (errorObj.message.includes('401') || errorObj.message.includes('Não autorizado')) {
        errorMessage = "Você precisa estar logada para gerar receitas. Faça login e tente novamente."
      } else if (errorObj.message.includes('429') || errorObj.message.includes('rate limit')) {
        errorMessage = "Muitas requisições. Aguarde alguns segundos e tente novamente."
      } else if (errorObj.message) {
        // Usar mensagem de erro da API se disponível
        errorMessage = errorObj.message
      }

      clientLogger.error("Receitas: Erro ao gerar receitas", error, {
        mood,
        hasPreferences: !!preferences,
        hasIngredients: !!ingredients,
        errorType: errorObj.name,
        errorMessage: errorObj.message,
      })

      setError(errorMessage)
    } finally {
      clearTimeout(timeoutId)
      setIsLoading(false)
    }
  }

  const handleSaveRecipe = (recipeIndex: number) => {
    // TODO: Implementar salvamento de receita
    console.log("Salvar receita:", recipeIndex)
    alert(`Receita salva! Em breve: salvar na sua lista de receitas favoritas.`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 pb-20 md:pb-6">
      <PageHeader
        title="Receitas do Coração"
        description="Receitas personalizadas com IA"
        icon={<ChefHat className="h-5 w-5" />}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 md:space-y-8">

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">{error}</div>
            )}

            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold mb-3 block">Como você está se sentindo hoje?</Label>
                <RadioGroup value={mood} onValueChange={setMood} className="space-y-3">
                  {moodOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="cursor-pointer flex-1">
                        <span className={`inline-block px-3 py-2 rounded-lg ${option.color} font-medium`}>
                          {option.label}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="preferences" className="text-base font-semibold mb-2 block">
                  O que você gosta de comer?
                </Label>
                <Textarea
                  id="preferences"
                  placeholder="Ex: Gosto de comidas leves, adoro massas, prefiro evitar frituras..."
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="ingredients" className="text-base font-semibold mb-2 block">
                  Quais ingredientes você tem disponíveis?
                </Label>
                <Textarea
                  id="ingredients"
                  placeholder="Ex: Frango, arroz, tomate, cebola, alho, batata, cenoura..."
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button onClick={generateRecipes} disabled={isLoading} className="w-full h-12 text-base" size="lg">
                {isLoading ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                    Criando receitas mágicas...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Gerar Receitas Personalizadas
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Receitas Geradas */}
          <div className="space-y-4">
            {recipes.length === 0 && !isLoading && (
              <Card className="p-12 text-center">
                <ChefHat className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-lg">
                  Preencha o formulário ao lado para receber receitas personalizadas
                </p>
              </Card>
            )}

            {recipes.map((recipe, index) => (
              <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{recipe.name}</h3>
                    <p className="text-sm text-muted-foreground">{recipe.description}</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary">{recipe.category}</Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {recipe.prepTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {recipe.servings}
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="h-4 w-4" />
                    {recipe.difficulty}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Ingredientes:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {recipe.ingredients.map((ing: string, i: number) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Modo de Preparo:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      {recipe.instructions.map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {recipe.nutritionalBenefit && (
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>Benefício:</strong> {recipe.nutritionalBenefit}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleSaveRecipe(index)}
                >
                  Salvar Receita
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  )
}
