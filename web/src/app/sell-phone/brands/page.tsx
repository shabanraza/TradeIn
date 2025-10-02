'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Smartphone, 
  Search,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import CompactHeader from '@/components/compact-header';

interface PhoneBrand {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<PhoneBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/admin/phone-brands');
      const data = await response.json();
      
      if (data.success) {
        setBrands(data.brands);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CompactHeader />
      
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/sell-phone">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">All Phone Brands</h1>
                <p className="text-sm text-gray-600">Choose your phone brand to get started</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredBrands.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Smartphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No brands found</h3>
              <p className="text-gray-600">Try adjusting your search term</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {filteredBrands.map((brand) => (
              <Link key={brand.id} href={`/sell-phone/brands/${brand.name.toLowerCase()}`}>
                <Card className="group hover:shadow-sm transition-all duration-200 hover:scale-105 cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      {brand.icon ? (
                        <Image
                          src={brand.icon}
                          alt={brand.name}
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      ) : (
                        <Smartphone className="h-6 w-6 text-gray-600" />
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                      {brand.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
