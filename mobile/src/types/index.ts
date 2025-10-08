// Re-export shared types from the workspace
export * from '../../../shared/src/types';

// Mobile-specific types
export interface MobileAuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
}

export interface MobileNavigationParams {
  Auth: undefined;
  Main: undefined;
  Home: undefined;
  Products: undefined;
  Profile: undefined;
  Sell: undefined;
}

// Mobile-specific API types
export interface MobileApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Mobile navigation types
export type RootStackParamList = {
  Landing: undefined;
  Auth: undefined | {
    screen: 'VerifyOTP';
    params: { email: string };
  };
  Main: undefined;
  AddProduct: undefined;
  SellForm: undefined;
};

export type AuthStackParamList = {
  VerifyOTP: { email: string };
};

export type MainTabParamList = {
  Sell: undefined;
  Dashboard: undefined;
  Products: undefined;
  Profile: undefined;
};

export type ProductsStackParamList = {
  ProductsList: undefined;
  ProductListing: {
    categoryId?: string;
    categoryName?: string;
    filterType?: 'old' | 'refurbished' | 'new';
  };
  ProductDetails: {
    product: any;
  };
};

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'customer' | 'retailer' | 'admin';

// Product types
export interface Product {
  id: string;
  retailerId: string;
  categoryId: string;
  title: string;
  description: string;
  brand: string;
  model: string;
  condition: ProductCondition;
  price: number;
  originalPrice?: number;
  isAvailable: boolean;
  location: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCondition = 'new' | 'like_new' | 'good' | 'fair' | 'poor';

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  createdAt: Date;
}

// Order types
export interface Order {
  id: string;
  customerId: string;
  productId: string;
  status: OrderStatus;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

// Review types
export interface Review {
  id: string;
  customerId: string;
  retailerId: string;
  productId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Export additional types
export * from './auth'
export * from './database'

