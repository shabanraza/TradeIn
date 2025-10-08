import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { 
  fetchRetailers, 
  fetchRetailer, 
  updateRetailerApproval
} from '@/lib/api/admin-api'

// Hook to fetch all retailers
export const useRetailers = () => {
  return useQuery({
    queryKey: queryKeys.retailers,
    queryFn: fetchRetailers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch retailer by ID
export const useRetailer = (id: string) => {
  return useQuery({
    queryKey: [...queryKeys.retailers, id],
    queryFn: () => fetchRetailer(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to update retailer approval status
export const useUpdateRetailerApproval = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) => 
      updateRetailerApproval(id, approved),
    onSuccess: (updatedRetailer) => {
      // Invalidate retailers queries
      queryClient.invalidateQueries({ queryKey: queryKeys.retailers })
      
      // Update the specific retailer in cache
      queryClient.setQueryData(
        [...queryKeys.retailers, updatedRetailer.id],
        updatedRetailer
      )
    },
  })
}

