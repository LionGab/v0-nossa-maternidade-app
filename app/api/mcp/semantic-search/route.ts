import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { MemoryManager } from "@/lib/mcp/memory-manager"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"

export { OPTIONS } // CORS preflight

// MCP: Busca Inteligente Semântica
async function handleSemanticSearch(req: NextRequest) {
  const startTime = Date.now()
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query, limit = 10, threshold = 0.7 } = await req.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const memoryManager = new MemoryManager(user.id)
    const results = await memoryManager.searchMemories(query, limit, threshold)

    logger.info("Semantic search completed successfully", {
      userId: user.id,
      query,
      resultsCount: results.length,
      duration: Date.now() - startTime
    })
    return NextResponse.json({
      results,
      count: results.length,
      query,
    })
  } catch (error) {
    logger.apiError("POST", "/api/mcp/semantic-search", error as Error, { duration: Date.now() - startTime })
    return NextResponse.json({ error: "Failed to perform semantic search" }, { status: 500 })
  }
}

export const POST = withRateLimit(handleSemanticSearch, RATE_LIMITS.AUTHENTICATED)
