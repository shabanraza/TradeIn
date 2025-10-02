'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layouts';
import { ProductCard, SearchFilters } from '@/components/marketplace';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchFilters as SearchFiltersType } from '@/components/marketplace';
import { Search, Grid, List, SlidersHorizontal } from 'lucide-react';

// Mock data for demonstration
const mockProducts = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max',
    description: 'Excellent condition, 256GB, Space Black',
    price: 899,
    condition: 'excellent' as const,
    images: ['/api/placeholder/300/200'],
    views: 156,
    isSold: false,
    createdAt: new Date('2024-01-15'),
    retailer: {
      id: 'retailer-1',
      name: 'John Smith',
      email: 'john@techstore.com',
      image: '/api/placeholder/40/40',
      businessName: 'TechStore NYC',
      role: 'retailer' as const,
    }
  },
  {
    id: '2',
    title: 'Samsung Galaxy S23 Ultra',
    description: 'Like new, 512GB, Phantom Black',
    price: 799,
    condition: 'good' as const,
    images: ['/api/placeholder/300/200'],
    views: 89,
    isSold: false,
    createdAt: new Date('2024-01-10'),
    retailer: {
      id: 'retailer-2',
      name: 'Sarah Johnson',
      email: 'sarah@mobilehub.com',
      image: '/api/placeholder/40/40',
      businessName: 'Mobile Hub LA',
      role: 'retailer' as const,
    }
  },
  {
    id: '3',
    title: 'Google Pixel 7 Pro',
    description: 'Good condition, 128GB, Obsidian',
    price: 599,
    condition: 'good' as const,
    images: ['/api/placeholder/300/200'],
    views: 67,
    isSold: false,
    createdAt: new Date('2024-01-08'),
    retailer: {
      id: 'retailer-3',
      name: 'Mike Chen',
      email: 'mike@pixelstore.com',
      image: '/api/placeholder/40/40',
      businessName: 'Pixel Store Chicago',
      role: 'retailer' as const,
    }
  },
  {
    id: '4',
    title: 'OnePlus 11',
    description: 'Excellent condition, 256GB, Titan Black',
    price: 499,
    condition: 'excellent' as const,
    images: ['/api/placeholder/300/200'],
    views: 43,
    isSold: false,
    createdAt: new Date('2024-01-05'),
    retailer: {
      id: 'retailer-4',
      name: 'Alex Rodriguez',
      email: 'alex@oneplusmiami.com',
      image: '/api/placeholder/40/40',
      businessName: 'OnePlus Miami',
      role: 'retailer' as const,
    }
  }
];

export default function ProductsPage() {
  const [filters, setFilters] = useState<SearchFiltersType>({
    query: '',
    minPrice: 0,
    maxPrice: 10000,
    condition: [],
    category: [],
    location: '',
    sortBy: 'newest',
    retailerType: [],
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = mockProducts.filter(product => {
    // Search query
    if (filters.query && !product.title.toLowerCase().includes(filters.query.toLowerCase()) &&
        !product.description.toLowerCase().includes(filters.query.toLowerCase())) {
      return false;
    }

    // Price range
    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }

    // Condition filter
    if (filters.condition.length > 0 && !filters.condition.includes(product.condition)) {
      return false;
    }

    // Retailer type filter
    if (filters.retailerType.length > 0 && !filters.retailerType.includes(product.retailer.role)) {
      return false;
    }

    return true;
  });

  const sortProducts = (products: typeof mockProducts) => {
    switch (filters.sortBy) {
      case 'price_low':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price_high':
        return [...products].sort((a, b) => b.price - a.price);
      case 'oldest':
        return [...products].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      case 'newest':
      default:
        return [...products].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  };

  const sortedProducts = sortProducts(filteredProducts);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Browse Phones
          </h1>
          <p className="text-muted-foreground">
            Find the perfect used phone from verified retailers
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-1/4">
            <SearchFilters
              onFiltersChange={setFilters}
              initialFilters={filters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {sortedProducts.length} phone{sortedProducts.length !== 1 ? 's' : ''} found
                </span>
                {filters.query && (
                  <Badge variant="secondary">
                    "{filters.query}"
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>

                {/* Sort */}
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => setFilters({ ...filters, sortBy: value as any })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mb-6">
                <SearchFilters
                  onFiltersChange={setFilters}
                  initialFilters={filters}
                />
              </div>
            )}

            {/* Products Grid/List */}
            {sortedProducts.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No phones found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    query: '',
                    minPrice: 0,
                    maxPrice: 10000,
                    condition: [],
                    category: [],
                    location: '',
                    sortBy: 'newest',
                    retailerType: [],
                  })}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
