// Shared Auth API functions for both web and mobile

export interface ApiAuthUser {
  id: string
  email: string
  name: string
  phone?: string
  image?: string
  emailVerified: boolean
  isRetailerApproved: boolean
  businessName?: string
  businessAddress?: string
  location?: string
  role: 'customer' | 'retailer' | 'super_admin'
  createdAt: Date
  updatedAt: Date
}

export interface AuthSession {
  user: ApiAuthUser | null
  isAuthenticated: boolean
}

// Get current user session
export const fetchAuthSession = async (baseURL: string = ''): Promise<AuthSession> => {
  const response = await fetch(`${baseURL}/api/auth/session`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch auth session')
  }
  
  const data = await response.json() as AuthSession
  return data
}

// Sign out user
export const signOutUser = async (baseURL: string = ''): Promise<void> => {
  const response = await fetch(`${baseURL}/api/auth/signout`, {
    method: 'POST',
  })
  
  if (!response.ok) {
    throw new Error('Failed to sign out')
  }
}

// Send OTP to email
export const sendOTP = async (email: string, baseURL: string = ''): Promise<{ message: string }> => {
  const response = await fetch(`${baseURL}/api/auth/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
  
  if (!response.ok) {
    const error = await response.json() as { error?: string }
    throw new Error(error.error || 'Failed to send OTP')
  }
  
  const data = await response.json() as { message: string }
  return data
}

// Verify OTP
export const verifyOTP = async (email: string, otp: string, baseURL: string = ''): Promise<AuthSession> => {
  const response = await fetch(`${baseURL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  })
  
  if (!response.ok) {
    const error = await response.json() as { error?: string }
    throw new Error(error.error || 'Failed to verify OTP')
  }
  
  const data = await response.json() as AuthSession
  return data
}

