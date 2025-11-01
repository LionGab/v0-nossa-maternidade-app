"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Newspaper, TrendingUp, Heart, BookOpen, Baby, Sparkles } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface NewsArticle {
  title: string
  summary: string
  category: string
  source: string
  url: string
  publishedAt: string
}

const categories = [
  { value: "all", label: "Todas", icon: Newspaper },
  { value: "pregnancy", label: "Gestação", icon: Baby },
  { value: "parenting", label: "Criação", icon: Heart },
  { value: "health", label: "Saúde", icon: Sparkles },
  { value: "trends", label: "Tendências", icon: TrendingUp },
]

export default function MaternidadeHojePage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
  }, [selectedCategory])

  const fetchNews = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/maternal-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: selectedCategory }),
      })

      if (!response.ok) {
        throw new Error("Erro ao buscar notícias")
      }

      const data = await response.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error("News: Error", error)
      setError("Erro ao buscar notícias. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Newspaper className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-serif font-bold text-foreground">Maternidade Hoje</h1>
          </div>
          <p className="text-lg text-warm max-w-2xl mx-auto">
            Notícias, tendências e informações atualizadas sobre maternidade, gestação e criação de filhos
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 text-center">{error}</div>
        )}

        {/* Categorias */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.value)}
              className="flex items-center gap-2"
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Artigos */}
        <div className="grid md:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </Card>
              ))}
            </>
          ) : (
            articles.map((article, index) => (
              <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <Badge className="mb-3">{article.category}</Badge>
                    <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">{article.title}</h3>
                  </div>
                  <BookOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>

                <p className="text-muted-foreground line-clamp-3">{article.summary}</p>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">{article.source}</p>
                    <p className="text-xs">{new Date(article.publishedAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      Ler Mais
                    </a>
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {!isLoading && articles.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">Nenhuma notícia encontrada nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
