'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

interface PhoneModel {
  id: string;
  name: string;
  brandId: string;
  description: string;
  image: string;
}

interface PhoneBrand {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function BrandModelsPage() {
  const params = useParams();
  const brandName = params.brand as string;
  
  const [brand, setBrand] = useState<PhoneBrand | null>(null);
  const [models, setModels] = useState<PhoneModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (brandName) {
      fetchBrandAndModels();
    }
  }, [brandName]);

  const fetchBrandAndModels = async () => {
    try {
      setIsLoading(true);
      
      // Fetch brand info
      const brandResponse = await fetch('/api/admin/phone-brands');
      const brandData = await brandResponse.json();
      
      if (brandData.success) {
        const foundBrand = brandData.brands.find((b: PhoneBrand) => 
          b.name.toLowerCase() === brandName.toLowerCase()
        );
        setBrand(foundBrand || null);
        
        if (foundBrand) {
          // Fetch models for this brand
          const modelsResponse = await fetch(`/api/admin/phone-models?brandId=${foundBrand.id}`);
          const modelsData = await modelsResponse.json();
          
          if (modelsData.success) {
            setModels(modelsData.models || []);
          } else {
            setModels([]);
          }
        } else {
          setModels([]);
        }
      } else {
        setBrand(null);
        setModels([]);
      }
    } catch (error) {
      console.error('Error fetching brand and models:', error);
      setBrand(null);
      setModels([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Smartphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Brand not found</h2>
            <p className="text-gray-600 mb-4">The brand you're looking for doesn't exist.</p>
            <Link href="/sell-phone/brands">
              <Button>Browse All Brands</Button>
            </Link>
          </CardContent>
        </Card>
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
              <Link href="/sell-phone/brands">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Brands
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Sell Old {brand.name}</h1>
                <p className="text-sm text-gray-600">Choose your {brand.name} model to get the best price</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={`Search ${brand.name} models...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Hero */}
      <div className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
              {brand.icon ? (
                <Image
                  src={brand.icon}
                  alt={brand.name}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              ) : (
                <Smartphone className="h-8 w-8 text-gray-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{brand.name}</h2>
            {brand.description && (
              <p className="text-gray-600 max-w-2xl mx-auto">{brand.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredModels.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Smartphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900">No models found</h3>
              <p className="text-gray-600">Try adjusting your search term</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {filteredModels.map((model) => (
              <Link key={model.id} href={`/sell-phone/brands/${brandName}/${model.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <Card className="group hover:shadow-sm transition-all duration-200 hover:scale-105 cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      {model.image ? (
                        <Image
                          src={model.image}
                          alt={model.name}
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      ) : (
                        <Smartphone className="h-6 w-6 text-gray-600" />
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                      {model.name}
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
