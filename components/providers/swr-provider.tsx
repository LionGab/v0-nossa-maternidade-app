"use client"

import { SWRConfig } from "swr"
import { swrGlobalConfig } from "@/lib/swr-config"

/**
 * SWR Provider Global
 * Configura SWR para toda a aplicação com configurações otimizadas
 */
export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={swrGlobalConfig}>
      {children}
    </SWRConfig>
  )
}

