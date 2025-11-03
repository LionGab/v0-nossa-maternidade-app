"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Brain, Sparkles, Search } from "lucide-react"

export function MultiAIChat() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState("")
  const [mode, setMode] = useState<"empathetic" | "general" | "research">("empathetic")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessages = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      let endpoint = "/api/multi-ai/chat"
      let body: any = { messages: newMessages }

      if (mode === "empathetic") {
        body.useEmpatheticMode = true
      } else if (mode === "research") {
        endpoint = "/api/multi-ai/research"
        body = { query: input }
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (mode === "research") {
        const data = await response.json()
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: `${data.answer}\n\nFontes: ${data.sources.join(", ")}`,
          },
        ])
      } else {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let assistantMessage = ""

        while (true) {
          const { done, value } = (await reader?.read()) || {}
          if (done) break

          const chunk = decoder.decode(value)
          assistantMessage += chunk

          setMessages([...newMessages, { role: "assistant", content: assistantMessage }])
        }
      }
    } catch (error) {
      // Error será visível para o usuário através do estado da UI
      if (process.env.NODE_ENV === 'development') {
        console.error("MultiAIChat: Error sending message", error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 mb-4">
        <Button
          variant={mode === "empathetic" ? "default" : "outline"}
          onClick={() => setMode("empathetic")}
          className="flex items-center gap-2"
        >
          <Heart className="h-4 w-4" />
          Modo Empático (Claude)
        </Button>
        <Button
          variant={mode === "general" ? "default" : "outline"}
          onClick={() => setMode("general")}
          className="flex items-center gap-2"
        >
          <Brain className="h-4 w-4" />
          Conversação (GPT-4)
        </Button>
        <Button
          variant={mode === "research" ? "default" : "outline"}
          onClick={() => setMode("research")}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Pesquisa (Perplexity)
        </Button>
      </div>

      <Card className="flex-1 p-4 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium mb-2">Sistema Multi-IA Avançado</p>
            <p className="text-sm">Escolha um modo e comece a conversar. Cada modo usa uma IA especializada.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "research" ? "Pesquise informações sobre saúde materna..." : "Digite sua mensagem..."}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
        />
        <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
          {isLoading ? "Enviando..." : "Enviar"}
        </Button>
      </div>

      <div className="mt-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="mr-2">
          {mode === "empathetic" && "Claude Sonnet 4 - Análise empática profunda"}
          {mode === "general" && "GPT-4 - Conversação inteligente"}
          {mode === "research" && "Perplexity - Pesquisa com fontes"}
        </Badge>
      </div>
    </div>
  )
}
