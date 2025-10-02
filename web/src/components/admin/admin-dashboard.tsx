'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Store, Smartphone, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  users: {
    total: number;
    customers: number;
    retailers: number;
    pendingRetailers: number;
    activeRetailers: number;
  };
  phoneDatabase: {
    brands: number;
    models: number;
    variants: number;
  };
  leads: {
    total: number;
    new: number;
    contacted: number;
    interested: number;
    closed: number;
    rejected: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    users: {
      total: 0,
      customers: 0,
      retailers: 0,
      pendingRetailers: 0,
      activeRetailers: 0
    },
    phoneDatabase: {
      brands: 0,
      models: 0,
      variants: 0
    },
    leads: {
      total: 0,
      new: 0,
      contacted: 0,
      interested: 0,
      closed: 0,
      rejected: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch stats data
      const statsResponse = await fetch('/api/admin/stats');
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mt-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your marketplace from here.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.users.customers} customers, {stats.users.retailers} retailers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retailers</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.retailers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.users.pendingRetailers} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phone Brands</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.phoneDatabase.brands}</div>
            <p className="text-xs text-muted-foreground">
              {stats.phoneDatabase.models} models, {stats.phoneDatabase.variants} variants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phone Database</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.phoneDatabase.variants}</div>
            <p className="text-xs text-muted-foreground">
              Total phone variants
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Leads Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.leads.total}</div>
            <p className="text-xs text-muted-foreground">
              Customer phone selling requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.leads.new}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting retailer response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.leads.closed}</div>
            <p className="text-xs text-muted-foreground">
              Successful deals completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Retailer Management
            </CardTitle>
            <CardDescription>
              Manage retailer accounts and approvals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending Approvals</span>
              <Badge variant={stats.users.pendingRetailers > 0 ? "destructive" : "secondary"}>
                {stats.users.pendingRetailers}
              </Badge>
            </div>
            <Link href="/admin/retailers">
              <Button className="w-full">
                Manage Retailers
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Phone Database
            </CardTitle>
            <CardDescription>
              Manage phone brands, models, and variants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/phones">
              <Button className="w-full">
                Manage Phone Database
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Leads Management
            </CardTitle>
            <CardDescription>
              Monitor all customer leads and retailer performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>New Leads</span>
                <Badge variant={stats.leads.new > 0 ? "destructive" : "secondary"}>
                  {stats.leads.new}
                </Badge>
              </div>
              <Link href="/admin/leads">
                <Button className="w-full">
                  View All Leads
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage all user accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/users">
              <Button className="w-full">
                Manage Users
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {stats.users.pendingRetailers > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              Pending Retailer Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700">
              You have {stats.users.pendingRetailers} retailer applications waiting for approval.
            </p>
            <Link href="/admin/retailers">
              <Button variant="outline" className="mt-3">
                Review Applications
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
