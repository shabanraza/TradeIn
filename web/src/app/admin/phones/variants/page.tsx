'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Cpu, Smartphone, Package, ArrowRight, Eye, Grid3X3, List } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

interface PhoneVariant {
  id: string;
  name: string;
  modelId: string;
  storage: string;
  ram: string;
  color: string;
  price: number;
  createdAt: string;
  model: {
    id: string;
    name: string;
    brand: {
      id: string;
      name: string;
    };
  };
}

export default function PhoneVariantsPage() {
  const [variants, setVariants] = useState<PhoneVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchVariants();
  }, []);

  const fetchVariants = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/phone-variants');
      const data = await response.json();
      
      if (data.success) {
        setVariants(data.variants);
      }
    } catch (error) {
      console.error('Error fetching variants:', error);
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
          <h1 className="text-3xl font-bold">Phone Variants</h1>
          <p className="text-muted-foreground">
            View all phone variants across all models
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
        {variants.map((variant) => (
          <Card key={variant.id} className="hover:shadow-md transition-shadow">
            {viewMode === 'grid' ? (
              <>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    {variant.name}
                  </CardTitle>
                  <CardDescription>
                    {variant.model?.brand?.name || 'Unknown Brand'} {variant.model?.name || 'Unknown Model'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {variant.storage && (
                        <Badge variant="secondary" className="text-xs">
                          {variant.storage}
                        </Badge>
                      )}
                      {variant.ram && (
                        <Badge variant="secondary" className="text-xs">
                          {variant.ram}
                        </Badge>
                      )}
                      {variant.color && (
                        <Badge variant="secondary" className="text-xs">
                          {variant.color}
                        </Badge>
                      )}
                    </div>
                    {variant.price > 0 && (
                      <p className="text-sm font-medium text-green-600">
                        ${variant.price}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      📅 Created {new Date(variant.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cpu className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">{variant.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {variant.model?.brand?.name || 'Unknown Brand'} {variant.model?.name || 'Unknown Model'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-wrap gap-1">
                      {variant.storage && (
                        <Badge variant="secondary" className="text-xs">
                          {variant.storage}
                        </Badge>
                      )}
                      {variant.ram && (
                        <Badge variant="secondary" className="text-xs">
                          {variant.ram}
                        </Badge>
                      )}
                      {variant.color && (
                        <Badge variant="secondary" className="text-xs">
                          {variant.color}
                        </Badge>
                      )}
                    </div>
                    {variant.price > 0 && (
                      <p className="text-sm font-medium text-green-600">
                        ${variant.price}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      📅 {new Date(variant.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        
        {variants.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <Cpu className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No variants found</h3>
              <p className="text-muted-foreground mb-4">
                No phone variants have been created yet
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
