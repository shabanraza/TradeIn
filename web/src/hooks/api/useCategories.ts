import { useCategories as useSharedCategories, Category } from '@oldsellerapp/shared';

// Re-export types for convenience
export type { Category };

// Web-specific wrapper for categories hook
export const useCategories = () => {
  // For web, we can use relative URLs or environment variables
  const baseURL = process.env.NEXT_PUBLIC_API_URL || '';
  
  return useSharedCategories(baseURL);
};
