import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../../config';

// Phone-specific data types
export interface PhoneBrand {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PhoneModel {
  id: string;
  name: string;
  brandId: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PhoneVariant {
  id: string;
  name: string;
  modelId: string;
  storage?: string;
  ram?: string;
  color?: string;
  price?: string;
  createdAt: string;
  updatedAt: string;
}

// Phone Brands Hook
export const usePhoneBrands = () => {
  return useQuery<PhoneBrand[]>({
    queryKey: ['phone-brands'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/admin/phone-brands`);
      if (!response.ok) {
        throw new Error('Failed to fetch phone brands');
      }
      const data = await response.json();
      return data.brands || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Phone Models Hook
export const usePhoneModels = (brandId?: string) => {
  return useQuery<PhoneModel[]>({
    queryKey: ['phone-models', brandId],
    queryFn: async () => {
      if (!brandId) return [];
      
      const response = await fetch(`${API_BASE_URL}/api/admin/phone-models?brandId=${brandId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch phone models');
      }
      const data = await response.json();
      return data.models || [];
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

// Phone Variants Hook
export const usePhoneVariants = (modelId?: string) => {
  return useQuery<PhoneVariant[]>({
    queryKey: ['phone-variants', modelId],
    queryFn: async () => {
      if (!modelId) return [];
      
      const response = await fetch(`${API_BASE_URL}/api/admin/phone-variants?modelId=${modelId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch phone variants');
      }
      const data = await response.json();
      return data.variants || [];
    },
    enabled: !!modelId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
