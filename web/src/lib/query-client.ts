// Re-export shared query client and keys
import { createQueryClient, queryKeys } from '@oldsellerapp/shared'

export const queryClient = createQueryClient()
export { queryKeys }

