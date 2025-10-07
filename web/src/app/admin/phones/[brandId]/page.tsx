'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Layers, Eye, ArrowRight, Smartphone, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUpload } from '@/components/ui/image-upload';

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

export default function BrandDetailPage({ params }: { params: { brandId: string } }) {
  const [brand, setBrand] = useState<PhoneBrand | null>(null);
  const [models, setModels] = useState<PhoneModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [modelForm, setModelForm] = useState({ 
    name: '', 
    description: '', 
    image: '',
    // Quick variant creation
    createVariant: true,
    variantName: '',
    variantStorage: '',
    variantRam: '',
    variantColor: '',
    variantPrice: 0
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editingModel, setEditingModel] = useState<PhoneModel | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBrandAndModels();
  }, [params.brandId]);

  const fetchBrandAndModels = async () => {
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

      // Fetch models for this brand
      const modelsResponse = await fetch(`/api/phone-models?brandId=${params.brandId}`);
      const modelsData = await modelsResponse.json();
      
      if (modelsData.success) {
        setModels(modelsData.models);
      } else {
        setAlert({ type: 'error', message: 'Failed to load models' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setAlert({ type: 'error', message: 'Failed to load data' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateModel = async () => {
    try {
      let imageUrl = modelForm.image;

      // Upload image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('type', 'product');

        const uploadResponse = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: formData
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        } else {
          setAlert({ type: 'error', message: 'Failed to upload image' });
          return;
        }
      }

      // Create the model first
      const modelResponse = await fetch('/api/phone-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: modelForm.name,
          brandId: params.brandId,
          description: modelForm.description,
          image: imageUrl
        })
      });

      const modelData = await modelResponse.json();
      
      if (!modelData.success) {
        setAlert({ type: 'error', message: modelData.error || 'Failed to create model' });
        return;
      }

      // If user wants to create a variant too
      if (modelForm.createVariant && modelForm.variantName) {
        const variantResponse = await fetch('/api/phone-variants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: modelForm.variantName,
            modelId: modelData.model.id,
            storage: modelForm.variantStorage,
            ram: modelForm.variantRam,
            color: modelForm.variantColor,
            price: modelForm.variantPrice
          })
        });

        const variantData = await variantResponse.json();
        
        if (!variantData.success) {
          setAlert({ type: 'error', message: 'Model created but failed to create variant: ' + variantData.error });
          return;
        }
      }

      setAlert({ type: 'success', message: 'Model created successfully' + (modelForm.createVariant ? ' with first variant' : '') });
      setModelForm({ 
        name: '', 
        description: '', 
        image: '',
        createVariant: true,
        variantName: '',
        variantStorage: '',
        variantRam: '',
        variantColor: '',
        variantPrice: 0
      });
      setSelectedImage(null);
      fetchBrandAndModels();
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to create model' });
    }
  };

  const handleEditModel = (model: PhoneModel) => {
    setEditingModel(model);
    setModelForm({ 
      name: model.name, 
      description: model.description, 
      image: model.image,
      createVariant: false,
      variantName: '',
      variantStorage: '',
      variantRam: '',
      variantColor: '',
      variantPrice: 0
    });
    setIsEditing(true);
  };

  const handleUpdateModel = async () => {
    if (!editingModel) return;

    try {
      let imageUrl = modelForm.image;

      // Upload image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('type', 'product');

        const uploadResponse = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: formData
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        } else {
          setAlert({ type: 'error', message: 'Failed to upload image' });
          return;
        }
      }

      const response = await fetch('/api/phone-models', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingModel.id,
          name: modelForm.name,
          brandId: params.brandId,
          description: modelForm.description,
          image: imageUrl
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setAlert({ type: 'success', message: 'Model updated successfully' });
        setModelForm({ 
          name: '', 
          description: '', 
          image: '',
          createVariant: true,
          variantName: '',
          variantStorage: '',
          variantRam: '',
          variantColor: '',
          variantPrice: 0
        });
        setSelectedImage(null);
        setEditingModel(null);
        setIsEditing(false);
        fetchBrandAndModels();
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to update model' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update model' });
    }
  };

  const handleDeleteModel = async (modelId: string) => {
    if (!confirm('Are you sure you want to delete this model? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/phone-models?id=${modelId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (data.success) {
        setAlert({ type: 'success', message: 'Model deleted successfully' });
        fetchBrandAndModels();
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to delete model' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete model' });
    }
  };

  const handleCancelEdit = () => {
    setEditingModel(null);
    setIsEditing(false);
    setModelForm({ 
      name: '', 
      description: '', 
      image: '',
      createVariant: true,
      variantName: '',
      variantStorage: '',
      variantRam: '',
      variantColor: '',
      variantPrice: 0
    });
    setSelectedImage(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Brand not found</h1>
        <Link href="/admin/phones">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brands
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/phones">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brands
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{brand.name}</h1>
          <p className="text-muted-foreground">{brand.description}</p>
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
          <h2 className="text-2xl font-semibold">Models ({models.length})</h2>
          <p className="text-muted-foreground">Manage phone models for {brand.name}</p>
        </div>
        <Dialog open={isEditing || false} onOpenChange={(open) => !open && handleCancelEdit()}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsEditing(false)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Model
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Model' : 'Create New Model'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update the phone model information.' : `Add a new phone model to ${brand.name}. You can also create the first variant.`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="modelName">Model Name</Label>
                <Input
                  id="modelName"
                  value={modelForm.name}
                  onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })}
                  placeholder="e.g., iPhone 15, Galaxy S24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelDescription">Description</Label>
                <Textarea
                  id="modelDescription"
                  value={modelForm.description}
                  onChange={(e) => setModelForm({ ...modelForm, description: e.target.value })}
                  placeholder="Model description and features"
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
                type="product"
              />
              
              <div className="space-y-2">
                <Label htmlFor="modelImage">Or enter Image URL manually</Label>
                <Input
                  id="modelImage"
                  value={modelForm.image}
                  onChange={(e) => setModelForm({ ...modelForm, image: e.target.value })}
                  placeholder="https://example.com/model.jpg"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="createVariant"
                    checked={modelForm.createVariant}
                    onChange={(e) => setModelForm({ ...modelForm, createVariant: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="createVariant">Create first variant for this model</Label>
                </div>

                {modelForm.createVariant && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium">Variant Details</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="variantName">Variant Name</Label>
                        <Input
                          id="variantName"
                          value={modelForm.variantName}
                          onChange={(e) => setModelForm({ ...modelForm, variantName: e.target.value })}
                          placeholder="e.g., 128GB Black"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="variantStorage">Storage</Label>
                          <Input
                            id="variantStorage"
                            value={modelForm.variantStorage}
                            onChange={(e) => setModelForm({ ...modelForm, variantStorage: e.target.value })}
                            placeholder="e.g., 128GB"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="variantRam">RAM</Label>
                          <Input
                            id="variantRam"
                            value={modelForm.variantRam}
                            onChange={(e) => setModelForm({ ...modelForm, variantRam: e.target.value })}
                            placeholder="e.g., 8GB"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="variantColor">Color</Label>
                          <Input
                            id="variantColor"
                            value={modelForm.variantColor}
                            onChange={(e) => setModelForm({ ...modelForm, variantColor: e.target.value })}
                            placeholder="e.g., Black"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="variantPrice">Price ($)</Label>
                          <Input
                            id="variantPrice"
                            type="number"
                            value={modelForm.variantPrice}
                            onChange={(e) => setModelForm({ ...modelForm, variantPrice: Number(e.target.value) })}
                            placeholder="999"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={isEditing ? handleUpdateModel : handleCreateModel} 
                  className="flex-1"
                >
                  {isEditing ? 'Update Model' : `Create Model${modelForm.createVariant ? ' with Variant' : ''}`}
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
        {models.map((model) => (
          <Card key={model.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                {model.name}
              </CardTitle>
              <CardDescription>{model.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  📅 Created {new Date(model.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Link href={`/admin/phones/${params.brandId}/${model.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Variants
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditModel(model)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteModel(model.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {models.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No models found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first model for {brand.name}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
