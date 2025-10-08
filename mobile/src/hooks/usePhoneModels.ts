import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../query-client'
import { fetchPhoneModels } from '../api/phone-api'

// Hook to fetch phone models by brand ID
export const usePhoneModels = (brandId: string, baseURL: string = '') => {
  return useQuery({
    queryKey: queryKeys.phoneModels(brandId),
    queryFn: () => fetchPhoneModels(brandId, baseURL),
    enabled: !!brandId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
