import { useState, useCallback } from 'react';

export interface LocationDetectionState {
  isDetecting: boolean;
  location: string | null;
  error: string | null;
  coordinates: { latitude: number; longitude: number } | null;
}

export interface LocationDetectionResult {
  city: string;
  state?: string;
  country?: string;
  coordinates: { latitude: number; longitude: number };
}

export function useLocationDetection() {
  const [state, setState] = useState<LocationDetectionState>({
    isDetecting: false,
    location: null,
    error: null,
    coordinates: null
  });

  const detectLocation = useCallback(async (): Promise<LocationDetectionResult | null> => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser.',
        isDetecting: false
      }));
      return null;
    }

    setState(prev => ({
      ...prev,
      isDetecting: true,
      error: null
    }));

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Use reverse geocoding to get location details
      let city = 'Unknown';
      let state = '';
      let country = '';
      
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(5000)
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          city = data.city || data.locality || data.principalSubdivision || 'Unknown';
          state = data.principalSubdivision || '';
          country = data.countryName || '';
        } else {
          console.warn('Reverse geocoding API failed, using coordinates only');
          city = `Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
        }
      } catch (apiError) {
        console.warn('Reverse geocoding failed:', apiError);
        // Fallback to coordinates-based location
        city = `Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
      }
      
      const result: LocationDetectionResult = {
        city,
        state,
        country,
        coordinates: { latitude, longitude }
      };

      setState(prev => ({
        ...prev,
        isDetecting: false,
        location: city,
        coordinates: { latitude, longitude },
        error: null
      }));

      return result;
    } catch (error) {
      console.error('Location detection error:', error);
      
      let errorMessage = 'Unable to detect location. Please enter your city manually.';
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enter your city manually.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please enter your city manually.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please enter your city manually.';
            break;
        }
      }

      setState(prev => ({
        ...prev,
        isDetecting: false,
        error: errorMessage
      }));

      return null;
    }
  }, []);

  const resetLocation = useCallback(() => {
    setState({
      isDetecting: false,
      location: null,
      error: null,
      coordinates: null
    });
  }, []);

  const setLocation = useCallback((location: string) => {
    setState(prev => ({
      ...prev,
      location,
      error: null
    }));
  }, []);

  return {
    ...state,
    detectLocation,
    resetLocation,
    setLocation
  };
}
