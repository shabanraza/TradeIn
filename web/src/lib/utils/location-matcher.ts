/**
 * Location matching utilities for finding retailers by proximity
 */

export interface Location {
  city: string;
  state?: string;
  country?: string;
}

export interface RetailerLocation {
  id: string;
  location: string;
  businessName: string;
  isRetailerApproved: boolean;
}

/**
 * Normalize location string for comparison
 */
export function normalizeLocation(location: string): string {
  return location
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' '); // Normalize spaces
}

/**
 * Check if two locations match (exact or partial match)
 */
export function isLocationMatch(location1: string, location2: string): boolean {
  const normalized1 = normalizeLocation(location1);
  const normalized2 = normalizeLocation(location2);
  
  // Exact match
  if (normalized1 === normalized2) {
    return true;
  }
  
  // Check if one location contains the other
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return true;
  }
  
  // Check for common city variations
  const commonVariations = {
    'mumbai': ['bombay', 'mumbai'],
    'delhi': ['new delhi', 'delhi'],
    'bangalore': ['bengaluru', 'bangalore'],
    'kolkata': ['calcutta', 'kolkata'],
    'chennai': ['madras', 'chennai'],
    'hyderabad': ['hyderabad'],
    'pune': ['pune'],
    'ahmedabad': ['ahmedabad'],
    'jaipur': ['jaipur'],
    'lucknow': ['lucknow']
  };
  
  for (const [, variations] of Object.entries(commonVariations)) {
    if (variations.some(v => normalized1.includes(v)) && variations.some(v => normalized2.includes(v))) {
      return true;
    }
  }
  
  return false;
}

/**
 * Find retailers that match the customer's location
 */
export function findMatchingRetailers(
  customerLocation: string,
  retailers: RetailerLocation[]
): RetailerLocation[] {
  return retailers.filter(retailer => {
    if (!retailer.isRetailerApproved) {
      return false;
    }
    
    return isLocationMatch(customerLocation, retailer.location);
  });
}

/**
 * Get the best matching retailer (first match or random if multiple)
 */
export function getBestMatchingRetailer(
  customerLocation: string,
  retailers: RetailerLocation[]
): RetailerLocation | null {
  const matchingRetailers = findMatchingRetailers(customerLocation, retailers);
  
  if (matchingRetailers.length === 0) {
    return null;
  }
  
  // Return the first match (could be randomized in the future)
  return matchingRetailers[0];
}
