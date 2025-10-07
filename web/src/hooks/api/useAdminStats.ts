import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { fetchAdminStats } from '@/lib/api/admin-api'

// Hook to fetch admin dashboard stats
export const useAdminStats = () => {
  return useQuery({
    queryKey: queryKeys.adminStats,
    queryFn: fetchAdminStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

