import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, AuthStackParamList } from '../../types';
import { colors, spacing, fontSize, borderRadius } from '../../styles';
import { testAPI, testSendOTP } from '../../utils/api-test';
import { API_BASE_URL } from '../../config';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

// Configure WebBrowser for Google OAuth
WebBrowser.maybeCompleteAuthSession();

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { sendOTP, login } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // Configure Google OAuth
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id',
    scopes: ['openid', 'profile', 'email'],
  });

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      setLoading(true);
      
      // Send OTP using auth context
      await sendOTP(email.trim());
      
      // Navigate to OTP verification
      navigation.navigate('VerifyOTP', { email: email.trim() });
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      
      console.log('🔍 Google config:', { clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID });
      
      if (!request) {
        Alert.alert(
          'Google OAuth Not Configured', 
          'Please set EXPO_PUBLIC_GOOGLE_CLIENT_ID in your environment variables.',
          [{ text: 'OK', style: 'default' }]
        );
        return;
      }
      
      await promptAsync();
    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert('Error', 'Failed to start Google authentication');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle Google OAuth response
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleGoogleAuthSuccess(authentication.accessToken);
      }
    } else if (response?.type === 'error') {
      console.error('Google OAuth error:', response.error);
      Alert.alert('Google Login Error', response.error?.message || 'Authentication failed');
    }
  }, [response]);

  const handleGoogleAuthSuccess = async (accessToken: string) => {
    try {
      setGoogleLoading(true);
      
      console.log('🔍 Google access token received:', accessToken);
      
      // Get user info from Google
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
      );
      
      if (!userInfoResponse.ok) {
        throw new Error('Failed to get user info from Google');
      }
      
      const userInfo = await userInfoResponse.json();
      console.log('🔍 Google user info:', userInfo);
      
      const requestBody = {
        accessToken,
        email: userInfo.email,
        name: userInfo.name,
        image: userInfo.picture,
      };
      
      console.log('🔍 Sending to backend:', requestBody);
      
      // Send to your backend for authentication
      const authResponse = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('🔍 Backend response status:', authResponse.status);
      
      if (authResponse.ok) {
        const authData = await authResponse.json();
        console.log('✅ Google auth success:', authData);
        
        // Use the login method from auth context
        await login(userInfo.email);
        
        Alert.alert('Success', 'Logged in with Google successfully!');
      } else {
        const errorData = await authResponse.json();
        console.log('❌ Google auth error:', errorData);
        throw new Error(errorData.error || 'Google authentication failed');
      }
    } catch (error: any) {
      console.error('Google auth error:', error);
      Alert.alert('Error', error.message || 'Google authentication failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleTestGoogleAPI = async () => {
    try {
      setGoogleLoading(true);
      
      // Test the Google API endpoint with mock data
      const mockData = {
        accessToken: 'test-google-token',
        email: 'test@gmail.com',
        name: 'Test User',
        image: 'https://via.placeholder.com/100',
      };
      
      console.log('🧪 Testing Google API with mock data:', mockData);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockData),
      });
      
      console.log('🧪 Google API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Google API test success:', data);
        Alert.alert('Success', 'Google API endpoint is working!');
      } else {
        const errorData = await response.json();
        console.log('❌ Google API test error:', errorData);
        Alert.alert('Error', errorData.error || 'Google API test failed');
      }
    } catch (error: any) {
      console.error('Google API test error:', error);
      Alert.alert('Error', error.message || 'Google API test failed');
    } finally {
      setGoogleLoading(false);
    }
  };



  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="phone-portrait" size={48} color={colors.primary} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.otpButton, loading && styles.otpButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Ionicons name="hourglass" size={20} color={colors.background} />
                  <Text style={styles.otpButtonText}>Sending OTP...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="mail" size={20} color={colors.background} />
                  <Text style={styles.otpButtonText}>Send OTP</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Login */}
            <TouchableOpacity 
              style={[styles.googleButton, googleLoading && styles.googleButtonDisabled]} 
              onPress={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <>
                  <Ionicons name="hourglass" size={20} color={colors.text} />
                  <Text style={styles.googleButtonText}>Signing in...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color={colors.text} />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>
            
            {/* Test Google API Endpoint */}
            <TouchableOpacity 
              style={[styles.googleButton, { backgroundColor: colors.primary, marginTop: spacing.sm }]} 
              onPress={handleTestGoogleAPI}
            >
              <Ionicons name="logo-google" size={20} color={colors.background} />
              <Text style={[styles.googleButtonText, { color: colors.background }]}>Test Google API</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
  },
  otpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  otpButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  otpButtonText: {
    color: colors.background,
    fontSize: fontSize.md,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  googleButtonDisabled: {
    backgroundColor: colors.textSecondary + '20',
    borderColor: colors.textSecondary + '40',
  },
  googleButtonText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  signUpText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
});

export default LoginScreen;

