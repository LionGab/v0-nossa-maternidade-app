import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { recipeRequestSchema } from "@/lib/validations/schemas"

export async function POST(request: Request) {
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

    // Validar dados de entrada
    const validationResult = recipeRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validationResult.error.errors },
        { status: 400 },
      )
    }

    const { mood, preferences, ingredients } = validationResult.data

    const prompt = `Você é uma chef especializada em receitas para mães ocupadas.

Estado emocional da mãe: ${mood}
Preferências alimentares: ${preferences}
Ingredientes disponíveis: ${ingredients}

Crie 3 receitas personalizadas considerando:
1. O estado emocional (receitas reconfortantes se cansada/triste, energizantes se precisa de energia)
2. As preferências alimentares mencionadas
3. Os ingredientes disponíveis
4. Que sejam rápidas (máximo 30 minutos)
5. Nutritivas e saborosas

Para cada receita, forneça:
- Nome criativo e acolhedor
- Descrição breve (1 frase)
- Categoria (café da manhã, almoço, jantar, lanche)
- Tempo de preparo
- Porções
- Dificuldade (Fácil/Média)
- Lista de ingredientes
- Modo de preparo (passo a passo)
- Benefício nutricional relacionado ao estado emocional

Retorne em formato JSON array com a estrutura:
[{
  "name": "string",
  "description": "string",
  "category": "string",
  "prepTime": "string",
  "servings": "string",
  "difficulty": "string",
  "ingredients": ["string"],
  "instructions": ["string"],
  "nutritionalBenefit": "string"
}]`

    const { text } = await generateText({
      model: "anthropic/claude-sonnet-4",
      prompt,
      temperature: 0.8,
    })

    // Parse JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    const recipes = jsonMatch ? JSON.parse(jsonMatch[0]) : []

    return NextResponse.json({ recipes })
  } catch (error) {
    console.error("Generate Recipes API: Error", error)
    return NextResponse.json({ error: "Failed to generate recipes" }, { status: 500 })
  }
}
