import { z } from "zod"

export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Mensagem não pode estar vazia")
    .max(5000, "Mensagem muito longa (máximo 5000 caracteres)"),
  conversationId: z.string().uuid("ID de conversa inválido").optional(),
  context: z
    .object({
      maternalJourney: z.enum(["pregnant", "planning", "postpartum", "experienced_mom"]).optional(),
      gestationWeek: z.number().min(1).max(42).optional(),
      interests: z.array(z.string()).optional(),
    })
    .optional(),
})

export type ChatMessageData = z.infer<typeof chatMessageSchema>

export const chatResponseSchema = z.object({
  response: z.string(),
  conversationId: z.string().uuid(),
  messageId: z.string().uuid().optional(),
})

export type ChatResponseData = z.infer<typeof chatResponseSchema>
