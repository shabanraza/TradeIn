import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../query-client'
import { 
  fetchPhoneBrands, 
  createPhoneBrand, 
  updatePhoneBrand, 
  deletePhoneBrand,
  type PhoneBrand 
} from '../api/phone-api'

// Hook to fetch all phone brands
export const usePhoneBrands = (baseURL: string = '') => {
  return useQuery({
    queryKey: queryKeys.phoneBrands,
    queryFn: () => fetchPhoneBrands(baseURL),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook to create a phone brand
export const useCreatePhoneBrand = (baseURL: string = '') => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (brandData: {
      name: string
      description?: string
      icon?: string
    }) => createPhoneBrand(brandData, baseURL),
    onSuccess: () => {
      // Invalidate and refetch phone brands
      queryClient.invalidateQueries({ queryKey: queryKeys.phoneBrands })
    },
  })
}

// Hook to update a phone brand
export const useUpdatePhoneBrand = (baseURL: string = '') => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (brandData: {
      id: string
      name: string
      description?: string
      icon?: string
    }) => updatePhoneBrand(brandData, baseURL),
    onSuccess: () => {
      // Invalidate and refetch phone brands
      queryClient.invalidateQueries({ queryKey: queryKeys.phoneBrands })
    },
  })
}

// Hook to delete a phone brand
export const useDeletePhoneBrand = (baseURL: string = '') => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => deletePhoneBrand(id, baseURL),
    onSuccess: () => {
      // Invalidate and refetch phone brands
      queryClient.invalidateQueries({ queryKey: queryKeys.phoneBrands })
    },
  })
}
