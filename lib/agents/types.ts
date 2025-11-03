/**
 * Tipos e interfaces para o sistema de múltiplos agentes de código
 */

export type AgentType =
    | "analyzer"      // Analisa código e identifica problemas
    | "refactor"      // Refatora código para melhor qualidade
    | "test-generator" // Gera testes automatizados
    | "documenter"    // Gera documentação
    | "optimizer"     // Otimiza performance
    | "bug-detector"  // Detecta bugs e vulnerabilidades
    | "component-generator" // Gera componentes React
    | "validator"     // Valida código e padrões

export type AgentStatus = "idle" | "processing" | "completed" | "error"

export interface AgentTask {
    id: string
    agentType: AgentType
    input: string
    filePath?: string
    options?: Record<string, any>
    priority?: number
}

export interface AgentResult {
    taskId: string
    agentType: AgentType
    status: AgentStatus
    output: string
    suggestions?: string[]
    code?: string
    metadata?: Record<string, any>
    error?: string
    duration?: number
}

export interface MultiAgentRequest {
    tasks: AgentTask[]
    mode?: "parallel" | "sequential" | "orchestrated"
    context?: {
        codebase?: string
        dependencies?: string[]
        preferences?: Record<string, any>
    }
}

export interface MultiAgentResponse {
    results: AgentResult[]
    summary: string
    totalDuration: number
    successCount: number
    errorCount: number
}

export interface AgentCapabilities {
    type: AgentType
    name: string
    description: string
    supportedLanguages?: string[]
    maxInputLength?: number
}
