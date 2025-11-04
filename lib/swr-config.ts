/**
 * Configuração Global do SWR
 * Centraliza configurações de revalidação e cache para melhor performance
 */

import { SWRConfiguration } from "swr"

/**
 * Configuração global padrão para SWR
 * - revalidateOnFocus: false - Evita re-fetch quando a janela ganha foco
 * - dedupingInterval: 60000 - Deduplica requisições dentro de 1 minuto
 * - revalidateOnReconnect: true - Revalida quando internet reconecta
 */
export const swrGlobalConfig: SWRConfiguration = {
  revalidateOnFocus: false, // Não revalidar ao focar na janela (melhora performance)
  revalidateOnReconnect: true, // Revalidar quando internet reconecta
  dedupingInterval: 60000, // 1 minuto - deduplica requisições idênticas
  refreshInterval: 0, // Não fazer polling automático
  shouldRetryOnError: true, // Tentar novamente em caso de erro
  errorRetryCount: 3, // Máximo 3 tentativas
  errorRetryInterval: 5000, // Esperar 5s entre tentativas
  focusThrottleInterval: 60000, // Throttle de 1 minuto para focus events
}

/**
 * Configuração para dados que raramente mudam (perfil, configurações)
 */
export const swrStaleConfig: SWRConfiguration = {
  ...swrGlobalConfig,
  revalidateIfStale: false, // Não revalidar se dados estão "stale"
  dedupingInterval: 300000, // 5 minutos - cache mais longo
}

/**
 * Configuração para dados em tempo real (chat, notificações)
 */
export const swrRealtimeConfig: SWRConfiguration = {
  ...swrGlobalConfig,
  revalidateOnFocus: true, // Revalidar ao focar (para dados em tempo real)
  dedupingInterval: 5000, // 5 segundos - cache mais curto
  refreshInterval: 30000, // Polling a cada 30s (opcional)
}

