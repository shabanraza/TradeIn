import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, MobileAuthState } from '../types';
import { authService } from '../services/auth';

interface AuthContextType extends MobileAuthState {
  sendOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  loading: boolean;
  pendingEmail: string | null;
  setPendingEmail: (email: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<MobileAuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
  });
  const [loading, setLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      const { token, refreshToken, user } = await authService.getAuthData();
      
      if (token && user) {
        // Verify token is still valid
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setAuthState({
            isAuthenticated: true,
            user: currentUser,
            token,
            refreshToken,
          });
        } else {
          // Token is invalid, clear auth data
          await authService.clearAuthData();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      await authService.clearAuthData();
    } finally {
      setLoading(false);
    }
  };


  const sendOTP = async (email: string) => {
    try {
      console.log('📧 AuthContext - Sending OTP to:', email);
      setLoading(true);
      await authService.sendOTP({ email });
      console.log('✅ AuthContext - OTP sent successfully');
      // Store the email for OTP verification
      setPendingEmail(email);
    } catch (error) {
      console.error('❌ AuthContext - Send OTP error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setLoading(true);
      const result = await authService.verifyOTP({ email, otp });
      
      await authService.storeAuthData(result.token, result.refreshToken, result.user);
      
      setAuthState({
        isAuthenticated: true,
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken,
      });
      
      // Clear pending email after successful verification
      setPendingEmail(null);
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (email: string) => {
    try {
      setLoading(true);
      await authService.sendOTP({ email });
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        const { token, refreshToken } = await authService.getAuthData();
        setAuthState({
          isAuthenticated: true,
          user: currentUser,
          token,
          refreshToken,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          refreshToken: null,
        });
      }
    } catch (error) {
      console.error('Refresh auth error:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
      });
    }
  };

  const value: AuthContextType = {
    ...authState,
    sendOTP,
    verifyOTP,
    resendOTP,
    logout,
    refreshAuth,
    loading,
    pendingEmail,
    setPendingEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

