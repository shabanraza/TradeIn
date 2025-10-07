import { useProducts as useSharedProducts, UseProductsOptions, Product } from '@oldsellerapp/shared';

// Re-export types for convenience
export type { Product, UseProductsOptions };

// Web-specific wrapper for products hook
export const useProducts = (options?: UseProductsOptions) => {
  // For web, we can use relative URLs or environment variables
  const baseURL = process.env.NEXT_PUBLIC_API_URL || '';
  
  return useSharedProducts(options, baseURL);
};
