// User types
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