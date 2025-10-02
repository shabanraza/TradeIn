'use client';

import { useSession } from '@/lib/auth/session';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

export default function Header() {
  const { user, isLoading, isSigningOut, signOut, forceSignOut, debugSessions } = useSession();
  
  // Debug session status
  console.log('Header session isLoading:', isLoading);
  console.log('Header session user:', user);

  return (
    <header
      className="shadow-sm border-b"
      style={{
        backgroundColor: 'var(--color-card)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl">📱</div>
            <span 
              className="text-xl font-bold"
              style={{ color: 'var(--color-primary)' }}
            >
              OldPhone Marketplace
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user?.role === 'retailer' || user?.role === 'super_admin' ? (
              <>
                <Link 
                  href="/retailer" 
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/retailer/leads" 
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Leads
                </Link>
                {user?.role === 'super_admin' && (
                  <Link 
                    href="/admin" 
                    className="hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link 
                  href="/products" 
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Products
                </Link>
                <Link 
                  href="/sell-phone" 
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Sell Phone
                </Link>
                <Link 
                  href="/about" 
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  About
                </Link>
              </>
            )}
          </nav>

    {/* User Actions */}
                  <div className="flex items-center space-x-4">
                    {/* Theme Toggle */}
                    <ThemeToggle />
                    
                    {isLoading ? (
                      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                    ) : user ? (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium text-sm">
                      {user.name?.charAt(0) || user.email?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span 
                      className="text-sm font-medium"
                      style={{ color: 'var(--color-foreground)' }}
                    >
                      {user.name || user.email}
                    </span>
                    {user.role && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{
                          backgroundColor: 'var(--color-secondary)',
                          color: 'var(--color-secondary-foreground)'
                        }}
                      >
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Sign Out Button */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signOut}
                    disabled={isSigningOut}
                    style={{
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-foreground)'
                    }}
                  >
                    {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={forceSignOut}
                    disabled={isSigningOut}
                    title="Force sign out - clears everything"
                  >
                    Force Out
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={debugSessions}
                    title="Debug sessions - check console"
                  >
                    Debug
                  </Button>
                </div>
              </div>
            ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/auth/signin">
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--color-primary-foreground)'
                        }}
                      >
                        Sign In
                      </Button>
                    </Link>
                  </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
