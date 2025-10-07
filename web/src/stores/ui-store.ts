import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UIState {
  // Modal states
  isPhoneSelectionModalOpen: boolean
  isContactFormModalOpen: boolean
  isConditionModalOpen: boolean
  
  // Search and filters
  searchQuery: string
  selectedBrand: string | null
  selectedModel: string | null
  selectedVariant: string | null
  
  // Loading states
  isSubmittingLead: boolean
  
  // Actions
  setPhoneSelectionModalOpen: (open: boolean) => void
  setContactFormModalOpen: (open: boolean) => void
  setConditionModalOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
  setSelectedBrand: (brandId: string | null) => void
  setSelectedModel: (modelId: string | null) => void
  setSelectedVariant: (variantId: string | null) => void
  setSubmittingLead: (submitting: boolean) => void
  
  // Reset functions
  resetPhoneSelection: () => void
  resetAll: () => void
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      // Initial state
      isPhoneSelectionModalOpen: false,
      isContactFormModalOpen: false,
      isConditionModalOpen: false,
      searchQuery: '',
      selectedBrand: null,
      selectedModel: null,
      selectedVariant: null,
      isSubmittingLead: false,
      
      // Actions
      setPhoneSelectionModalOpen: (open) => 
        set({ isPhoneSelectionModalOpen: open }),
      
      setContactFormModalOpen: (open) => 
        set({ isContactFormModalOpen: open }),
      
      setConditionModalOpen: (open) => 
        set({ isConditionModalOpen: open }),
      
      setSearchQuery: (query) => 
        set({ searchQuery: query }),
      
      setSelectedBrand: (brandId) => 
        set({ 
          selectedBrand: brandId,
          selectedModel: null, // Reset model when brand changes
          selectedVariant: null, // Reset variant when brand changes
        }),
      
      setSelectedModel: (modelId) => 
        set({ 
          selectedModel: modelId,
          selectedVariant: null, // Reset variant when model changes
        }),
      
      setSelectedVariant: (variantId) => 
        set({ selectedVariant: variantId }),
      
      setSubmittingLead: (submitting) => 
        set({ isSubmittingLead: submitting }),
      
      // Reset functions
      resetPhoneSelection: () => 
        set({ 
          selectedBrand: null,
          selectedModel: null,
          selectedVariant: null,
        }),
      
      resetAll: () => 
        set({ 
          isPhoneSelectionModalOpen: false,
          isContactFormModalOpen: false,
          isConditionModalOpen: false,
          searchQuery: '',
          selectedBrand: null,
          selectedModel: null,
          selectedVariant: null,
          isSubmittingLead: false,
        }),
    }),
    {
      name: 'ui-store',
    }
  )
)

