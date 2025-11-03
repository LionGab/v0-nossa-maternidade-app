/**
 * API Route para Sistema de Múltiplos Agentes de Código
 * Coordena execução de múltiplos agentes especializados
 */

import { executeMultiAgents, getAvailableAgents, isAgentAvailable } from "@/lib/agents/code-agents-manager"
import type { AgentType } from "@/lib/agents/types"
import { OPTIONS, RATE_LIMITS, withRateLimit } from "@/lib/api-utils"
import { logger } from "@/lib/logger"
import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"

export { OPTIONS }; // CORS preflight

/**
 * Schema de validação para requisição de agente único
 */
const agentTaskSchema = z.object({
    id: z.string().optional(),
    agentType: z.enum([
        "analyzer",
        "refactor",
        "test-generator",
        "documenter",
        "optimizer",
        "bug-detector",
        "component-generator",
        "validator",
    ]),
    input: z.string().min(1, "Input não pode estar vazio"),
    filePath: z.string().optional(),
    options: z.record(z.any()).optional(),
    priority: z.number().optional(),
})

/**
 * Schema de validação para requisição multi-agente
 */
const multiAgentRequestSchema = z.object({
    tasks: z.array(agentTaskSchema).min(1, "Pelo menos uma tarefa é necessária"),
    mode: z.enum(["parallel", "sequential", "orchestrated"]).optional(),
    context: z
        .object({
            codebase: z.string().optional(),
            dependencies: z.array(z.string()).optional(),
            preferences: z.record(z.any()).optional(),
        })
        .optional(),
})

/**
 * Handler para POST - Executar múltiplos agentes
 */
async function handleMultiAgents(req: NextRequest) {
    const startTime = Date.now()

    try {
        // Autenticação
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: "Não autorizado" },
                { status: 401 }
            )
        }

        // Validar body
        const body = await req.json()
        const validationResult = multiAgentRequestSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Dados inválidos",
                    details: validationResult.error.errors,
                },
                { status: 400 }
            )
        }

        const { tasks, mode, context } = validationResult.data

        // Gerar IDs se não fornecidos
        const enrichedTasks = tasks.map((task, index) => ({
            ...task,
            id: task.id || `task-${Date.now()}-${index}`,
        }))

        // Verificar disponibilidade dos agentes
        const unavailableAgents: AgentType[] = []
        for (const task of enrichedTasks) {
            if (!isAgentAvailable(task.agentType)) {
                unavailableAgents.push(task.agentType)
            }
        }

        if (unavailableAgents.length > 0) {
            return NextResponse.json(
                {
                    error: "Alguns agentes não estão disponíveis",
                    unavailableAgents,
                    message:
                        "Configure as APIs de IA (ANTHROPIC_API_KEY, OPENAI_API_KEY, GOOGLE_AI_API_KEY) para habilitar os agentes.",
                },
                { status: 503 }
            )
        }

        logger.info("Executando múltiplos agentes", {
            userId: user.id,
            taskCount: enrichedTasks.length,
            mode: mode || "parallel",
        })

        // Executar agentes
        const response = await executeMultiAgents({
            tasks: enrichedTasks,
            mode: mode || "parallel",
            context,
        })

        // Log de sucesso
        logger.info("Múltiplos agentes executados com sucesso", {
            userId: user.id,
            taskCount: enrichedTasks.length,
            successCount: response.successCount,
            errorCount: response.errorCount,
            duration: Date.now() - startTime,
        })

        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        logger.apiError("POST", "/api/code-agents", error as Error, {
            duration: Date.now() - startTime,
        })

        const errorMessage =
            error instanceof Error ? error.message : "Erro desconhecido"

        return NextResponse.json(
            {
                error: "Erro ao executar agentes",
                message: errorMessage,
            },
            { status: 500 }
        )
    }
}

/**
 * Handler para GET - Listar agentes disponíveis
 */
async function handleGetAgents(req: NextRequest) {
    try {
        // Autenticação
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: "Não autorizado" },
                { status: 401 }
            )
        }

        const agents = getAvailableAgents()
        const agentsWithAvailability = agents.map((agent) => ({
            ...agent,
            available: isAgentAvailable(agent.type),
        }))

        return NextResponse.json(
            {
                agents: agentsWithAvailability,
                total: agents.length,
                available: agentsWithAvailability.filter((a) => a.available).length,
            },
            { status: 200 }
        )
    } catch (error) {
        logger.apiError("GET", "/api/code-agents", error as Error)

        return NextResponse.json(
            {
                error: "Erro ao listar agentes",
                message: error instanceof Error ? error.message : "Erro desconhecido",
            },
            { status: 500 }
        )
    }
}

export const POST = withRateLimit(handleMultiAgents, RATE_LIMITS.HEAVY)
export const GET = withRateLimit(handleGetAgents, RATE_LIMITS.AUTHENTICATED)
