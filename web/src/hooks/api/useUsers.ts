import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { 
  fetchUsers, 
  fetchUsersByRole, 
  updateUserRole,
  type User 
} from '@/lib/api/admin-api'

// Hook to fetch all users
export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch users by role
export const useUsersByRole = (role: string) => {
  return useQuery({
    queryKey: [...queryKeys.users, 'role', role],
    queryFn: () => fetchUsersByRole(role),
    enabled: !!role,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to update user role
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => 
      updateUserRole(id, role),
    onSuccess: (updatedUser) => {
      // Invalidate users queries
      queryClient.invalidateQueries({ queryKey: queryKeys.users })
      
      // Update the specific user in cache
      queryClient.setQueryData(
        [...queryKeys.users, updatedUser.id],
        updatedUser
      )
    },
  })
}

