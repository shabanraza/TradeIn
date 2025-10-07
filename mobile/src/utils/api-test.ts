// API Test Utility
import { API_BASE_URL } from '../config';

export const testAPI = async () => {
  try {
    console.log('🔍 Testing API connection to:', API_BASE_URL);
    
    // Test basic connectivity
    const response = await fetch(`${API_BASE_URL}/api/auth/session`);
    console.log('✅ API is reachable:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📡 API Response:', data);
      return true;
    } else {
      console.log('❌ API returned error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ API connection failed:', error);
    return false;
  }
};

export const testSendOTP = async (email: string) => {
  try {
    console.log('🔍 Testing send OTP for:', email);
    
    const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    console.log('📡 Send OTP Response:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ OTP sent successfully:', data);
      return true;
    } else {
      const error = await response.json();
      console.log('❌ Send OTP failed:', error);
      return false;
    }
  } catch (error) {
    console.log('❌ Send OTP error:', error);
    return false;
  }
};
