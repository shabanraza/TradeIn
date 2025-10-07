// Auth API functions for TanStack Query

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

export interface AuthSession {
  user: User | null
  isAuthenticated: boolean
}

// Get current user session
export const fetchAuthSession = async (): Promise<AuthSession> => {
  const response = await fetch('/api/auth/session')
  
  if (!response.ok) {
    throw new Error('Failed to fetch auth session')
  }
  
  const data = await response.json()
  return data
}

// Sign out user
export const signOutUser = async (): Promise<void> => {
  const response = await fetch('/api/auth/signout', {
    method: 'POST',
  })
  
  if (!response.ok) {
    throw new Error('Failed to sign out')
  }
}

// Send OTP to email
export const sendOTP = async (email: string): Promise<{ message: string }> => {
  const response = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to send OTP')
  }
  
  const data = await response.json()
  return data
}

// Verify OTP
export const verifyOTP = async (email: string, otp: string): Promise<AuthSession> => {
  const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to verify OTP')
  }
  
  const data = await response.json()
  return data
}

