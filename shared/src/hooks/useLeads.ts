import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../query-client'
import { 
  fetchLeads, 
  fetchLead, 
  createLead, 
  updateLead, 
  deleteLead,
  type Lead,
  type CreateLeadData,
  type UpdateLeadData 
} from '../api/leads-api'

// Hook to fetch all leads
export const useLeads = (params?: { 
  retailerId?: string; 
  status?: string; 
  customerId?: string 
}, baseURL: string = '') => {
  return useQuery({
    queryKey: [...queryKeys.leads, params],
    queryFn: () => fetchLeads(params, baseURL),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Hook to fetch leads by retailer
export const useLeadsByRetailer = (retailerId: string, baseURL: string = '') => {
  return useQuery({
    queryKey: queryKeys.leadsByRetailer(retailerId),
    queryFn: () => fetchLeads({ retailerId }, baseURL),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Hook to fetch leads by status
export const useLeadsByStatus = (status: string, baseURL: string = '') => {
  return useQuery({
    queryKey: queryKeys.leadsByStatus(status),
    queryFn: () => fetchLeads({ status }, baseURL),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Hook to fetch a single lead
export const useLead = (id: string, baseURL: string = '') => {
  return useQuery({
    queryKey: [...queryKeys.leads, id],
    queryFn: () => fetchLead(id, baseURL),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to create a lead
export const useCreateLead = (baseURL: string = '') => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (leadData: CreateLeadData) => createLead(leadData, baseURL),
    onSuccess: () => {
      // Invalidate all leads queries
      queryClient.invalidateQueries({ queryKey: queryKeys.leads })
    },
  })
}

// Hook to update a lead
export const useUpdateLead = (baseURL: string = '') => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadData }) => 
      updateLead(id, data, baseURL),
    onSuccess: (updatedLead) => {
      // Invalidate all leads queries
      queryClient.invalidateQueries({ queryKey: queryKeys.leads })
      
      // Update the specific lead in cache
      queryClient.setQueryData(
        [...queryKeys.leads, updatedLead.id],
        updatedLead
      )
    },
  })
}

// Hook to delete a lead
export const useDeleteLead = (baseURL: string = '') => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => deleteLead(id, baseURL),
    onSuccess: () => {
      // Invalidate all leads queries
      queryClient.invalidateQueries({ queryKey: queryKeys.leads })
    },
  })
}
