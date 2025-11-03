"use client"

/**
 * Painel de Múltiplos Agentes de Código Automatizado
 * Interface para coordenar e executar múltiplos agentes especializados
 */

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  Code,
  FileCode,
  TestTube,
  FileText,
  Zap,
  Bug,
  Component,
  CheckSquare,
  Settings,
  List,
} from "lucide-react"
import type { AgentType } from "@/lib/agents/types"

interface AgentCapability {
  type: AgentType
  name: string
  description: string
  available: boolean
}

interface AgentResult {
  taskId: string
  agentType: AgentType
  status: "idle" | "processing" | "completed" | "error"
  output: string
  suggestions?: string[]
  code?: string
  metadata?: Record<string, any>
  error?: string
  duration?: number
}

interface MultiAgentResponse {
  results: AgentResult[]
  summary: string
  totalDuration: number
  successCount: number
  errorCount: number
}

export function CodeAgentsPanel() {
  const [agents, setAgents] = useState<AgentCapability[]>([])
  const [selectedAgents, setSelectedAgents] = useState<Set<AgentType>>(new Set())
  const [codeInput, setCodeInput] = useState("")
  const [filePath, setFilePath] = useState("")
  const [executionMode, setExecutionMode] = useState<"parallel" | "sequential" | "orchestrated">("parallel")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<AgentResult[]>([])
  const [summary, setSummary] = useState<string>("")

  // Carregar agentes disponíveis
  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    try {
      const response = await fetch("/api/code-agents")
      if (!response.ok) throw new Error("Erro ao carregar agentes")

      const data = await response.json()
      setAgents(data.agents || [])
    } catch (error) {
      // Error será mostrado na UI através do estado do componente
      if (error instanceof Error) {
        console.error("Erro ao carregar agentes:", error.message)
      }
    }
  }

  const toggleAgent = (agentType: AgentType) => {
    const newSelected = new Set(selectedAgents)
    if (newSelected.has(agentType)) {
      newSelected.delete(agentType)
    } else {
      newSelected.add(agentType)
    }
    setSelectedAgents(newSelected)
  }

  const selectAllAgents = () => {
    const availableAgents = agents.filter((a) => a.available).map((a) => a.type)
    setSelectedAgents(new Set(availableAgents))
  }

  const clearSelection = () => {
    setSelectedAgents(new Set())
  }

  const executeAgents = async () => {
    if (selectedAgents.size === 0) {
      alert("Selecione pelo menos um agente")
      return
    }

    if (!codeInput.trim()) {
      alert("Digite o código para processar")
      return
    }

    setIsLoading(true)
    setResults([])
    setSummary("")

    try {
      const tasks = Array.from(selectedAgents).map((agentType, index) => ({
        agentType,
        input: codeInput,
        filePath: filePath || undefined,
        priority: index,
      }))

      const response = await fetch("/api/code-agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks,
          mode: executionMode,
          context: {
            codebase: codeInput,
          },
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erro ao executar agentes")
      }

      const data: MultiAgentResponse = await response.json()
      setResults(data.results)
      setSummary(data.summary)
    } catch (error) {
      // Error é mostrado através do alert para o usuário
      const errorMessage = error instanceof Error ? error.message : "Erro ao executar agentes"
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const getAgentIcon = (type: AgentType) => {
    switch (type) {
      case "analyzer":
        return <Code className="h-4 w-4" />
      case "refactor":
        return <FileCode className="h-4 w-4" />
      case "test-generator":
        return <TestTube className="h-4 w-4" />
      case "documenter":
        return <FileText className="h-4 w-4" />
      case "optimizer":
        return <Zap className="h-4 w-4" />
      case "bug-detector":
        return <Bug className="h-4 w-4" />
      case "component-generator":
        return <Component className="h-4 w-4" />
      case "validator":
        return <CheckSquare className="h-4 w-4" />
      default:
        return <Code className="h-4 w-4" />
    }
  }

  const getAgentColor = (type: AgentType) => {
    switch (type) {
      case "analyzer":
        return "bg-blue-500"
      case "refactor":
        return "bg-green-500"
      case "test-generator":
        return "bg-purple-500"
      case "documenter":
        return "bg-yellow-500"
      case "optimizer":
        return "bg-orange-500"
      case "bug-detector":
        return "bg-red-500"
      case "component-generator":
        return "bg-pink-500"
      case "validator":
        return "bg-indigo-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Cabeçalho */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Agentes de Código Automatizado</h2>
            <p className="text-muted-foreground text-sm">
              Execute múltiplos agentes especializados de forma eficiente e coordenada
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAllAgents}>
              <List className="h-4 w-4 mr-2" />
              Selecionar Todos
            </Button>
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Limpar
            </Button>
          </div>
        </div>

        {/* Seletor de Modo */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={executionMode === "parallel" ? "default" : "outline"}
            size="sm"
            onClick={() => setExecutionMode("parallel")}
          >
            Paralelo
          </Button>
          <Button
            variant={executionMode === "sequential" ? "default" : "outline"}
            size="sm"
            onClick={() => setExecutionMode("sequential")}
          >
            Sequencial
          </Button>
          <Button
            variant={executionMode === "orchestrated" ? "default" : "outline"}
            size="sm"
            onClick={() => setExecutionMode("orchestrated")}
          >
            Orquestrado
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Painel Esquerdo - Seleção e Input */}
        <div className="flex flex-col gap-4">
          {/* Seleção de Agentes */}
          <Card className="p-4 flex-1">
            <h3 className="font-semibold mb-4">Selecione os Agentes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto">
              {agents.map((agent) => (
                <Card
                  key={agent.type}
                  className={`p-3 cursor-pointer transition-all ${
                    selectedAgents.has(agent.type)
                      ? "ring-2 ring-primary"
                      : ""
                  } ${
                    !agent.available ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => agent.available && toggleAgent(agent.type)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`${getAgentColor(
                        agent.type
                      )} text-white p-2 rounded`}
                    >
                      {getAgentIcon(agent.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{agent.name}</span>
                        {selectedAgents.has(agent.type) && (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        )}
                        {!agent.available && (
                          <Badge variant="outline" className="text-xs">
                            Indisponível
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Input de Código */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Código para Processar</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Caminho do Arquivo (opcional)
                </label>
                <input
                  type="text"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  placeholder="ex: components/MyComponent.tsx"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Código
                </label>
                <Textarea
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Cole ou digite o código aqui..."
                  className="font-mono text-sm min-h-[200px]"
                />
              </div>
              <Button
                onClick={executeAgents}
                disabled={isLoading || selectedAgents.size === 0 || !codeInput.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Executando...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Executar Agentes ({selectedAgents.size})
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Painel Direito - Resultados */}
        <Card className="p-4 flex-1 min-h-0 flex flex-col">
          <h3 className="font-semibold mb-4">Resultados</h3>
          {summary && (
            <div className="mb-4 p-3 bg-muted rounded-md">
              <p className="text-sm whitespace-pre-wrap">{summary}</p>
            </div>
          )}
          <div className="flex-1 overflow-y-auto space-y-4">
            {results.length === 0 && !isLoading && (
              <div className="text-center text-muted-foreground py-8">
                <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Execute agentes para ver os resultados aqui</p>
              </div>
            )}
            {results.map((result) => {
              const agent = agents.find((a) => a.type === result.agentType)
              return (
                <Card key={result.taskId} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`${getAgentColor(
                        result.agentType
                      )} text-white p-2 rounded`}
                    >
                      {getAgentIcon(result.agentType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{agent?.name || result.agentType}</span>
                        <div className="flex items-center gap-2">
                          {result.duration && (
                            <Badge variant="outline" className="text-xs">
                              {(result.duration / 1000).toFixed(2)}s
                            </Badge>
                          )}
                          {result.status === "completed" && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                          {result.status === "error" && (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          {result.status === "processing" && (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                          )}
                        </div>
                      </div>
                      {result.error && (
                        <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-600 dark:text-red-400">
                          Erro: {result.error}
                        </div>
                      )}
                    </div>
                  </div>

                  {result.suggestions && result.suggestions.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-2">Sugestões:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {result.suggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.code && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-2">Código Gerado:</h4>
                      <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs">
                        <code>{result.code}</code>
                      </pre>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium mb-2">Output:</h4>
                    <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                      {result.output || "Nenhum output disponível"}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
