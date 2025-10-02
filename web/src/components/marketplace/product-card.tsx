'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { marketplaceColors } from '@/lib/design-system';
import Link from 'next/link';

// Local type definitions matching our database schema
type ProductCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'broken';
type UserRole = 'customer' | 'retailer' | 'super_admin';

interface ProductCardProps {
  id: string;
  title: string;
  description?: string;
  price: number;
  condition: ProductCondition;
  images?: string[];
  retailer: {
    id: string;
    name: string;
    image?: string;
    businessName?: string;
    role: UserRole;
  };
  views?: number;
  isSold?: boolean;
  createdAt: Date;
}

const conditionColors = {
  excellent: 'bg-green-100 text-green-800 border-green-200',
  good: 'bg-blue-100 text-blue-800 border-blue-200',
  fair: 'bg-orange-100 text-orange-800 border-orange-200',
  poor: 'bg-red-100 text-red-800 border-red-200',
  broken: 'bg-gray-100 text-gray-800 border-gray-200',
};

const conditionLabels = {
  excellent: 'Excellent',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
  broken: 'Broken',
};

export function ProductCard({
  id,
  title,
  description,
  price,
  condition,
  images,
  retailer,
  views,
  isSold,
  createdAt,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={`/products/${id}`}>
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 overflow-hidden">
            {images && images.length > 0 ? (
              <img
                src={images[0]}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg
                  className="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          
            {/* Sold Overlay */}
            {isSold && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  SOLD
                </Badge>
              </div>
            )}

            {/* Condition Badge */}
            <Badge
              className={`absolute top-2 left-2 ${conditionColors[condition]}`}
            >
              {conditionLabels[condition]}
            </Badge>

            {/* Views Badge */}
            {views && views > 0 && (
              <Badge
                variant="secondary"
                className="absolute top-2 right-2 bg-black/50 text-white border-0"
              >
                👁 {views}
              </Badge>
            )}
          </div>

          <CardHeader className="pb-2">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(price)}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(createdAt)}
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-0">
            <div className="flex items-center justify-between w-full">
              {/* Retailer Info */}
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={retailer.image} />
                  <AvatarFallback className="text-xs">
                    {retailer.name?.charAt(0) || retailer.businessName?.charAt(0) || 'R'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {retailer.businessName || retailer.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-xs w-fit"
                    style={{
                      backgroundColor: marketplaceColors.role[retailer.role] + '20',
                      borderColor: marketplaceColors.role[retailer.role],
                      color: marketplaceColors.role[retailer.role],
                    }}
                  >
                    {retailer.role.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              {/* Action Button */}
              <Button
                size="sm"
                variant="outline"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  // Handle quick action
                }}
              >
                View Details
              </Button>
            </div>
          </CardFooter>
        </div>
      </Link>
    </Card>
  );
}
