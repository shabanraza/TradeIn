import { useMutation } from '@tanstack/react-query';
import { sendOTP, verifyOTP } from '@/lib/api/otp-api';

export const useSendOTP = () => {
  return useMutation({
    mutationFn: sendOTP,
    onError: (error) => {
      console.error('Send OTP error:', error);
    },
  });
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: verifyOTP,
    onError: (error) => {
      console.error('Verify OTP error:', error);
    },
  });
};


