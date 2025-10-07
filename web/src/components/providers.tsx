'use client';

import { SessionProvider } from '@/lib/auth/session';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryProvider } from '@/providers/query-provider';
import { StoreProvider } from '@/providers/store-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <StoreProvider>
        <ThemeProvider defaultTheme="system" storageKey="oldsellerapp-theme">
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </StoreProvider>
    </QueryProvider>
  );
}
