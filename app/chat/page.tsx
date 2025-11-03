"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Send, Loader2, Heart, Brain, Smile } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { clientLogger } from "@/lib/logger-client"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
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
      // Preparar histórico de mensagens para a API
      const conversationHistory = messages.map(m => ({
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

      const response = await fetch("/api/multi-ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          useEmpatheticMode: false
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Erro ao enviar mensagem")
      }

      // A API retorna um stream, não JSON
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("Resposta vazia do servidor")
      }

      const decoder = new TextDecoder()
      let assistantMessageContent = ""
      const messageId = (Date.now() + 1).toString()

      // Iniciar streaming visual
      setStreamingMessageId(messageId)
      setStreamingMessage("")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        assistantMessageContent += chunk

        // Atualizar mensagem em tempo real para streaming visual
        setStreamingMessage(assistantMessageContent)
      }

      // Finalizar: adicionar mensagem completa e limpar streaming
      const assistantMessage: Message = {
        id: messageId,
        role: "assistant",
        content: assistantMessageContent || "Desculpe, não consegui processar sua mensagem. Tente novamente.",
        timestamp: new Date(),
      }

      setStreamingMessage(null)
      setStreamingMessageId(null)
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      // Limpar streaming em caso de erro
      setStreamingMessage(null)
      setStreamingMessageId(null)

      clientLogger.error("Chat: Erro ao enviar mensagem", error, {
        userId: "client-side",
        message: content.trim().substring(0, 50),
      })
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Desculpe, tive um problema ao processar sua mensagem. Por favor, tente novamente em alguns instantes.",
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

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-serif font-bold text-foreground">NathAI</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-muted-foreground">Online - Assistente Maternal com IA</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Powered by Gemini 2.5
          </Badge>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-2xl p-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}>
                  {message.timestamp.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
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
              className="flex gap-3 justify-start"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="max-w-[75%] rounded-2xl p-4 bg-muted">
                <p className="text-sm whitespace-pre-wrap">
                  {streamingMessage}
                  <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1">|</span>
                </p>
                <p className="text-xs mt-2 text-muted-foreground">
                  {new Date().toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            </div>
          )}

          {isLoading && !streamingMessage && (
            <div className="flex gap-3 justify-start">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="bg-muted rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
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
        <div className="border-t bg-background/50 p-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground mb-3">Sugestões de perguntas:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleSuggestedQuestion(question)}
                  className="justify-start text-left h-auto py-3 px-4 bg-transparent"
                  disabled={isLoading}
                >
                  <Brain className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{question}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-background p-4 sticky bottom-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              className="flex-1 h-12"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              size="lg"
              className="px-6"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            A NathAI é uma assistente com IA. Sempre consulte profissionais de saúde para questões médicas.
          </p>
        </form>
      </div>
    </div>
  )
}
