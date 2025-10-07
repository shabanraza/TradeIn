// Shared Phone API functions for both web and mobile

export interface PhoneBrand {
  id: string
  name: string
  description: string
  icon: string
  createdAt: Date
  updatedAt: Date
}

export interface PhoneModel {
  id: string
  name: string
  description: string
  image: string
  brandId: string
  brand?: PhoneBrand
  createdAt: Date
  updatedAt: Date
}

export interface PhoneVariant {
  id: string
  name: string
  storage: string
  color: string
  price: number | null
  modelId: string
  model?: PhoneModel
  createdAt: Date
  updatedAt: Date
}

// Fetch all phone brands
export const fetchPhoneBrands = async (baseURL: string = ''): Promise<PhoneBrand[]> => {
  const response = await fetch(`${baseURL}/api/phone-brands`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch phone brands')
  }
  
  const data = await response.json() as { brands?: PhoneBrand[] }
  return data.brands || []
}

// Fetch phone models by brand ID
export const fetchPhoneModels = async (brandId: string, baseURL: string = ''): Promise<PhoneModel[]> => {
  const response = await fetch(`${baseURL}/api/phone-models?brandId=${brandId}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch phone models')
  }
  
  const data = await response.json() as { models?: PhoneModel[] }
  return data.models || []
}

// Fetch phone variants by model ID
export const fetchPhoneVariants = async (modelId: string, baseURL: string = ''): Promise<PhoneVariant[]> => {
  const response = await fetch(`${baseURL}/api/phone-variants?modelId=${modelId}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch phone variants')
  }
  
  const data = await response.json() as { variants?: PhoneVariant[] }
  return data.variants || []
}

// Create a new phone brand
export const createPhoneBrand = async (brandData: {
  name: string
  description?: string
  icon?: string
}, baseURL: string = ''): Promise<PhoneBrand> => {
  const response = await fetch(`${baseURL}/api/phone-brands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(brandData),
  })
  
  if (!response.ok) {
    const error = await response.json() as { error?: string }
    throw new Error(error.error || 'Failed to create phone brand')
  }
  
  const data = await response.json() as { brand: PhoneBrand }
  return data.brand
}

// Update a phone brand
export const updatePhoneBrand = async (brandData: {
  id: string
  name: string
  description?: string
  icon?: string
}, baseURL: string = ''): Promise<PhoneBrand> => {
  const response = await fetch(`${baseURL}/api/phone-brands`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(brandData),
  })
  
  if (!response.ok) {
    const error = await response.json() as { error?: string }
    throw new Error(error.error || 'Failed to update phone brand')
  }
  
  const data = await response.json() as { brand: PhoneBrand }
  return data.brand
}

// Delete a phone brand
export const deletePhoneBrand = async (id: string, baseURL: string = ''): Promise<void> => {
  const response = await fetch(`${baseURL}/api/phone-brands?id=${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json() as { error?: string }
    throw new Error(error.error || 'Failed to delete phone brand')
  }
}
