'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layouts';
import { UserAvatar, PriceDisplay, ConditionBadge } from '@/components/marketplace';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Star, Heart, MessageCircle, Shield, Truck, RotateCcw, Share2, Flag } from 'lucide-react';
import { useProduct } from '@/hooks/api/useProduct';
import Image from 'next/image';

// Helper function to transform API product to display format
const transformProduct = (apiProduct: any) => ({
  id: apiProduct.id,
  title: apiProduct.title || apiProduct.name,
  description: apiProduct.description || '',
  price: parseFloat(apiProduct.price),
  originalPrice: apiProduct.originalPrice ? parseFloat(apiProduct.originalPrice) : undefined,
  condition: apiProduct.condition,
  images: apiProduct.images || [],
  views: 0, // API doesn't provide views yet
  isSold: !apiProduct.isActive,
  isNew: apiProduct.phoneType === 'new',
  isRefurbished: apiProduct.phoneType === 'refurbished',
  createdAt: new Date(apiProduct.createdAt),
  retailer: {
    id: apiProduct.retailerId,
    name: apiProduct.retailer?.name || 'Unknown',
    email: apiProduct.retailer?.email || '',
    businessName: apiProduct.retailer?.businessName || 'Unknown Business',
    location: apiProduct.retailer?.location || '',
    role: 'retailer' as const,
    rating: 4.5, // Default rating
    totalSales: 0, // Default sales count
    verified: true // Default verified status
  },
  specifications: {
    'Storage': '256GB', // Default specs - could be enhanced with real data
    'Color': 'Space Black',
    'Battery Health': '98%',
    'Screen Size': '6.7"',
    'Camera': '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
    'Operating System': 'iOS 17.2',
    'Network': '5G',
    'Warranty': '3 months'
  },
  features: [
    'A16 Bionic chip',
    'Pro camera system',
    'Face ID',
    'Wireless charging',
    '5G connectivity',
    'Ceramic Shield front',
    'Surgical-grade stainless steel'
  ]
});

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // Use real API data
  const { data: productData, isLoading, error } = useProduct(productId);

  // Transform API data to display format
  const product = productData?.product ? transformProduct(productData.product) : null;

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Product not found
            </h3>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : 'The product you are looking for does not exist.'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl">📱</span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(product.images && product.images.length > 0 ? product.images : ['/api/placeholder/200/200']).map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-muted rounded-md flex items-center justify-center transition-all overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-primary' : 'hover:bg-muted/80'
                  }`}
                >
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">📱</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info - Shopify Style */}
          <div className="space-y-6">
            {/* Product Title & Price */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.title}
              </h1>
              <div className="mb-4">
                <PriceDisplay
                  price={product.price}
                  originalPrice={product.originalPrice}
                  size="xl"
                  showDiscount={true}
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Condition:</span>
                  <span className="font-medium">
                    <ConditionBadge condition={product.condition} size="sm" />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">
                    {product.isNew ? 'New' : product.isRefurbished ? 'Refurbished' : 'Used'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{product.retailer.location || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views:</span>
                  <span className="font-medium">{product.views}</span>
                </div>
              </div>
            </div>

            {/* Retailer Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
              <div className="flex items-center justify-between">
                <UserAvatar
                  user={product.retailer}
                  size="md"
                  showRole={true}
                  showBusinessName={true}
                />
                <div className="flex items-center gap-2">
                  <div className="text-right text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{product.retailer.rating}</span>
                      <span className="text-muted-foreground">({product.retailer.totalSales} sales)</span>
                    </div>
                    {product.retailer.verified && (
                      <div className="flex items-center gap-1 text-green-600 text-xs">
                        <Shield className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <Button className="flex-1" size="lg">
                Contact Seller
              </Button>
              <Button variant="outline" className="flex-1" size="lg">
                Make Offer
              </Button>
            </div>

            {/* Product Description */}
            <div className="prose prose-sm max-w-none pt-6 border-t">
              <h3 className="text-lg font-semibold mb-3">Product Description</h3>
              <div className="text-muted-foreground leading-relaxed">
                {product.description}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto text-green-600 mb-2" />
                <p className="text-sm font-medium">Free Shipping</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                <p className="text-sm font-medium">30-Day Returns</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                <p className="text-sm font-medium">Buyer Protection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>
                Reviews from verified buyers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No reviews yet</p>
                <p className="text-sm">Be the first to review this product!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
