'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { marketplaceColors } from '@/lib/design-system';

// Local type definitions matching our database schema
type ProductCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'broken';
type UserRole = 'customer' | 'retailer' | 'super_admin';

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
}

export interface SearchFilters {
  query: string;
  minPrice: number;
  maxPrice: number;
  condition: ProductCondition[];
  category: string[];
  location: string;
  sortBy: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'relevance';
  retailerType: UserRole[];
}

const conditionOptions = [
  { value: 'excellent', label: 'Excellent', color: marketplaceColors.condition.excellent },
  { value: 'good', label: 'Good', color: marketplaceColors.condition.good },
  { value: 'fair', label: 'Fair', color: marketplaceColors.condition.fair },
  { value: 'poor', label: 'Poor', color: marketplaceColors.condition.poor },
  { value: 'broken', label: 'Broken', color: marketplaceColors.condition.broken },
] as const;

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'relevance', label: 'Most Relevant' },
] as const;

const retailerTypeOptions = [
  { value: 'customer', label: 'Individual Sellers', color: marketplaceColors.role.customer },
  { value: 'retailer', label: 'Verified Retailers', color: marketplaceColors.role.retailer },
] as const;

export function SearchFilters({ onFiltersChange, initialFilters = {} }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    minPrice: 0,
    maxPrice: 10000,
    condition: [],
    category: [],
    location: '',
    sortBy: 'newest',
    retailerType: [],
    ...initialFilters,
  });

  const updateFilters = (updates: Partial<SearchFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleCondition = (condition: ProductCondition) => {
    const newConditions = filters.condition.includes(condition)
      ? filters.condition.filter(c => c !== condition)
      : [...filters.condition, condition];
    updateFilters({ condition: newConditions });
  };

  const toggleRetailerType = (type: UserRole) => {
    const newTypes = filters.retailerType.includes(type)
      ? filters.retailerType.filter(t => t !== type)
      : [...filters.retailerType, type];
    updateFilters({ retailerType: newTypes });
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      minPrice: 0,
      maxPrice: 10000,
      condition: [],
      category: [],
      location: '',
      sortBy: 'newest',
      retailerType: [],
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFiltersCount = [
    filters.query,
    filters.minPrice > 0,
    filters.maxPrice < 10000,
    filters.condition.length > 0,
    filters.category.length > 0,
    filters.location,
    filters.retailerType.length > 0,
  ].filter(Boolean).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          {activeFiltersCount > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{activeFiltersCount} active</Badge>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search Query */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search for phones, brands, models..."
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
          />
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
                Min Price
              </Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="0"
                value={filters.minPrice || ''}
                onChange={(e) => updateFilters({ minPrice: Number(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                Max Price
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="10000"
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilters({ maxPrice: Number(e.target.value) || 10000 })}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Condition */}
        <div className="space-y-3">
          <Label>Condition</Label>
          <div className="flex flex-wrap gap-2">
            {conditionOptions.map((option) => (
              <Button
                key={option.value}
                variant={filters.condition.includes(option.value as ProductCondition) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleCondition(option.value as ProductCondition)}
                className="text-xs"
                style={{
                  backgroundColor: filters.condition.includes(option.value as ProductCondition)
                    ? option.color
                    : undefined,
                  borderColor: option.color,
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Retailer Type */}
        <div className="space-y-3">
          <Label>Seller Type</Label>
          <div className="flex flex-wrap gap-2">
            {retailerTypeOptions.map((option) => (
              <Button
                key={option.value}
                variant={filters.retailerType.includes(option.value as UserRole) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleRetailerType(option.value as UserRole)}
                className="text-xs"
                style={{
                  backgroundColor: filters.retailerType.includes(option.value as UserRole)
                    ? option.color
                    : undefined,
                  borderColor: option.color,
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, State, or ZIP"
            value={filters.location}
            onChange={(e) => updateFilters({ location: e.target.value })}
          />
        </div>

        <Separator />

        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sortBy">Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => updateFilters({ sortBy: value as SearchFilters['sortBy'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
