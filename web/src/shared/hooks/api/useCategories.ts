import { useQuery } from '@tanstack/react-query';

// API Configuration - can be overridden by platform-specific configs
const getApiBaseUrl = () => {
  // For web: use relative URLs or environment variables
  if (typeof globalThis !== 'undefined' && 'window' in globalThis) {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }
  // For mobile: use the mobile config
  return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
};

export interface ApiCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesResponse {
  success: boolean;
  categories: ApiCategory[];
}

export const useCategories = (baseURL?: string) => {
  const apiBaseUrl = baseURL || getApiBaseUrl();
  
  return useQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: async (): Promise<CategoriesResponse> => {
      const response = await fetch(`${apiBaseUrl}/api/categories`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      return response.json() as Promise<CategoriesResponse>;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
