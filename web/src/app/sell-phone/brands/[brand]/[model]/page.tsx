'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  ArrowLeft,
  CheckCircle,
  DollarSign,
  Shield,
  Truck,
  Zap,
  Star,
  Calendar,
  Package,
  MessageSquare,
  MapPin,
  Phone,
  Mail,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from '@/lib/auth/session';
import CompactHeader from '@/components/compact-header';

interface PhoneVariant {
  id: string;
  name: string;
  modelId: string;
  storage: string;
  ram: string;
  color: string;
  price: number;
}

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

export default function PhoneDetailsPage() {
  const params = useParams();
  const brandName = params.brand as string;
  const modelName = params.model as string;
  const { user } = useSession();
  
  const [brand, setBrand] = useState<PhoneBrand | null>(null);
  const [model, setModel] = useState<PhoneModel | null>(null);
  const [variants, setVariants] = useState<PhoneVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<PhoneVariant | null>(null);
  
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
    if (brandName && modelName) {
      fetchPhoneData();
    }
  }, [brandName, modelName]);

  const fetchPhoneData = async () => {
    try {
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
            const foundModel = modelsData.models.find((m: PhoneModel) => 
              m.name.toLowerCase().replace(/\s+/g, '-') === modelName.toLowerCase()
            );
            setModel(foundModel || null);
            
            if (foundModel) {
              // Fetch variants for this model
              const variantsResponse = await fetch(`/api/admin/phone-variants?modelId=${foundModel.id}`);
              const variantsData = await variantsResponse.json();
              
              if (variantsData.success) {
                setVariants(variantsData.variants);
              }
              
              // Set form data
              setFormData(prev => ({
                ...prev,
                phoneBrand: foundBrand.name,
                phoneModel: foundModel.name
              }));
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching phone data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVariantSelect = (variant: PhoneVariant) => {
    setSelectedVariant(variant);
    setFormData(prev => ({
      ...prev,
      phoneVariant: variant.name,
      storage: variant.storage,
      color: variant.color
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

  if (!brand || !model) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Smartphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Phone not found</h2>
            <p className="text-gray-600 mb-4">The phone you're looking for doesn't exist.</p>
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
          <div className="flex items-center space-x-4">
            <Link href={`/sell-phone/brands/${brandName}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {brand.name}
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Sell {brand.name} {model.name}</h1>
              <p className="text-sm text-gray-600">Get the best price for your {brand.name} {model.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {alert && (
          <Alert className={`mb-6 ${alert.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <AlertDescription className={alert.type === 'success' ? 'text-green-700' : 'text-red-700'}>
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Phone Info */}
          <div className="text-center py-8 bg-white rounded-lg">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
              {model.image ? (
                <Image
                  src={model.image}
                  alt={model.name}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              ) : (
                <Smartphone className="h-8 w-8 text-gray-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{brand.name} {model.name}</h2>
            {model.description && (
              <p className="text-gray-600 max-w-2xl mx-auto">{model.description}</p>
            )}
          </div>

          {/* Variant Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Variant</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantSelect(variant)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                    selectedVariant?.id === variant.id
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-gray-600" />
                    </div>
                    <h4 className="font-medium text-sm text-gray-800 mb-1">{variant.name}</h4>
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-gray-600">{variant.storage}</span>
                      <span className="text-gray-600">{variant.color}</span>
                    </div>
                    {variant.price && (
                      <div className="mt-2">
                        <span className="text-sm font-bold text-green-600">
                          ₹{variant.price.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Condition Assessment */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Phone Condition</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { value: 'excellent', label: 'Excellent', desc: 'Like new', color: 'green', icon: '✨' },
                { value: 'good', label: 'Good', desc: 'Minor wear', color: 'blue', icon: '👍' },
                { value: 'fair', label: 'Fair', desc: 'Some damage', color: 'yellow', icon: '⚠️' },
                { value: 'poor', label: 'Poor', desc: 'Heavy damage', color: 'red', icon: '🔧' }
              ].map((condition) => (
                <button
                  key={condition.value}
                  onClick={() => setFormData(prev => ({ ...prev, condition: condition.value }))}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                    formData.condition === condition.value
                      ? `border-${condition.color}-500 bg-${condition.color}-50 shadow-sm`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{condition.icon}</div>
                    <h4 className="font-semibold text-sm mb-1">{condition.label}</h4>
                    <p className="text-xs text-gray-600">{condition.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName" className="text-sm font-medium text-gray-700">Full Name *</Label>
                <Input
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="customerPhone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                <Input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                  placeholder="Enter your phone number"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="customerEmail" className="text-sm font-medium text-gray-700">Email Address *</Label>
                <Input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="customerLocation" className="text-sm font-medium text-gray-700">Location *</Label>
                <Input
                  value={formData.customerLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerLocation: e.target.value }))}
                  placeholder="Enter your city/location"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !selectedVariant || !formData.condition || !formData.customerName || !formData.customerPhone || !formData.customerEmail || !formData.customerLocation}
                className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Request
                    <Zap className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
