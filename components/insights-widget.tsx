"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  Sparkles,
  Target,
  Award,
  Lightbulb,
  ArrowRight
} from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { clientLogger } from "@/lib/logger-client"

interface InsightsData {
  moodTrend: {
    trend: string
    score: number
    message: string
  }
  activityPattern: {
    weeklyAverage: number
    mostActiveDay: string
    streak: number
  }
  selfCareScore: {
    score: number
    message: string
    suggestions: string[]
  }
  engagementLevel: {
    level: string
    message: string
    suggestions: string[]
  }
  recommendations: Array<{
    title: string
    description: string
    priority: "high" | "medium" | "low"
    action: string
  }>
  milestones: Array<{
    title: string
    description: string
    icon: string
  }>
}

export function InsightsWidget() {
  const router = useRouter()
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    try {
      const response = await fetch("/api/insights")
      if (response.ok) {
        const data = await response.json()
        setInsights(data.insights)
      }
    } catch (error) {
      clientLogger.error("Insights Widget: Erro ao carregar insights", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-8 bg-muted rounded"></div>
        </div>
      </Card>
    )
  }

  if (!insights) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Mood Trend */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          {insights.moodTrend.trend === "improving" ? (
            <TrendingUp className="w-6 h-6 text-green-500" />
          ) : insights.moodTrend.trend === "declining" ? (
            <TrendingDown className="w-6 h-6 text-orange-500" />
          ) : (
            <Activity className="w-6 h-6 text-blue-500" />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Tendência de Bem-Estar</h3>
            <p className="text-sm text-muted-foreground mt-1">{insights.moodTrend.message}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Score de Bem-Estar</span>
            <span className="font-medium">{Math.round(insights.moodTrend.score * 100)}%</span>
          </div>
          <Progress value={insights.moodTrend.score * 100} className="h-3" />
        </div>
      </Card>

      {/* Activity Pattern */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-blue-500" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Seu Padrão de Atividade</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {insights.activityPattern.streak > 0
                ? `${insights.activityPattern.streak} dias consecutivos! 🔥`
                : "Continue ativa para construir uma sequência"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {insights.activityPattern.weeklyAverage}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Atividades/dia</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {insights.activityPattern.streak}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Dias seguidos</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 capitalize">
              {insights.activityPattern.mostActiveDay.split(',')[0]}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Dia mais ativo</p>
          </div>
        </div>
      </Card>

      {/* Self Care Score */}
      <Card className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border-pink-200 dark:border-pink-800">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-pink-500" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Score de Autocuidado</h3>
            <p className="text-sm text-muted-foreground mt-1">{insights.selfCareScore.message}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Seu Score</span>
              <span className="font-medium">{insights.selfCareScore.score}/100</span>
            </div>
            <Progress value={insights.selfCareScore.score} className="h-3" />
          </div>
          {insights.selfCareScore.suggestions.length > 0 && (
            <div className="pt-2 space-y-1">
              {insights.selfCareScore.suggestions.map((suggestion, i) => (
                <p key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span>💡</span>
                  <span>{suggestion}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Recommendations */}
      {insights.recommendations.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Recomendações para Você</h3>
          </div>
          <div className="space-y-3">
            {insights.recommendations.map((rec, i) => (
              <div
                key={i}
                className="p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-yellow-200 dark:border-yellow-800 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{rec.title}</h4>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          rec.priority === "high"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                            : rec.priority === "medium"
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                        }`}
                      >
                        {rec.priority === "high" ? "Alta" : rec.priority === "medium" ? "Média" : "Baixa"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                  <Link href={rec.action}>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Milestones */}
      {insights.milestones.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900 dark:text-purple-100">Marcos Conquistados</h3>
          </div>
          <div className="space-y-3">
            {insights.milestones.map((milestone, i) => (
              <div
                key={i}
                className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-purple-200 dark:border-purple-800 animate-in fade-in slide-in-from-bottom-2"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{milestone.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{milestone.title}</h4>
                    <p className="text-xs text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
