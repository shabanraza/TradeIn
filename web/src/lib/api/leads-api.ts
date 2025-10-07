// Leads API functions for TanStack Query

export interface Lead {
  id: string
  customerId: string
  retailerId: string | null
  phoneBrandId: string
  phoneModelId: string
  phoneVariantId: string
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  estimatedValue: number | null
  finalValue: number | null
  notes: string | null
  // Mobile form fields
  phoneAge?: string
  modelName?: string
  hasBill?: boolean
  billImage?: string
  hasBox?: boolean
  screenReplacement?: string
  battery?: string
  batteryPercentage?: string
  phoneImages?: string[]
  city?: string
  createdAt: Date
  updatedAt: Date
  // Relations
  phoneBrand?: {
    id: string
    name: string
    icon: string
  }
  phoneModel?: {
    id: string
    name: string
    image: string
  }
  phoneVariant?: {
    id: string
    name: string
    storage: string
    color: string
    price: number | null
  }
  customer?: {
    id: string
    name: string
    email: string
    phone: string
  }
  retailer?: {
    id: string
    businessName: string
    businessAddress: string
    phone: string
  }
}

export interface CreateLeadData {
  customerId: string
  phoneBrand: string
  phoneModel: string
  modelName?: string
  phoneAge?: string
  hasBill?: boolean
  billImage?: string
  hasBox?: boolean
  screenReplacement?: string
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  battery?: string
  batteryPercentage?: string
  phoneImages?: string[]
  customerName: string
  customerPhone: string
  customerLocation: string
  city?: string
  preferredContactMethod?: string
  status?: string
  // Optional fields for backward compatibility
  phoneBrandId?: string
  phoneModelId?: string
  phoneVariantId?: string
  customerEmail?: string
  customerAddress?: string
}

export interface UpdateLeadData {
  status?: 'pending' | 'approved' | 'rejected' | 'completed'
  estimatedValue?: number
  finalValue?: number
  notes?: string
}

// Fetch all leads
export const fetchLeads = async (params?: {
  retailerId?: string
  status?: string
  customerId?: string
}): Promise<Lead[]> => {
  const searchParams = new URLSearchParams()
  if (params?.retailerId) searchParams.append('retailerId', params.retailerId)
  if (params?.status) searchParams.append('status', params.status)
  if (params?.customerId) searchParams.append('customerId', params.customerId)
  
  const url = `/api/leads${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error('Failed to fetch leads')
  }
  
  const data = await response.json()
  return data.leads || []
}

// Fetch lead by ID
export const fetchLead = async (id: string): Promise<Lead> => {
  const response = await fetch(`/api/leads/${id}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch lead')
  }
  
  const data = await response.json()
  return data.lead
}

// Create a new lead
export const createLead = async (leadData: CreateLeadData): Promise<any> => {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leadData),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create lead')
  }
  
  const data = await response.json()
  return data.lead || data
}

// Update a lead
export const updateLead = async (id: string, leadData: UpdateLeadData): Promise<Lead> => {
  const response = await fetch(`/api/leads/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leadData),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update lead')
  }
  
  const data = await response.json()
  return data.lead
}

// Delete a lead
export const deleteLead = async (id: string): Promise<void> => {
  const response = await fetch(`/api/leads/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete lead')
  }
}
