/**
 * TanStack Query (React Query) Client Configuration
 * 
 * Provides centralized configuration for data fetching, caching, and synchronization.
 * TanStack Query replaces SWR for more powerful features and better TypeScript support.
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';

/**
 * Default configuration for all queries
 */
const queryConfig: DefaultOptions = {
  queries: {
    // Retry failed requests
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Stale time - how long data is considered fresh (5 minutes)
    staleTime: 5 * 60 * 1000,
    
    // Cache time - how long inactive data stays in cache (10 minutes)
    gcTime: 10 * 60 * 1000,
    
    // Refetch on window focus in production only
    refetchOnWindowFocus: process.env.NODE_ENV === 'production',
    
    // Refetch on reconnect
    refetchOnReconnect: true,
    
    // Refetch on mount if data is stale
    refetchOnMount: true,
  },
  mutations: {
    // Retry mutations once
    retry: 1,
    
    // Network mode
    networkMode: 'online',
  },
};

/**
 * Create a new QueryClient instance
 * 
 * This should be created once per request on the server,
 * and once per application on the client.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
}

/**
 * Client-side query client (singleton)
 */
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a new query client
    return makeQueryClient();
  } else {
    // Browser: create query client if it doesn't exist
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}
