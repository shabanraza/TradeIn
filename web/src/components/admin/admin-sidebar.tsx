'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Users,
  Store,
  Smartphone,
  BarChart3,
  Settings,
  FileText,
  Bell,
  Shield,
  Database,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    current: true
  },
  {
    name: 'Retailers',
    href: '/admin/retailers',
    icon: Store,
    badge: 14,
    children: [
      { name: 'Applications', href: '/admin/retailers/applications' },
      { name: 'Active Retailers', href: '/admin/retailers/active' },
      { name: 'Suspended', href: '/admin/retailers/suspended' }
    ]
  },
  {
    name: 'Phone Database',
    href: '/admin/phones',
    icon: Smartphone,
    children: [
      { name: 'Brands', href: '/admin/phones/brands' },
      { name: 'Models', href: '/admin/phones/models' },
      { name: 'Variants', href: '/admin/phones/variants' }
    ]
  },
  {
    name: 'Leads',
    href: '/admin/leads',
    icon: FileText,
    badge: 0
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    children: [
      { name: 'All Users', href: '/admin/users' },
      { name: 'Customers', href: '/admin/users/customers' },
      { name: 'Retailers', href: '/admin/users/retailers' }
    ]
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    name: 'System',
    href: '/admin/system',
    icon: Settings,
    children: [
      { name: 'Settings', href: '/admin/system/settings' },
      { name: 'Notifications', href: '/admin/system/notifications' },
      { name: 'Logs', href: '/admin/system/logs' }
    ]
  }
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={cn(
      "fixed left-0 top-0 z-50 h-full bg-card border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">Marketplace Management</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <div key={item.name}>
              <div
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Link href={item.href} className="flex items-center space-x-3 flex-1">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
                
                {!collapsed && item.children && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(item.name)}
                    className="p-1 h-auto"
                  >
                    {expandedItems.includes(item.name) ? (
                      <ChevronLeft className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>

              {/* Sub-navigation */}
              {!collapsed && item.children && expandedItems.includes(item.name) && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive(child.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-muted-foreground">super_admin</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
