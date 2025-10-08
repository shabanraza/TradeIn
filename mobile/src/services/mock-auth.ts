// Mock Authentication Service for Development
import { AuthUser } from '../types';
import { UserRole } from '../types/auth';

export interface MockAuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export interface MockRegisterResponse {
  message: string;
}

export interface MockOTPResponse {
  message: string;
}

// Mock user data
const mockUsers: AuthUser[] = [
  {
    id: '1',
    email: 'customer@example.com',
    name: 'John Customer',
    phone: '9876543210',
    role: UserRole.CUSTOMER,
    isEmailVerified: true,
    isRetailerApproved: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'retailer@example.com',
    name: 'Jane Retailer',
    phone: '9876543211',
    role: UserRole.RETAILER,
    isEmailVerified: true,
    isRetailerApproved: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock authentication service
export class MockAuthService {
  private static instance: MockAuthService;
  private otpStore: Map<string, string> = new Map();

  static getInstance(): MockAuthService {
    if (!MockAuthService.instance) {
      MockAuthService.instance = new MockAuthService();
    }
    return MockAuthService.instance;
  }

  // Mock login with email OTP
  async login(email: string): Promise<MockAuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email);
        if (!user) {
          reject(new Error('User not found'));
          return;
        }

        // Generate mock tokens
        const token = `mock_token_${Date.now()}_${user.id}`;
        const refreshToken = `mock_refresh_${Date.now()}_${user.id}`;

        resolve({
          user,
          token,
          refreshToken,
        });
      }, 1000); // Simulate network delay
    });
  }

  // Mock registration
  async register(userData: {
    email: string;
    name: string;
    phone?: string;
    role: UserRole;
    businessName?: string;
    businessAddress?: string;
  }): Promise<MockRegisterResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = mockUsers.find(u => u.email === userData.email);
        if (existingUser) {
          reject(new Error('User already exists'));
          return;
        }

        // Create new user
        const newUser: AuthUser = {
          id: (mockUsers.length + 1).toString(),
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          role: userData.role,
          isEmailVerified: false,
          isRetailerApproved: userData.role === UserRole.RETAILER,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockUsers.push(newUser);
        resolve({ message: 'User registered successfully' });
      }, 1000);
    });
  }

  // Mock send OTP
  async sendOTP(email: string): Promise<MockOTPResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.otpStore.set(email, otp);
        
        console.log(`🔐 Mock OTP for ${email}: ${otp}`);
        
        resolve({ message: 'OTP sent successfully' });
      }, 1000);
    });
  }

  // Mock verify OTP
  async verifyOTP(email: string, otp: string): Promise<MockAuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const storedOTP = this.otpStore.get(email);
        if (!storedOTP || storedOTP !== otp) {
          reject(new Error('Invalid OTP'));
          return;
        }

        // Clear OTP after successful verification
        this.otpStore.delete(email);

        const user = mockUsers.find(u => u.email === email);
        if (!user) {
          reject(new Error('User not found'));
          return;
        }

        // Update user as verified
        user.isEmailVerified = true;

        // Generate mock tokens
        const token = `mock_token_${Date.now()}_${user.id}`;
        const refreshToken = `mock_refresh_${Date.now()}_${user.id}`;

        resolve({
          user,
          token,
          refreshToken,
        });
      }, 1000);
    });
  }

  // Mock get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return the first user for demo purposes
        resolve(mockUsers[0]);
      }, 500);
    });
  }

  // Mock logout
  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }
}

export const mockAuthService = MockAuthService.getInstance();
