import { z } from 'zod';

// User Roles
export enum UserRole {
  CUSTOMER = 'customer',
  RETAILER = 'retailer',
  SUPER_ADMIN = 'super_admin'
}

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  image?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isRetailerApproved?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Auth Requests/Responses
export interface LoginRequest {
  email: string;
  password?: string;
  provider?: 'google' | 'email';
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  businessName?: string; // For retailers
  businessAddress?: string; // For retailers
}

export interface OTPRequest {
  email: string;
}

export interface OTPVerifyRequest {
  email: string;
  otp: string;
}

// Validation Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required').optional(),
  provider: z.enum(['google', 'email']).optional(),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole),
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
});

export const otpSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const otpVerifySchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export type LoginRequestType = z.infer<typeof loginSchema>;
export type RegisterRequestType = z.infer<typeof registerSchema>;
export type OTPRequestType = z.infer<typeof otpSchema>;
export type OTPVerifyRequestType = z.infer<typeof otpVerifySchema>;
