import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"

export { OPTIONS } // CORS preflight

/**
 * API de Insights Personalizados
 * Analisa padrões do usuário e fornece insights acionáveis
 */
async function insightsHandler(request: NextRequest) {
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

    // Buscar dados históricos do usuário
    const [onboardingData, sentimentData, activitiesData, chatData] = await Promise.all([
      // Onboarding responses
      supabase
        .from("onboarding_responses")
        .select("emotional_state, sleep_quality, self_care_frequency, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),

      // Sentiment analysis history
      supabase
        .from("sentiment_analysis")
        .select("sentiment_score, sentiment_label, emotions, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),

      // Daily activities
      supabase
        .from("daily_activities")
        .select("activity_type, activity_date, points_earned")
        .eq("user_id", user.id)
        .order("activity_date", { ascending: false })
        .limit(30),

      // Chat messages count (para verificar engajamento)
      supabase
        .from("conversations")
        .select("id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50),
    ])

    // Calcular insights
    const insights = {
      moodTrend: calculateMoodTrend(sentimentData.data || []),
      activityPattern: calculateActivityPattern(activitiesData.data || []),
      selfCareScore: calculateSelfCareScore(
        onboardingData.data,
        activitiesData.data || []
      ),
      engagementLevel: calculateEngagementLevel(chatData.data || []),
      recommendations: generateRecommendations(
        onboardingData.data,
        sentimentData.data || [],
        activitiesData.data || []
      ),
      milestones: detectMilestones(activitiesData.data || []),
    }

    logger.info("Insights generated", {
      userId: user.id,
      duration: Date.now() - startTime,
    })

    return NextResponse.json({ insights })
  } catch (error) {
    logger.apiError("GET", "/api/insights", error as Error, {
      duration: Date.now() - startTime,
    })
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}

function calculateMoodTrend(sentiments: any[]): { trend: string; score: number; message: string } {
  if (sentiments.length === 0) {
    return {
      trend: "stable",
      score: 0.5,
      message: "Continue acompanhando seu bem-estar para obter insights personalizados",
    }
  }

  const recent = sentiments.slice(0, 3)
  const older = sentiments.slice(3, 6)

  const recentAvg = recent.reduce((sum, s) => sum + (s.sentiment_score || 0), 0) / recent.length
  const olderAvg = older.length > 0
    ? older.reduce((sum, s) => sum + (s.sentiment_score || 0), 0) / older.length
    : recentAvg

  const trend = recentAvg > olderAvg + 0.1 ? "improving" : recentAvg < olderAvg - 0.1 ? "declining" : "stable"

  const messages = {
    improving: "Seu bem-estar está melhorando! Continue assim 💕",
    declining: "Você está passando por um momento desafiador. Estamos aqui para te apoiar 💪",
    stable: "Seu bem-estar está estável. Que tal tentar algo novo hoje? ✨",
  }

  return {
    trend,
    score: recentAvg,
    message: messages[trend],
  }
}

function calculateActivityPattern(activities: any[]): {
  weeklyAverage: number
  mostActiveDay: string
  streak: number
} {
  if (activities.length === 0) {
    return { weeklyAverage: 0, mostActiveDay: "N/A", streak: 0 }
  }

  // Calcular média semanal
  const last7Days = activities.filter(a => {
    const date = new Date(a.activity_date)
    const daysAgo = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
    return daysAgo <= 7
  })

  const weeklyAverage = last7Days.length / 7

  // Calcular streak
  let streak = 0
  const today = new Date().toISOString().split("T")[0]
  const dates = [...new Set(activities.map(a => a.activity_date))].sort().reverse()

  for (let i = 0; i < dates.length; i++) {
    const expectedDate = new Date()
    expectedDate.setDate(expectedDate.getDate() - i)
    const expectedDateStr = expectedDate.toISOString().split("T")[0]

    if (dates[i] === expectedDateStr) {
      streak++
    } else {
      break
    }
  }

  // Dia mais ativo
  const dayCounts: Record<string, number> = {}
  activities.forEach(a => {
    const day = new Date(a.activity_date).toLocaleDateString("pt-BR", { weekday: "long" })
    dayCounts[day] = (dayCounts[day] || 0) + 1
  })

  const mostActiveDay = Object.entries(dayCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A"

  return {
    weeklyAverage: Math.round(weeklyAverage * 10) / 10,
    mostActiveDay,
    streak,
  }
}

function calculateSelfCareScore(onboarding: any, activities: any[]): {
  score: number
  message: string
  suggestions: string[]
} {
  const selfCareActivities = activities.filter(a =>
    a.activity_type === "self_care"
  ).length

  const totalDays = Math.max(1, activities.length)
  const selfCareFrequency = selfCareActivities / totalDays

  let score = 0
  let message = ""
  const suggestions: string[] = []

  if (selfCareFrequency >= 0.3) {
    score = 90
    message = "Você está cuidando muito bem de si mesma! Continue assim 💕"
  } else if (selfCareFrequency >= 0.15) {
    score = 70
    message = "Seu autocuidado está bom, mas pode melhorar um pouco mais"
    suggestions.push("Tente dedicar 10 minutos por dia para você")
  } else if (selfCareFrequency >= 0.05) {
    score = 50
    message = "Você está começando a cuidar de si mesma. Que tal aumentar a frequência?"
    suggestions.push("Experimente o autocuidado 2-3 vezes por semana")
    suggestions.push("Explore atividades que você gosta")
  } else {
    score = 30
    message = "O autocuidado é essencial para sua jornada. Vamos começar?"
    suggestions.push("Visite a página de Autocuidado para ideias")
    suggestions.push("Comece com atividades de 10 minutos")
    suggestions.push("Lembre-se: cuidar de você é cuidar do seu bebê")
  }

  return { score, message, suggestions }
}

function calculateEngagementLevel(chats: any[]): {
  level: string
  message: string
  suggestions: string[]
} {
  const last7Days = chats.filter(c => {
    const date = new Date(c.created_at)
    const daysAgo = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
    return daysAgo <= 7
  }).length

  if (last7Days >= 10) {
    return {
      level: "high",
      message: "Você está muito engajada! Continue explorando o app 💕",
      suggestions: [],
    }
  } else if (last7Days >= 5) {
    return {
      level: "medium",
      message: "Bom engajamento! Explore mais funcionalidades",
      suggestions: ["Experimente a NathAI para dúvidas personalizadas"],
    }
  } else {
    return {
      level: "low",
      message: "Que tal explorar mais o app hoje?",
      suggestions: [
        "Converse com a NathAI sobre suas dúvidas",
        "Explore receitas personalizadas",
        "Veja seu progresso e conquistas",
      ],
    }
  }
}

function generateRecommendations(
  onboarding: any,
  sentiments: any[],
  activities: any[]
): Array<{ title: string; description: string; priority: "high" | "medium" | "low"; action: string }> {
  const recommendations: Array<{ title: string; description: string; priority: "high" | "medium" | "low"; action: string }> = []

  // Analisar padrões de humor
  if (sentiments.length > 0) {
    const recent = sentiments[0]
    if (recent.sentiment_score < 0.3) {
      recommendations.push({
        title: "Momento de Autocuidado",
        description: "Seu bem-estar emocional precisa de atenção. Que tal dedicar um tempo para você?",
        priority: "high",
        action: "/autocuidado",
      })
    }
  }

  // Analisar frequência de atividades
  const selfCareCount = activities.filter(a => a.activity_type === "self_care").length
  if (selfCareCount < 3) {
    recommendations.push({
      title: "Explore Autocuidado",
      description: "Você ainda não explorou muito o autocuidado. Descubra atividades que você vai amar!",
      priority: "medium",
      action: "/autocuidado",
    })
  }

  // Recomendações baseadas em onboarding
  if (onboarding?.data?.sleep_quality === "poor" || onboarding?.data?.sleep_quality === "very_poor") {
    recommendations.push({
      title: "Dicas para Melhor Sono",
      description: "Seu sono pode melhorar. Explore histórias de sono e técnicas de relaxamento.",
      priority: "high",
      action: "/historias-sono",
    })
  }

  return recommendations.slice(0, 3) // Limitar a 3 recomendações
}

function detectMilestones(activities: any[]): Array<{ title: string; description: string; icon: string }> {
  const milestones: Array<{ title: string; description: string; icon: string }> = []

  // Milestone: Primeira semana
  if (activities.length >= 7) {
    milestones.push({
      title: "Primeira Semana Completa!",
      description: "Você completou uma semana de atividades. Parabéns! 🎉",
      icon: "🌟",
    })
  }

  // Milestone: 30 dias
  if (activities.length >= 30) {
    milestones.push({
      title: "Um Mês de Jornada!",
      description: "Você está construindo um hábito incrível. Continue assim! 💪",
      icon: "🏆",
    })
  }

  // Milestone: Streak de 7 dias
  const uniqueDays = new Set(activities.map(a => a.activity_date)).size
  if (uniqueDays >= 7) {
    milestones.push({
      title: "7 Dias Consecutivos!",
      description: "Você manteve uma sequência de 7 dias. Isso é incrível! 🔥",
      icon: "🔥",
    })
  }

  return milestones
}

export const GET = withRateLimit(insightsHandler, RATE_LIMITS.AUTHENTICATED)
