'use client';

import { Badge } from '@/components/ui/badge';
import { marketplaceColors } from '@/lib/design-system';

// Local type definition matching our database schema
type ProductCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'broken';

interface ConditionBadgeProps {
  condition: ProductCondition;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'solid';
  className?: string;
}

const conditionConfig = {
  excellent: {
    label: 'Excellent',
    color: marketplaceColors.condition.excellent,
    description: 'Like new, minimal wear',
  },
  good: {
    label: 'Good',
    color: marketplaceColors.condition.good,
    description: 'Minor wear, fully functional',
  },
  fair: {
    label: 'Fair',
    color: marketplaceColors.condition.fair,
    description: 'Visible wear, works well',
  },
  poor: {
    label: 'Poor',
    color: marketplaceColors.condition.poor,
    description: 'Heavy wear, may have issues',
  },
  broken: {
    label: 'Broken',
    color: marketplaceColors.condition.broken,
    description: 'Not working, for parts only',
  },
} as const;

export function ConditionBadge({
  condition,
  size = 'md',
  variant = 'default',
  className,
}: ConditionBadgeProps) {
  const config = conditionConfig[condition];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'solid':
        return {
          backgroundColor: config.color,
          color: 'white',
          border: 'none',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: config.color,
          borderColor: config.color,
          border: '1px solid',
        };
      default:
        return {
          backgroundColor: config.color + '20',
          color: config.color,
          borderColor: config.color,
          border: '1px solid',
        };
    }
  };

  return (
    <Badge
      className={`${sizeClasses[size]} font-medium ${className}`}
      style={getVariantStyles()}
      title={config.description}
    >
      {config.label}
    </Badge>
  );
}
