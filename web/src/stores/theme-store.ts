import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  isDark: boolean
  
  // Actions
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        theme: 'system',
        isDark: false,
        
        // Actions
        setTheme: (theme) => {
          set({ theme })
          
          // Update isDark based on theme
          if (theme === 'dark') {
            set({ isDark: true })
            document.documentElement.classList.add('dark')
          } else if (theme === 'light') {
            set({ isDark: false })
            document.documentElement.classList.remove('dark')
          } else {
            // System theme
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            set({ isDark: prefersDark })
            if (prefersDark) {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }
          }
        },
        
        toggleTheme: () => {
          const currentTheme = get().theme
          const newTheme = currentTheme === 'light' ? 'dark' : 'light'
          get().setTheme(newTheme)
        },
      }),
      {
        name: 'theme-store',
        // Only persist theme preference, not isDark (computed)
        partialize: (state) => ({ theme: state.theme }),
      }
    ),
    {
      name: 'theme-store',
    }
  )
)

// Initialize theme on store creation
if (typeof window !== 'undefined') {
  const store = useThemeStore.getState()
  store.setTheme(store.theme)
}

