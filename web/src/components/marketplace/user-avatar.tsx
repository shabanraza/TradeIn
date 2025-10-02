'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { marketplaceColors } from '@/lib/design-system';

// Local type definition matching our database schema
type UserRole = 'customer' | 'retailer' | 'super_admin';

interface UserAvatarProps {
  user: {
    id: string;
    name?: string;
    email: string;
    image?: string;
    role: UserRole;
    businessName?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showRole?: boolean;
  showBusinessName?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const roleLabels = {
  customer: 'Customer',
  retailer: 'Retailer',
  super_admin: 'Admin',
} as const;

export function UserAvatar({
  user,
  size = 'md',
  showRole = false,
  showBusinessName = false,
  className = '',
}: UserAvatarProps) {
  const getInitials = () => {
    if (user.businessName) {
      return user.businessName.charAt(0).toUpperCase();
    }
    if (user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return user.email.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    if (showBusinessName && user.businessName) {
      return user.businessName;
    }
    return user.name || user.email;
  };

  const getRoleColor = (role: UserRole) => {
    return marketplaceColors.role[role];
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={user.image} alt={getDisplayName()} />
        <AvatarFallback
          className="text-xs font-medium"
          style={{
            backgroundColor: getRoleColor(user.role) + '20',
            color: getRoleColor(user.role),
          }}
        >
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col">
        <span className="text-sm font-medium truncate max-w-[120px]">
          {getDisplayName()}
        </span>
        
        {showRole && (
          <Badge
            variant="outline"
            className="text-xs w-fit"
            style={{
              backgroundColor: getRoleColor(user.role) + '20',
              borderColor: getRoleColor(user.role),
              color: getRoleColor(user.role),
            }}
          >
            {roleLabels[user.role]}
          </Badge>
        )}
      </div>
    </div>
  );
}
