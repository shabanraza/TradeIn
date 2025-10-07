import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../query-client'
import { fetchPhoneVariants } from '../api/phone-api'

// Hook to fetch phone variants by model ID
export const usePhoneVariants = (modelId: string, baseURL: string = '') => {
  return useQuery({
    queryKey: queryKeys.phoneVariants(modelId),
    queryFn: () => fetchPhoneVariants(modelId, baseURL),
    enabled: !!modelId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
