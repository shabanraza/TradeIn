'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layouts';
import { UserAvatar, PriceDisplay, ConditionBadge } from '@/components/marketplace';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { MapPin, Star, Heart, MessageCircle, Shield, Truck, RotateCcw, Share2, Flag } from 'lucide-react';

// Mock product data
const mockProduct = {
  id: '1',
  title: 'iPhone 14 Pro Max',
  description: 'This iPhone 14 Pro Max is in excellent condition with minimal signs of wear. The device has been well-maintained and comes with all original accessories. Perfect for someone looking for a premium iPhone experience at a fraction of the retail price.',
  price: 899,
  originalPrice: 1199,
  condition: 'excellent' as const,
  images: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
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
    rating: 4.9,
    totalSales: 156,
    verified: true
  },
  specifications: {
    'Storage': '256GB',
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
};

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-foreground">Products</a>
          <span>/</span>
          <span className="text-foreground">{mockProduct.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              <span className="text-8xl">📱</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {mockProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-muted rounded-md flex items-center justify-center transition-all ${
                    selectedImage === index ? 'ring-2 ring-primary' : 'hover:bg-muted/80'
                  }`}
                >
                  <span className="text-2xl">📱</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {mockProduct.title}
                  </h1>
                  <p className="text-muted-foreground mb-4">
                    {mockProduct.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <ConditionBadge condition={mockProduct.condition} size="md" />
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      New York, NY
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      👁 {mockProduct.views} views
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
                    {isFavorited ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Flag className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="border-t pt-6">
              <PriceDisplay
                price={mockProduct.price}
                originalPrice={mockProduct.originalPrice}
                size="xl"
                showDiscount={true}
              />
            </div>

            {/* Retailer Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <UserAvatar
                    user={mockProduct.retailer}
                    size="md"
                    showRole={true}
                    showBusinessName={true}
                  />
                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{mockProduct.retailer.rating}</span>
                        <span className="text-muted-foreground">({mockProduct.retailer.totalSales} sales)</span>
                      </div>
                      {mockProduct.retailer.verified && (
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
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full" size="lg">
                Contact Seller
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Make Offer
              </Button>
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

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(mockProduct.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b last:border-b-0">
                        <span className="font-medium text-foreground">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mockProduct.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
