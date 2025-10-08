import { useProducts as useSharedProducts, UseProductsOptions, ApiProduct } from '@/shared/hooks/api/useProducts';

// Re-export types for convenience
export type { ApiProduct as Product, UseProductsOptions };

// Web-specific wrapper for products hook
export const useProducts = (options?: UseProductsOptions) => {
  // For web, we can use relative URLs or environment variables
  const baseURL = process.env.NEXT_PUBLIC_API_URL || '';
  
  return useSharedProducts(options, baseURL);
};
