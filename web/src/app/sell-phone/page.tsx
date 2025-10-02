'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  ArrowRight,
  DollarSign,
  Shield,
  Zap,
  Truck
} from 'lucide-react';
import { useSession } from '@/lib/auth/session';
import Image from 'next/image';
import CompactHeader from '@/components/compact-header';

interface PhoneBrand {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface PhoneModel {
  id: string;
  name: string;
  brandId: string;
  description: string;
  image: string;
}

interface PhoneVariant {
  id: string;
  name: string;
  modelId: string;
  storage: string;
  ram: string;
  color: string;
  price: number;
}

export default function SellPhonePage() {
  const { user } = useSession();
  const [brands, setBrands] = useState<PhoneBrand[]>([]);
  const [models, setModels] = useState<PhoneModel[]>([]);
  const [variants, setVariants] = useState<PhoneVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Phone details
    phoneBrand: '',
    phoneModel: '',
    phoneVariant: '',
    condition: '',
    storage: '',
    color: '',
    purchaseDate: '',
    warrantyStatus: '',
    accessories: '',
    
    // Customer details
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerLocation: '',
    preferredContactMethod: '',
    preferredContactTime: '',
    notes: ''
  });

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

  const fetchModels = async (brandId: string) => {
    try {
      const response = await fetch(`/api/admin/phone-models?brandId=${brandId}`);
      const data = await response.json();
      
      if (data.success) {
        setModels(data.models);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const fetchVariants = async (modelId: string) => {
    try {
      const response = await fetch(`/api/admin/phone-variants?modelId=${modelId}`);
      const data = await response.json();
      
      if (data.success) {
        setVariants(data.variants);
      }
    } catch (error) {
      console.error('Error fetching variants:', error);
    }
  };

  const handleBrandChange = (brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    setFormData(prev => ({ ...prev, phoneBrand: brand?.name || '', phoneModel: '', phoneVariant: '' }));
    setModels([]);
    setVariants([]);
    if (brandId) {
      fetchModels(brandId);
    }
  };

  const handleModelChange = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    setFormData(prev => ({ ...prev, phoneModel: model?.name || '', phoneVariant: '' }));
    setVariants([]);
    if (modelId) {
      fetchVariants(modelId);
    }
  };

  const handleVariantChange = (variantId: string) => {
    const variant = variants.find(v => v.id === variantId);
    setFormData(prev => ({ 
      ...prev, 
      phoneVariant: variant?.name || '',
      storage: variant?.storage || '',
      color: variant?.color || ''
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Get a random retailer for now (in production, this would be based on location)
      const retailersResponse = await fetch('/api/admin/retailers');
      const retailersData = await retailersResponse.json();
      
      if (!retailersData.success || retailersData.retailers.length === 0) {
        setAlert({ type: 'error', message: 'No retailers available at the moment' });
        return;
      }
      
      const randomRetailer = retailersData.retailers[0];
      
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user?.id || 'anonymous',
          retailerId: randomRetailer.id,
          ...formData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setAlert({ type: 'success', message: 'Your request has been submitted successfully! A retailer will contact you soon.' });
        setStep(4);
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to submit request' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to submit request' });
    } finally {
      setIsSubmitting(false);
    }
  };

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
      
      {/* Hero Banner */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sell Your Old Mobile Phone
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get instant cash for your old phone with the best prices guaranteed
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium">Best Prices</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Safe & Secure</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <Truck className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Free Pickup</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span className="font-medium">Instant Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Brand Selection */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Phone Brand</h2>
            <p className="text-gray-600">Select your phone brand to get started</p>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => window.location.href = `/sell-phone/brands/${brand.name.toLowerCase()}`}
                className="group p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all duration-200 bg-white"
              >
                <div className="text-center">
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
                  <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                    {brand.name}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* View All Brands Button */}
          <div className="text-center mt-6">
            <Button 
              onClick={() => window.location.href = '/sell-phone/brands'}
              variant="outline" 
              className="px-6"
            >
              View All Brands
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
