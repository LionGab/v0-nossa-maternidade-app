import { z } from "zod"

// Schema de validação para onboarding
export const onboardingSchema = z.object({
  emotionalState: z.enum(["exausta", "ansiosa", "feliz", "confusa", "equilibrada"]),
  mainChallenges: z.array(z.string()).optional().default([]),
  sleepQuality: z.enum(["pessima", "ruim", "regular", "boa"]),
  selfCareFrequency: z.enum(["nunca", "raramente", "as-vezes", "frequentemente"]),
  babyAge: z.number().int().min(0).max(60),
  specificNeeds: z.array(z.string()).optional().default([]),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>

// Schema de validação para chat
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(5000),
})

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1),
  useEmpatheticMode: z.boolean().optional().default(false),
})

export type ChatRequest = z.infer<typeof chatRequestSchema>

// Schema de validação para receitas
export const recipeRequestSchema = z.object({
  mood: z.string().min(1),
  preferences: z.string().min(1),
  ingredients: z.string().min(1),
})

export type RecipeRequest = z.infer<typeof recipeRequestSchema>

// Schema de validação para notícias
export const newsRequestSchema = z.object({
  category: z.enum(["all", "pregnancy", "parenting", "health", "trends"]).optional().default("all"),
})

export type NewsRequest = z.infer<typeof newsRequestSchema>

// Schema de validação para atividade de gamificação
export const gamificationActivitySchema = z.object({
  activityType: z.string().min(1),
  points: z.number().int().min(0).optional(),
  metadata: z.record(z.any()).optional(),
})

export type GamificationActivity = z.infer<typeof gamificationActivitySchema>

// Schema de validação para entradas de diário
export const diaryEntrySchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string().min(1).max(10000),
  mood: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  audioUrl: z.string().url().optional(),
  audioTranscript: z.string().optional(),
})

export type DiaryEntry = z.infer<typeof diaryEntrySchema>

// Schema de validação para posts da comunidade
export const communityPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(5000),
  category: z.enum(["general", "support", "advice", "celebration", "vent"]),
  isAnonymous: z.boolean().optional().default(false),
})

export type CommunityPost = z.infer<typeof communityPostSchema>

// Schema de validação para comentários
export const commentSchema = z.object({
  content: z.string().min(1).max(1000),
  postId: z.string().uuid(),
})

export type Comment = z.infer<typeof commentSchema>

// Schema de validação para triagem pós-parto
export const postpartumScreeningSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string(),
      answer: z.number().int().min(0).max(3),
    }),
  ).length(10),
})

export type PostpartumScreening = z.infer<typeof postpartumScreeningSchema>

// Schema de validação para recomendação IA
export const recommendationRequestSchema = z.object({
  context: z.string().min(1).max(2000),
  type: z.enum(["health", "self_care", "baby_care", "nutrition", "exercise"]),
})

export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>

