'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDiscount?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
  xl: 'text-3xl',
};

export function PriceDisplay({
  price,
  originalPrice,
  currency = 'USD',
  size = 'md',
  showDiscount = true,
  className,
}: PriceDisplayProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateDiscount = () => {
    if (!originalPrice || originalPrice <= price) return null;
    const discount = ((originalPrice - price) / originalPrice) * 100;
    return Math.round(discount);
  };

  const discount = calculateDiscount();

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className="flex flex-col">
        <span className={cn('font-bold text-primary', sizeClasses[size])}>
          {formatPrice(price)}
        </span>
        
        {originalPrice && originalPrice > price && (
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>
      
      {showDiscount && discount && discount > 0 && (
        <Badge
          variant="destructive"
          className="text-xs font-bold"
        >
          -{discount}%
        </Badge>
      )}
    </div>
  );
}
