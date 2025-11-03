"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Moon, Play, Pause, Heart, Star, Volume2 } from "lucide-react"
import Image from "next/image"

const historias = [
  {
    id: 1,
    titulo: "O Coelhinho Sonolento",
    duracao: "5 min",
    idade: "0-2 anos",
    tema: "Natureza",
    historia: "Era uma vez um coelhinho muito fofo que morava em uma floresta encantada. Todas as noites, antes de dormir, ele pulava de nuvem em nuvem até encontrar a nuvem mais macia de todas...",
    mensagem: "Durma bem, pequenino. Amanhã será um dia cheio de descobertas.",
    audio: null, // Placeholder for audio URL
  },
  {
    id: 2,
    titulo: "A Estrelinha Brilhante",
    duracao: "4 min",
    idade: "0-3 anos",
    tema: "Espaço",
    historia: "Lá no céu bem alto, vivia uma estrelinha muito especial. Ela brilhava suavemente para iluminar os sonhos de todos os bebês do mundo...",
    mensagem: "Que seus sonhos sejam doces como mel.",
    audio: null,
  },
  {
    id: 3,
    titulo: "O Ursinho de Pelúcia",
    duracao: "6 min",
    idade: "1-3 anos",
    tema: "Amizade",
    historia: "Em um quarto aconchegante, havia um ursinho de pelúcia chamado Fofinho. Todas as noites, ele protegia os sonhos do seu amiguinho...",
    mensagem: "Boa noite, meu amor. Você está seguro e amado.",
    audio: null,
  },
  {
    id: 4,
    titulo: "O Barquinho dos Sonhos",
    duracao: "5 min",
    idade: "0-2 anos",
    tema: "Mar",
    historia: "No mar calmo da noite, navegava um barquinho dourado. Ele carregava todos os sonhos mais bonitos para as crianças que dormiam...",
    mensagem: "Navegue pelos sonhos mais lindos, meu tesouro.",
    audio: null,
  },
  {
    id: 5,
    titulo: "A Lua e as Nuvens",
    duracao: "4 min",
    idade: "0-3 anos",
    tema: "Céu",
    historia: "A lua conversava com as nuvenzinhas todas as noites. Elas contavam histórias sussurradas pelo vento sobre bebês que dormiam tranquilos...",
    mensagem: "Feche os olhinhos e deixe a lua te abraçar.",
    audio: null,
  },
]

export default function HistoriasSonoPage() {
  const [historiaAtual, setHistoriaAtual] = useState<number | null>(null)
  const [tocando, setTocando] = useState(false)

  const iniciarHistoria = (id: number) => {
    setHistoriaAtual(id)
    setTocando(true)
    // TODO: Implement audio playback
  }

  const pausarHistoria = () => {
    setTocando(false)
    // TODO: Pause audio
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center gap-3">
            <Moon className="h-10 w-10 text-yellow-300" />
            <div>
              <h1 className="text-4xl font-serif font-bold text-white">Histórias de Sono</h1>
              <p className="text-lg text-purple-200 mt-1">Histórias acolhedoras para adormecer</p>
            </div>
          </div>
        </div>

        {/* Mensagem Acolhedora */}
        <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <div className="flex items-start gap-4">
            <Heart className="h-6 w-6 text-pink-300 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Um momento especial</h3>
              <p className="text-purple-100">
                Criar uma rotina de histórias antes de dormir fortalece o vínculo com seu bebê e ajuda a estabelecer 
                um ritual calmante. Escolha um cantinho confortável, baixe as luzes e aproveite esse momento mágico juntos.
              </p>
            </div>
          </div>
        </Card>

        {/* Grid de Histórias */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historias.map((historia) => (
            <Card 
              key={historia.id} 
              className={`p-6 hover:shadow-xl transition-all cursor-pointer bg-white/95 ${
                historiaAtual === historia.id ? "ring-2 ring-purple-400" : ""
              }`}
            >
              <div className="space-y-4">
                {/* Ícone de Tema */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mx-auto">
                  {historia.tema === "Natureza" && "🌳"}
                  {historia.tema === "Espaço" && "⭐"}
                  {historia.tema === "Amizade" && "🧸"}
                  {historia.tema === "Mar" && "⛵"}
                  {historia.tema === "Céu" && "🌙"}
                </div>

                {/* Título */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{historia.titulo}</h3>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {historia.duracao}
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {historia.idade}
                    </Badge>
                    <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                      {historia.tema}
                    </Badge>
                  </div>
                </div>

                {/* Preview da História */}
                <p className="text-sm text-muted-foreground line-clamp-3 text-center">
                  {historia.historia}
                </p>

                {/* Mensagem */}
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-900 italic text-center">
                    "{historia.mensagem}"
                  </p>
                </div>

                {/* Botões */}
                <div className="flex gap-2">
                  {historiaAtual === historia.id && tocando ? (
                    <Button 
                      onClick={pausarHistoria} 
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => iniciarHistoria(historia.id)} 
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {historiaAtual === historia.id ? "Continuar" : "Ouvir"}
                    </Button>
                  )}
                  <Button variant="outline" size="icon" className="bg-transparent">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Dicas para o Sono */}
        <Card className="p-6 bg-white/95">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Moon className="h-6 w-6 text-purple-600" />
            Dicas para uma Boa Noite de Sono
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Rotina Consistente</h4>
                <p className="text-sm text-muted-foreground">
                  Mantenha o mesmo horário todos os dias para criar previsibilidade
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Ambiente Calmo</h4>
                <p className="text-sm text-muted-foreground">
                  Luz baixa, temperatura agradável e sem barulhos altos
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Tom de Voz Suave</h4>
                <p className="text-sm text-muted-foreground">
                  Fale baixinho e devagar para transmitir calma
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Contato Físico</h4>
                <p className="text-sm text-muted-foreground">
                  Abraços e carinho ajudam o bebê a se sentir seguro
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
