'use client';

import { ReactNode } from 'react';
import Header from '@/components/header';
import { Toaster } from '@/components/ui/sonner';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/30 to-purple-50/40 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
