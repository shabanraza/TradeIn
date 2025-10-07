'use client'

import { ReactNode } from 'react'

interface StoreProviderProps {
  children: ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  // Zustand stores are automatically available throughout the app
  // No need for a provider component like Redux
  return <>{children}</>
}

