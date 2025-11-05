/**
 * Sistema de Coordenação de Múltiplos Agentes de Código
 * Gerencia execução paralela, sequencial e orquestrada de agentes especializados
 */

import { hasApiKey } from "@/lib/env"
import { logger } from "@/lib/logger"
import { getAnthropicClient, getOpenAIClient, getGeminiClient } from "@/lib/ai/providers"
import type {
    AgentCapabilities,
    AgentResult,
    AgentTask,
    AgentType,
    MultiAgentRequest,
    MultiAgentResponse,
} from "./types"

/**
 * Capacidades dos agentes especializados
 */
export const AGENT_CAPABILITIES: Record<AgentType, AgentCapabilities> = {
    analyzer: {
        type: "analyzer",
        name: "Analisador de Código",
        description: "Analisa código e identifica problemas, code smells e oportunidades de melhoria",
        supportedLanguages: ["typescript", "javascript", "tsx", "jsx", "python", "go"],
    },
    refactor: {
        type: "refactor",
        name: "Refatorador de Código",
        description: "Refatora código para melhor qualidade, legibilidade e manutenibilidade",
        supportedLanguages: ["typescript", "javascript", "tsx", "jsx"],
    },
    "test-generator": {
        type: "test-generator",
        name: "Gerador de Testes",
        description: "Gera testes automatizados completos e bem estruturados",
        supportedLanguages: ["typescript", "javascript", "tsx", "jsx"],
    },
    documenter: {
        type: "documenter",
        name: "Documentador de Código",
        description: "Gera documentação clara e completa para código e APIs",
        supportedLanguages: ["typescript", "javascript", "tsx", "jsx"],
    },
    optimizer: {
        type: "optimizer",
        name: "Otimizador de Performance",
        description: "Otimiza código para melhor performance e eficiência",
        supportedLanguages: ["typescript", "javascript", "tsx", "jsx"],
    },
    "bug-detector": {
        type: "bug-detector",
        name: "Detector de Bugs",
        description: "Detecta bugs, vulnerabilidades e problemas de segurança",
        supportedLanguages: ["typescript", "javascript", "tsx", "jsx", "python"],
    },
    "component-generator": {
        type: "component-generator",
        name: "Gerador de Componentes",
        description: "Gera componentes React/Next.js completos e bem estruturados",
        supportedLanguages: ["tsx", "jsx"],
    },
    validator: {
        type: "validator",
        name: "Validador de Código",
        description: "Valida código contra padrões, convenções e boas práticas",
        supportedLanguages: ["typescript", "javascript", "tsx", "jsx"],
    },
}

/**
 * Executa um agente individual
 */
async function executeAgent(task: AgentTask): Promise<AgentResult> {
    const startTime = Date.now()
    const result: AgentResult = {
        taskId: task.id,
        agentType: task.agentType,
        status: "processing",
        output: "",
    }

    try {
        const prompt = buildPrompt(task)
        const agentName = AGENT_CAPABILITIES[task.agentType].name

        logger.info(`Executando agente: ${agentName}`, {
            taskId: task.id,
            agentType: task.agentType,
        })

        // Escolher modelo baseado no tipo de agente
        const response = await callAI(prompt, task.agentType)

        result.output = response
        result.status = "completed"
        result.duration = Date.now() - startTime

        // Extrair sugestões e código se disponível
        const parsed = parseResponse(response, task.agentType)
        result.suggestions = parsed.suggestions
        result.code = parsed.code
        result.metadata = parsed.metadata

        logger.info(`Agente concluído: ${agentName}`, {
            taskId: task.id,
            duration: result.duration,
        })
    } catch (error) {
        result.status = "error"
        result.error = error instanceof Error ? error.message : "Erro desconhecido"
        result.duration = Date.now() - startTime

        logger.error(`Erro no agente: ${AGENT_CAPABILITIES[task.agentType].name}`, error as Error, {
            taskId: task.id,
        })
    }

    return result
}

/**
 * Constrói o prompt específico para cada tipo de agente
 */
function buildPrompt(task: AgentTask): string {
    const baseContext = task.filePath ? `Arquivo: ${task.filePath}\n` : ""
    const codeContext = task.options?.codebase || ""
    const dependencies = task.options?.dependencies
        ? `\nDependências: ${JSON.stringify(task.options.dependencies)}`
        : ""

    const commonPrompt = `${baseContext}${codeContext}${dependencies}

Código a processar:
\`\`\`
${task.input}
\`\`\`
`

    switch (task.agentType) {
        case "analyzer":
            return `Você é um analisador de código especializado. Analise o código fornecido e identifique:
1. Problemas e bugs potenciais
2. Code smells e más práticas
3. Oportunidades de melhoria
4. Complexidade e qualidade do código
5. Padrões e antipadrões identificados

${commonPrompt}

Forneça uma análise detalhada e estruturada com recomendações específicas.`

        case "refactor":
            return `Você é um refatorador de código especializado. Refatore o código fornecido seguindo:
1. Princípios SOLID
2. Clean Code e boas práticas
3. Melhor legibilidade e manutenibilidade
4. Padrões de projeto apropriados
5. TypeScript/JavaScript moderno

${commonPrompt}

Forneça o código refatorado completo e explique as melhorias realizadas.`

        case "test-generator":
            return `Você é um gerador de testes especializado. Crie testes completos e bem estruturados para o código fornecido:
1. Testes unitários abrangentes
2. Testes de edge cases
3. Testes de integração quando apropriado
4. Cobertura completa das funcionalidades
5. Usando Vitest ou Jest

${commonPrompt}

Forneça testes completos e prontos para uso.`

        case "documenter":
            return `Você é um documentador de código especializado. Crie documentação clara e completa:
1. Documentação de funções/métodos
2. Exemplos de uso
3. Documentação de tipos e interfaces
4. README quando apropriado
5. Comentários JSDoc/TSDoc

${commonPrompt}

Forneça documentação completa e bem formatada.`

        case "optimizer":
            return `Você é um otimizador de performance especializado. Otimize o código para:
1. Melhor performance e velocidade
2. Menor uso de memória
3. Otimizações de algoritmos
4. Bundle size e tree-shaking
5. Otimizações específicas para React/Next.js

${commonPrompt}

Forneça o código otimizado e explique as otimizações aplicadas.`

        case "bug-detector":
            return `Você é um detector de bugs especializado. Identifique:
1. Bugs e erros potenciais
2. Vulnerabilidades de segurança
3. Race conditions e problemas de concorrência
4. Memory leaks potenciais
5. Problemas de tipagem e lógica

${commonPrompt}

Forneça uma lista detalhada de bugs encontrados com soluções.`

        case "component-generator":
            return `Você é um gerador de componentes React/Next.js especializado. Crie componentes completos:
1. Componentes funcionais com TypeScript
2. Props tipadas corretamente
3. Hooks e estado quando necessário
4. Acessibilidade (a11y)
5. Responsividade e design system

${commonPrompt}

Forneça o componente completo e pronto para uso.`

        case "validator":
            return `Você é um validador de código especializado. Valide o código contra:
1. Padrões de código (ESLint, Prettier)
2. Convenções e boas práticas
3. TypeScript strict mode
4. Acessibilidade (a11y)
5. Performance e otimizações

${commonPrompt}

Forneça uma validação detalhada com sugestões de correção.`

        default:
            return commonPrompt
    }
}

/**
 * Chama a IA apropriada baseado no tipo de agente
 */
async function callAI(prompt: string, agentType: AgentType): Promise<string> {
    // Agentes críticos usam Claude (melhor qualidade)
    const criticalAgents: AgentType[] = ["analyzer", "refactor", "bug-detector"]

    // Agentes de geração usam GPT-4 (melhor para código)
    const generationAgents: AgentType[] = ["test-generator", "component-generator", "optimizer"]

    // Agentes de documentação podem usar Gemini (boa performance)
    const documentationAgents: AgentType[] = ["documenter", "validator"]

    if (criticalAgents.includes(agentType)) {
        const anthropic = getAnthropicClient()
        if (anthropic) {
            const response = await anthropic.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: 4096,
                messages: [{ role: "user", content: prompt }],
            })
            return response.content[0].type === "text" ? response.content[0].text : ""
        }
    }

    if (generationAgents.includes(agentType)) {
        const openai = getOpenAIClient()
        if (openai) {
            const completion = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3, // Menor temperatura para código mais consistente
            })
            return completion.choices[0]?.message?.content || ""
        }
    }

    if (documentationAgents.includes(agentType)) {
        const genAI = getGeminiClient()
        if (genAI) {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
            const result = await model.generateContent(prompt)
            return result.response.text()
        }
    }

    // Fallback para primeira API disponível
    const anthropic = getAnthropicClient()
    if (anthropic) {
        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4096,
            messages: [{ role: "user", content: prompt }],
        })
        return response.content[0].type === "text" ? response.content[0].text : ""
    }

    const openai = getOpenAIClient()
    if (openai) {
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [{ role: "user", content: prompt }],
        })
        return completion.choices[0]?.message?.content || ""
    }

    throw new Error("Nenhuma API de IA disponível")
}

/**
 * Faz parse da resposta da IA para extrair informações estruturadas
 */
function parseResponse(response: string, agentType: AgentType): {
    suggestions?: string[]
    code?: string
    metadata?: Record<string, any>
} {
    const result: {
        suggestions?: string[]
        code?: string
        metadata?: Record<string, any>
    } = {}

    // Extrair código entre ``` se presente
    const codeBlockRegex = /```(?:typescript|tsx|jsx|javascript|ts|js)?\n([\s\S]*?)```/g
    const codeMatches = [...response.matchAll(codeBlockRegex)]
    if (codeMatches.length > 0) {
        result.code = codeMatches.map((m) => m[1]).join("\n\n")
    }

    // Extrair sugestões (listas numeradas ou com bullets)
    const suggestionsRegex = /(?:^\d+\.|^[-*])\s+(.+)$/gm
    const suggestions = [...response.matchAll(suggestionsRegex)]
    if (suggestions.length > 0) {
        result.suggestions = suggestions.map((s) => s[1].trim())
    }

    // Metadata adicional
    result.metadata = {
        hasCode: !!result.code,
        suggestionCount: result.suggestions?.length || 0,
        responseLength: response.length,
    }

    return result
}

/**
 * Executa múltiplos agentes em paralelo
 */
async function executeParallel(tasks: AgentTask[]): Promise<AgentResult[]> {
    logger.info("Executando agentes em paralelo", { taskCount: tasks.length })
    return Promise.all(tasks.map((task) => executeAgent(task)))
}

/**
 * Executa múltiplos agentes sequencialmente
 */
async function executeSequential(tasks: AgentTask[]): Promise<AgentResult[]> {
    logger.info("Executando agentes sequencialmente", { taskCount: tasks.length })
    const results: AgentResult[] = []

    for (const task of tasks) {
        const result = await executeAgent(task)
        results.push(result)

        // Se um agente crítico falhou, pode parar a cadeia
        const criticalAgents: AgentType[] = ["bug-detector", "validator"]
        if (result.status === "error" && criticalAgents.includes(task.agentType)) {
            logger.warn("Agente crítico falhou, parando execução sequencial", {
                taskId: task.id,
            })
            break
        }
    }

    return results
}

/**
 * Executa agentes de forma orquestrada (com dependências)
 */
async function executeOrchestrated(tasks: AgentTask[]): Promise<AgentResult[]> {
    logger.info("Executando agentes de forma orquestrada", { taskCount: tasks.length })

    // Ordenar por prioridade (maior primeiro)
    const sortedTasks = [...tasks].sort((a, b) => (b.priority || 0) - (a.priority || 0))

    // Agrupar por camada de dependência
    const results: AgentResult[] = []
    const completedResults = new Map<string, AgentResult>()

    for (const task of sortedTasks) {
        // Verificar dependências (se houver)
        const canExecute = true // Simplificado por enquanto

        if (canExecute) {
            const result = await executeAgent(task)
            results.push(result)
            completedResults.set(task.id, result)

            // Passar resultados para próximos agentes se necessário
            if (task.options?.usePreviousResults && results.length > 0) {
                task.options.context = {
                    ...task.options.context,
                    previousResults: results.map((r) => ({
                        agentType: r.agentType,
                        output: r.output,
                    })),
                }
            }
        }
    }

    return results
}

/**
 * Executa múltiplos agentes baseado na estratégia especificada
 */
export async function executeMultiAgents(
    request: MultiAgentRequest
): Promise<MultiAgentResponse> {
    const startTime = Date.now()
    const { tasks, mode = "parallel", context } = request

    logger.info("Iniciando execução de múltiplos agentes", {
        taskCount: tasks.length,
        mode,
    })

    try {
        let results: AgentResult[]

        // Adicionar contexto aos tasks
        const enrichedTasks = tasks.map((task) => ({
            ...task,
            options: {
                ...task.options,
                ...context,
            },
        }))

        switch (mode) {
            case "sequential":
                results = await executeSequential(enrichedTasks)
                break
            case "orchestrated":
                results = await executeOrchestrated(enrichedTasks)
                break
            case "parallel":
            default:
                results = await executeParallel(enrichedTasks)
                break
        }

        const totalDuration = Date.now() - startTime
        const successCount = results.filter((r) => r.status === "completed").length
        const errorCount = results.filter((r) => r.status === "error").length

        // Gerar resumo
        const summary = generateSummary(results, totalDuration)

        logger.info("Execução de múltiplos agentes concluída", {
            totalDuration,
            successCount,
            errorCount,
            taskCount: tasks.length,
        })

        return {
            results,
            summary,
            totalDuration,
            successCount,
            errorCount,
        }
    } catch (error) {
        logger.error("Erro na execução de múltiplos agentes", error as Error)
        throw error
    }
}

/**
 * Gera resumo dos resultados
 */
function generateSummary(results: AgentResult[], duration: number): string {
    const agentNames = results.map(
        (r) => AGENT_CAPABILITIES[r.agentType].name
    )
    const successCount = results.filter((r) => r.status === "completed").length
    const errorCount = results.filter((r) => r.status === "error").length

    return `
Execução de ${results.length} agentes concluída em ${(duration / 1000).toFixed(2)}s
- Sucessos: ${successCount}
- Erros: ${errorCount}
- Agentes executados: ${agentNames.join(", ")}
`
}

/**
 * Lista todas as capacidades dos agentes disponíveis
 */
export function getAvailableAgents(): AgentCapabilities[] {
    return Object.values(AGENT_CAPABILITIES)
}

/**
 * Verifica se um agente está disponível
 */
export function isAgentAvailable(agentType: AgentType): boolean {
    const capabilities = AGENT_CAPABILITIES[agentType]
    if (!capabilities) return false

    // Verificar se há APIs disponíveis
    return !!(anthropic || openai || genAI)
}
