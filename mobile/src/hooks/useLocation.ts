import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationData {
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export interface UseLocationReturn {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  refreshLocation: () => Promise<void>;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reverseGeocode = async (latitude: number, longitude: number): Promise<LocationData> => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const data = await response.json();
      
      return {
        city: data.city || data.locality || 'Unknown City',
        state: data.principalSubdivision || data.administrativeArea || 'Unknown State',
        country: data.countryName || 'Unknown Country',
        latitude,
        longitude,
        formattedAddress: `${data.city || data.locality || 'Unknown City'}, ${data.principalSubdivision || data.administrativeArea || 'Unknown State'}`
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Fallback to coordinates if reverse geocoding fails
      return {
        city: 'Unknown City',
        state: 'Unknown State',
        country: 'Unknown Country',
        latitude,
        longitude,
        formattedAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
      };
    }
  };

  const getCurrentLocation = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if location services are enabled
      const hasLocationPermission = await Location.hasServicesEnabledAsync();
      if (!hasLocationPermission) {
        throw new Error('Location services are not enabled');
      }

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      // Get current position
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      });

      const { latitude, longitude } = locationResult.coords;
      
      // Reverse geocode to get address
      const locationData = await reverseGeocode(latitude, longitude);
      setLocation(locationData);
      
    } catch (err) {
      console.error('Location error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      
      // Set a fallback location if detection fails
      setLocation({
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        latitude: 19.0760,
        longitude: 72.8777,
        formattedAddress: 'Mumbai, Maharashtra'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshLocation = async (): Promise<void> => {
    await getCurrentLocation();
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    location,
    isLoading,
    error,
    refreshLocation
  };
};
