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

export interface ApiProduct {
  id: string;
  name: string;
  title?: string;
  description?: string;
  price: string;
  originalPrice?: string;
  discountPrice?: string;
  discountPercentage?: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'broken';
  phoneType?: 'new' | 'used' | 'refurbished';
  categoryId: string;
  retailerId: string;
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    description?: string;
    image?: string;
  };
  retailer?: {
    id: string;
    name?: string;
    businessName?: string;
    location?: string;
  };
}

interface ProductsResponse {
  success: boolean;
  products: ApiProduct[];
}

export interface UseProductsOptions {
  categoryId?: string;
  sellerId?: string;
  search?: string;
  limit?: number;
}

export const useProducts = (options?: UseProductsOptions, baseURL?: string) => {
  const apiBaseUrl = baseURL || getApiBaseUrl();
  
  return useQuery<ProductsResponse>({
    queryKey: ['products', options],
    queryFn: async (): Promise<ProductsResponse> => {
      const params = new URLSearchParams();
      
      if (options?.categoryId) params.append('categoryId', options.categoryId);
      if (options?.sellerId) params.append('sellerId', options.sellerId);
      if (options?.search) params.append('search', options.search);
      if (options?.limit) params.append('limit', options.limit.toString());
      
      // Handle both absolute URLs (with domain) and relative URLs
      const basePath = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;
      const url = `${basePath}/products${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      return response.json() as Promise<ProductsResponse>;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
