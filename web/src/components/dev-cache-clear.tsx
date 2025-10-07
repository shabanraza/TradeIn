'use client';

import { useEffect } from 'react';

export function DevCacheClear() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const clearAllCaches = async () => {
      console.log('Development mode: Clearing all caches...');
      
      // Clear browser caches
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => {
              console.log('Deleting cache:', cacheName);
              return caches.delete(cacheName);
            })
          );
          console.log('All browser caches cleared');
        } catch (error) {
          console.error('Error clearing caches:', error);
        }
      }

      // Unregister service workers
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(
            registrations.map(registration => {
              console.log('Unregistering service worker:', registration.scope);
              return registration.unregister();
            })
          );
          console.log('All service workers unregistered');
        } catch (error) {
          console.error('Error unregistering service workers:', error);
        }
      }

      // Clear storage
      try {
        localStorage.clear();
        sessionStorage.clear();
        console.log('All storage cleared');
      } catch (error) {
        console.error('Error clearing storage:', error);
      }
    };

    // Run on mount
    clearAllCaches();

    // Run on page focus
    const handleFocus = () => {
      clearAllCaches();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return null;
}
