/**
 * Widget de Notícias Maternais
 * Exibe últimas notícias agregadas de Perplexity e Grok
 */

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, TrendingUp, Activity, Loader2 } from "lucide-react"

interface MaternalNews {
    title: string
    summary: string
    category: "scientific" | "trends" | "health" | "general"
    source: "perplexity" | "grok" | "combined"
    url?: string
    published_at?: string
    relevance_score: number
}

export function MaternalNewsWidget() {
    const [news, setNews] = useState<MaternalNews[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchNews()
    }, [])

    async function fetchNews() {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch("/api/content/maternal-trends", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: "maternidade",
                    category: "all",
                }),
            })

            if (!response.ok) {
                throw new Error("Erro ao buscar notícias")
            }

            const data = await response.json()
            setNews(data.news || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido")
        } finally {
            setLoading(false)
        }
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "scientific":
                return <BookOpen className="h-4 w-4" />
            case "trends":
                return <TrendingUp className="h-4 w-4" />
            case "health":
                return <Activity className="h-4 w-4" />
            default:
                return <BookOpen className="h-4 w-4" />
        }
    }

    const getSourceBadge = (source: string) => {
        const colors: Record<string, string> = {
            perplexity: "bg-blue-500",
            grok: "bg-purple-500",
            combined: "bg-green-500",
        }

        return (
            <Badge className={colors[source] || "bg-gray-500"} variant="secondary">
                {source === "perplexity" ? "Perplexity" : source === "grok" ? "Grok" : "Combinado"}
            </Badge>
        )
    }

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Notícias Maternais
                    </CardTitle>
                    <CardDescription>Últimas notícias e tendências sobre maternidade</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Notícias Maternais
                    </CardTitle>
                    <CardDescription>Últimas notícias e tendências sobre maternidade</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <p>{error}</p>
                        <button
                            onClick={fetchNews}
                            className="mt-4 text-sm text-primary hover:underline"
                        >
                            Tentar novamente
                        </button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (news.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Notícias Maternais
                    </CardTitle>
                    <CardDescription>Últimas notícias e tendências sobre maternidade</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Nenhuma notícia disponível no momento</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Mostrar apenas as 3 mais relevantes
    const topNews = news.slice(0, 3)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Notícias Maternais
                </CardTitle>
                <CardDescription>Últimas notícias e tendências sobre maternidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {topNews.map((item, index) => (
                    <div
                        key={index}
                        className="p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                                {getCategoryIcon(item.category)}
                                <h3 className="font-semibold text-sm line-clamp-2">
                                    {item.title}
                                </h3>
                            </div>
                            {getSourceBadge(item.source)}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.summary}
                        </p>
                        {item.url && (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline mt-2 inline-block"
                            >
                                Ler mais →
                            </a>
                        )}
                    </div>
                ))}
                <button
                    onClick={fetchNews}
                    className="w-full text-sm text-primary hover:underline"
                >
                    Atualizar notícias
                </button>
            </CardContent>
        </Card>
    )
}

