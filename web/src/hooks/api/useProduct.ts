import { useQuery } from '@tanstack/react-query';

export interface ProductResponse {
  success: boolean;
  product: {
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
      email?: string;
      phone?: string;
    };
  };
}

export const useProduct = (productId: string) => {
  return useQuery<ProductResponse>({
    queryKey: ['product', productId],
    queryFn: async (): Promise<ProductResponse> => {
      const response = await fetch(`/api/products/${productId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      
      return response.json() as Promise<ProductResponse>;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
