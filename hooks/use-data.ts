import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import type { GamificationStats } from "@/lib/gamification/gamification-manager"

// Fetchers para SWR
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.")
    // @ts-ignore
    error.info = await res.json()
    // @ts-ignore
    error.status = res.status
    throw error
  }
  return res.json()
}

/**
 * Hook para buscar estatísticas de gamificação
 * @param revalidateOnFocus - Revalidar quando a janela ganha foco (padrão: true)
 */
export function useGamification(revalidateOnFocus = true) {
  const { data, error, isLoading, mutate } = useSWR<GamificationStats>(
    "/api/gamification/stats",
    fetcher,
    {
      revalidateOnFocus,
      revalidateOnReconnect: true,
      dedupingInterval: 2000, // Deduplicar requisições dentro de 2 segundos
    },
  )

  return {
    stats: data,
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook para buscar perfil do usuário
 */
export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR(
    "profile",
    async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return null

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      return profile
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    },
  )

  return {
    profile: data,
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook para buscar posts da comunidade
 */
export function useCommunityPosts(limit = 20) {
  const { data, error, isLoading, mutate } = useSWR(
    `community-posts-${limit}`,
    async () => {
      const supabase = createClient()
      const { data: posts, error } = await supabase
        .from("community_posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      return posts
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    },
  )

  return {
    posts: data,
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook para buscar entradas de diário
 */
export function useDiaryEntries(limit = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `diary-entries-${limit}`,
    async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return []

      const { data: entries, error } = await supabase
        .from("diary_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      return entries
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    },
  )

  return {
    entries: data,
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook para buscar análises de sentimento recentes
 */
export function useSentimentAnalysis(limit = 5) {
  const { data, error, isLoading, mutate } = useSWR(
    `sentiment-analysis-${limit}`,
    async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return []

      const { data: analyses, error } = await supabase
        .from("sentiment_analysis")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      return analyses
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    },
  )

  return {
    analyses: data,
    isLoading,
    isError: error,
    mutate,
  }
}

