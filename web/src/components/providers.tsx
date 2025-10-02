'use client';

import { SessionProvider } from '@/lib/auth/session';
import { ThemeProvider } from '@/components/theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="oldsellerapp-theme">
      <SessionProvider>
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}
