import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface FormState {
  // Phone selection form
  phoneSelection: {
    brandId: string | null
    modelId: string | null
    variantId: string | null
    condition: 'excellent' | 'good' | 'fair' | 'poor' | null
  }
  
  // Contact information form
  contactInfo: {
    name: string
    email: string
    phone: string
    address: string
  }
  
  // Form validation
  errors: {
    phoneSelection: Record<string, string>
    contactInfo: Record<string, string>
  }
  
  // Form state
  isDirty: boolean
  isSubmitting: boolean
  
  // Actions
  setPhoneSelection: (data: Partial<FormState['phoneSelection']>) => void
  setContactInfo: (data: Partial<FormState['contactInfo']>) => void
  setErrors: (form: keyof FormState['errors'], errors: Record<string, string>) => void
  clearErrors: (form?: keyof FormState['errors']) => void
  setDirty: (dirty: boolean) => void
  setSubmitting: (submitting: boolean) => void
  
  // Reset functions
  resetPhoneSelection: () => void
  resetContactInfo: () => void
  resetAll: () => void
}

export const useFormStore = create<FormState>()(
  devtools(
    (set) => ({
      // Initial state
      phoneSelection: {
        brandId: null,
        modelId: null,
        variantId: null,
        condition: null,
      },
      contactInfo: {
        name: '',
        email: '',
        phone: '',
        address: '',
      },
      errors: {
        phoneSelection: {},
        contactInfo: {},
      },
      isDirty: false,
      isSubmitting: false,
      
      // Actions
      setPhoneSelection: (data) => 
        set((state) => ({
          phoneSelection: { ...state.phoneSelection, ...data },
          isDirty: true,
        })),
      
      setContactInfo: (data) => 
        set((state) => ({
          contactInfo: { ...state.contactInfo, ...data },
          isDirty: true,
        })),
      
      setErrors: (form, errors) => 
        set((state) => ({
          errors: { ...state.errors, [form]: errors },
        })),
      
      clearErrors: (form) => 
        set((state) => ({
          errors: form 
            ? { ...state.errors, [form]: {} }
            : { phoneSelection: {}, contactInfo: {} },
        })),
      
      setDirty: (dirty) => 
        set({ isDirty: dirty }),
      
      setSubmitting: (submitting) => 
        set({ isSubmitting: submitting }),
      
      // Reset functions
      resetPhoneSelection: () => 
        set((state) => ({
          phoneSelection: {
            brandId: null,
            modelId: null,
            variantId: null,
            condition: null,
          },
          errors: { ...state.errors, phoneSelection: {} },
        })),
      
      resetContactInfo: () => 
        set((state) => ({
          contactInfo: {
            name: '',
            email: '',
            phone: '',
            address: '',
          },
          errors: { ...state.errors, contactInfo: {} },
        })),
      
      resetAll: () => 
        set({
          phoneSelection: {
            brandId: null,
            modelId: null,
            variantId: null,
            condition: null,
          },
          contactInfo: {
            name: '',
            email: '',
            phone: '',
            address: '',
          },
          errors: {
            phoneSelection: {},
            contactInfo: {},
          },
          isDirty: false,
          isSubmitting: false,
        }),
    }),
    {
      name: 'form-store',
    }
  )
)

