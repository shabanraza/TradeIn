import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../query-client'
import { 
  fetchAuthSession, 
  signOutUser, 
  sendOTP, 
  verifyOTP,
  type AuthSession 
} from '../api/auth-api'

// Hook to get current auth session
export const useAuth = (baseURL: string = '') => {
  return useQuery({
    queryKey: queryKeys.auth,
    queryFn: () => fetchAuthSession(baseURL),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry auth failures
  })
}

// Hook to sign out user
export const useSignOut = (baseURL: string = '') => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => signOutUser(baseURL),
    onSuccess: () => {
      // Clear all queries and reset to initial state
      queryClient.clear()
    },
  })
}

// Hook to send OTP
export const useSendOTP = (baseURL: string = '') => {
  return useMutation({
    mutationFn: (email: string) => sendOTP(email, baseURL),
  })
}

// Hook to verify OTP
export const useVerifyOTP = (baseURL: string = '') => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) => 
      verifyOTP(email, otp, baseURL),
    onSuccess: () => {
      // Invalidate auth session to refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth })
    },
  })
}

// Hook to login user - TODO: Implement when loginUser is available
// export const useLogin = (baseURL: string = '') => {
//   const queryClient = useQueryClient()
//   
//   return useMutation({
//     mutationFn: ({ email, password }: { email: string; password?: string }) => 
//       loginUser(email, password, baseURL),
//     onSuccess: () => {
//       // Invalidate auth session to refetch user data
//       queryClient.invalidateQueries({ queryKey: queryKeys.auth })
//     },
//   })
// }

// Hook to register user - TODO: Implement when registerUser is available
// export const useRegister = (baseURL: string = '') => {
//   return useMutation({
//     mutationFn: (userData: {
//       email: string
//       name: string
//       role: 'customer' | 'retailer' | 'super_admin'
//       businessName?: string
//       businessAddress?: string
//     }) => registerUser(userData, baseURL),
//   })
// }
