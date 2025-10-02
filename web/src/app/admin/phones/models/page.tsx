'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone, Package, ArrowRight, Eye, Grid3X3, List } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

interface PhoneModel {
  id: string;
  name: string;
  brandId: string;
  description: string;
  image: string;
  createdAt: string;
  brand: {
    id: string;
    name: string;
  };
}

export default function PhoneModelsPage() {
  const [models, setModels] = useState<PhoneModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/phone-models');
      const data = await response.json();
      
      if (data.success) {
        setModels(data.models);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setIsLoading(false);
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
          <h1 className="text-3xl font-bold">Phone Models</h1>
          <p className="text-muted-foreground">
            View all phone models across all brands
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
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
        {models.map((model) => (
          <Card key={model.id} className="hover:shadow-md transition-shadow">
            {viewMode === 'grid' ? (
              <>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    {model.name}
                  </CardTitle>
                  <CardDescription>{model.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      <Package className="h-3 w-3" />
                      {model.brand?.name || 'Unknown Brand'}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      📅 Created {new Date(model.createdAt).toLocaleDateString()}
                    </p>
                    <Link href={`/admin/phones/${model.brandId}/${model.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Variants
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
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">{model.name}</h3>
                      <p className="text-sm text-muted-foreground">{model.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {model.brand?.name || 'Unknown Brand'}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      📅 {new Date(model.createdAt).toLocaleDateString()}
                    </p>
                    <Link href={`/admin/phones/${model.brandId}/${model.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Variants
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        
        {models.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No models found</h3>
              <p className="text-muted-foreground mb-4">
                No phone models have been created yet
              </p>
              <Link href="/admin/phones">
                <Button>
                  <Package className="h-4 w-4 mr-2" />
                  Go to Brands
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
