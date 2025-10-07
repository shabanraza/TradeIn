import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Lead {
  id: string;
  customerId: string;
  retailerId?: string;
  phoneBrand: string;
  phoneModel: string;
  phoneVariant?: string;
  condition: string;
  storage?: string;
  color?: string;
  purchaseDate?: string;
  warrantyStatus?: string;
  accessories?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerLocation: string;
  preferredContactMethod?: string;
  preferredContactTime?: string;
  estimatedValue?: number;
  status: string;
  notes?: string;
  retailerNotes?: string;
  // Mobile form fields (optional)
  phoneAge?: string;
  modelName?: string;
  hasBill?: boolean;
  billImage?: string;
  hasBox?: boolean;
  screenReplacement?: string;
  battery?: string;
  batteryPercentage?: string;
  phoneImages?: string[];
  city?: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadsResponse {
  success: boolean;
  leads: Lead[];
}

interface CreateLeadRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface UseLeadsOptions {
  customerId?: string;
}

export const useLeads = (options?: UseLeadsOptions) => {
  return useQuery<LeadsResponse>({
    queryKey: ['leads', options?.customerId],
    queryFn: async () => {
      const url = options?.customerId 
        ? `/api/leads?customerId=${options.customerId}`
        : '/api/leads';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      return response.json();
    },
    enabled: !options?.customerId || !!options.customerId, // Only run if customerId is provided or not required
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (leadData: CreateLeadRequest) => {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create lead');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Lead['status'] }) => {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update lead status');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};
