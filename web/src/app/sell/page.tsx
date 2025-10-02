'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layouts';
import { ConditionBadge } from '@/components/marketplace';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Camera, 
  X, 
  Plus, 
  Save, 
  Eye,
  AlertCircle,
  CheckCircle,
  Smartphone,
  DollarSign,
  Tag
} from 'lucide-react';

const conditionOptions = [
  { value: 'excellent', label: 'Excellent', description: 'Like new, minimal wear' },
  { value: 'good', label: 'Good', description: 'Minor wear, fully functional' },
  { value: 'fair', label: 'Fair', description: 'Visible wear, works well' },
  { value: 'poor', label: 'Poor', description: 'Heavy wear, may have issues' },
  { value: 'broken', label: 'Broken', description: 'Not working, for parts only' },
];

const brandOptions = [
  'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei', 'Sony', 'LG', 'Motorola', 'Other'
];

const storageOptions = [
  '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'
];

const colorOptions = [
  'Black', 'White', 'Silver', 'Gold', 'Blue', 'Red', 'Green', 'Purple', 'Pink', 'Other'
];

export default function SellPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    model: '',
    condition: '',
    price: '',
    originalPrice: '',
    storage: '',
    color: '',
    location: '',
    images: [] as string[],
  });
  const [isDraft, setIsDraft] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...newImages].slice(0, 10) // Max 10 images
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveDraft = () => {
    setIsDraft(true);
    // Save to localStorage or API
    localStorage.setItem('productDraft', JSON.stringify(formData));
    console.log('Draft saved');
  };

  const publishProduct = () => {
    // Publish product
    console.log('Product published:', formData);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.brand && formData.model;
      case 2:
        return formData.condition && formData.price;
      case 3:
        return formData.description && formData.location;
      case 4:
        return formData.images.length > 0;
      default:
        return false;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sell Your Phone
          </h1>
          <p className="text-muted-foreground">
            List your phone for sale and connect with buyers
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Basic Info</span>
            <span>Pricing</span>
            <span>Details</span>
            <span>Photos</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Step {currentStep} of 4</CardTitle>
                <CardDescription>
                  {currentStep === 1 && 'Tell us about your phone'}
                  {currentStep === 2 && 'Set your price'}
                  {currentStep === 3 && 'Add details and location'}
                  {currentStep === 4 && 'Upload photos'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Phone Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., iPhone 14 Pro Max 256GB"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="brand">Brand *</Label>
                        <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            {brandOptions.map(brand => (
                              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="model">Model *</Label>
                        <Input
                          id="model"
                          placeholder="e.g., iPhone 14 Pro Max"
                          value={formData.model}
                          onChange={(e) => handleInputChange('model', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="storage">Storage</Label>
                        <Select value={formData.storage} onValueChange={(value) => handleInputChange('storage', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select storage" />
                          </SelectTrigger>
                          <SelectContent>
                            {storageOptions.map(storage => (
                              <SelectItem key={storage} value={storage}>{storage}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="color">Color</Label>
                        <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                          <SelectContent>
                            {colorOptions.map(color => (
                              <SelectItem key={color} value={color}>{color}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Pricing */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="condition">Condition *</Label>
                      <div className="grid grid-cols-1 gap-3 mt-2">
                        {conditionOptions.map(option => (
                          <div
                            key={option.value}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              formData.condition === option.value
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => handleInputChange('condition', option.value)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-sm text-muted-foreground">{option.description}</div>
                              </div>
                              {formData.condition === option.value && (
                                <CheckCircle className="w-5 h-5 text-primary" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Selling Price *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="price"
                            type="number"
                            placeholder="0"
                            className="pl-10"
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="originalPrice"
                            type="number"
                            placeholder="0"
                            className="pl-10"
                            value={formData.originalPrice}
                            onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Details */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your phone's condition, any issues, accessories included, etc."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="City, State"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Photos */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div>
                      <Label>Photos *</Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload clear photos of your phone. First photo will be the main image.
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                            <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {index === 0 && (
                              <Badge className="absolute bottom-2 left-2">Main</Badge>
                            )}
                          </div>
                        ))}
                        
                        {formData.images.length < 10 && (
                          <label className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                            <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">Add Photo</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={saveDraft}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </Button>
                    
                    {currentStep < 4 ? (
                      <Button
                        onClick={nextStep}
                        disabled={!isStepValid(currentStep)}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        onClick={publishProduct}
                        disabled={!isStepValid(currentStep)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Publish Product
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
                  Selling Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium mb-1">📸 Take Great Photos</div>
                  <p className="text-muted-foreground">Use good lighting and show all angles</p>
                </div>
                <div className="text-sm">
                  <div className="font-medium mb-1">💰 Price Competitively</div>
                  <p className="text-muted-foreground">Research similar listings for fair pricing</p>
                </div>
                <div className="text-sm">
                  <div className="font-medium mb-1">📝 Be Honest</div>
                  <p className="text-muted-foreground">Describe any issues or wear accurately</p>
                </div>
                <div className="text-sm">
                  <div className="font-medium mb-1">🔒 Stay Safe</div>
                  <p className="text-muted-foreground">Meet in public places for transactions</p>
                </div>
              </CardContent>
            </Card>

            {/* Preview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formData.title ? (
                  <div className="space-y-3">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      {formData.images.length > 0 ? (
                        <img src={formData.images[0]} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Smartphone className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium line-clamp-2">{formData.title || 'Your phone title'}</h4>
                      {formData.price && (
                        <p className="text-lg font-bold text-primary">${formData.price}</p>
                      )}
                      {formData.condition && (
                        <ConditionBadge condition={formData.condition as any} size="sm" />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Smartphone className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Fill in details to see preview</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
