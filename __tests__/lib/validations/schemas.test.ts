import { describe, it, expect } from 'vitest'
import {
  onboardingSchema,
  chatRequestSchema,
  chatMessageSchema,
  recipeRequestSchema,
  newsRequestSchema,
  gamificationActivitySchema,
  diaryEntrySchema,
  communityPostSchema,
  postpartumScreeningSchema,
  recommendationRequestSchema,
} from '@/lib/validations/schemas'

describe('lib/validations/schemas', () => {
  describe('onboardingSchema', () => {
    it('deve validar dados de onboarding válidos', () => {
      const validData = {
        emotionalState: 'feliz',
        mainChallenges: ['sono', 'estresse'],
        sleepQuality: 'regular',
        selfCareFrequency: 'as-vezes',
        babyAge: 6,
        specificNeeds: ['suporte emocional'],
      }

      const result = onboardingSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.emotionalState).toBe('feliz')
        expect(result.data.babyAge).toBe(6)
      }
    })

    it('deve rejeitar emotionalState inválido', () => {
      const invalidData = {
        emotionalState: 'inválido',
        sleepQuality: 'boa',
        selfCareFrequency: 'frequentemente',
        babyAge: 3,
      }

      const result = onboardingSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('deve rejeitar babyAge fora do range', () => {
      const invalidData = {
        emotionalState: 'feliz',
        sleepQuality: 'boa',
        selfCareFrequency: 'frequentemente',
        babyAge: 100, // Fora do range 0-60
      }

      const result = onboardingSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('deve usar valores padrão para arrays opcionais', () => {
      const data = {
        emotionalState: 'equilibrada',
        sleepQuality: 'boa',
        selfCareFrequency: 'frequentemente',
        babyAge: 3,
      }

      const result = onboardingSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.mainChallenges).toEqual([])
        expect(result.data.specificNeeds).toEqual([])
      }
    })
  })

  describe('chatMessageSchema', () => {
    it('deve validar mensagem válida', () => {
      const validMessage = {
        role: 'user',
        content: 'Olá, como você está?',
      }

      const result = chatMessageSchema.safeParse(validMessage)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar role inválido', () => {
      const invalidMessage = {
        role: 'invalid',
        content: 'Teste',
      }

      const result = chatMessageSchema.safeParse(invalidMessage)
      expect(result.success).toBe(false)
    })

    it('deve rejeitar conteúdo muito longo', () => {
      const invalidMessage = {
        role: 'user',
        content: 'a'.repeat(5001), // Máximo é 5000
      }

      const result = chatMessageSchema.safeParse(invalidMessage)
      expect(result.success).toBe(false)
    })

    it('deve rejeitar conteúdo vazio', () => {
      const invalidMessage = {
        role: 'user',
        content: '',
      }

      const result = chatMessageSchema.safeParse(invalidMessage)
      expect(result.success).toBe(false)
    })
  })

  describe('chatRequestSchema', () => {
    it('deve validar request válido', () => {
      const validRequest = {
        messages: [
          { role: 'user', content: 'Olá' },
          { role: 'assistant', content: 'Olá! Como posso ajudar?' },
        ],
        useEmpatheticMode: true,
      }

      const result = chatRequestSchema.safeParse(validRequest)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar array vazio de mensagens', () => {
      const invalidRequest = {
        messages: [],
      }

      const result = chatRequestSchema.safeParse(invalidRequest)
      expect(result.success).toBe(false)
    })

    it('deve usar valor padrão para useEmpatheticMode', () => {
      const request = {
        messages: [{ role: 'user', content: 'Teste' }],
      }

      const result = chatRequestSchema.safeParse(request)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.useEmpatheticMode).toBe(false)
      }
    })
  })

  describe('recipeRequestSchema', () => {
    it('deve validar request válido', () => {
      const validRequest = {
        mood: 'cansada',
        preferences: 'vegetariana',
        ingredients: 'tomate, cebola, alho',
      }

      const result = recipeRequestSchema.safeParse(validRequest)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar campos vazios', () => {
      const invalidRequest = {
        mood: '',
        preferences: 'vegetariana',
        ingredients: 'tomate',
      }

      const result = recipeRequestSchema.safeParse(invalidRequest)
      expect(result.success).toBe(false)
    })
  })

  describe('newsRequestSchema', () => {
    it('deve validar categoria válida', () => {
      const validRequest = {
        category: 'health',
      }

      const result = newsRequestSchema.safeParse(validRequest)
      expect(result.success).toBe(true)
    })

    it('deve usar "all" como padrão', () => {
      const request = {}

      const result = newsRequestSchema.safeParse(request)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.category).toBe('all')
      }
    })

    it('deve rejeitar categoria inválida', () => {
      const invalidRequest = {
        category: 'invalid',
      }

      const result = newsRequestSchema.safeParse(invalidRequest)
      expect(result.success).toBe(false)
    })
  })

  describe('gamificationActivitySchema', () => {
    it('deve validar atividade válida', () => {
      const validActivity = {
        activityType: 'chat',
        points: 10,
        metadata: { extra: 'data' },
      }

      const result = gamificationActivitySchema.safeParse(validActivity)
      expect(result.success).toBe(true)
    })

    it('deve validar sem pontos e metadata', () => {
      const activity = {
        activityType: 'diary_entry',
      }

      const result = gamificationActivitySchema.safeParse(activity)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar pontos negativos', () => {
      const invalidActivity = {
        activityType: 'chat',
        points: -5,
      }

      const result = gamificationActivitySchema.safeParse(invalidActivity)
      expect(result.success).toBe(false)
    })
  })

  describe('diaryEntrySchema', () => {
    it('deve validar entrada válida', () => {
      const validEntry = {
        title: 'Meu dia',
        content: 'Hoje foi um bom dia',
        mood: 'feliz',
        tags: ['positivo', 'família'],
      }

      const result = diaryEntrySchema.safeParse(validEntry)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar título muito longo', () => {
      const invalidEntry = {
        title: 'a'.repeat(201), // Máximo é 200
        content: 'Teste',
      }

      const result = diaryEntrySchema.safeParse(invalidEntry)
      expect(result.success).toBe(false)
    })

    it('deve rejeitar conteúdo muito longo', () => {
      const invalidEntry = {
        content: 'a'.repeat(10001), // Máximo é 10000
      }

      const result = diaryEntrySchema.safeParse(invalidEntry)
      expect(result.success).toBe(false)
    })
  })

  describe('communityPostSchema', () => {
    it('deve validar post válido', () => {
      const validPost = {
        title: 'Dúvida sobre amamentação',
        content: 'Tenho uma dúvida...',
        category: 'support',
        isAnonymous: false,
      }

      const result = communityPostSchema.safeParse(validPost)
      expect(result.success).toBe(true)
    })

    it('deve usar false como padrão para isAnonymous', () => {
      const post = {
        title: 'Teste',
        content: 'Conteúdo',
        category: 'general',
      }

      const result = communityPostSchema.safeParse(post)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.isAnonymous).toBe(false)
      }
    })
  })

  describe('postpartumScreeningSchema', () => {
    it('deve validar screening válido com exatamente 10 questões', () => {
      const validScreening = {
        questions: Array.from({ length: 10 }, (_, i) => ({
          id: `q${i}`,
          answer: i % 4, // 0-3
        })),
      }

      const result = postpartumScreeningSchema.safeParse(validScreening)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar menos de 10 questões', () => {
      const invalidScreening = {
        questions: Array.from({ length: 9 }, (_, i) => ({
          id: `q${i}`,
          answer: 0,
        })),
      }

      const result = postpartumScreeningSchema.safeParse(invalidScreening)
      expect(result.success).toBe(false)
    })

    it('deve rejeitar respostas fora do range 0-3', () => {
      const invalidScreening = {
        questions: Array.from({ length: 10 }, (_, i) => ({
          id: `q${i}`,
          answer: i === 0 ? 5 : 0, // Uma resposta inválida
        })),
      }

      const result = postpartumScreeningSchema.safeParse(invalidScreening)
      expect(result.success).toBe(false)
    })
  })

  describe('recommendationRequestSchema', () => {
    it('deve validar request válido', () => {
      const validRequest = {
        context: 'Estou me sentindo cansada e estressada',
        type: 'self_care',
      }

      const result = recommendationRequestSchema.safeParse(validRequest)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar tipo inválido', () => {
      const invalidRequest = {
        context: 'Teste',
        type: 'invalid',
      }

      const result = recommendationRequestSchema.safeParse(invalidRequest)
      expect(result.success).toBe(false)
    })

    it('deve rejeitar contexto muito longo', () => {
      const invalidRequest = {
        context: 'a'.repeat(2001), // Máximo é 2000
        type: 'health',
      }

      const result = recommendationRequestSchema.safeParse(invalidRequest)
      expect(result.success).toBe(false)
    })
  })
})
