/**
 * Dashboard Admin - Analytics de IA
 * Compara performance de cada provider
 * Mostra métricas, custos e gráficos
 */

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, TrendingUp, DollarSign, Clock, Star, Download } from "lucide-react"

interface PerformanceStats {
    provider: string
    total_queries: number
    avg_response_time_ms: number
    total_tokens: number
    total_cost_usd: number
    avg_rating: number | null
    success_rate: number
}

interface CostSummary {
    provider: string
    total_cost_usd: number
    total_tokens: number
    query_count: number
    avg_cost_per_query: number
    daily_costs: Array<{ date: string; cost_usd: number }>
}

export default function AIAnalyticsPage() {
    const [stats, setStats] = useState<PerformanceStats[]>([])
    const [costs, setCosts] = useState<CostSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchAnalytics()
    }, [])

    async function fetchAnalytics() {
        try {
            setLoading(true)
            setError(null)

            // Buscar stats de performance
            const statsResponse = await fetch("/api/admin/ai-analytics/stats")
            if (!statsResponse.ok) throw new Error("Erro ao buscar stats")
            const statsData = await statsResponse.json()
            setStats(statsData.stats || [])

            // Buscar custos
            const costsResponse = await fetch("/api/admin/ai-analytics/costs")
            if (!costsResponse.ok) throw new Error("Erro ao buscar custos")
            const costsData = await costsResponse.json()
            setCosts(costsData.costs || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido")
        } finally {
            setLoading(false)
        }
    }

    function exportToCSV() {
        const csv = [
            ["Provider", "Queries", "Avg Time (ms)", "Tokens", "Cost (USD)", "Avg Rating", "Success Rate"],
            ...stats.map((s) => [
                s.provider,
                s.total_queries.toString(),
                s.avg_response_time_ms.toString(),
                s.total_tokens.toString(),
                s.total_cost_usd.toFixed(6),
                s.avg_rating?.toFixed(2) || "N/A",
                s.success_rate.toFixed(2),
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n")

        const blob = new Blob([csv], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `ai-analytics-${new Date().toISOString().split("T")[0]}.csv`
        a.click()
    }

    const getProviderIcon = (provider: string) => {
        const icons: Record<string, string> = {
            claude: "🧠",
            gpt4: "✨",
            gemini: "🔍",
            grok: "🐦",
            perplexity: "📚",
        }
        return icons[provider] || "🤖"
    }

    const getProviderColor = (provider: string) => {
        const colors: Record<string, string> = {
            claude: "bg-purple-500",
            gpt4: "bg-green-500",
            gemini: "bg-blue-500",
            grok: "bg-orange-500",
            perplexity: "bg-pink-500",
        }
        return colors[provider] || "bg-gray-500"
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-destructive">{error}</p>
                        <Button onClick={fetchAnalytics} className="mt-4">
                            Tentar novamente
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const totalCost = costs.reduce((sum, c) => sum + c.total_cost_usd, 0)
    const totalQueries = stats.reduce((sum, s) => sum + s.total_queries, 0)

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Analytics de IA</h1>
                    <p className="text-muted-foreground mt-2">
                        Comparação de performance entre providers
                    </p>
                </div>
                <Button onClick={exportToCSV} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                </Button>
            </div>

            {/* Resumo Geral */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total de Queries</CardDescription>
                        <CardTitle className="text-2xl">{totalQueries.toLocaleString()}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Custo Total</CardDescription>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            ${totalCost.toFixed(2)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Tempo Médio</CardDescription>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            {stats.length > 0
                                ? `${Math.round(stats.reduce((sum, s) => sum + s.avg_response_time_ms, 0) / stats.length)}ms`
                                : "N/A"}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Avaliação Média</CardDescription>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Star className="h-5 w-5" />
                            {stats.length > 0
                                ? stats
                                      .filter((s) => s.avg_rating)
                                      .reduce((sum, s) => sum + (s.avg_rating || 0), 0) /
                                  stats.filter((s) => s.avg_rating).length || "N/A"
                                : "N/A"}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Performance por Provider */}
            <Card>
                <CardHeader>
                    <CardTitle>Performance por Provider</CardTitle>
                    <CardDescription>Métricas detalhadas de cada IA</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.provider}
                                className="p-4 border rounded-lg hover:bg-accent transition-colors"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{getProviderIcon(stat.provider)}</span>
                                        <div>
                                            <h3 className="font-semibold capitalize">{stat.provider}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {stat.total_queries} queries
                                            </p>
                                        </div>
                                    </div>
                                    <Badge className={getProviderColor(stat.provider)}>
                                        {stat.success_rate.toFixed(1)}% sucesso
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Tempo Médio</p>
                                        <p className="font-semibold">{stat.avg_response_time_ms}ms</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Tokens</p>
                                        <p className="font-semibold">{stat.total_tokens.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Custo</p>
                                        <p className="font-semibold">${stat.total_cost_usd.toFixed(4)}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Avaliação</p>
                                        <p className="font-semibold">
                                            {stat.avg_rating ? stat.avg_rating.toFixed(1) : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Custo/Query</p>
                                        <p className="font-semibold">
                                            ${(stat.total_cost_usd / stat.total_queries).toFixed(6)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Custos por Provider */}
            <Card>
                <CardHeader>
                    <CardTitle>Custos por Provider</CardTitle>
                    <CardDescription>Custo total e por query</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {costs.map((cost) => (
                            <div key={cost.provider} className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{getProviderIcon(cost.provider)}</span>
                                        <h3 className="font-semibold capitalize">{cost.provider}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">${cost.total_cost_usd.toFixed(4)}</p>
                                        <p className="text-sm text-muted-foreground">
                                            ${cost.avg_cost_per_query.toFixed(6)} por query
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>{cost.query_count} queries</span>
                                    <span>{cost.total_tokens.toLocaleString()} tokens</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

