import { OPTIONS, RATE_LIMITS, withRateLimit } from "@/lib/api-utils"
import { logger } from "@/lib/logger"
import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export { OPTIONS }; // CORS preflight

/**
 * Busca imagens do Unsplash para receitas
 * Rápido e gratuito, sem necessidade de API key
 */
async function getRecipeImage(recipeName: string, ingredients: string[]): Promise<string | null> {
  try {
    // Criar query de busca baseada no nome da receita e ingrediente principal
    const mainIngredient = ingredients[0]?.toLowerCase() || recipeName.toLowerCase().split(' ')[0]
    const searchQuery = encodeURIComponent(`${recipeName} ${mainIngredient} food`)

    // Usar Unsplash Source API (gratuito, sem key necessária para imagens simples)
    // Formato: https://source.unsplash.com/800x600/?{query}
    const imageUrl = `https://source.unsplash.com/800x600/?${searchQuery}`

    // Alternativa: usar Unsplash API com query mais específica
    // Mas para performance, vamos usar source.unsplash.com que é mais rápido
    return imageUrl
  } catch (error) {
    logger.error("Failed to get recipe image", error as Error, { recipeName })
    return null
  }
}

/**
 * Busca imagens para múltiplas receitas em paralelo
 */
async function getRecipeImages(recipes: Array<{ name: string; ingredients: string[] }>): Promise<Record<number, string>> {
  const imagePromises = recipes.map((recipe, index) =>
    getRecipeImage(recipe.name, recipe.ingredients).then(image => ({ index, image }))
  )

  const results = await Promise.allSettled(imagePromises)

  const images: Record<number, string> = {}

  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.image) {
      images[result.value.index] = result.value.image
    }
  })

  return images
}

async function recipeImagesHandler(request: NextRequest) {
  const startTime = Date.now()

  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { recipes } = body

    if (!recipes || !Array.isArray(recipes)) {
      return NextResponse.json({ error: "Recipes array is required" }, { status: 400 })
    }

    // Buscar imagens em paralelo para todas as receitas
    const images = await getRecipeImages(recipes)

    logger.info("Recipe images fetched", {
      userId: user.id,
      count: Object.keys(images).length,
      duration: Date.now() - startTime
    })

    return NextResponse.json({ images })
  } catch (error) {
    logger.apiError("POST", "/api/recipe-images", error as Error, {
      duration: Date.now() - startTime,
    })
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}

export const POST = withRateLimit(recipeImagesHandler, RATE_LIMITS.HEAVY)
