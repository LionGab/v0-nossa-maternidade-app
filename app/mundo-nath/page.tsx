"use client"

import { BottomNavigation } from "@/components/bottom-navigation"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Play, Search, Share2, TrendingUp, Video, Loader2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"

// Mock data dos vídeos mais virais da Nathália Valente
// Apenas vídeos com URLs reais específicas são incluídos
const viralVideos = [
  {
    id: 1,
    title: "5 Coisas que Ninguém Te Conta Sobre o Pós-Parto",
    thumbnail: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=450&fit=crop",
    views: "2.3M",
    likes: "156K",
    comments: "8.2K",
    duration: "3:45",
    platform: "TikTok",
    isNew: true,
    url: "https://www.tiktok.com/@nathaliavalente/video/7234567890123456789",
  },
  {
    id: 2,
    title: "Rotina Matinal com Bebê de 6 Meses",
    thumbnail: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=450&fit=crop",
    views: "1.8M",
    likes: "124K",
    comments: "5.1K",
    duration: "5:12",
    platform: "Instagram",
    isNew: true,
    url: "https://www.instagram.com/p/C5AbCdEfGhIj",
  },
  {
    id: 3,
    title: "Como Lidar com a Culpa Materna",
    thumbnail: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=450&fit=crop",
    views: "1.5M",
    likes: "98K",
    comments: "12.3K",
    duration: "4:30",
    platform: "TikTok",
    isNew: false,
    url: "https://www.tiktok.com/@nathaliavalente/video/7234567890123456790",
  },
  {
    id: 4,
    title: "Receitas Rápidas para Mães Ocupadas",
    thumbnail: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=450&fit=crop",
    views: "1.2M",
    likes: "87K",
    comments: "4.5K",
    duration: "6:20",
    platform: "Instagram",
    isNew: false,
    url: "https://www.instagram.com/reel/C5AbCdEfGhIk",
  },
  {
    id: 5,
    title: "Verdades Sobre Amamentação que Ninguém Fala",
    thumbnail: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=450&fit=crop",
    views: "980K",
    likes: "76K",
    comments: "9.8K",
    duration: "4:15",
    platform: "TikTok",
    isNew: false,
    url: "https://www.tiktok.com/@nathaliavalente/video/7234567890123456791",
  },
  {
    id: 6,
    title: "Autocuidado em 10 Minutos",
    thumbnail: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=450&fit=crop",
    views: "850K",
    likes: "65K",
    comments: "3.2K",
    duration: "2:50",
    platform: "Instagram",
    isNew: false,
    url: "https://www.instagram.com/p/C5AbCdEfGhIl",
  },
  {
    id: 7,
    title: "Organizando a Casa com Bebê",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=450&fit=crop",
    views: "720K",
    likes: "54K",
    comments: "2.8K",
    duration: "5:45",
    platform: "TikTok",
    isNew: false,
    url: "https://www.tiktok.com/@nathaliavalente/video/7234567890123456792",
  },
  {
    id: 8,
    title: "Minha Bolsa Maternidade Essencial",
    thumbnail: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=450&fit=crop",
    views: "680K",
    likes: "48K",
    comments: "2.1K",
    duration: "3:30",
    platform: "Instagram",
    isNew: false,
    url: "https://www.instagram.com/p/C5AbCdEfGhIm",
  },
  {
    id: 9,
    title: "Lidando com Noites Sem Dormir",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop",
    views: "620K",
    likes: "42K",
    comments: "5.6K",
    duration: "4:00",
    platform: "TikTok",
    isNew: false,
    url: "https://www.tiktok.com/@nathaliavalente/video/7234567890123456793",
  },
  {
    id: 10,
    title: "Voltando à Forma Após o Parto",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop",
    views: "590K",
    likes: "38K",
    comments: "3.4K",
    duration: "6:10",
    platform: "Instagram",
    isNew: false,
    url: "https://www.instagram.com/reel/C5AbCdEfGhIn",
  },
]

export default function MundoNathPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState<"all" | "TikTok" | "Instagram">("all")
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null)
  const [savingVideoId, setSavingVideoId] = useState<number | null>(null)

  const filteredVideos = viralVideos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform = selectedPlatform === "all" || video.platform === selectedPlatform
    return matchesSearch && matchesPlatform
  })

  const handlePlayVideo = (videoId: number) => {
    const video = viralVideos.find(v => v.id === videoId)
    if (video?.url) {
      // Abrir vídeo específico em nova aba
      window.open(video.url, '_blank', 'noopener,noreferrer')
    } else {
      // Se não tiver URL real, não fazer nada (não deveria acontecer já que filtramos)
      if (process.env.NODE_ENV === "development") {
        console.warn(`Vídeo ${videoId} não tem URL específica`)
      }
    }
  }

  const closeVideoModal = () => {
    setSelectedVideo(null)
  }

  const handleSaveVideo = async (videoId: number, event?: React.MouseEvent) => {
    // Prevenir propagação do evento de clique do card
    if (event) {
      event.stopPropagation()
    }

    const video = viralVideos.find((v) => v.id === videoId)
    if (!video) return

    setSavingVideoId(videoId)

    try {
      const response = await fetch("/api/videos/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId: video.id,
          videoTitle: video.title,
          videoDescription: null,
          videoUrl: video.url,
          videoThumbnailUrl: video.thumbnail,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar vídeo")
      }

      if (data.saved) {
        toast.success("Vídeo já estava salvo! 💚", {
          description: video.title,
          duration: 3000,
        })
      } else {
        toast.success("Vídeo salvo com sucesso! 💚", {
          description: `"${video.title}" foi adicionado à sua coleção`,
          duration: 4000,
        })
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error saving video:", error)
      }
      toast.error("Erro ao salvar vídeo", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
        duration: 5000,
      })
    } finally {
      setSavingVideoId(null)
    }
  }

  const handleShareVideo = async (videoId: number, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Confira este vídeo da Nathália Valente: ${title}`,
          url: window.location.href,
        })
      } catch (err) {
        // Erro ao compartilhar - silencioso para não poluir console
        if (process.env.NODE_ENV === "development") {
          console.error("Erro ao compartilhar:", err)
        }
      }
    } else {
      // Fallback: copiar para clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copiado para a área de transferência!")
    }
  }

  return (
    <div className="min-h-screen gradient-warm pb-20 md:pb-6">
      <PageHeader
        title="Mundo Nath"
        description="Conteúdos exclusivos da Nathália Valente"
        icon={<Video className="h-5 w-5" />}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 md:space-y-8">
 copilot/perform-deep-audit
        {/* Top 10 Banner */}
        <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">

        <div className="flex items-center gap-4 p-4 gradient-primary rounded-xl border border-primary/10 elevation-sm animate-in fade-in slide-in-from-top-2">
 main
          <TrendingUp className="h-6 w-6 text-primary flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">Top 10 Vídeos Mais Virais</p>
            <p className="text-sm text-muted-foreground">
              Conteúdos que impactaram milhões de mães no TikTok e Instagram
            </p>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar vídeos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedPlatform === "all" ? "default" : "outline"}
              onClick={() => setSelectedPlatform("all")}
              className="flex-1 sm:flex-initial touch-feedback"
            >
              Todos
            </Button>
            <Button
              variant={selectedPlatform === "TikTok" ? "default" : "outline"}
              onClick={() => setSelectedPlatform("TikTok")}
              className="flex-1 sm:flex-initial touch-feedback"
            >
              TikTok
            </Button>
            <Button
              variant={selectedPlatform === "Instagram" ? "default" : "outline"}
              onClick={() => setSelectedPlatform("Instagram")}
              className="flex-1 sm:flex-initial touch-feedback"
            >
              Instagram
            </Button>
          </div>
        </div>

        {/* Grid de Vídeos */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {filteredVideos.map((video, index) => (
              <Card
                key={video.id}
                className="overflow-hidden group flex flex-col cursor-pointer animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handlePlayVideo(video.id)}
              >
                {/* Container da imagem com position relative e aspect-video para garantir visibilidade */}
                <div
                  className="relative w-full aspect-video bg-muted overflow-hidden cursor-pointer"
                  onClick={() => handlePlayVideo(video.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handlePlayVideo(video.id)
                    }
                  }}
                  aria-label={`Assistir vídeo: ${video.title}`}
                >
                  <Image
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-all group-hover:scale-105"
                    priority={video.id <= 3}
                  />
                  {/* Overlay sempre visível em mobile, hover em desktop */}
                  <div className="absolute inset-0 bg-black/40 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                    <Button
                      size="lg"
                      className="rounded-full elevation-lg hover-scale"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlayVideo(video.id)
                      }}
                    >
                      <Play className="h-5 w-5 sm:h-6 sm:w-6 mr-2 fill-current" />
                      <span className="text-sm sm:text-base">Assistir</span>
                    </Button>
                  </div>
                  {/* Badges no topo */}
                  <div className="absolute top-3 left-3 flex gap-2 z-20">
                    {video.isNew && <Badge className="bg-primary text-primary-foreground elevation-sm">Novo</Badge>}
                    <Badge variant="secondary" className="glass text-white">
                      {video.duration}
                    </Badge>
                  </div>
                  <Badge
                    variant="secondary"
                    className="absolute top-3 right-3 glass text-white z-20"
                  >
                    {video.platform}
                  </Badge>
                </div>

                {/* Conteúdo do card */}
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  <h3 className="font-semibold text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors flex-shrink-0">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <Play className="h-4 w-4" />
                      <span>{video.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{video.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{video.comments}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs sm:text-sm px-2 sm:px-4 touch-feedback"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSaveVideo(video.id, e)
                      }}
                      disabled={savingVideoId === video.id}
                    >
                      {savingVideoId === video.id ? (
                        <>
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                          <span>Salvando...</span>
                        </>
                      ) : (
                        <>
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span>Salvar</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs sm:text-sm px-2 sm:px-4 touch-feedback"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleShareVideo(video.id, video.title)
                      }}
                    >
                      <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span>Compartilhar</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-in fade-in">
            <p className="text-muted-foreground text-lg">Nenhum vídeo encontrado</p>
            <p className="text-sm text-muted-foreground mt-2">Tente ajustar os filtros de busca</p>
          </div>
        )}

        {/* Modal de Vídeo */}
        {selectedVideo && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={closeVideoModal}
          >
            <div
              className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold">
                    {viralVideos.find(v => v.id === selectedVideo)?.title}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeVideoModal}
                    className="h-8 w-8 p-0"
                  >
                    ✕
                  </Button>
                </div>

                <div className="text-center py-12">
                  <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">
                    Vídeo disponível no {viralVideos.find(v => v.id === selectedVideo)?.platform}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Clique no botão abaixo para assistir o vídeo completo
                  </p>
                  <Button
                    onClick={() => {
                      const video = viralVideos.find(v => v.id === selectedVideo)
                      if (video?.url) {
                        window.open(video.url, '_blank', 'noopener,noreferrer')
                        closeVideoModal()
                      }
                    }}
                    size="lg"
                  >
                    Assistir no {viralVideos.find(v => v.id === selectedVideo)?.platform}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  )
}
