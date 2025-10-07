import * as SecureStore from 'expo-secure-store';
import { AuthUser } from '../types';
import { API_BASE_URL } from '../config';
import { 
  fetchAuthSession, 
  signOutUser, 
  sendOTP, 
  verifyOTP
} from '@oldsellerapp/shared';
import { UserRole } from '../../../shared/src/types/auth';
import { mockAuthService } from './mock-auth';

const AUTH_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

export class AuthService {
  private static instance: AuthService;
  private baseURL = API_BASE_URL;
  private useMockAuth = true; // Set to true for mock authentication

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Store authentication data securely
  async storeAuthData(token: string, refreshToken: string, user: AuthUser): Promise<void> {
    try {
      await SecureStore.setItemAsync(AUTH_KEYS.ACCESS_TOKEN, token);
      await SecureStore.setItemAsync(AUTH_KEYS.REFRESH_TOKEN, refreshToken);
      await SecureStore.setItemAsync(AUTH_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  // Retrieve authentication data
  async getAuthData(): Promise<{
    token: string | null;
    refreshToken: string | null;
    user: AuthUser | null;
  }> {
    try {
      const [token, refreshToken, userData] = await Promise.all([
        SecureStore.getItemAsync(AUTH_KEYS.ACCESS_TOKEN),
        SecureStore.getItemAsync(AUTH_KEYS.REFRESH_TOKEN),
        SecureStore.getItemAsync(AUTH_KEYS.USER_DATA),
      ]);

      return {
        token,
        refreshToken,
        user: userData ? JSON.parse(userData) : null,
      };
    } catch (error) {
      console.error('Error retrieving auth data:', error);
      return { token: null, refreshToken: null, user: null };
    }
  }

  // Clear authentication data
  async clearAuthData(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(AUTH_KEYS.ACCESS_TOKEN),
        SecureStore.deleteItemAsync(AUTH_KEYS.REFRESH_TOKEN),
        SecureStore.deleteItemAsync(AUTH_KEYS.USER_DATA),
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }


  // Send OTP using shared API
  async sendOTP(data: { email: string }): Promise<{ message: string }> {
    try {
      if (this.useMockAuth) {
        console.log('🔧 Using mock authentication for development');
        return await mockAuthService.sendOTP(data.email);
      }

      const result = await sendOTP(data.email, this.baseURL);
      return result;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }

  // Verify OTP using shared API
  async verifyOTP(data: { email: string; otp: string }): Promise<{ user: AuthUser; token: string; refreshToken: string }> {
    try {
      const result = await verifyOTP(data.email, data.otp, this.baseURL);
      // Convert AuthSession to the expected format
      if (!result.user) {
        throw new Error('OTP verification failed - no user data received');
      }
      
      // For now, we'll use mock tokens since the shared API doesn't return them
      // In a real implementation, these would come from the API response
      const mockToken = 'mock_access_token_' + Date.now();
      const mockRefreshToken = 'mock_refresh_token_' + Date.now();
      
      return {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          phone: result.user.phone,
          image: result.user.image,
          role: result.user.role,
          isEmailVerified: result.user.emailVerified,
          isRetailerApproved: result.user.isRetailerApproved,
          createdAt: result.user.createdAt,
          updatedAt: result.user.updatedAt
        } as AuthUser,
        token: mockToken,
        refreshToken: mockRefreshToken
      };
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  }

  // Refresh token
  async refreshToken(): Promise<{ token: string; refreshToken: string }> {
    try {
      const { refreshToken } = await this.getAuthData();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Token refresh failed');
      }

      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // Logout using shared API
  async logout(): Promise<void> {
    try {
      const { token } = await this.getAuthData();
      
      if (token) {
        await signOutUser(this.baseURL);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.clearAuthData();
    }
  }

  // Get current user using shared API
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { token, user } = await this.getAuthData();
      
      if (!token || !user) {
        return null;
      }

      // Verify token is still valid by making a request
      const session = await fetchAuthSession(this.baseURL);
      
      if (!session.isAuthenticated) {
        await this.clearAuthData();
        return null;
      }

      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      await this.clearAuthData();
      return null;
    }
  }
}

export const authService = AuthService.getInstance();
