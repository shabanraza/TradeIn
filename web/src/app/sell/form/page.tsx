'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from '@/lib/auth/session';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/header';
import { useLocationDetection } from '@/hooks/use-location-detection';
import { 
  Smartphone,
  IndianRupee,
  Shield,
  Truck,
  Zap,
  CheckCircle,
  Phone,
  Clock,
  Mail,
  Upload,
  X,
  Image as ImageIcon,
  MapPin,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  brand: z.string().min(1, 'Please select a phone brand'),
  model: z.string().optional(),
  age: z.string().optional(),
  hasBill: z.string().optional(),
  billImage: z.string().optional(),
  hasBox: z.string().optional(),
  screenReplacement: z.string().optional(),
  condition: z.string().optional(),
  battery: z.string().optional(),
  name: z.string().min(1, 'Please enter your name'),
  phone: z.string()
    .min(1, 'Please enter your phone number')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'),
  city: z.string().min(1, 'Please enter your city')
});

const brandOptions = [
  'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei', 'Sony', 'LG', 'Motorola', 'Other'
];

const ageOptions = [
  { value: 'less-than-1', label: 'Less than 1 year' },
  { value: '1-2-years', label: '1-2 years' },
  { value: '2-3-years', label: '2-3 years' },
  { value: 'more-than-3', label: 'More than 3 years' }
];

const conditionOptions = [
  { value: 'excellent', label: 'Excellent - Like new', description: 'No scratches, works perfectly' },
  { value: 'good', label: 'Good - Minor scratches', description: 'Small scratches, works well' },
  { value: 'fair', label: 'Fair - Some wear', description: 'Visible wear but functional' },
  { value: 'poor', label: 'Poor - Visible damage', description: 'Cracks or major issues' }
];

const batteryOptions = [
  { value: 'above-80', label: 'Above 80%' },
  { value: '60-80', label: '60-80%' },
  { value: '40-60', label: '40-60%' },
  { value: 'below-40', label: 'Below 40%' }
];

const screenReplacementOptions = [
  { value: 'original', label: 'Original screen - Never replaced' },
  { value: 'replaced', label: 'Screen replaced (with original parts)' },
  { value: 'replaced-aftermarket', label: 'Screen replaced (with aftermarket parts)' },
  { value: 'unknown', label: 'Not sure / Don\'t know' }
];

export default function SellFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const { user, isLoading: sessionLoading } = useSession();
  const { 
    isDetecting, 
    location, 
    error: locationError, 
    detectLocation 
  } = useLocationDetection();

  // Cache busting to prevent old UI from showing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Add timestamp to prevent caching
      const currentUrl = new URL(window.location.href);
      const timestamp = Date.now();
      
      // If no timestamp in URL, add one to force fresh load
      if (!currentUrl.searchParams.has('t')) {
        currentUrl.searchParams.set('t', timestamp.toString());
        window.history.replaceState({}, '', currentUrl.toString());
      }
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      brand: '',
      model: '',
      age: '',
      hasBill: '',
      billImage: '',
      hasBox: '',
      screenReplacement: '',
      condition: '',
      battery: '',
      name: '',
      phone: '',
      city: ''
    }
  });

  // Auto-detect location on component mount
  useEffect(() => {
    const autoDetectLocation = async () => {
      const result = await detectLocation();
      if (result) {
        form.setValue('city', result.city);
      }
    };
    autoDetectLocation();
  }, [detectLocation, form]);

  const handleLocationDetection = async () => {
    const result = await detectLocation();
    if (result) {
      form.setValue('city', result.city);
    }
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setAlert(null);

    try {
      // Check if user is already logged in
      if (user) {
        // User is already logged in, create lead directly
        const formData = {
          customerId: user.id,
          phoneBrand: values.brand,
          phoneModel: values.model,
          phoneAge: values.age,
          hasBill: values.hasBill === 'yes',
          billImage: values.billImage || '',
          hasBox: values.hasBox === 'yes',
          screenReplacement: values.screenReplacement,
          condition: values.condition,
          batteryPercentage: values.battery,
          customerName: values.name,
          customerPhone: values.phone,
          customerLocation: values.city,
          preferredContactMethod: 'phone',
          status: 'pending'
        };

        // Create lead directly using API
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const responseData = await response.json();
          let successMessage = 'Your phone listing has been submitted successfully!';
          
          // Show auto-assigned retailer info if available
          if (responseData.autoAssignedRetailer) {
            successMessage += ` A retailer from ${responseData.autoAssignedRetailer.location} (${responseData.autoAssignedRetailer.businessName}) will contact you soon!`;
          }
          
          setAlert({ type: 'success', message: successMessage });
          setTimeout(() => {
            window.location.href = '/my-listings';
          }, 3000);
        } else {
          const errorData = await response.json();
          setAlert({ type: 'error', message: errorData.error || 'Failed to create lead. Please try again.' });
        }
      } else {
        // User not logged in, store data and redirect to signin
        const formData = {
          brand: values.brand,
          model: values.model,
          age: values.age,
          hasBill: values.hasBill === 'yes',
          billImage: values.billImage || '',
          hasBox: values.hasBox === 'yes',
          screenReplacement: values.screenReplacement,
          condition: values.condition,
          battery: values.battery,
          customerName: values.name,
          customerPhone: values.phone,
          customerLocation: values.city,
          preferredContactMethod: 'phone',
          timestamp: Date.now()
        };

        localStorage.setItem('pendingLeadData', JSON.stringify(formData));
        
        // Redirect to existing login page
        window.location.href = '/auth/signin';
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking session
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/sell" className="hover:text-foreground transition-colors">Sell Phone</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Get Best Price</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Get Best Price for Your Phone
          </h1>
          <p className="text-xl text-muted-foreground">
            Fill in a few details and retailers will call you within 24 hours
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Alert Messages */}
            {alert && (
              <Alert className={alert.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <AlertDescription className={alert.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {alert.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Brand Selection */}
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 gap-4">
                  <FormLabel className="col-span-1 text-base font-medium text-foreground items-start">Phone Brand *</FormLabel>
                  <div className="col-span-2">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="Select your phone brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brandOptions.map(brand => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Model Name (Optional) */}
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 gap-4">
                  <FormLabel className="col-span-1 text-base font-medium text-foreground items-start">Model Name (Optional)</FormLabel>
                  <div className="col-span-2">
                    <FormControl>
                      <Input
                        placeholder="e.g., iPhone 14, Samsung Galaxy S21 (Don't know? No problem!)"
                        {...field}
                        className="w-full h-10"
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground mt-1">Don't worry if you don't know - retailers will help you!</p>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Phone Age */}
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 gap-4">
                  <FormLabel className="col-span-1 text-base font-medium text-foreground items-start">How old is your phone? *</FormLabel>
                  <div className="col-span-2 space-y-2">
                    {ageOptions.map(option => (
                      <div
                        key={option.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                          field.value === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-sm'
                            : 'border-border hover:border-blue-400 bg-background'
                        }`}
                        onClick={() => field.onChange(option.value)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{option.label}</span>
                          {field.value === option.value && (
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Bill Availability */}
            <FormField
              control={form.control}
              name="hasBill"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 gap-4">
                  <FormLabel className="col-span-1 text-base font-medium text-foreground items-start">Do you have the original bill? *</FormLabel>
                  <div className="col-span-2 space-y-2">
                    <div
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                        field.value === 'yes'
                          ? 'border-green-500 bg-green-50 dark:bg-green-950 shadow-sm'
                          : 'border-border hover:border-green-400 bg-background'
                      }`}
                      onClick={() => field.onChange('yes')}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Yes, I have the bill</span>
                        {field.value === 'yes' && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                    <div
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                        field.value === 'no'
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950 shadow-sm'
                          : 'border-border hover:border-orange-400 bg-background'
                      }`}
                      onClick={() => field.onChange('no')}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">No, I don't have the bill</span>
                        {field.value === 'no' && (
                          <CheckCircle className="w-4 h-4 text-orange-600" />
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Bill Image Upload - Only show if user has bill */}
            {form.watch('hasBill') === 'yes' && (
              <FormField
                control={form.control}
                name="billImage"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 gap-4">
                    <FormLabel className="col-span-1 text-base font-medium text-foreground items-start">Upload Bill Image</FormLabel>
                    <div className="col-span-2">
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const url = await handleFileUpload(file);
                                  field.onChange(url);
                                } catch (error) {
                                  console.error('Upload failed:', error);
                                }
                              }
                            }}
                            className="hidden"
                            id="bill-image"
                          />
                          <label htmlFor="bill-image" className="cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-foreground">Upload Bill Image</p>
                            <p className="text-xs text-muted-foreground">Click to upload</p>
                          </label>
                        </div>
                        
                        {/* Display uploaded image */}
                        {field.value && (
                          <div className="space-y-2">
                            <p className="text-sm text-foreground">Uploaded Image:</p>
                            <div className="border rounded-lg p-3">
                              <div className="flex items-center space-x-2">
                                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-foreground">Bill Image</span>
                                <button
                                  type="button"
                                  onClick={() => field.onChange('')}
                                  className="ml-auto text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            )}

            {/* Phone Box Availability */}
            <FormField
              control={form.control}
              name="hasBox"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 gap-4">
                  <FormLabel className="col-span-1 text-base font-medium text-foreground items-start">Do you have the original phone box? *</FormLabel>
                  <div className="col-span-2 space-y-2">
                    <div
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                        field.value === 'yes'
                          ? 'border-green-500 bg-green-50 dark:bg-green-950 shadow-sm'
                          : 'border-border hover:border-green-400 bg-background'
                      }`}
                      onClick={() => field.onChange('yes')}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Yes, I have the box</span>
                        {field.value === 'yes' && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                    <div
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                        field.value === 'no'
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950 shadow-sm'
                          : 'border-border hover:border-orange-400 bg-background'
                      }`}
                      onClick={() => field.onChange('no')}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">No, I don't have the box</span>
                        {field.value === 'no' && (
                          <CheckCircle className="w-4 h-4 text-orange-600" />
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />


            {/* Screen Replacement */}
            <FormField
              control={form.control}
              name="screenReplacement"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 gap-4">
                  <FormLabel className="col-span-1 text-base font-medium text-foreground items-start">Screen replacement *</FormLabel>
                  <div className="col-span-2 space-y-2">
                    {screenReplacementOptions.map(option => (
                      <div
                        key={option.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                          field.value === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-sm'
                            : 'border-border hover:border-blue-400 bg-background'
                        }`}
                        onClick={() => field.onChange(option.value)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{option.label}</span>
                          {field.value === option.value && (
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Phone Condition */}
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 gap-4">
                  <FormLabel className="col-span-1 text-base font-medium text-foreground items-start">Phone condition *</FormLabel>
                  <div className="col-span-2 space-y-2">
                    {conditionOptions.map(option => (
                      <div
                        key={option.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                          field.value === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-sm'
                            : 'border-border hover:border-blue-400 bg-background'
                        }`}
                        onClick={() => field.onChange(option.value)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-foreground">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                          {field.value === option.value && (
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Battery Percentage */}
            <FormField
              control={form.control}
              name="battery"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 gap-4">
                  <FormLabel className="col-span-1 text-base font-medium text-foreground items-start">Battery percentage *</FormLabel>
                  <div className="col-span-2 space-y-2">
                    {batteryOptions.map(option => (
                      <div
                        key={option.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                          field.value === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-sm'
                            : 'border-border hover:border-blue-400 bg-background'
                        }`}
                        onClick={() => field.onChange(option.value)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{option.label}</span>
                          {field.value === option.value && (
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Contact Information */}
            <div className="border-t border-border pt-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">Your Contact Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 gap-4 mb-4">
                    <FormLabel className="col-span-1 text-base font-medium text-foreground items-start">Your Name *</FormLabel>
                    <div className="col-span-2">
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                          className="w-full h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 gap-4 mb-4">
                    <FormLabel className="col-span-1 text-base font-medium text-foreground items-start">Phone Number *</FormLabel>
                    <div className="col-span-2">
                      <FormControl>
                        <Input
                          placeholder="Enter your 10-digit phone number"
                          {...field}
                          className="w-full h-10"
                          type="tel"
                          maxLength={10}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">Enter 10-digit Indian mobile number (e.g., 9876543210)</p>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 gap-4">
                    <FormLabel className="col-span-1 text-base font-medium text-foreground items-start">Your City *</FormLabel>
                    <div className="col-span-2 space-y-2">
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="Enter your city"
                            {...field}
                            className="w-full h-10"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleLocationDetection}
                          disabled={isDetecting}
                          className="h-10 px-3"
                        >
                          {isDetecting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <MapPin className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      
                      {/* Location detection status */}
                      {isDetecting && (
                        <p className="text-sm text-blue-600 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Detecting your location...
                        </p>
                      )}
                      
                      {locationError && (
                        <p className="text-sm text-orange-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {locationError}
                        </p>
                      )}
                      
                      {field.value && !isDetecting && !locationError && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Location detected: {field.value}
                        </p>
                      )}
                      
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>


            {/* Submit Button */}
            <div className="pt-8">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <IndianRupee className="w-5 h-5 mr-2" />
                    Get Best Price
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-3">
                Retailers will call you within 24 hours • No commitment required
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
