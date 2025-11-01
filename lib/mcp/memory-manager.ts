import { createClient } from "@supabase/supabase-js"
import { embed } from "ai"
import { openai } from "@ai-sdk/openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface MemoryEntry {
  id: string
  contentText: string
  contentType: string
  metadata: any
  similarity: number
  createdAt: string
}

export class MemoryManager {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  // Store a new memory with embedding
  async storeMemory(
    contentText: string,
    contentType: "conversation" | "diary" | "post" | "onboarding",
    contentId?: string,
    metadata: any = {},
  ) {
    try {
      // Generate embedding
      const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: contentText,
      })

      // Store in database
      const { data, error } = await supabase
        .from("memory_embeddings")
        .insert({
          user_id: this.userId,
          content_type: contentType,
          content_id: contentId,
          content_text: contentText,
          embedding: embedding,
          metadata: metadata,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("MemoryManager: Error storing memory", error)
      throw error
    }
  }

  // Search similar memories using semantic search
  async searchMemories(query: string, limit = 10, threshold = 0.7): Promise<MemoryEntry[]> {
    try {
      // Generate embedding for query
      const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: query,
      })

      // Search similar memories
      const { data, error } = await supabase.rpc("search_similar_memories", {
        query_embedding: embedding,
        match_user_id: this.userId,
        match_threshold: threshold,
        match_count: limit,
      })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("MemoryManager: Error searching memories", error)
      return []
    }
  }

  // Get memories from a specific time range (e.g., 80 days ago)
  async getMemoriesFromPeriod(daysAgo: number, limit = 50): Promise<MemoryEntry[]> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - daysAgo)

      const { data, error } = await supabase
        .from("memory_embeddings")
        .select("*")
        .eq("user_id", this.userId)
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("MemoryManager: Error getting period memories", error)
      return []
    }
  }

  // Get comprehensive context for AI (combines recent + relevant memories)
  async getComprehensiveContext(currentQuery: string, daysBack = 90): Promise<string> {
    try {
      // Get recent memories (last 7 days)
      const recentMemories = await this.getMemoriesFromPeriod(7, 10)

      // Search semantically relevant memories from entire history
      const relevantMemories = await this.searchMemories(currentQuery, 15, 0.75)

      // Get summarized context for longer periods
      const { data: contextSummaries } = await supabase
        .from("ai_memory_context")
        .select("*")
        .eq("user_id", this.userId)
        .gte("start_date", new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString())
        .order("start_date", { ascending: false })

      // Build comprehensive context
      let context = "=== CONTEXTO HISTÓRICO DA USUÁRIA ===\n\n"

      if (contextSummaries && contextSummaries.length > 0) {
        context += "## Resumos de Períodos Anteriores:\n"
        contextSummaries.forEach((summary: any) => {
          context += `\n### ${summary.start_date} a ${summary.end_date}:\n${summary.summary}\n`
          if (summary.key_events) {
            context += `Eventos importantes: ${JSON.stringify(summary.key_events)}\n`
          }
        })
      }

      if (recentMemories.length > 0) {
        context += "\n## Memórias Recentes (últimos 7 dias):\n"
        recentMemories.forEach((memory: any) => {
          context += `- [${memory.created_at}] ${memory.content_text}\n`
        })
      }

      if (relevantMemories.length > 0) {
        context += "\n## Memórias Relevantes ao Contexto Atual:\n"
        relevantMemories.forEach((memory: MemoryEntry) => {
          context += `- [${memory.createdAt}] (relevância: ${(memory.similarity * 100).toFixed(0)}%) ${memory.contentText}\n`
        })
      }

      return context
    } catch (error) {
      console.error("MemoryManager: Error getting comprehensive context", error)
      return ""
    }
  }

  // Generate periodic summaries (run this weekly/monthly)
  async generatePeriodSummary(startDate: Date, endDate: Date) {
    try {
      // Get all memories from period
      const { data: memories } = await supabase
        .from("memory_embeddings")
        .select("*")
        .eq("user_id", this.userId)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())

      if (!memories || memories.length === 0) return null

      // Combine all content
      const allContent = memories.map((m: any) => m.content_text).join("\n\n")

      // Generate summary using AI (implement this based on your AI setup)
      // This is a placeholder - you'll implement the actual summarization
      const summary = await this.summarizeContent(allContent)

      // Store summary
      const { data, error } = await supabase
        .from("ai_memory_context")
        .insert({
          user_id: this.userId,
          time_period: "custom",
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
          summary: summary,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("MemoryManager: Error generating period summary", error)
      throw error
    }
  }

  private async summarizeContent(content: string): Promise<string> {
    // Implement AI summarization here
    // This is a placeholder
    return content.substring(0, 500) + "..."
  }
}
