import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { recipeRequestSchema } from "@/lib/validations/schemas"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"
import { sanitizeString } from "@/lib/sanitize"
import { getCachedResponse, setCachedResponse } from "@/lib/ai/cache"
import { createHash } from "crypto"

export { OPTIONS } // CORS preflight

async function generateRecipesHandler(request: NextRequest) {
  const startTime = Date.now()

  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      logger.warn("Unauthorized recipe generation attempt")
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()

    // Validar dados de entrada
    const validationResult = recipeRequestSchema.safeParse(body)
    if (!validationResult.success) {
      logger.warn("Invalid recipe request data", { userId: user.id, errors: validationResult.error.errors })
      return NextResponse.json(
        { error: "Invalid input data", details: validationResult.error.errors },
        { status: 400 },
      )
    }

    const { mood, preferences, ingredients } = validationResult.data

    // Sanitize user input to prevent XSS
    const sanitizedMood = sanitizeString(mood)
    const sanitizedPreferences = sanitizeString(preferences)
    const sanitizedIngredients = sanitizeString(ingredients)

    // Gerar chave de cache baseada nos parâmetros da requisição
    const cacheKey = createHash("sha256")
      .update(JSON.stringify({ mood: sanitizedMood, preferences: sanitizedPreferences, ingredients: sanitizedIngredients }))
      .digest("hex")

    // Verificar cache antes de gerar receitas
    const supabaseForCache = await createClient()
    const { data: cachedData } = await supabaseForCache
      .from("api_cache")
      .select("cache_data")
      .eq("cache_key", `recipes_${cacheKey}`)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (cachedData?.cache_data) {
      logger.info("Recipe cache hit", {
        userId: user.id,
        cacheKey: `recipes_${cacheKey}`,
      })

      const duration = Date.now() - startTime
      return NextResponse.json(
        {
          recipes: cachedData.cache_data,
          cached: true,
          duration,
        },
        { status: 200 },
      )
    }

    // Coletar informações do perfil do bebê para receitas adequadas
    let babyProfile = null
    try {
      const { data: babyData } = await supabase
        .from("baby_profiles")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()
      babyProfile = babyData
    } catch (error) {
      logger.debug("Baby profile fetch failed for recipes", { userId: user.id, error })
    }

    // Usar prompt simplificado para resposta mais rápida (< 1 minuto)
    const prompt = `Você é uma chef e nutricionista especializada em alimentação materna. Você tem conhecimento profundo em:

ESPECIALIZAÇÕES:
- Nutrição pós-parto e recuperação física
- Alimentação durante amamentação (lactogogos, nutrientes essenciais)
- Receitas que aumentam produção de leite quando necessário
- Alimentação para energia e bem-estar materno
- Receitas rápidas e práticas para mães com tempo limitado
- Nutrição adequada para recuperação pós-parto
- Alimentos que podem afetar o bebê via leite materno (quando relevante)

CONTEXTO DA MÃE:
Estado emocional: ${sanitizedMood}
Preferências alimentares: ${sanitizedPreferences}
Ingredientes disponíveis: ${sanitizedIngredients}
${babyProfile ? `
Contexto do bebê:
- Idade: ${babyProfile.age_months ? `${babyProfile.age_months} meses` : "não informado"}
- Tipo de alimentação: ${babyProfile.feeding_type || "não informado"}
` : ""}

Crie 2 receitas HIGHLY PERSONALIZED e ESPECIALIZADAS (máximo 2 para resposta mais rápida) considerando:
1. Estado emocional:
   - Se cansada/triste: receitas reconfortantes ricas em triptofano, magnésio, complexo B
   - Se precisa energia: receitas com ferro, proteínas, carboidratos complexos
   - Se estressada: receitas anti-inflamatórias e calmantes
2. Período pós-parto: receitas que favorecem recuperação física
3. Amamentação: incluir alimentos lactogogos quando apropriado (aveia, linhaça, amêndoas, etc)
4. Preferências alimentares: respeitar restrições e preferências
5. Ingredientes disponíveis: usar o que a mãe tem em casa
6. Tempo: máximo 30 minutos de preparo (mães ocupadas)
7. Nutrição: balanceada, rica em nutrientes essenciais para mães

Para cada receita, forneça informações DETALHADAS:
- Nome criativo, acolhedor e descritivo
- Descrição breve mas informativa (1-2 frases)
- Categoria específica (café da manhã, almoço, jantar, lanche, lanche da noite)
- Tempo de preparo REALISTA (considerar mãe ocupada)
- Porções (geralmente 1-2 para mãe solo, ou mais se família)
- Dificuldade (Fácil/Média - priorize Fácil)
- Lista de ingredientes COMPLETA com quantidades precisas
- Modo de preparo PASSO A PASSO claro e detalhado
- Benefício nutricional ESPECÍFICO relacionado ao estado emocional e período pós-parto
- Dica extra prática (opcional mas valorizado)

IMPORTANTE:
- Evite receitas genéricas - seja específica e qualificada
- Considere nutrição materna pós-parto
- Se amamentando, mencione alimentos lactogogos quando relevante
- Seja prática e realista sobre tempo e dificuldade
- Forneça informações nutricionais úteis

IMPORTANTE:
- Retorne APENAS JSON válido (sem markdown, sem texto adicional)
- Seja concisa mas completa
- Foque na qualidade, não quantidade

Retorne JSON com a estrutura:
[{
  "name": "string",
  "description": "string",
  "category": "string",
  "prepTime": "string",
  "servings": "string",
  "difficulty": "string",
  "ingredients": ["string"],
  "instructions": ["string"],
  "nutritionalBenefit": "string",
  "tip": "string (opcional)"
}]`

    // Usar modelo mais rápido (haiku) para melhor performance
    // Reduzir prompt ainda mais para resposta mais rápida
    const simplifiedPrompt = `Você é uma chef e nutricionista especializada em alimentação materna.

CONTEXTO:
Estado emocional: ${sanitizedMood}
Preferências: ${sanitizedPreferences}
Ingredientes: ${sanitizedIngredients}
${babyProfile ? `Bebê: ${babyProfile.age_months} meses, ${babyProfile.feeding_type}` : ''}

Crie 2 receitas ESPECÍFICAS e QUALIFICADAS para mãe em puerpério:
- Nome criativo
- Descrição (1 frase)
- Categoria (café da manhã, almoço, jantar, lanche)
- Tempo de preparo (máximo 30min)
- Porções
- Dificuldade (Fácil/Média)
- Ingredientes com quantidades
- Modo de preparo passo a passo
- Benefício nutricional específico

Retorne APENAS JSON array: [{"name":"","description":"","category":"","prepTime":"","servings":"","difficulty":"","ingredients":[""],"instructions":[""],"nutritionalBenefit":""}]`

    const { text } = await generateText({
      model: "anthropic/claude-3-5-haiku-20241022", // Modelo mais rápido
      prompt: simplifiedPrompt,
      temperature: 0.7, // Reduzir temperatura para respostas mais consistentes
    })

    // Parse JSON from response (mais robusto)
    let recipes = []
    try {
      // Tentar extrair JSON direto
      const jsonMatch = text.match(/\[[\s\S]*\]/) || text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const jsonStr = jsonMatch[0]
        recipes = JSON.parse(jsonStr)
        // Se retornou objeto com array, extrair array
        if (recipes && typeof recipes === 'object' && !Array.isArray(recipes)) {
          recipes = recipes.recipes || recipes.data || []
        }
      }

      // Garantir que é array
      if (!Array.isArray(recipes)) {
        recipes = []
      }

      // Limitar a 2 receitas
      recipes = recipes.slice(0, 2)

      // Adicionar URLs de imagens do Unsplash para cada receita
      // Usar busca rápida baseada no nome e ingredientes (sem chamada API adicional)
      recipes = recipes.map((recipe: any) => {
        const mainIngredient = recipe.ingredients?.[0]?.toLowerCase() || recipe.name.toLowerCase().split(' ')[0]
        const searchQuery = encodeURIComponent(`${recipe.name} ${mainIngredient} food recipe`)
        // Unsplash Source API - rápido e gratuito, sem necessidade de API key
        const imageUrl = `https://source.unsplash.com/800x600/?${searchQuery}`

        return {
          ...recipe,
          image: imageUrl,
        }
      })

      // Salvar no cache para próximas requisições idênticas (24h)
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      try {
        await supabaseForCache
          .from("api_cache")
          .upsert({
            cache_key: `recipes_${cacheKey}`,
            cache_data: recipes,
            endpoint: "/api/generate-recipes",
            expires_at: expiresAt.toISOString(),
          })
      } catch (cacheError) {
        // Falha no cache não deve bloquear a resposta
        logger.warn("Failed to cache recipes", {
          userId: user.id,
          error: cacheError instanceof Error ? cacheError.message : String(cacheError),
        })
      }
    } catch (error) {
      logger.error("Failed to parse recipes JSON", error as Error, { text: text.substring(0, 200) })
      recipes = []
    }

    logger.info("Recipes generated", {
      userId: user.id,
      count: recipes.length,
      duration: Date.now() - startTime
    })

    return NextResponse.json({ recipes })
  } catch (error) {
    logger.apiError("POST", "/api/generate-recipes", error as Error, {
      duration: Date.now() - startTime,
    })
    return NextResponse.json({ error: "Failed to generate recipes" }, { status: 500 })
  }
}

export const POST = withRateLimit(generateRecipesHandler, RATE_LIMITS.HEAVY)
