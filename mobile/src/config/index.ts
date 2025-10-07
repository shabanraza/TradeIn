// API Configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// App Configuration
export const APP_CONFIG = {
  name: 'SellerApp Mobile',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
};

// Authentication Configuration
export const AUTH_CONFIG = {
  tokenKey: 'access_token',
  refreshTokenKey: 'refresh_token',
  userKey: 'user_data',
};

// Google OAuth Configuration
export const GOOGLE_CONFIG = {
  clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id',
  scopes: ['openid', 'profile', 'email'],
};

// Navigation Configuration
export const NAVIGATION_CONFIG = {
  animationDuration: 300,
  headerHeight: 60,
  tabBarHeight: 60,
};

// Theme Configuration
export const THEME_CONFIG = {
  primaryColor: '#3B82F6',
  secondaryColor: '#1E40AF',
  accentColor: '#F59E0B',
  backgroundColor: '#FFFFFF',
  surfaceColor: '#F8FAFC',
  textColor: '#1F2937',
  textSecondaryColor: '#6B7280',
  borderColor: '#E5E7EB',
  errorColor: '#EF4444',
  successColor: '#10B981',
  warningColor: '#F59E0B',
};

