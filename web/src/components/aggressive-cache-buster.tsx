'use client';

import { useEffect } from 'react';

export function AggressiveCacheBuster() {
  useEffect(() => {
    // Clear all possible caches
    const clearAllCaches = async () => {
      // Clear browser cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('Cleared all browser caches');
      }

      // Clear service worker
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        console.log('Unregistered all service workers');
      }

      // Clear localStorage cache markers
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('cache') || key.includes('reload') || key.includes('session'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Clear sessionStorage
      sessionStorage.clear();

      // Force reload with cache busting
      const timestamp = Date.now();
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('_cb', timestamp.toString());
      currentUrl.searchParams.set('_t', Math.random().toString(36).substring(7));
      
      // Only reload if we're not already on a cache-busted URL
      if (!currentUrl.searchParams.has('_cb') || 
          !window.location.search.includes('_cb=')) {
        console.log('Forcing cache-busted reload');
        window.location.href = currentUrl.toString();
      }
    };

    // Run immediately
    clearAllCaches();

    // Also run on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        clearAllCaches();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}
