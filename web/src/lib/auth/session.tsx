'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isEmailVerified: boolean;
  image?: string;
  location?: string;
}

interface SessionContextType {
  user: User | null;
  isLoading: boolean;
  isSigningOut: boolean;
  signOut: () => void;
  refreshSession: () => void;
  forceSignOut: () => void;
  debugSessions: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  // Listen for storage events to refresh session when needed
  useEffect(() => {
    const handleStorageChange = () => {
      checkSession();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page became visible - refreshing session');
        checkSession(true); // Force refresh when page becomes visible
      }
    };

    const handleFocus = () => {
      console.log('Window focused - refreshing session');
      checkSession(true); // Force refresh when window gains focus
    };

    const handleForceRefresh = () => {
      console.log('Force session refresh triggered');
      checkSession(true); // Force refresh when cache buster triggers
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('forceSessionRefresh', handleForceRefresh);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('forceSessionRefresh', handleForceRefresh);
    };
  }, []);

  const processPendingLead = async (formData: any, customerId: string) => {
    try {
      // Use TanStack Query mutation for lead creation
      const { createLead } = await import('@/lib/api/leads-api');
      
      // Create lead using TanStack Query
      const lead = await createLead({
        ...formData,
        customerId,
        status: 'pending'
      });

      if (lead) {
        console.log('Pending lead submitted successfully');
        // Clear pending data
        localStorage.removeItem('pendingLeadData');
        localStorage.removeItem('pendingLeadProcessing');
        // Redirect to my listings
        window.location.href = '/my-listings';
      } else {
        console.error('Failed to submit pending lead');
        // Clear processing flag on failure
        localStorage.removeItem('pendingLeadProcessing');
      }
    } catch (error) {
      console.error('Error submitting pending lead:', error);
      // Clear processing flag on error
      localStorage.removeItem('pendingLeadProcessing');
    }
  };

  const checkSession = async (forceRefresh = false) => {
    try {
      console.log('Checking session...', forceRefresh ? '(force refresh)' : '');
      
      // Clear any stale processing flags on app startup
      const processingFlag = localStorage.getItem('pendingLeadProcessing');
      if (processingFlag) {
        const flagTime = parseInt(processingFlag);
        const now = Date.now();
        // If flag is older than 5 minutes, clear it
        if (now - flagTime > 5 * 60 * 1000) {
          localStorage.removeItem('pendingLeadProcessing');
          console.log('Cleared stale processing flag');
        }
      }
      
      // Force clear any cached session data if force refresh
      if (forceRefresh) {
        console.log('Force refreshing session - clearing cache');
        // Clear any cached session data
        if (typeof window !== 'undefined') {
          // Clear any session-related localStorage
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.includes('session')) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
        }
      }
      
      let userFound = false;
      
      // Use existing session API that now handles both Google OAuth and Email OTP
      try {
        const sessionResponse = await fetch('/api/auth/session?' + Date.now(), {
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
        });
        const sessionData = await sessionResponse.json();
        
        console.log('Session response:', sessionData);
        
        if (sessionData && sessionData.user) {
          console.log('User found via session:', sessionData.user.email, 'Login method:', sessionData.loginMethod);
          setUser(sessionData.user);
          userFound = true;
          
          // Check for pending lead data after successful login
          const pendingData = localStorage.getItem('pendingLeadData');
          const processingFlag = localStorage.getItem('pendingLeadProcessing');
          
          if (pendingData && !processingFlag) {
            console.log('Found pending lead data, processing...');
            // Set processing flag to prevent duplicate processing
            localStorage.setItem('pendingLeadProcessing', Date.now().toString());
            
            try {
              await processPendingLead(JSON.parse(pendingData), sessionData.user.id);
              // Clear the pending data after successful processing
              localStorage.removeItem('pendingLeadData');
              localStorage.removeItem('pendingLeadProcessing');
              console.log('Pending lead data processed and cleared');
            } catch (error) {
              console.error('Error processing pending lead:', error);
              // Clear processing flag on error
              localStorage.removeItem('pendingLeadProcessing');
              // Keep the data in localStorage if processing failed
            }
          }

          // Check for pending location update
          const pendingLocation = localStorage.getItem('pendingLocation');
          if (pendingLocation) {
            console.log('Found pending location, updating user...');
            try {
              await fetch('/api/user/update-location', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ location: pendingLocation }),
              });
              console.log('Location updated successfully:', pendingLocation);
              localStorage.removeItem('pendingLocation');
            } catch (error) {
              console.error('Failed to update location:', error);
            }
          }
        } else {
          console.log('No user found in session');
        }
      } catch (sessionError) {
        console.log('Session check failed:', sessionError);
      }

      // If no user found in either session, user is not logged in
      if (!userFound) {
        console.log('No session found - user is not logged in');
        setUser(null);
      }
      
    } catch (error) {
      console.error('Error checking session:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (isSigningOut) return; // Prevent multiple sign out attempts
    
    setIsSigningOut(true);
    
    try {
      console.log('Starting comprehensive sign out process...');
      
      // Clear local state immediately to prevent UI issues
      setUser(null);
      
      // Always clear BOTH Better Auth and custom sessions regardless of login method
      const signOutPromises = [];
      
      // Always try Better Auth sign out (for Google OAuth sessions)
      signOutPromises.push(
        fetch('/api/auth/sign-out', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(response => {
          if (response.ok) {
            console.log('Better Auth sign out successful');
          } else {
            console.log('Better Auth sign out failed (normal for OTP sessions)');
          }
        }).catch(error => {
          console.log('Better Auth sign out error (normal for OTP sessions):', error);
        })
      );

      // Always try custom sign out (for OTP sessions)
      signOutPromises.push(
        fetch('/api/auth/signout', { 
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(response => {
          if (response.ok) {
            console.log('Custom sign out successful');
          } else {
            console.log('Custom sign out failed');
          }
        }).catch(error => {
          console.log('Custom sign out error:', error);
        })
      );

      // Wait for both sign out attempts to complete
      await Promise.allSettled(signOutPromises);
      
      console.log('All sign out attempts completed');
      
      // Clear any local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('oldsellerapp-theme');
        // Clear any other local storage items if needed
      }
      
      // Force clear all cookies manually
      if (typeof document !== 'undefined') {
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
      }
      
      // Wait a moment for cookies to be cleared, then redirect
      setTimeout(() => {
        window.location.href = '/';
      }, 200);
      
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if API fails, clear local state and redirect
      setUser(null);
      window.location.href = '/';
    } finally {
      setIsSigningOut(false);
    }
  };

  const refreshSession = () => {
    setIsLoading(true);
    checkSession(true); // Force refresh
  };

  const forceSignOut = async () => {
    console.log('Force sign out - clearing everything');
    setUser(null);
    setIsLoading(false);
    
    // Try nuclear sign out first
    try {
      await fetch('/api/auth/nuclear-signout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Nuclear sign out completed');
    } catch (error) {
      console.log('Nuclear sign out failed:', error);
    }
    
    // Clear all cookies manually
    if (typeof document !== 'undefined') {
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
    }
    
    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    
    // Redirect immediately
    window.location.href = '/';
  };

  const debugSessions = async () => {
    console.log('=== DEBUG SESSIONS ===');
    
    // Check Better Auth session
    try {
      const betterAuthResponse = await fetch('/api/auth/better-auth-session?' + Date.now());
      const betterAuthData = await betterAuthResponse.json();
      console.log('Better Auth session:', betterAuthData);
    } catch (error) {
      console.log('Better Auth session error:', error);
    }
    
    // Check custom session
    try {
      const customResponse = await fetch('/api/auth/session?' + Date.now());
      const customData = await customResponse.json();
      console.log('Custom session:', customData);
    } catch (error) {
      console.log('Custom session error:', error);
    }
    
    // Check cookies
    console.log('All cookies:', document.cookie);
    console.log('=== END DEBUG ===');
  };

  return (
    <SessionContext.Provider value={{ user, isLoading, isSigningOut, signOut, refreshSession, forceSignOut, debugSessions }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
