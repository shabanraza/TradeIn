// Re-export shared query client and keys
import { createQueryClient, queryKeys } from '../shared/query-client'

export const queryClient = createQueryClient()
export { queryKeys }

