// Admin API functions for TanStack Query

export interface AdminStats {
  users: {
    total: number
    customers: number
    retailers: number
    pendingRetailers: number
    activeRetailers: number
  }
  phoneDatabase: {
    brands: number
    models: number
    variants: number
  }
  leads: {
    total: number
    new: number
    contacted: number
    interested: number
    closed: number
    rejected: number
  }
}

export interface Retailer {
  id: string
  userId: string
  businessName: string
  businessAddress: string
  phone: string
  location: string
  isRetailerApproved: boolean
  createdAt: Date
  updatedAt: Date
  user?: {
    id: string
    name: string
    email: string
    phone: string
  }
}

export interface User {
  id: string
  email: string
  name: string
  emailVerified: boolean
  isRetailerApproved: boolean
  businessName?: string
  businessAddress?: string
  phone?: string
  location?: string
  role: 'customer' | 'retailer' | 'super_admin'
  createdAt: Date
  updatedAt: Date
}

// Fetch admin dashboard stats
export const fetchAdminStats = async (): Promise<AdminStats> => {
  const response = await fetch('/api/admin/stats')
  
  if (!response.ok) {
    throw new Error('Failed to fetch admin stats')
  }
  
  const data = await response.json()
  return data.stats
}

// Fetch all retailers
export const fetchRetailers = async (): Promise<Retailer[]> => {
  const response = await fetch('/api/admin/retailers')
  
  if (!response.ok) {
    throw new Error('Failed to fetch retailers')
  }
  
  const data = await response.json()
  return data.retailers || []
}

// Fetch retailer by ID
export const fetchRetailer = async (id: string): Promise<Retailer> => {
  const response = await fetch(`/api/admin/retailers/${id}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch retailer')
  }
  
  const data = await response.json()
  return data.retailer
}

// Update retailer approval status
export const updateRetailerApproval = async (id: string, approved: boolean): Promise<Retailer> => {
  const response = await fetch(`/api/admin/retailers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isRetailerApproved: approved }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update retailer approval')
  }
  
  const data = await response.json()
  return data.retailer
}

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('/api/admin/users')
  
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  
  const data = await response.json()
  return data.users || []
}

// Fetch users by role
export const fetchUsersByRole = async (role: string): Promise<User[]> => {
  const response = await fetch(`/api/admin/users?role=${role}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch users by role')
  }
  
  const data = await response.json()
  return data.users || []
}

// Update user role
export const updateUserRole = async (id: string, role: string): Promise<User> => {
  const response = await fetch(`/api/admin/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update user role')
  }
  
  const data = await response.json()
  return data.user
}
