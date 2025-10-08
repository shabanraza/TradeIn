'use client';

import { useSession } from '@/lib/auth/session';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, List, Settings, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const { user, isLoading, isSigningOut, signOut } = useSession();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-800/20 shadow-lg shadow-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
              Trade In
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {user?.role === 'retailer' || user?.role === 'super_admin' ? (
              <>
                <Link 
                  href="/retailer" 
                  className="relative px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm border border-transparent hover:border-white/20 dark:hover:border-gray-700/20 transition-all duration-200"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/retailer/leads" 
                  className="relative px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm border border-transparent hover:border-white/20 dark:hover:border-gray-700/20 transition-all duration-200"
                >
                  Leads
                </Link>
                {user?.role === 'super_admin' && (
                  <Link 
                    href="/admin" 
                    className="relative px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm border border-transparent hover:border-white/20 dark:hover:border-gray-700/20 transition-all duration-200"
                  >
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link 
                  href="/products" 
                  className="relative px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm border border-transparent hover:border-white/20 dark:hover:border-gray-700/20 transition-all duration-200"
                >
                  Products
                </Link>
                <Link 
                  href="/sell" 
                  className="relative px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm border border-transparent hover:border-white/20 dark:hover:border-gray-700/20 transition-all duration-200"
                >
                  Sell Phone
                </Link>
                <Link 
                  href="/about" 
                  className="relative px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm border border-transparent hover:border-white/20 dark:hover:border-gray-700/20 transition-all duration-200"
                >
                  About
                </Link>
              </>
            )}
          </nav>

    {/* User Actions */}
                  <div className="flex items-center space-x-2">
                    {/* Location Display - Single, non-clickable */}
                    <div className="flex items-center space-x-1.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20 dark:border-gray-700/20">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user?.location || 'Mumbai'}
                      </span>
                    </div>
                    
                    {/* Theme Toggle */}
                    <ThemeToggle />
                    
                    {isLoading ? (
                      <div className="w-8 h-8 rounded-full bg-gray-200/50 dark:bg-gray-700/50 animate-pulse backdrop-blur-sm"></div>
                    ) : user ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm border border-transparent hover:border-white/20 dark:hover:border-gray-700/20 transition-all duration-200">
                            <Avatar className="h-8 w-8 ring-2 ring-white/20 dark:ring-gray-700/20">
                              <AvatarImage src={user.image || ''} alt={user.name || user.email} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                                {user.name?.charAt(0) || user.email?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-800/20 shadow-xl" align="end" forceMount>
                          <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium leading-none text-gray-800 dark:text-gray-200">
                                {user.name || user.email}
                              </p>
                              <p className="text-xs leading-none text-gray-600 dark:text-gray-400">
                                {user.email}
                              </p>
                              {user.role && (
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs w-fit mt-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/20 dark:border-blue-800/20"
                                >
                                  {user.role}
                                </Badge>
                              )}
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-gray-700/50" />
                          <DropdownMenuItem asChild>
                            <Link href="/my-listings" className="flex items-center hover:bg-white/50 dark:hover:bg-gray-800/50">
                              <List className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <span className="text-gray-800 dark:text-gray-200">My Listings</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard" className="flex items-center hover:bg-white/50 dark:hover:bg-gray-800/50">
                              <User className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <span className="text-gray-800 dark:text-gray-200">Dashboard</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/settings" className="flex items-center hover:bg-white/50 dark:hover:bg-gray-800/50">
                              <Settings className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <span className="text-gray-800 dark:text-gray-200">Settings</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-gray-700/50" />
                          <DropdownMenuItem 
                            onClick={signOut}
                            disabled={isSigningOut}
                            className="flex items-center text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 focus:text-red-600 dark:focus:text-red-400"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
            ) : (
                  <div className="flex items-center space-x-4">
                    <Link href="/auth/signin">
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white border-0 transition-all duration-200"
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
