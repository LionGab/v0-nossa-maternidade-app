/**
 * API - Salvar Receita
 * Salva uma receita gerada para o perfil do usuário
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"
import { z } from "zod"

export { OPTIONS } // CORS preflight

// Schema de validação
const saveRecipeSchema = z.object({
  recipeTitle: z.string().min(1).max(200),
  recipeContent: z.string().min(1),
  recipeIngredients: z.array(z.string()),
  recipeInstructions: z.array(z.string()),
  mood: z.string().optional(),
  preferences: z.string().optional(),
})

async function saveRecipeHandler(request: NextRequest) {
  const startTime = Date.now()

  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      logger.warn("Unauthorized recipe save attempt")
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()

    // Validar dados
    const validationResult = saveRecipeSchema.safeParse(body)
    if (!validationResult.success) {
      logger.warn("Invalid recipe save data", {
        userId: user.id,
        errors: validationResult.error.errors,
      })
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const {
      recipeTitle,
      recipeContent,
      recipeIngredients,
      recipeInstructions,
      mood,
      preferences,
    } = validationResult.data

    // Verificar se já existe (evitar duplicatas)
    const { data: existing } = await supabase
      .from("saved_recipes")
      .select("id")
      .eq("user_id", user.id)
      .eq("recipe_title", recipeTitle)
      .eq("recipe_content", recipeContent)
      .single()

    if (existing) {
      logger.info("Recipe already saved", { userId: user.id, recipeTitle })
      return NextResponse.json(
        {
          success: true,
          message: "Receita já está salva",
          saved: true,
        },
        { status: 200 },
      )
    }

    // Salvar receita
    const { data, error } = await supabase
      .from("saved_recipes")
      .insert({
        user_id: user.id,
        recipe_title: recipeTitle,
        recipe_content: recipeContent,
        recipe_ingredients: recipeIngredients,
        recipe_instructions: recipeInstructions,
        mood: mood || null,
        preferences: preferences || null,
      })
      .select("id")
      .single()

    if (error) {
      logger.error(
        "Failed to save recipe",
        error instanceof Error ? error : new Error(String(error)),
        {
          userId: user.id,
          recipeTitle,
        },
      )
      return NextResponse.json(
        {
          error: "Erro ao salvar receita",
          message: error.message,
        },
        { status: 500 },
      )
    }

    const duration = Date.now() - startTime
    logger.info("Recipe saved successfully", {
      userId: user.id,
      recipeId: data.id,
      recipeTitle,
      duration,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Receita salva com sucesso!",
        recipeId: data.id,
      },
      { status: 201 },
    )
  } catch (error) {
    logger.error(
      "Error saving recipe",
      error instanceof Error ? error : new Error(String(error)),
      {
        duration: Date.now() - startTime,
      },
    )

    return NextResponse.json(
      {
        error: "Erro ao salvar receita",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

export const POST = withRateLimit(saveRecipeHandler, RATE_LIMITS.AUTHENTICATED)

