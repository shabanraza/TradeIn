'use client';

import { useEffect } from 'react';

export function CacheBuster() {
  useEffect(() => {
    // Always force reload on development
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode - forcing cache bust');
      // Clear all caches
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
      
      // Clear service worker cache
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.unregister();
          });
        });
      }
    }
    
    // Force reload if this is a cached version
    const lastReload = localStorage.getItem('lastReload');
    const now = Date.now();
    
    if (!lastReload || now - parseInt(lastReload) > 10000) { // 10 seconds
      localStorage.setItem('lastReload', now.toString());
    } else {
      // If we're getting cached content, force a hard reload
      console.log('Detected cached content, forcing reload...');
      window.location.reload();
    }
    
    // Add cache busting to all fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input.toString();
      const separator = url.includes('?') ? '&' : '?';
      const cacheBuster = `${separator}_cb=${Date.now()}`;
      
      return originalFetch(url + cacheBuster, {
        ...init,
        cache: 'no-store',
        headers: {
          ...init?.headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    };
    
    // Listen for page visibility changes to force refresh
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page became visible, checking for stale content...');
        // Force a session refresh when page becomes visible
        const event = new CustomEvent('forceSessionRefresh');
        window.dispatchEvent(event);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null; // This component doesn't render anything
}
