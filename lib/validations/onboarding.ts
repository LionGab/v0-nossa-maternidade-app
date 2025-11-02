import { z } from "zod"

export const onboardingSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  maternalJourney: z.enum(["pregnant", "planning", "postpartum", "experienced_mom"], {
    errorMap: () => ({ message: "Selecione uma opção válida para sua jornada maternal" }),
  }),
  gestationWeek: z
    .number()
    .min(1, "Semana de gestação deve ser pelo menos 1")
    .max(42, "Semana de gestação não pode ser maior que 42")
    .optional()
    .nullable(),
  interests: z
    .array(z.string())
    .min(1, "Selecione pelo menos um interesse")
    .max(10, "Selecione no máximo 10 interesses"),
  nathContentPreferences: z.array(z.string()).max(10, "Selecione no máximo 10 preferências"),
  recipePreferences: z.array(z.string()).max(10, "Selecione no máximo 10 preferências de receitas"),
})

export type OnboardingData = z.infer<typeof onboardingSchema>

// Validation for updating profile
export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  maternalJourney: z.enum(["pregnant", "planning", "postpartum", "experienced_mom"]).optional(),
  gestationWeek: z.number().min(1).max(42).optional().nullable(),
  interests: z.array(z.string()).max(10).optional(),
  nathContentPreferences: z.array(z.string()).max(10).optional(),
  recipePreferences: z.array(z.string()).max(10).optional(),
})

export type UpdateProfileData = z.infer<typeof updateProfileSchema>
