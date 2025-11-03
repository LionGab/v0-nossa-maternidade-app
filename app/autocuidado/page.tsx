"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Clock, Star, Sparkles } from "lucide-react"

type Sugestao = {
  id: number
  titulo: string
  descricao: string
  duracao: string
  categoria: "respiracao" | "movimento" | "relaxamento" | "criatividade" | "conexao"
  favorita: boolean
}

const sugestoes: Sugestao[] = [
  {
    id: 1,
    titulo: "Respiração Profunda 3x3",
    descricao: "Inspire contando até 3, segure por 3, expire por 3. Repita 3 vezes. Acalma instantaneamente.",
    duracao: "2 min",
    categoria: "respiracao",
    favorita: false,
  },
  {
    id: 2,
    titulo: "Alongamento Suave",
    descricao: "Alongue braços, pescoço e costas lentamente. Perfeito para quando você está tensa.",
    duracao: "5 min",
    categoria: "movimento",
    favorita: false,
  },
  {
    id: 3,
    titulo: "Chá ou Café Consciente",
    descricao: "Prepare sua bebida favorita e saboreie cada gole, sem pressa. Momento só seu.",
    duracao: "8 min",
    categoria: "relaxamento",
    favorita: false,
  },
  {
    id: 4,
    titulo: "Dança com Música Favorita",
    descricao: "Coloque sua música preferida e dance livremente. Libera endorfina e levanta o humor!",
    duracao: "5 min",
    categoria: "movimento",
    favorita: false,
  },
  {
    id: 5,
    titulo: "Escrever 3 Gratidões",
    descricao: "Anote três coisas pelas quais você é grata hoje. Muda sua perspectiva imediatamente.",
    duracao: "3 min",
    categoria: "criatividade",
    favorita: false,
  },
  {
    id: 6,
    titulo: "Skincare Rápido",
    descricao: "Lave o rosto, aplique um hidratante e sinta-se renovada. Autocuidado começa aqui.",
    duracao: "7 min",
    categoria: "relaxamento",
    favorita: false,
  },
  {
    id: 7,
    titulo: "Meditação Guiada Curta",
    descricao: "Use um app ou vídeo de 5 minutos. Acalma a mente e reduz ansiedade rapidamente.",
    duracao: "5 min",
    categoria: "respiracao",
    favorita: false,
  },
  {
    id: 8,
    titulo: "Ligar para Uma Amiga",
    descricao: "Um papo rápido com alguém que você ama pode fazer toda a diferença no seu dia.",
    duracao: "10 min",
    categoria: "conexao",
    favorita: false,
  },
  {
    id: 9,
    titulo: "Desenho ou Rabisco Livre",
    descricao: "Pegue um papel e desenhe o que vier à mente. Não precisa ser perfeito, é só para você.",
    duracao: "8 min",
    categoria: "criatividade",
    favorita: false,
  },
  {
    id: 10,
    titulo: "Caminhada ao Ar Livre",
    descricao: "Mesmo que seja no quintal ou na calçada. Ar fresco e movimento fazem maravilhas.",
    duracao: "10 min",
    categoria: "movimento",
    favorita: false,
  },
]

const categoriaColors = {
  respiracao: "bg-blue-100 text-blue-800 border-blue-300",
  movimento: "bg-green-100 text-green-800 border-green-300",
  relaxamento: "bg-purple-100 text-purple-800 border-purple-300",
  criatividade: "bg-pink-100 text-pink-800 border-pink-300",
  conexao: "bg-orange-100 text-orange-800 border-orange-300",
}

export default function AutocuidadoPage() {
  const [sugestoesState, setSugestoesState] = useState(sugestoes)
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null)

  const toggleFavorita = (id: number) => {
    setSugestoesState(sugestoesState.map(s => 
      s.id === id ? { ...s, favorita: !s.favorita } : s
    ))
  }

  const sugestoesFiltradas = filtroCategoria
    ? sugestoesState.filter(s => s.categoria === filtroCategoria)
    : sugestoesState

  const categorias = [
    { value: "respiracao", label: "Respiração" },
    { value: "movimento", label: "Movimento" },
    { value: "relaxamento", label: "Relaxamento" },
    { value: "criatividade", label: "Criatividade" },
    { value: "conexao", label: "Conexão" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Heart className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-4xl font-serif font-bold text-foreground">Autocuidado em 10 Minutos</h1>
              <p className="text-lg text-warm mt-1">Pequenos momentos que fazem grande diferença</p>
            </div>
          </div>
        </div>

        {/* Mensagem Acolhedora */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-start gap-4">
            <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Você merece esse tempo para você</h3>
              <p className="text-muted-foreground">
                Cuidar de si mesma não é egoísmo, é essencial. Escolha uma das sugestões abaixo e reserve alguns minutos só seus hoje.
              </p>
            </div>
          </div>
        </Card>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filtroCategoria === null ? "default" : "outline"}
            onClick={() => setFiltroCategoria(null)}
            size="sm"
          >
            Todas
          </Button>
          {categorias.map((cat) => (
            <Button
              key={cat.value}
              variant={filtroCategoria === cat.value ? "default" : "outline"}
              onClick={() => setFiltroCategoria(cat.value)}
              size="sm"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Grid de Sugestões */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sugestoesFiltradas.map((sugestao) => (
            <Card 
              key={sugestao.id} 
              className={`p-5 hover:shadow-lg transition-all cursor-pointer relative ${
                sugestao.favorita ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorita(sugestao.id)}
                  className="h-8 w-8 p-0"
                >
                  <Star 
                    className={`h-5 w-5 ${
                      sugestao.favorita ? "fill-primary text-primary" : "text-muted-foreground"
                    }`} 
                  />
                </Button>
              </div>

              <div className="space-y-3 pr-8">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">{sugestao.duracao}</span>
                </div>

                <h3 className="font-semibold text-lg text-foreground">{sugestao.titulo}</h3>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {sugestao.descricao}
                </p>

                <Badge 
                  variant="secondary" 
                  className={`${categoriaColors[sugestao.categoria]} border`}
                >
                  {categorias.find(c => c.value === sugestao.categoria)?.label}
                </Badge>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Agendar
                </Button>
                <Button size="sm" className="flex-1">
                  Fazer Agora
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Contador de Favoritas */}
        {sugestoesState.filter(s => s.favorita).length > 0 && (
          <Card className="p-4 bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary fill-primary" />
                <span className="font-medium">
                  {sugestoesState.filter(s => s.favorita).length} {
                    sugestoesState.filter(s => s.favorita).length === 1 ? "favorita" : "favoritas"
                  }
                </span>
              </div>
              <Button variant="outline" size="sm">
                Ver Favoritas
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
