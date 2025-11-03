import { describe, expect, it } from "vitest"
import {
  onboardingSchema,
  chatMessageSchema,
  chatRequestSchema,
  recipeRequestSchema,
  gamificationActivitySchema,
  diaryEntrySchema,
  communityPostSchema,
  commentSchema,
  postpartumScreeningSchema,
  recommendationRequestSchema,
} from "@/lib/validations/schemas"

describe("Validation Schemas", () => {
  describe("onboardingSchema", () => {
    it("should validate correct onboarding data", () => {
      const validData = {
        emotionalState: "feliz" as const,
        mainChallenges: ["sono", "amamentacao"],
        sleepQuality: "boa" as const,
        selfCareFrequency: "frequentemente" as const,
        babyAge: 6,
        specificNeeds: ["apoio"],
      }
      expect(() => onboardingSchema.parse(validData)).not.toThrow()
    })

    it("should reject invalid emotional state", () => {
      const invalidData = {
        emotionalState: "invalid",
        sleepQuality: "boa",
        selfCareFrequency: "frequentemente",
        babyAge: 6,
      }
      expect(() => onboardingSchema.parse(invalidData)).toThrow()
    })

    it("should reject negative baby age", () => {
      const invalidData = {
        emotionalState: "feliz",
        sleepQuality: "boa",
        selfCareFrequency: "frequentemente",
        babyAge: -1,
      }
      expect(() => onboardingSchema.parse(invalidData)).toThrow()
    })
  })

  describe("chatMessageSchema", () => {
    it("should validate correct chat message", () => {
      const validMessage = {
        role: "user" as const,
        content: "Hello, how are you?",
      }
      expect(() => chatMessageSchema.parse(validMessage)).not.toThrow()
    })

    it("should reject empty content", () => {
      const invalidMessage = {
        role: "user",
        content: "",
      }
      expect(() => chatMessageSchema.parse(invalidMessage)).toThrow()
    })

    it("should reject content longer than 5000 characters", () => {
      const invalidMessage = {
        role: "user",
        content: "a".repeat(5001),
      }
      expect(() => chatMessageSchema.parse(invalidMessage)).toThrow()
    })
  })

  describe("chatRequestSchema", () => {
    it("should validate correct chat request", () => {
      const validRequest = {
        messages: [
          { role: "user" as const, content: "Hello" },
          { role: "assistant" as const, content: "Hi there!" },
        ],
        useEmpatheticMode: true,
      }
      expect(() => chatRequestSchema.parse(validRequest)).not.toThrow()
    })

    it("should reject empty messages array", () => {
      const invalidRequest = {
        messages: [],
      }
      expect(() => chatRequestSchema.parse(invalidRequest)).toThrow()
    })
  })

  describe("recipeRequestSchema", () => {
    it("should validate correct recipe request", () => {
      const validRequest = {
        mood: "feliz",
        preferences: "vegetariana",
        ingredients: "ovos, leite, farinha",
      }
      expect(() => recipeRequestSchema.parse(validRequest)).not.toThrow()
    })

    it("should reject empty mood", () => {
      const invalidRequest = {
        mood: "",
        preferences: "vegetariana",
        ingredients: "ovos",
      }
      expect(() => recipeRequestSchema.parse(invalidRequest)).toThrow()
    })
  })

  describe("gamificationActivitySchema", () => {
    it("should validate correct activity", () => {
      const validActivity = {
        activityType: "daily_checkin",
        points: 10,
        metadata: { mood: "happy" },
      }
      expect(() => gamificationActivitySchema.parse(validActivity)).not.toThrow()
    })

    it("should reject empty activity type", () => {
      const invalidActivity = {
        activityType: "",
        points: 10,
      }
      expect(() => gamificationActivitySchema.parse(invalidActivity)).toThrow()
    })
  })

  describe("diaryEntrySchema", () => {
    it("should validate correct diary entry", () => {
      const validEntry = {
        title: "My day",
        content: "Today was a good day...",
        mood: "happy",
        tags: ["gratitude"],
      }
      expect(() => diaryEntrySchema.parse(validEntry)).not.toThrow()
    })

    it("should reject empty content", () => {
      const invalidEntry = {
        content: "",
      }
      expect(() => diaryEntrySchema.parse(invalidEntry)).toThrow()
    })

    it("should reject content longer than 10000 characters", () => {
      const invalidEntry = {
        content: "a".repeat(10001),
      }
      expect(() => diaryEntrySchema.parse(invalidEntry)).toThrow()
    })
  })

  describe("communityPostSchema", () => {
    it("should validate correct community post", () => {
      const validPost = {
        title: "Need advice",
        content: "How do you handle...",
        category: "advice" as const,
        isAnonymous: false,
      }
      expect(() => communityPostSchema.parse(validPost)).not.toThrow()
    })

    it("should reject empty title", () => {
      const invalidPost = {
        title: "",
        content: "How do you handle...",
        category: "advice",
      }
      expect(() => communityPostSchema.parse(invalidPost)).toThrow()
    })

    it("should reject invalid category", () => {
      const invalidPost = {
        title: "Need advice",
        content: "How do you handle...",
        category: "invalid",
      }
      expect(() => communityPostSchema.parse(invalidPost)).toThrow()
    })
  })

  describe("commentSchema", () => {
    it("should validate correct comment", () => {
      const validComment = {
        content: "Great post!",
        postId: "550e8400-e29b-41d4-a716-446655440000",
      }
      expect(() => commentSchema.parse(validComment)).not.toThrow()
    })

    it("should reject invalid UUID", () => {
      const invalidComment = {
        content: "Great post!",
        postId: "invalid-uuid",
      }
      expect(() => commentSchema.parse(invalidComment)).toThrow()
    })
  })

  describe("postpartumScreeningSchema", () => {
    it("should validate correct screening data", () => {
      const validScreening = {
        questions: Array.from({ length: 10 }, (_, i) => ({
          id: `q${i + 1}`,
          answer: 2,
        })),
      }
      expect(() => postpartumScreeningSchema.parse(validScreening)).not.toThrow()
    })

    it("should reject fewer than 10 questions", () => {
      const invalidScreening = {
        questions: Array.from({ length: 5 }, (_, i) => ({
          id: `q${i + 1}`,
          answer: 2,
        })),
      }
      expect(() => postpartumScreeningSchema.parse(invalidScreening)).toThrow()
    })

    it("should reject answer outside 0-3 range", () => {
      const invalidScreening = {
        questions: Array.from({ length: 10 }, (_, i) => ({
          id: `q${i + 1}`,
          answer: 5,
        })),
      }
      expect(() => postpartumScreeningSchema.parse(invalidScreening)).toThrow()
    })
  })

  describe("recommendationRequestSchema", () => {
    it("should validate correct recommendation request", () => {
      const validRequest = {
        context: "I'm feeling stressed and need help",
        type: "self_care" as const,
      }
      expect(() => recommendationRequestSchema.parse(validRequest)).not.toThrow()
    })

    it("should reject empty context", () => {
      const invalidRequest = {
        context: "",
        type: "self_care",
      }
      expect(() => recommendationRequestSchema.parse(invalidRequest)).toThrow()
    })

    it("should reject invalid type", () => {
      const invalidRequest = {
        context: "I need help",
        type: "invalid",
      }
      expect(() => recommendationRequestSchema.parse(invalidRequest)).toThrow()
    })
  })
})
