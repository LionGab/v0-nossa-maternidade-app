import { z } from "zod"

// Constantes compartilhadas para validação
const MAX_STRING_LENGTH = {
  title: 200,
  content_short: 1000,
  content_medium: 5000,
  content_long: 10000,
  context: 2000,
} as const

const MIN_STRING_LENGTH = 1

// Schema de validação para onboarding
export const onboardingSchema = z.object({
  emotionalState: z.enum(["exausta", "ansiosa", "feliz", "confusa", "equilibrada"], {
    errorMap: () => ({ message: "Estado emocional inválido" }),
  }),
  mainChallenges: z
    .array(z.string().min(MIN_STRING_LENGTH).max(MAX_STRING_LENGTH.content_short))
    .optional()
    .default([]),
  sleepQuality: z.enum(["pessima", "ruim", "regular", "boa"], {
    errorMap: () => ({ message: "Qualidade do sono inválida" }),
  }),
  selfCareFrequency: z.enum(["nunca", "raramente", "as-vezes", "frequentemente"], {
    errorMap: () => ({ message: "Frequência de autocuidado inválida" }),
  }),
  babyAge: z
    .number({ invalid_type_error: "Idade do bebê deve ser um número" })
    .int({ message: "Idade do bebê deve ser um número inteiro" })
    .min(0, { message: "Idade não pode ser negativa" })
    .max(60, { message: "Idade máxima permitida é 60 meses" }),
  specificNeeds: z
    .array(z.string().min(MIN_STRING_LENGTH).max(MAX_STRING_LENGTH.content_short))
    .optional()
    .default([]),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>

// Schema de validação para chat
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"], {
    errorMap: () => ({ message: "Papel da mensagem inválido" }),
  }),
  content: z
    .string({ required_error: "Conteúdo da mensagem é obrigatório" })
    .min(MIN_STRING_LENGTH, { message: "Mensagem não pode estar vazia" })
    .max(MAX_STRING_LENGTH.content_medium, {
      message: `Mensagem muito longa (máximo ${MAX_STRING_LENGTH.content_medium} caracteres)`,
    }),
})

export const chatRequestSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1, { message: "Pelo menos uma mensagem é necessária" }),
  useEmpatheticMode: z.boolean().optional().default(false),
})

export type ChatRequest = z.infer<typeof chatRequestSchema>

// Schema de validação para receitas
export const recipeRequestSchema = z.object({
  mood: z
    .string({ required_error: "Humor é obrigatório" })
    .min(MIN_STRING_LENGTH, { message: "Humor não pode estar vazio" })
    .max(MAX_STRING_LENGTH.content_short),
  preferences: z
    .string({ required_error: "Preferências são obrigatórias" })
    .min(MIN_STRING_LENGTH, { message: "Preferências não podem estar vazias" })
    .max(MAX_STRING_LENGTH.content_medium),
  ingredients: z
    .string({ required_error: "Ingredientes são obrigatórios" })
    .min(MIN_STRING_LENGTH, { message: "Ingredientes não podem estar vazios" })
    .max(MAX_STRING_LENGTH.content_medium),
})

export type RecipeRequest = z.infer<typeof recipeRequestSchema>

// Schema de validação para notícias
export const newsRequestSchema = z.object({
  category: z
    .enum(["all", "pregnancy", "parenting", "health", "trends"], {
      errorMap: () => ({ message: "Categoria inválida" }),
    })
    .optional()
    .default("all"),
})

export type NewsRequest = z.infer<typeof newsRequestSchema>

// Schema de validação para atividade de gamificação
export const gamificationActivitySchema = z.object({
  activityType: z
    .string({ required_error: "Tipo de atividade é obrigatório" })
    .min(MIN_STRING_LENGTH, { message: "Tipo de atividade não pode estar vazio" })
    .max(MAX_STRING_LENGTH.content_short),
  points: z
    .number({ invalid_type_error: "Pontos devem ser um número" })
    .int({ message: "Pontos devem ser um número inteiro" })
    .min(0, { message: "Pontos não podem ser negativos" })
    .optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type GamificationActivity = z.infer<typeof gamificationActivitySchema>

// Schema de validação para entradas de diário
export const diaryEntrySchema = z.object({
  title: z
    .string()
    .max(MAX_STRING_LENGTH.title, {
      message: `Título muito longo (máximo ${MAX_STRING_LENGTH.title} caracteres)`,
    })
    .optional(),
  content: z
    .string({ required_error: "Conteúdo do diário é obrigatório" })
    .min(MIN_STRING_LENGTH, { message: "Conteúdo não pode estar vazio" })
    .max(MAX_STRING_LENGTH.content_long, {
      message: `Conteúdo muito longo (máximo ${MAX_STRING_LENGTH.content_long} caracteres)`,
    }),
  mood: z
    .string()
    .max(MAX_STRING_LENGTH.content_short)
    .optional(),
  tags: z
    .array(z.string().min(MIN_STRING_LENGTH).max(MAX_STRING_LENGTH.content_short))
    .optional()
    .default([]),
  audioUrl: z
    .string()
    .url({ message: "URL de áudio inválida" })
    .optional(),
  audioTranscript: z
    .string()
    .max(MAX_STRING_LENGTH.content_long)
    .optional(),
})

export type DiaryEntry = z.infer<typeof diaryEntrySchema>

// Schema de validação para posts da comunidade
export const communityPostSchema = z.object({
  title: z
    .string({ required_error: "Título é obrigatório" })
    .min(MIN_STRING_LENGTH, { message: "Título não pode estar vazio" })
    .max(MAX_STRING_LENGTH.title, {
      message: `Título muito longo (máximo ${MAX_STRING_LENGTH.title} caracteres)`,
    }),
  content: z
    .string({ required_error: "Conteúdo é obrigatório" })
    .min(MIN_STRING_LENGTH, { message: "Conteúdo não pode estar vazio" })
    .max(MAX_STRING_LENGTH.content_medium, {
      message: `Conteúdo muito longo (máximo ${MAX_STRING_LENGTH.content_medium} caracteres)`,
    }),
  category: z.enum(["general", "support", "advice", "celebration", "vent"], {
    errorMap: () => ({ message: "Categoria inválida" }),
  }),
  isAnonymous: z.boolean().optional().default(false),
})

export type CommunityPost = z.infer<typeof communityPostSchema>

// Schema de validação para comentários
export const commentSchema = z.object({
  content: z
    .string({ required_error: "Conteúdo do comentário é obrigatório" })
    .min(MIN_STRING_LENGTH, { message: "Comentário não pode estar vazio" })
    .max(MAX_STRING_LENGTH.content_short, {
      message: `Comentário muito longo (máximo ${MAX_STRING_LENGTH.content_short} caracteres)`,
    }),
  postId: z.string().uuid({ message: "ID do post inválido" }),
})

export type Comment = z.infer<typeof commentSchema>

// Schema de validação para triagem pós-parto
export const postpartumScreeningSchema = z.object({
  questions: z
    .array(
      z.object({
        id: z.string({ required_error: "ID da pergunta é obrigatório" }),
        answer: z
          .number({ invalid_type_error: "Resposta deve ser um número" })
          .int({ message: "Resposta deve ser um número inteiro" })
          .min(0, { message: "Resposta não pode ser negativa" })
          .max(3, { message: "Resposta máxima permitida é 3" }),
      }),
    )
    .length(10, { message: "Exatamente 10 perguntas são necessárias" }),
})

export type PostpartumScreening = z.infer<typeof postpartumScreeningSchema>

// Schema de validação para recomendação IA
export const recommendationRequestSchema = z.object({
  context: z
    .string({ required_error: "Contexto é obrigatório" })
    .min(MIN_STRING_LENGTH, { message: "Contexto não pode estar vazio" })
    .max(MAX_STRING_LENGTH.context, {
      message: `Contexto muito longo (máximo ${MAX_STRING_LENGTH.context} caracteres)`,
    }),
  type: z.enum(["health", "self_care", "baby_care", "nutrition", "exercise"], {
    errorMap: () => ({ message: "Tipo de recomendação inválido" }),
  }),
})

export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>

// Schema de validação para agentes de código
export const agentTaskSchema = z.object({
  id: z.string().max(MAX_STRING_LENGTH.content_short).optional(),
  agentType: z.enum(
    [
      "analyzer",
      "refactor",
      "test-generator",
      "documenter",
      "optimizer",
      "bug-detector",
      "component-generator",
      "validator",
    ],
    {
      errorMap: () => ({ message: "Tipo de agente inválido" }),
    }
  ),
  input: z
    .string({ required_error: "Input é obrigatório" })
    .min(MIN_STRING_LENGTH, { message: "Input não pode estar vazio" })
    .max(MAX_STRING_LENGTH.content_long),
  filePath: z.string().max(MAX_STRING_LENGTH.content_short).optional(),
  options: z.record(z.unknown()).optional(),
  priority: z
    .number({ invalid_type_error: "Prioridade deve ser um número" })
    .int({ message: "Prioridade deve ser um número inteiro" })
    .min(0, { message: "Prioridade não pode ser negativa" })
    .optional(),
})

export const multiAgentRequestSchema = z.object({
  tasks: z.array(agentTaskSchema).min(1, { message: "Pelo menos uma tarefa é necessária" }),
  mode: z
    .enum(["parallel", "sequential", "orchestrated"], {
      errorMap: () => ({ message: "Modo inválido" }),
    })
    .optional(),
  context: z
    .object({
      codebase: z.string().max(MAX_STRING_LENGTH.content_long).optional(),
      dependencies: z
        .array(z.string().min(MIN_STRING_LENGTH).max(MAX_STRING_LENGTH.content_short))
        .optional(),
      preferences: z.record(z.unknown()).optional(),
    })
    .optional(),
})

export type AgentTask = z.infer<typeof agentTaskSchema>
export type MultiAgentRequest = z.infer<typeof multiAgentRequestSchema>
