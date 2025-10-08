import { useProducts as useSharedProducts, UseProductsOptions, ApiProduct } from '@/shared/hooks/api/useProducts';

// Re-export types for convenience
export type { ApiProduct as Product, UseProductsOptions };

// Web-specific wrapper for products hook
export const useProducts = (options?: UseProductsOptions) => {
  // For web, use relative URLs for API calls
  const baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';
  
  return useSharedProducts(options, baseURL);
};
