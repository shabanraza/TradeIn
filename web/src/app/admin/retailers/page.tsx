'use client';

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google: any;
  }
}

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Store, CheckCircle, XCircle, Edit, Trash2, Plus } from 'lucide-react';

// TanStack Query hooks
import { useRetailers, useUpdateRetailerApproval } from '@/hooks/api/useRetailers';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorBoundary } from '@/components/common/error-boundary';

interface Retailer {
  id: string;
  email: string;
  name: string;
  businessName: string;
  businessAddress: string;
  phone: string;
  location: string;
  isRetailerApproved: boolean;
  createdAt: string;
}

export default function RetailersPage() {
  // TanStack Query hooks
  const { data: retailers, isLoading, error } = useRetailers();
  const updateRetailerApprovalMutation = useUpdateRetailerApproval();
  
  // Local state for form and UI
  const [isCreating, setIsCreating] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    businessName: '',
    businessAddress: '',
    phone: '',
    location: ''
  });

  useEffect(() => {
    initializeGooglePlaces();
  }, []);

  const initializeGooglePlaces = () => {
    // Load Google Maps script if not already loaded
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeAutocomplete();
      };
      document.head.appendChild(script);
    } else if (window.google) {
      initializeAutocomplete();
    }
  };

  const initializeAutocomplete = () => {
    if (locationInputRef.current && window.google) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        locationInputRef.current,
        {
          types: ['establishment', 'geocode'],
          componentRestrictions: { country: 'in' } // Restrict to India, change as needed
        }
      );

      autocompleteRef.current?.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.formatted_address) {
          setFormData(prev => ({ ...prev, location: place.formatted_address || '' }));
        }
      });
    }
  };


  const handleCreateRetailer = async () => {
    try {
      setIsCreating(true);
      const response = await fetch('/api/admin/retailers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setAlert({ type: 'success', message: 'Retailer created successfully' });
        setFormData({ email: '', name: '', businessName: '', businessAddress: '', phone: '', location: '' });
        
        // Data will be automatically refetched by TanStack Query
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to create retailer' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to create retailer' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleApproveRetailer = async (retailerId: string, approved: boolean) => {
    try {
      await updateRetailerApprovalMutation.mutateAsync({ id: retailerId, approved });
      setAlert({ type: 'success', message: `Retailer ${approved ? 'approved' : 'rejected'} successfully` });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update retailer' });
    }
  };

  const handleDeleteRetailer = async (retailerId: string) => {
    if (!confirm('Are you sure you want to delete this retailer?')) return;

    try {
      const response = await fetch(`/api/admin/retailers/${retailerId}`, {
        method: 'DELETE',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setAlert({ type: 'success', message: 'Retailer deleted successfully' });
        
        // Data will be automatically refetched by TanStack Query
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to delete retailer' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete retailer' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Retailer Management</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <LoadingSpinner size="sm" />
            <span>Loading retailers...</span>
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Retailer Management</h1>
          <div className="text-red-600">
            <h2 className="text-lg font-medium">Error Loading Retailers</h2>
            <p className="text-sm">Failed to load retailers. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Retailer Management</h1>
          <p className="text-muted-foreground">
            Manage retailer accounts and approvals
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Retailer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Retailer</DialogTitle>
              <DialogDescription>
                Add a new retailer to the marketplace
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    ref={locationInputRef}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Start typing to search locations..."
                  />
                </div>
              </div>
              <Button onClick={handleCreateRetailer} disabled={isCreating} className="w-full">
                {isCreating ? 'Creating...' : 'Create Retailer'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {alert && (
        <Alert className={alert.type === 'success' ? 'border-green-500' : 'border-red-500'}>
          <AlertDescription className={alert.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {retailers?.map((retailer) => (
          <Card key={retailer.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">{retailer.businessName}</h3>
                    <Badge variant={retailer.isRetailerApproved ? "default" : "secondary"}>
                      {retailer.isRetailerApproved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {retailer.user?.name || 'N/A'} • {retailer.user?.email || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    📍 {retailer.location} • 📞 {retailer.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    📅 Joined {new Date(retailer.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {!retailer.isRetailerApproved && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproveRetailer(retailer.id, true)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproveRetailer(retailer.id, false)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteRetailer(retailer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {retailers?.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No retailers found</h3>
              <p className="text-muted-foreground">
                No retailers have registered yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}