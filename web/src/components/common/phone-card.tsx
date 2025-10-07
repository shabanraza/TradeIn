'use client'

import { Smartphone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PhoneCardProps {
  id: string
  name: string
  image?: string
  icon?: string
  href: string
  className?: string
  onClick?: () => void
}

export function PhoneCard({ 
  id, 
  name, 
  image, 
  icon, 
  href, 
  className,
  onClick 
}: PhoneCardProps) {
  return (
    <Link href={href} onClick={onClick}>
      <Card className={cn(
        'group hover:shadow-sm transition-all duration-200 hover:scale-105 cursor-pointer',
        className
      )}>
        <CardContent className="p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
            {image || icon ? (
              <Image
                src={image || icon || ''}
                alt={name}
                width={24}
                height={24}
                className="w-6 h-6"
              />
            ) : (
              <Smartphone className="h-6 w-6 text-gray-600" />
            )}
          </div>
          <h3 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </CardContent>
      </Card>
    </Link>
  )
}

