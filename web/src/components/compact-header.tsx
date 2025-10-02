'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MapPin, 
  User,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from '@/lib/auth/session';

export default function CompactHeader() {
  const { user, signOut } = useSession();
  const [location, setLocation] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Auto-detect location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode the coordinates
          setLocation('Your City');
        },
        () => {
          setLocation('Select Location');
        }
      );
    } else {
      setLocation('Select Location');
    }
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Name */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              OldPhone Marketplace
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for phones, brands..."
                className="pl-10 pr-4 py-2 text-sm"
              />
            </div>
          </div>

          {/* Right: Location & Login */}
          <div className="flex items-center space-x-4">
            {/* Location */}
            <Button variant="ghost" size="sm" className="text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {location}
            </Button>

            {/* Login/User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{user.name}</span>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <User className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button size="sm">
                  <User className="h-4 w-4 mr-1" />
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link href="/sell-phone" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Sell Phone
              </Link>
              <Link href="/products" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Products
              </Link>
              <Link href="/about" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
