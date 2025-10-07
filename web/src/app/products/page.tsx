'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Grid, List, SlidersHorizontal, ChevronRight, Home, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Label } from '@/components/ui/label';

// Mock data for demonstration
const mockProducts = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max',
    description: 'Excellent condition, 256GB, Space Black',
    price: 899,
    originalPrice: 1099,
    condition: 'excellent' as const,
    images: ['/api/placeholder/300/200'],
    views: 156,
    isSold: false,
    isNew: true,
    isRefurbished: false,
    createdAt: new Date('2024-01-15'),
    retailer: {
      id: 'retailer-1',
      name: 'John Smith',
      businessName: 'TechStore NYC',
      role: 'retailer' as const,
    }
  },
  {
    id: '2',
    title: 'Samsung Galaxy S23 Ultra',
    description: 'Like new, 512GB, Phantom Black',
    price: 799,
    originalPrice: 999,
    condition: 'good' as const,
    images: ['/api/placeholder/300/200'],
    views: 89,
    isSold: false,
    isNew: false,
    isRefurbished: true,
    createdAt: new Date('2024-01-10'),
    retailer: {
      id: 'retailer-2',
      name: 'Sarah Johnson',
      businessName: 'Mobile Hub LA',
      role: 'retailer' as const,
    }
  },
  {
    id: '3',
    title: 'Google Pixel 7 Pro',
    description: 'Good condition, 128GB, Obsidian',
    price: 599,
    originalPrice: 799,
    condition: 'good' as const,
    images: ['/api/placeholder/300/200'],
    views: 67,
    isSold: false,
    isNew: true,
    isRefurbished: false,
    createdAt: new Date('2024-01-08'),
    retailer: {
      id: 'retailer-3',
      name: 'Mike Chen',
      businessName: 'Pixel Store Chicago',
      role: 'retailer' as const,
    }
  },
  {
    id: '4',
    title: 'OnePlus 11',
    description: 'Excellent condition, 256GB, Titan Black',
    price: 499,
    originalPrice: 699,
    condition: 'excellent' as const,
    images: ['/api/placeholder/300/200'],
    views: 43,
    isSold: false,
    isNew: false,
    isRefurbished: true,
    createdAt: new Date('2024-01-05'),
    retailer: {
      id: 'retailer-4',
      name: 'Alex Rodriguez',
      businessName: 'OnePlus Miami',
      role: 'retailer' as const,
    }
  },
  {
    id: '5',
    title: 'iPhone 13 Pro',
    description: 'Excellent condition, 128GB, Sierra Blue',
    price: 699,
    originalPrice: 899,
    condition: 'excellent' as const,
    images: ['/api/placeholder/300/200'],
    views: 78,
    isSold: false,
    isNew: true,
    isRefurbished: false,
    createdAt: new Date('2024-01-03'),
    retailer: {
      id: 'retailer-5',
      name: 'David Kim',
      businessName: 'iPhone Store NYC',
      role: 'retailer' as const,
    }
  }
];

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    sortBy: 'newest',
    category: '',
    condition: 'all',
    priceRange: 'all',
    brand: 'all',
    storage: 'all',
    color: 'all',
    productType: 'all'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = mockProducts.filter(product => {
    if (filters.condition && filters.condition !== 'all' && product.condition !== filters.condition) {
      return false;
    }
    if (filters.productType && filters.productType !== 'all') {
      if (filters.productType === 'new' && !product.isNew) {
        return false;
      }
      if (filters.productType === 'refurbished' && !product.isRefurbished) {
        return false;
      }
      if (filters.productType === 'used' && product.isNew) {
        return false;
      }
    }
    if (filters.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (filters.priceRange === '1500+') {
        if (product.price < 1500) return false;
      } else if (max) {
        if (product.price < min || product.price > max) return false;
      }
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
      <div>
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb 
            items={[
              { label: 'Products' }
            ]} 
          />
        </div>

        {/* Categories Section - Centered */}
        <div className="mb-6 flex flex-col items-center">
          <h2 className="text-xl font-bold text-foreground mb-4 text-center">Category name</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center max-w-5xl">
            {[
              { name: 'Phones', icon: '📱', color: 'bg-blue-50' },
              { name: 'Headsets', icon: '🎧', color: 'bg-blue-50' },
              { name: 'Laptops', icon: '💻', color: 'bg-blue-50' },
              { name: 'TV sets', icon: '📺', color: 'bg-blue-50' },
              { name: 'Sound', icon: '🔊', color: 'bg-blue-50' },
              { name: 'Watches', icon: '⌚', color: 'bg-blue-50' },
              { name: 'Others', icon: '💡', color: 'bg-blue-50' },
              { name: 'Internet', icon: '📶', color: 'bg-blue-50' }
            ].map((category) => (
              <div
                key={category.name}
                className={`flex-shrink-0 w-20 h-20 ${category.color} rounded-full cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col items-center justify-center ${
                  filters.category === category.name 
                    ? 'ring-2 ring-primary shadow-md' 
                    : 'hover:shadow-sm'
                }`}
                onClick={() => setFilters({ ...filters, category: filters.category === category.name ? '' : category.name })}
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-xs font-medium text-gray-900 text-center">{category.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-4">
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-800/30 shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm"
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>

              <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Product Type Filter */}
                <div className="space-y-2">
                  <Label>Product Type</Label>
                  <Select
                    value={filters.productType}
                    onValueChange={(value) => setFilters({ ...filters, productType: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="refurbished">Refurbished</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Condition Filter */}
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select
                    value={filters.condition}
                    onValueChange={(value) => setFilters({ ...filters, condition: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Conditions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <Select
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-200">Under $200</SelectItem>
                      <SelectItem value="200-500">$200 - $500</SelectItem>
                      <SelectItem value="500-1000">$500 - $1000</SelectItem>
                      <SelectItem value="1000-1500">$1000 - $1500</SelectItem>
                      <SelectItem value="1500+">Over $1500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand Filter */}
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Select
                    value={filters.brand}
                    onValueChange={(value) => setFilters({ ...filters, brand: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="samsung">Samsung</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="oneplus">OnePlus</SelectItem>
                      <SelectItem value="xiaomi">Xiaomi</SelectItem>
                      <SelectItem value="huawei">Huawei</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Storage Filter */}
                <div className="space-y-2">
                  <Label>Storage</Label>
                  <Select
                    value={filters.storage}
                    onValueChange={(value) => setFilters({ ...filters, storage: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Storage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Storage</SelectItem>
                      <SelectItem value="64">64GB</SelectItem>
                      <SelectItem value="128">128GB</SelectItem>
                      <SelectItem value="256">256GB</SelectItem>
                      <SelectItem value="512">512GB</SelectItem>
                      <SelectItem value="1tb">1TB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Color Filter */}
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Select
                    value={filters.color}
                    onValueChange={(value) => setFilters({ ...filters, color: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Colors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Colors</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={() => setFilters({ sortBy: 'newest', category: '', condition: 'all', priceRange: 'all', brand: 'all', storage: 'all', color: 'all', productType: 'all' })}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {sortedProducts.length} phone{sortedProducts.length !== 1 ? 's' : ''} found
                </span>
                {filters.category && (
                  <Badge variant="secondary">
                    {filters.category}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
                >
                  <SelectTrigger className="w-[160px] rounded-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex gap-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-full"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-full"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid - Maximum 4 per row */}
            {sortedProducts.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'
                  : 'space-y-4'
              }>
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
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
                  Try adjusting your search terms.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Screenshot-style Product Card Component
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'broken';
  images?: string[];
  views: number;
  isSold: boolean;
  isNew: boolean;
  isRefurbished: boolean;
  createdAt: Date;
  retailer: {
    id: string;
    name: string;
    businessName: string;
    role: 'retailer';
  };
}

function ProductCard({ product, viewMode }: { product: Product; viewMode: 'grid' | 'list' }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (viewMode === 'list') {
    return (
      <div className="group hover:shadow-sm transition-all duration-200 overflow-hidden bg-white rounded-lg shadow-sm border border-gray-100">
        <Link href={`/products/${product.id}`}>
          <div className="flex">
            {/* Image */}
            <div className="w-16 h-16 bg-gray-100 overflow-hidden flex-shrink-0 rounded-l-lg">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-lg">📱</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-1 mb-1">
                    {product.isNew && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs font-medium">
                        NEW
                      </Badge>
                    )}
                    {product.isRefurbished && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-medium">
                        REFURBISHED
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-1">{product.description}</p>
                </div>
                <div className="text-right ml-2">
                  <div className="text-sm font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </div>
                  {product.originalPrice && (
                    <div className="text-xs text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="group hover:shadow-md transition-all duration-200 overflow-hidden bg-white rounded-lg shadow-sm border border-gray-100">
      <Link href={`/products/${product.id}`}>
        <div className="relative">
          {/* Product Image - Further reduced size */}
          <div className="aspect-square bg-gray-100 overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                width={160}
                height={160}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-2xl">📱</span>
              </div>
            )}
          </div>

          <div className="p-2">
            {/* Badge */}
            <div className="mb-1">
              {product.isNew && (
                <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs font-medium">
                  NEW
                </Badge>
              )}
              {product.isRefurbished && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-medium">
                  REFURBISHED
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {product.title}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-1">
                {product.description}
              </p>

              {/* Price */}
              <div className="pt-1">
                <div className="text-xs text-gray-500 mb-1">From</div>
                <div className="text-sm font-bold text-gray-900">
                  {formatPrice(product.price)}
                </div>
                {product.originalPrice && (
                  <div className="text-xs text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}