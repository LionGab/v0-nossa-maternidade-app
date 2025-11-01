import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { MemoryManager } from "@/lib/mcp/memory-manager"

// MCP: Busca Inteligente Semântica
export async function POST(req: NextRequest) {
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

    return NextResponse.json({
      results,
      count: results.length,
      query,
    })
  } catch (error) {
    console.error("[v0] Error in semantic search MCP:", error)
    return NextResponse.json({ error: "Failed to perform semantic search" }, { status: 500 })
  }
}
