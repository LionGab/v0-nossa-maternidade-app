"use client"

import { BottomNavigation } from "@/components/bottom-navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { clientLogger } from "@/lib/logger-client"
import { Brain, Heart, Loader2, Send, Sparkles, Search, TrendingUp, BookOpen } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  provider?: string
  queryType?: string
  metadata?: {
    reason?: string
    responseTime?: number
    tokens?: number
    cost?: number
    metricId?: string
  }
}

const suggestedQuestions = [
  "Como lidar com a exaustão materna?",
  "Dicas para organizar a rotina do bebê",
  "Como cuidar de mim mesma?",
  "Receitas rápidas e nutritivas",
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Eu sou a NathAI, sua assistente maternal com inteligência artificial. Estou aqui para te apoiar na sua jornada da maternidade. Como posso te ajudar hoje? 💕",
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Limitar histórico para as últimas 8 mensagens (4 interações) para respostas mais rápidas
      const recentMessages = messages.slice(-8)
      const conversationHistory = recentMessages.map(m => ({
        role: m.role,
        content: m.content
      }))

      // Adicionar a nova mensagem do usuário ao histórico
      const apiMessages = [
        ...conversationHistory,
        {
          role: "user",
          content: content.trim()
        }
      ]

      // AbortController para timeout de 20 segundos
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000)

      const response = await fetch("/api/ai/smart-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          preferredMode: "auto",
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erro desconhecido" }))
        throw new Error(errorData.error || "Erro ao enviar mensagem")
      }

      // A API smart-chat retorna JSON
      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer || "Desculpe, não consegui processar sua mensagem. Tente novamente.",
        timestamp: new Date(),
        // Adicionar metadata do provider
        provider: data.provider,
        queryType: data.queryType,
        metadata: data.metadata,
      }

      setStreamingMessage(null)
      setStreamingMessageId(null)
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      // Limpar streaming em caso de erro
      setStreamingMessage(null)
      setStreamingMessageId(null)

      const isTimeout = error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))

      clientLogger.error("Chat: Erro ao enviar mensagem", error, {
        userId: "client-side",
        message: content.trim().substring(0, 50),
      })

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: isTimeout
          ? "A resposta está demorando muito. Por favor, tente uma pergunta mais simples ou aguarde um momento."
          : "Desculpe, tive um problema ao processar sua mensagem. Por favor, tente novamente.",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question)
  }

  const handleFeedback = async (metricId: string, rating: 1 | 0) => {
    try {
      const response = await fetch("/api/ai/analytics/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metricId,
          rating: rating === 1 ? 5 : 1, // 5 = útil, 1 = não útil
        }),
      })

      if (response.ok) {
        clientLogger.info("Feedback enviado", { metricId, rating })
      }
    } catch (error) {
      clientLogger.error("Erro ao enviar feedback", error)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-secondary/5 pb-20 md:pb-0">
      <PageHeader
        title="NathAI"
        description="Assistente Maternal com IA"
        icon={<Sparkles className="h-5 w-5" />}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-md animate-in fade-in slide-in-from-left-2 duration-300">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300 ${message.role === "user"
                  ? "bg-primary text-primary-foreground shadow-primary/20"
                  : "bg-muted/80 backdrop-blur-sm border border-border/50"
                  }`}
              >
                {message.role === "assistant" && message.provider && (
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {message.provider === "claude" && <Brain className="h-3 w-3 mr-1" />}
                      {message.provider === "gpt4" && <Sparkles className="h-3 w-3 mr-1" />}
                      {message.provider === "gemini" && <Search className="h-3 w-3 mr-1" />}
                      {message.provider === "grok" && <TrendingUp className="h-3 w-3 mr-1" />}
                      {message.provider === "perplexity" && <BookOpen className="h-3 w-3 mr-1" />}
                      {message.provider === "claude" && "Claude"}
                      {message.provider === "gpt4" && "GPT-4"}
                      {message.provider === "gemini" && "Gemini"}
                      {message.provider === "grok" && "Grok"}
                      {message.provider === "perplexity" && "Perplexity"}
                    </Badge>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className={`text-xs opacity-70 ${message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}>
                    {message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                  {message.role === "assistant" && message.metadata?.metricId && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleFeedback(message.metadata!.metricId!, 1)}
                        className="text-xs text-muted-foreground hover:text-primary"
                        title="Útil"
                      >
                        👍
                      </button>
                      <button
                        onClick={() => handleFeedback(message.metadata!.metricId!, 0)}
                        className="text-xs text-muted-foreground hover:text-destructive"
                        title="Não útil"
                      >
                        👎
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {message.role === "user" && (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
              )}
            </div>
          ))}

          {/* Mensagem sendo transmitida (streaming) */}
          {streamingMessage && streamingMessageId && (
            <div
              key={streamingMessageId}
              className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-md">
                <Sparkles className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div className="max-w-[75%] rounded-2xl p-4 bg-muted/80 backdrop-blur-sm border border-border/50 shadow-sm">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {streamingMessage}
                  <span className="inline-block w-2 h-4 bg-primary/60 animate-pulse ml-1 rounded">|</span>
                </p>
                <p className="text-xs mt-2 text-muted-foreground opacity-70">
                  {new Date().toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            </div>
          )}

          {isLoading && !streamingMessage && (
            <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-md">
                <Sparkles className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div className="bg-muted/80 backdrop-blur-sm border border-border/50 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">NathAI está pensando...</p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && !isLoading && (
        <div className="border-t bg-gradient-to-t from-background via-background/95 to-background/50 p-4 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Sugestões de perguntas:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleSuggestedQuestion(question)}
                  className="justify-start text-left h-auto py-3 px-4 bg-card/50 hover:bg-primary/5 hover:border-primary/30 border-2 border-transparent hover:shadow-sm transition-all duration-300 group"
                  disabled={isLoading}
                >
                  <Brain className="h-4 w-4 mr-2 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm group-hover:text-primary transition-colors">{question}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-background/95 backdrop-blur-sm p-4 sticky bottom-0 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem... (foco em maternidade 💕)"
              disabled={isLoading}
              className="flex-1 h-12 rounded-xl border-2 focus:border-primary/50 transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && input.trim() && !isLoading) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              size="lg"
              className="px-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            💕 A NathAI é especializada em maternidade. Sempre consulte profissionais de saúde para questões médicas.
          </p>
        </form>
      </div>
      <BottomNavigation />
    </div>
  )
}
