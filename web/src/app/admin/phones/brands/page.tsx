'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, Plus, ArrowRight, Eye, Grid3X3, List } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { ImageUpload } from '@/components/ui/image-upload';

interface PhoneBrand {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
}

export default function PhoneBrandsPage() {
  const [brands, setBrands] = useState<PhoneBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [brandForm, setBrandForm] = useState({ name: '', description: '', icon: '' });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/phone-brands');
      const data = await response.json();
      
      if (data.success) {
        setBrands(data.brands);
      } else {
        setAlert({ type: 'error', message: 'Failed to load brands' });
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      setAlert({ type: 'error', message: 'Failed to load brands' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBrand = async () => {
    try {
      let iconUrl = brandForm.icon;

      // Upload image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('type', 'brand');

        const uploadResponse = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: formData
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          iconUrl = uploadData.url;
        } else {
          setAlert({ type: 'error', message: 'Failed to upload image' });
          return;
        }
      }

      const response = await fetch('/api/phone-brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...brandForm,
          icon: iconUrl
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setAlert({ type: 'success', message: 'Brand created successfully' });
        setBrandForm({ name: '', description: '', icon: '' });
        setSelectedImage(null);
        fetchBrands();
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to create brand' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to create brand' });
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Phone Brands</h1>
          <p className="text-muted-foreground">
            Manage phone brands and their models. Click on a brand to view and manage its models.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <ThemeToggle />
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Brand
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Brand</DialogTitle>
                <DialogDescription>
                  Add a new phone brand to the database
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name</Label>
                  <Input
                    id="brandName"
                    value={brandForm.name}
                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                    placeholder="e.g., Apple, Samsung, Google"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandDescription">Description</Label>
                  <Textarea
                    id="brandDescription"
                    value={brandForm.description}
                    onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                    placeholder="Brief description of the brand"
                  />
                </div>
                
                <ImageUpload
                  onImageSelect={(file) => {
                    setSelectedImage(file);
                  }}
                  onImageRemove={() => {
                    setSelectedImage(null);
                  }}
                  selectedImage={selectedImage}
                  type="brand"
                />
                
                <div className="space-y-2">
                  <Label htmlFor="brandIcon">Or enter Icon URL manually</Label>
                  <Input
                    id="brandIcon"
                    value={brandForm.icon}
                    onChange={(e) => setBrandForm({ ...brandForm, icon: e.target.value })}
                    placeholder="https://example.com/icon.png"
                  />
                </div>
                
                <Button onClick={handleCreateBrand} className="w-full">
                  Create Brand
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {alert && (
        <Alert className={alert.type === 'success' ? 'border-green-500' : 'border-red-500'}>
          <AlertDescription className={alert.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
        {brands.map((brand) => (
          <Card key={brand.id} className="hover:shadow-md transition-shadow">
            {viewMode === 'grid' ? (
              <>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {brand.name}
                  </CardTitle>
                  <CardDescription>{brand.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      📅 Created {new Date(brand.createdAt).toLocaleDateString()}
                    </p>
                    <Link href={`/admin/phones/${brand.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Models
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">{brand.name}</h3>
                      <p className="text-sm text-muted-foreground">{brand.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                      📅 {new Date(brand.createdAt).toLocaleDateString()}
                    </p>
                    <Link href={`/admin/phones/${brand.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Models
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        
        {brands.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No brands found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first phone brand
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
