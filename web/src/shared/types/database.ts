import { UserRole } from './auth';

// Database Schema Types (matching Drizzle schema)

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isRetailerApproved?: boolean;
  businessName?: string;
  businessAddress?: string;
  phone?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  brand: string;
  model: string;
  condition: ProductCondition;
  price: number;
  currency: string;
  images: string[];
  specifications: Record<string, string | number | boolean>;
  isAvailable: boolean;
  retailerId: string;
  categoryId: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  customerId: string;
  retailerId: string;
  productId: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  shippingAddress?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  orderId: string;
  customerId: string;
  retailerId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  productId?: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OTPCode {
  id: string;
  email: string;
  code: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}

// Enums
export enum ProductCondition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  BROKEN = 'broken'
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

// Relations
export interface UserWithProfile extends User {
  products?: Product[];
  orders?: Order[];
  reviews?: Review[];
  sentMessages?: Message[];
  receivedMessages?: Message[];
}

export interface ProductWithDetails extends Product {
  retailer: User;
  category: Category;
  orders?: Order[];
  reviews?: Review[];
}

export interface OrderWithDetails extends Order {
  customer: User;
  retailer: User;
  product: Product;
  review?: Review;
}
