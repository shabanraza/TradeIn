  import { useCategories as useSharedCategories, type ApiCategory } from '@/shared/hooks/api/useCategories';

export type { ApiCategory };

// Web-specific wrapper for categories hook
export const useCategories = (baseURL?: string) => {
  return useSharedCategories(baseURL);
};
