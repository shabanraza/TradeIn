'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Cpu, Smartphone, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface PhoneBrand {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
}

interface PhoneModel {
  id: string;
  name: string;
  brandId: string;
  description: string;
  image: string;
  createdAt: string;
}

interface PhoneVariant {
  id: string;
  name: string;
  modelId: string;
  storage: string;
  ram: string;
  color: string;
  price: number;
  createdAt: string;
}

export default function ModelDetailPage({ params }: { params: { brandId: string; modelId: string } }) {
  const [brand, setBrand] = useState<PhoneBrand | null>(null);
  const [model, setModel] = useState<PhoneModel | null>(null);
  const [variants, setVariants] = useState<PhoneVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [variantForm, setVariantForm] = useState({ 
    name: '', 
    storage: '', 
    ram: '', 
    color: '', 
    price: 0 
  });
  const [editingVariant, setEditingVariant] = useState<PhoneVariant | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [params.brandId, params.modelId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch brand details
      const brandResponse = await fetch('/api/phone-brands');
      const brandData = await brandResponse.json();
      
      if (brandData.success) {
        const foundBrand = brandData.brands.find((b: PhoneBrand) => b.id === params.brandId);
        if (foundBrand) {
          setBrand(foundBrand);
        } else {
          setAlert({ type: 'error', message: 'Brand not found' });
          return;
        }
      }

      // Fetch model details
      const modelResponse = await fetch(`/api/phone-models?brandId=${params.brandId}`);
      const modelData = await modelResponse.json();
      
      if (modelData.success) {
        const foundModel = modelData.models.find((m: PhoneModel) => m.id === params.modelId);
        if (foundModel) {
          setModel(foundModel);
        } else {
          setAlert({ type: 'error', message: 'Model not found' });
          return;
        }
      }

      // Fetch variants for this model
      const variantsResponse = await fetch(`/api/phone-variants?modelId=${params.modelId}`);
      const variantsData = await variantsResponse.json();
      
      if (variantsData.success) {
        setVariants(variantsData.variants);
      } else {
        setAlert({ type: 'error', message: 'Failed to load variants' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setAlert({ type: 'error', message: 'Failed to load data' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVariant = async () => {
    try {
      const response = await fetch('/api/phone-variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: variantForm.name,
          modelId: params.modelId,
          storage: variantForm.storage,
          ram: variantForm.ram,
          color: variantForm.color,
          price: variantForm.price
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setAlert({ type: 'success', message: 'Variant created successfully' });
        setVariantForm({ name: '', storage: '', ram: '', color: '', price: 0 });
        fetchData();
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to create variant' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to create variant' });
    }
  };

  const handleEditVariant = (variant: PhoneVariant) => {
    setEditingVariant(variant);
    setVariantForm({ 
      name: variant.name, 
      storage: variant.storage, 
      ram: variant.ram, 
      color: variant.color, 
      price: variant.price 
    });
    setIsEditing(true);
  };

  const handleUpdateVariant = async () => {
    if (!editingVariant) return;

    try {
      const response = await fetch('/api/phone-variants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingVariant.id,
          name: variantForm.name,
          modelId: params.modelId,
          storage: variantForm.storage,
          ram: variantForm.ram,
          color: variantForm.color,
          price: variantForm.price
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setAlert({ type: 'success', message: 'Variant updated successfully' });
        setVariantForm({ name: '', storage: '', ram: '', color: '', price: 0 });
        setEditingVariant(null);
        setIsEditing(false);
        fetchData();
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to update variant' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update variant' });
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm('Are you sure you want to delete this variant? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/phone-variants?id=${variantId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (data.success) {
        setAlert({ type: 'success', message: 'Variant deleted successfully' });
        fetchData();
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to delete variant' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete variant' });
    }
  };

  const handleCancelEdit = () => {
    setEditingVariant(null);
    setIsEditing(false);
    setVariantForm({ name: '', storage: '', ram: '', color: '', price: 0 });
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
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Model not found</h1>
        <Link href={`/admin/phones/${params.brandId}`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Models
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/phones/${params.brandId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Models
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{brand.name} {model.name}</h1>
          <p className="text-muted-foreground">{model.description}</p>
        </div>
      </div>

      {alert && (
        <Alert className={alert.type === 'success' ? 'border-green-500' : 'border-red-500'}>
          <AlertDescription className={alert.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Variants ({variants.length})</h2>
          <p className="text-muted-foreground">Manage variants for {brand.name} {model.name}</p>
        </div>
        <Dialog open={isEditing || false} onOpenChange={(open) => !open && handleCancelEdit()}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsEditing(false)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Variant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Variant' : 'Create New Variant'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update the variant information.' : `Add a new variant to ${brand.name} ${model.name}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="variantName">Variant Name</Label>
                <Input
                  id="variantName"
                  value={variantForm.name}
                  onChange={(e) => setVariantForm({ ...variantForm, name: e.target.value })}
                  placeholder="e.g., 128GB Black, 256GB White"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="variantStorage">Storage</Label>
                  <Input
                    id="variantStorage"
                    value={variantForm.storage}
                    onChange={(e) => setVariantForm({ ...variantForm, storage: e.target.value })}
                    placeholder="e.g., 128GB"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="variantRam">RAM</Label>
                  <Input
                    id="variantRam"
                    value={variantForm.ram}
                    onChange={(e) => setVariantForm({ ...variantForm, ram: e.target.value })}
                    placeholder="e.g., 8GB"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="variantColor">Color</Label>
                  <Input
                    id="variantColor"
                    value={variantForm.color}
                    onChange={(e) => setVariantForm({ ...variantForm, color: e.target.value })}
                    placeholder="e.g., Black, White"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="variantPrice">Price ($)</Label>
                  <Input
                    id="variantPrice"
                    type="number"
                    value={variantForm.price}
                    onChange={(e) => setVariantForm({ ...variantForm, price: Number(e.target.value) })}
                    placeholder="999"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={isEditing ? handleUpdateVariant : handleCreateVariant} 
                  className="flex-1"
                >
                  {isEditing ? 'Update Variant' : 'Create Variant'}
                </Button>
                {isEditing && (
                  <Button 
                    variant="outline" 
                    onClick={handleCancelEdit}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {variants.map((variant) => (
          <Card key={variant.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                {variant.name}
              </CardTitle>
              <CardDescription>
                {variant.storage} • {variant.ram} • {variant.color}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price:</span>
                  <Badge variant="secondary" className="text-lg font-semibold">
                    ${variant.price}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  📅 Created {new Date(variant.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditVariant(variant)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteVariant(variant.id)}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {variants.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <Cpu className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No variants found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first variant for {brand.name} {model.name}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
