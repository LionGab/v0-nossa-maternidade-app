"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Flame, Trophy, Star, Sparkles, Target } from "lucide-react"

interface GamificationStats {
  totalPoints: number
  currentLevel: number
  pointsToNextLevel: number
  currentStreak: number
  longestStreak: number
  achievements: any[]
  activeChallenges: any[]
}

export function GamificationWidget() {
  const [stats, setStats] = useState<GamificationStats | null>(null)
  const [showAchievements, setShowAchievements] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/gamification/stats")

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        throw new Error("Failed to fetch stats")
      }
    } catch (error) {
      console.error("Gamification Widget: Error", error)
      setError("Erro ao carregar estatísticas")
      setStats({
        totalPoints: 0,
        currentLevel: 1,
        pointsToNextLevel: 100,
        currentStreak: 0,
        longestStreak: 0,
        achievements: [],
        activeChallenges: [],
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-8 bg-muted rounded"></div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <p className="text-sm text-muted-foreground text-center">{error}</p>
      </Card>
    )
  }

  const levelProgress =
    ((stats.totalPoints - (stats.totalPoints - stats.pointsToNextLevel)) /
      (stats.totalPoints + stats.pointsToNextLevel)) *
    100

  const newAchievements = stats.achievements.filter((a) => a.isNew)

  return (
    <div className="space-y-4">
      {/* Nível e Progresso */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-primary" fill="currentColor" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Seu Nível</p>
              <p className="text-2xl font-bold text-primary">Nível {stats.currentLevel}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Pontos Totais</p>
            <p className="text-xl font-semibold">{stats.totalPoints}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso para Nível {stats.currentLevel + 1}</span>
            <span className="font-medium">{stats.pointsToNextLevel} pontos restantes</span>
          </div>
          <Progress value={levelProgress} className="h-3" />
        </div>
      </Card>

      {/* Streak */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sequência Atual</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.currentStreak} dias</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Recorde</p>
            <p className="text-xl font-semibold text-orange-600 dark:text-orange-400">{stats.longestStreak} dias</p>
          </div>
        </div>
        {stats.currentStreak > 0 && (
          <p className="mt-3 text-sm text-orange-700 dark:text-orange-300">
            Continue assim! Você está construindo um hábito incrível 🔥
          </p>
        )}
      </Card>

      {/* Conquistas Recentes */}
      {newAchievements.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Novas Conquistas!</h3>
          </div>
          <div className="space-y-2">
            {newAchievements.slice(0, 3).map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                >
                  +{achievement.pointsReward}
                </Badge>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 text-yellow-700 hover:text-yellow-800 hover:bg-yellow-100"
            onClick={() => setShowAchievements(true)}
          >
            Ver Todas as Conquistas
          </Button>
        </Card>
      )}

      {/* Desafios Ativos */}
      {stats.activeChallenges.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Desafios da Semana</h3>
          </div>
          <div className="space-y-4">
            {stats.activeChallenges.map((challenge) => (
              <div key={challenge.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{challenge.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{challenge.title}</p>
                      <p className="text-xs text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>
                  {challenge.isCompleted && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30">
                      Completo!
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {challenge.currentProgress} / {challenge.goalValue}
                    </span>
                    <span>+{challenge.pointsReward} pontos</span>
                  </div>
                  <Progress value={(challenge.currentProgress / challenge.goalValue) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Resumo de Conquistas */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Conquistas Desbloqueadas</p>
              <p className="text-xl font-bold">{stats.achievements.length}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowAchievements(true)}>
            Ver Todas
          </Button>
        </div>
      </Card>
    </div>
  )
}
