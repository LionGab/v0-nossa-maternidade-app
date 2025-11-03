"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { clientLogger } from "@/lib/logger-client"
import { Gauge, Heart, Moon, Pause, Play, RotateCcw, Star, Volume2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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
  const [volume, setVolume] = useState(0.7)
  const [velocidade, setVelocidade] = useState(1.0)
  const [tempoAtual, setTempoAtual] = useState(0)
  const [duracao, setDuracao] = useState(0)
  const [progresso, setProgresso] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Inicializar Web Speech API
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  // Limpar quando trocar história
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setTocando(false)
      setTempoAtual(0)
      setProgresso(0)
    }
  }, [historiaAtual])

  // Atualizar progresso enquanto toca
  useEffect(() => {
    if (!tocando) return

    const interval = setInterval(() => {
      if (utteranceRef.current) {
        // Estimativa de duração baseada no texto (palavras por minuto)
        const palavrasPorMinuto = 150
        const historia = historias.find(h => h.id === historiaAtual)
        if (historia) {
          const numPalavras = historia.historia.split(" ").length
          const duracaoEstimada = (numPalavras / palavrasPorMinuto) * 60 * 1000 // ms
          setDuracao(duracaoEstimada)

          // Simular progresso (aproximado, já que Web Speech API não tem eventos de progresso)
          setTempoAtual(prev => {
            const novo = prev + 100
            const progressoNovo = Math.min((novo / duracaoEstimada) * 100, 100)
            setProgresso(progressoNovo)
            return novo
          })
        }
      }
    }, 100)

    return () => clearInterval(interval)
  }, [tocando, historiaAtual])

  const iniciarHistoria = async (id: number) => {
    try {
      const historia = historias.find(h => h.id === id)
      if (!historia) return

      // Se já estiver tocando, pausar primeiro
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel()
      }

      setHistoriaAtual(id)
      setTempoAtual(0)
      setProgresso(0)

      // Tentar usar arquivo de áudio se disponível
      if (historia.audio) {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }

        const audio = new Audio(historia.audio)
        audio.volume = volume
        audio.playbackRate = velocidade

        audio.addEventListener("loadedmetadata", () => {
          setDuracao(audio.duration * 1000)
        })

        audio.addEventListener("timeupdate", () => {
          setTempoAtual(audio.currentTime * 1000)
          setProgresso((audio.currentTime / audio.duration) * 100)
        })

        audio.addEventListener("ended", () => {
          setTocando(false)
          setTempoAtual(0)
          setProgresso(0)
        })

        audioRef.current = audio
        await audio.play()
        setTocando(true)
      } else {
        // Usar Text-to-Speech como fallback
        if (!synthRef.current) {
          clientLogger.error("Web Speech API não disponível", null, { historiaId: id })
          return
        }

        const utterance = new SpeechSynthesisUtterance(historia.historia)
        utterance.rate = velocidade
        utterance.volume = volume
        utterance.lang = "pt-BR"

        utterance.onend = () => {
          setTocando(false)
          setTempoAtual(0)
          setProgresso(0)
        }

        utterance.onerror = (error) => {
          clientLogger.error("Erro na síntese de voz", error, { historiaId: id })
          setTocando(false)
        }

        utteranceRef.current = utterance
        synthRef.current.speak(utterance)
        setTocando(true)
      }
    } catch (error) {
      clientLogger.error("Erro ao iniciar história", error, { historiaId: id })
      setTocando(false)
    }
  }

  const pausarHistoria = () => {
    if (audioRef.current && historiaAtual) {
      const historia = historias.find(h => h.id === historiaAtual)
      if (historia?.audio) {
        audioRef.current.pause()
      }
    }

    if (synthRef.current) {
      synthRef.current.pause()
    }

    setTocando(false)
  }

  const continuarHistoria = () => {
    if (audioRef.current && historiaAtual) {
      const historia = historias.find(h => h.id === historiaAtual)
      if (historia?.audio) {
        audioRef.current.play()
      }
    }

    if (synthRef.current) {
      synthRef.current.resume()
    }

    setTocando(true)
  }

  const reiniciarHistoria = () => {
    if (audioRef.current && historiaAtual) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }

    if (synthRef.current) {
      synthRef.current.cancel()
      iniciarHistoria(historiaAtual!)
    }

    setTempoAtual(0)
    setProgresso(0)
  }

  const formatarTempo = (ms: number) => {
    const segundos = Math.floor(ms / 1000)
    const minutos = Math.floor(segundos / 60)
    const segundosRestantes = segundos % 60
    return `${minutos}:${segundosRestantes.toString().padStart(2, "0")}`
  }

  // Atualizar volume do áudio quando mudar
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
    if (utteranceRef.current) {
      utteranceRef.current.volume = volume
    }
  }, [volume])

  // Atualizar velocidade do áudio quando mudar
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = velocidade
    }
    if (utteranceRef.current && synthRef.current) {
      utteranceRef.current.rate = velocidade
    }
  }, [velocidade])

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
              className={`p-6 hover:shadow-xl transition-all cursor-pointer bg-white/95 ${historiaAtual === historia.id ? "ring-2 ring-purple-400" : ""
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

                {/* Controles de Áudio */}
                {historiaAtual === historia.id && (
                  <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    {/* Barra de Progresso */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatarTempo(tempoAtual)}</span>
                        <span>{formatarTempo(duracao)}</span>
                      </div>
                      <Slider
                        value={[progresso]}
                        max={100}
                        step={0.1}
                        className="w-full"
                        onValueChange={(value: number[]) => {
                          const novoProgresso = value[0]
                          setProgresso(novoProgresso)
                          if (audioRef.current && historia.audio) {
                            audioRef.current.currentTime = (novoProgresso / 100) * audioRef.current.duration
                          }
                          // Para TTS, reiniciar a partir do ponto
                          if (!historia.audio && synthRef.current) {
                            const tempoMs = (novoProgresso / 100) * duracao
                            // Implementação simplificada: reiniciar história do início
                            // Em produção, seria necessário segmentar o texto
                          }
                        }}
                      />
                    </div>

                    {/* Botões de Controle */}
                    <div className="flex gap-2">
                      {tocando ? (
                        <Button
                          onClick={pausarHistoria}
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                          size="sm"
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Pausar
                        </Button>
                      ) : (
                        <Button
                          onClick={() => historiaAtual === historia.id ? continuarHistoria() : iniciarHistoria(historia.id)}
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                          size="sm"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {historiaAtual === historia.id && tempoAtual > 0 ? "Continuar" : "Ouvir"}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={reiniciarHistoria}
                        disabled={historiaAtual !== historia.id || tempoAtual === 0}
                        title="Reiniciar"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Controles de Volume e Velocidade */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Volume */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Volume2 className="h-3 w-3" />
                          <span className="text-muted-foreground">Volume</span>
                          <span className="text-xs font-medium">{Math.round(volume * 100)}%</span>
                        </div>
                        <Slider
                          value={[volume]}
                          max={1}
                          min={0}
                          step={0.1}
                          onValueChange={(value: number[]) => setVolume(value[0])}
                        />
                      </div>

                      {/* Velocidade */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Gauge className="h-3 w-3" />
                          <span className="text-muted-foreground">Velocidade</span>
                          <span className="text-xs font-medium">{velocidade.toFixed(1)}x</span>
                        </div>
                        <Slider
                          value={[velocidade]}
                          max={2}
                          min={0.5}
                          step={0.1}
                          onValueChange={(value: number[]) => setVelocidade(value[0])}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Botões quando não está tocando */}
                {historiaAtual !== historia.id && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => iniciarHistoria(historia.id)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Ouvir
                    </Button>
                    <Button variant="outline" size="icon" className="bg-transparent">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                )}
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
