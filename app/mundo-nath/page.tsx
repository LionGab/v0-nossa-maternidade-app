"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Heart, MessageCircle, Share2, Search, TrendingUp } from "lucide-react"
import Image from "next/image"

// Mock data dos vídeos mais virais da Nathália Valente
const viralVideos = [
  {
    id: 1,
    title: "5 Coisas que Ninguém Te Conta Sobre o Pós-Parto",
    thumbnail: "/mother-postpartum-care.jpg",
    views: "2.3M",
    likes: "156K",
    comments: "8.2K",
    duration: "3:45",
    platform: "TikTok",
    isNew: true,
  },
  {
    id: 2,
    title: "Rotina Matinal com Bebê de 6 Meses",
    thumbnail: "/morning-routine-baby.jpg",
    views: "1.8M",
    likes: "124K",
    comments: "5.1K",
    duration: "5:12",
    platform: "Instagram",
    isNew: true,
  },
  {
    id: 3,
    title: "Como Lidar com a Culpa Materna",
    thumbnail: "/mother-emotional-support.jpg",
    views: "1.5M",
    likes: "98K",
    comments: "12.3K",
    duration: "4:30",
    platform: "TikTok",
    isNew: false,
  },
  {
    id: 4,
    title: "Receitas Rápidas para Mães Ocupadas",
    thumbnail: "/quick-healthy-recipes.jpg",
    views: "1.2M",
    likes: "87K",
    comments: "4.5K",
    duration: "6:20",
    platform: "Instagram",
    isNew: false,
  },
  {
    id: 5,
    title: "Verdades Sobre Amamentação que Ninguém Fala",
    thumbnail: "/breastfeeding-mother.jpg",
    views: "980K",
    likes: "76K",
    comments: "9.8K",
    duration: "4:15",
    platform: "TikTok",
    isNew: false,
  },
  {
    id: 6,
    title: "Autocuidado em 10 Minutos",
    thumbnail: "/self-care-mother.jpg",
    views: "850K",
    likes: "65K",
    comments: "3.2K",
    duration: "2:50",
    platform: "Instagram",
    isNew: false,
  },
  {
    id: 7,
    title: "Organizando a Casa com Bebê",
    thumbnail: "/organized-home-baby.jpg",
    views: "720K",
    likes: "54K",
    comments: "2.8K",
    duration: "5:45",
    platform: "TikTok",
    isNew: false,
  },
  {
    id: 8,
    title: "Minha Bolsa Maternidade Essencial",
    thumbnail: "/diaper-bag-essentials.jpg",
    views: "680K",
    likes: "48K",
    comments: "2.1K",
    duration: "3:30",
    platform: "Instagram",
    isNew: false,
  },
  {
    id: 9,
    title: "Lidando com Noites Sem Dormir",
    thumbnail: "/tired-mother-night.jpg",
    views: "620K",
    likes: "42K",
    comments: "5.6K",
    duration: "4:00",
    platform: "TikTok",
    isNew: false,
  },
  {
    id: 10,
    title: "Voltando à Forma Após o Parto",
    thumbnail: "/postpartum-fitness.png",
    views: "590K",
    likes: "38K",
    comments: "3.4K",
    duration: "6:10",
    platform: "Instagram",
    isNew: false,
  },
]

export default function MundoNathPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState<"all" | "TikTok" | "Instagram">("all")

  const filteredVideos = viralVideos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform = selectedPlatform === "all" || video.platform === selectedPlatform
    return matchesSearch && matchesPlatform
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Nathália Valente"
              width={80}
              height={80}
              className="rounded-full ring-4 ring-primary/20"
            />
            <div>
              <h1 className="text-4xl font-serif font-bold text-foreground">Mundo Nath</h1>
              <p className="text-lg text-warm mt-1">Conteúdos exclusivos da Nathália Valente</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Top 10 Vídeos Mais Virais</p>
              <p className="text-sm text-muted-foreground">
                Conteúdos que impactaram milhões de mães no TikTok e Instagram
              </p>
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar vídeos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedPlatform === "all" ? "default" : "outline"}
              onClick={() => setSelectedPlatform("all")}
            >
              Todos
            </Button>
            <Button
              variant={selectedPlatform === "TikTok" ? "default" : "outline"}
              onClick={() => setSelectedPlatform("TikTok")}
            >
              TikTok
            </Button>
            <Button
              variant={selectedPlatform === "Instagram" ? "default" : "outline"}
              onClick={() => setSelectedPlatform("Instagram")}
            >
              Instagram
            </Button>
          </div>
        </div>

        {/* Grid de Vídeos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-video bg-muted">
                <Image src={video.thumbnail || "/placeholder.svg"} alt={video.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="lg" className="rounded-full">
                    <Play className="h-6 w-6 mr-2" />
                    Assistir
                  </Button>
                </div>
                <div className="absolute top-3 left-3 flex gap-2">
                  {video.isNew && <Badge className="bg-primary text-primary-foreground">Novo</Badge>}
                  <Badge variant="secondary" className="bg-black/60 text-white">
                    {video.duration}
                  </Badge>
                </div>
                <Badge variant="secondary" className="absolute top-3 right-3 bg-black/60 text-white">
                  {video.platform}
                </Badge>
              </div>

              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Play className="h-4 w-4" />
                      {video.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {video.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {video.comments}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Heart className="h-4 w-4 mr-1" />
                    Salvar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Share2 className="h-4 w-4 mr-1" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nenhum vídeo encontrado com esses filtros.</p>
          </div>
        )}
      </div>
    </div>
  )
}
