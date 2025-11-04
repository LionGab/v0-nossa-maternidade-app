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
import Image from "next/image"

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 pb-20 md:pb-6">
      <PageHeader
        title="Receitas do Coração"
        description="Receitas personalizadas com IA"
        icon={<ChefHat className="h-5 w-5" />}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 md:space-y-8">

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="p-6 space-y-6 shadow-lg border-2 border-border/50 hover:shadow-xl transition-shadow duration-300 animate-in fade-in slide-in-from-left-4">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200 text-sm shadow-sm animate-in fade-in slide-in-from-top-2">{error}</div>
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

              <Button
                onClick={generateRecipes}
                disabled={isLoading}
                className="w-full h-12 text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
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
              <Card className="p-12 text-center border-2 border-dashed border-border/50 bg-muted/30 animate-in fade-in slide-in-from-right-4">
                <ChefHat className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Preencha o formulário ao lado para receber receitas personalizadas 💕
                </p>
              </Card>
            )}

            {recipes.map((recipe, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-border/50 bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-right-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Imagem da Receita */}
                {recipe.image && (
                  <div className="relative w-full h-48 sm:h-64 overflow-hidden bg-muted">
                    <Image
                      src={recipe.image}
                      alt={recipe.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-primary/90 text-primary-foreground border border-primary/20 shadow-lg">
                        {recipe.category}
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2 leading-tight">{recipe.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{recipe.description}</p>
                    </div>
                    {!recipe.image && (
                      <Badge className="bg-primary/10 text-primary border border-primary/20 shadow-sm shrink-0">
                        {recipe.category}
                      </Badge>
                    )}
                  </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-lg border border-border/50">
                    <Clock className="h-4 w-4 text-primary" />
                    {recipe.prepTime}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-lg border border-border/50">
                    <Users className="h-4 w-4 text-primary" />
                    {recipe.servings}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-lg border border-border/50">
                    <Flame className="h-4 w-4 text-primary" />
                    {recipe.difficulty}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                    <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                      <ChefHat className="h-4 w-4 text-primary" />
                      Ingredientes:
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
                      {recipe.ingredients.map((ing: string, i: number) => (
                        <li key={i} className="pl-2">{ing}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                    <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Modo de Preparo:
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
                      {recipe.instructions.map((step: string, i: number) => (
                        <li key={i} className="pl-2">{step}</li>
                      ))}
                    </ol>
                  </div>

                  {recipe.nutritionalBenefit && (
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border-2 border-green-200 dark:border-green-800 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                      <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                        <strong className="font-semibold">💚 Benefício Nutricional:</strong> {recipe.nutritionalBenefit}
                      </p>
                    </div>
                  )}

                  {recipe.tip && (
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 shadow-sm">
                      <p className="text-sm text-foreground leading-relaxed">
                        <strong className="font-semibold text-primary">💡 Dica:</strong> {recipe.tip}
                      </p>
                    </div>
                  )}
                </div>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent hover:bg-primary/5 hover:border-primary/30 rounded-xl transition-all duration-300"
                    onClick={() => handleSaveRecipe(index)}
                  >
                    💾 Salvar Receita
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  )
}
