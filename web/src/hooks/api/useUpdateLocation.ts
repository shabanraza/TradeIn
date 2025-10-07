import { useMutation } from '@tanstack/react-query';

interface UpdateLocationData {
  location: string;
}

interface UpdateLocationResponse {
  success: boolean;
  message: string;
}

async function updateUserLocation(data: UpdateLocationData): Promise<UpdateLocationResponse> {
  const response = await fetch('/api/user/update-location', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update location');
  }

  return response.json();
}

export function useUpdateLocation() {
  return useMutation({
    mutationFn: updateUserLocation,
  });
}
