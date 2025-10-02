'use client';

import { useSession } from '@/lib/auth/session';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // No automatic redirects - let individual pages handle access control

  // For setup page, allow access without authentication
  if (pathname === '/admin/setup') {
    return <>{children}</>;
  }

  // For non-setup pages, show loading or let individual pages handle access
  if (pathname !== '/admin/setup') {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    // Let individual pages handle access control
    if (!user || user.role !== 'super_admin') {
      return <>{children}</>; // Let the admin page show the access denied message
    }
  }


  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <AdminHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
