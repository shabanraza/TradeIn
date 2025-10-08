import { QueryClient } from '@tanstack/react-query'

export const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes - shorter for better UX
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'status' in error && typeof error.status === 'number') {
          if (error.status >= 400 && error.status < 500) {
            return false
          }
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      refetchOnWindowFocus: true, // Refetch when window gains focus (web only)
      refetchOnMount: true,
      refetchOnReconnect: true, // Refetch when network reconnects
    },
    mutations: {
      retry: false,
    },
  },
})

// Query keys factory for consistent key management
export const queryKeys = {
  phoneBrands: ['phone-brands'] as const,
  phoneModels: (brandId?: string) => ['phone-models', brandId] as const,
  phoneVariants: (modelId?: string) => ['phone-variants', modelId] as const,
  leads: ['leads'] as const,
  leadsByRetailer: (retailerId: string) => ['leads', 'retailer', retailerId] as const,
  leadsByStatus: (status: string) => ['leads', 'status', status] as const,
  auth: ['auth'] as const,
  adminStats: ['admin-stats'] as const,
  retailers: ['retailers'] as const,
  users: ['users'] as const,
} as const
