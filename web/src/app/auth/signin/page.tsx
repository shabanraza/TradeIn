'use client';

import { useState, useEffect } from 'react';
import { signIn } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Mail, MapPin } from 'lucide-react';
import { useSendOTP, useVerifyOTP } from '@/hooks/api/useOtp';
import { useLocationDetection } from '@/hooks/use-location-detection';
import { useUpdateLocation } from '@/hooks/api/useUpdateLocation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  // TanStack Query mutations
  const sendOTPMutation = useSendOTP();
  const verifyOTPMutation = useVerifyOTP();
  const updateLocationMutation = useUpdateLocation();

  // Location detection
  const { 
    isDetecting, 
    location, 
    error: locationError, 
    detectLocation 
  } = useLocationDetection();

  // Add a state to disable location detection if it's causing issues
  const [locationDetectionEnabled, setLocationDetectionEnabled] = useState(false);

  // Auto-detect location on component mount
  useEffect(() => {
    if (!locationDetectionEnabled) return;
    
    const autoDetectLocation = async () => {
      try {
        const result = await detectLocation();
        if (result) {
          console.log('Location detected during sign-in:', result.city);
        }
      } catch (error) {
        console.warn('Location detection failed during sign-in:', error);
        // Disable location detection if it keeps failing
        setLocationDetectionEnabled(false);
      }
    };
    autoDetectLocation();
  }, [detectLocation, locationDetectionEnabled]);


  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    sendOTPMutation.mutate(email, {
      onSuccess: () => {
        setOtpSent(true);
      },
      onError: (error: Error) => {
        setError(error.message);
      },
    });
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    verifyOTPMutation.mutate({ email, otp }, {
      onSuccess: async () => {
        // Save location if detected
        if (location) {
          try {
            await updateLocationMutation.mutateAsync({ location });
            console.log('Location saved for user:', location);
          } catch (error) {
            console.error('Failed to save location:', error);
            // Don't block sign-in if location save fails
          }
        }
        
        // Redirect to homepage after successful verification
        // Session provider will handle pending lead data
        window.location.href = '/';
      },
      onError: (error: Error) => {
        setError(error.message);
      },
    });
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
      
      // Save location if detected (this will happen after redirect)
      if (location) {
        // We'll save this in the session provider or after redirect
        localStorage.setItem('pendingLocation', location);
      }
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-3xl">📱</span>
            <span className="ml-2 text-2xl font-bold text-indigo-600">OldPhone</span>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Location Detection Status */}
          {locationDetectionEnabled && isDetecting && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-blue-600">Detecting your location...</span>
            </div>
          )}
          
          {locationDetectionEnabled && location && !isDetecting && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">Location detected: {location}</span>
            </div>
          )}
          
          {locationDetectionEnabled && locationError && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-600">{locationError}</span>
            </div>
          )}

          {!otpSent ? (
            /* Email Input */
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={sendOTPMutation.isPending}
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={sendOTPMutation.isPending}>
                {sendOTPMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                Send OTP
              </Button>
            </form>
          ) : (
            /* OTP Input */
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  We've sent a 6-digit code to <strong>{email}</strong>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                  disabled={verifyOTPMutation.isPending}
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={verifyOTPMutation.isPending || otp.length !== 6}>
                {verifyOTPMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                Verify OTP
              </Button>

              <div className="text-center">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                    setError('');
                  }}
                >
                  Use different email
                </Button>
              </div>
            </form>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={sendOTPMutation.isPending || verifyOTPMutation.isPending}
            className="w-full"
            variant="outline"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
