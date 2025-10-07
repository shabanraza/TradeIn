'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Store, 
  Smartphone, 
  IndianRupee,
  Eye,
  ShoppingCart,
  Star,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

// Mock data for demonstration
const mockAnalytics = {
  overview: {
    totalUsers: 2456,
    activeRetailers: 142,
    totalProducts: 1234,
    totalRevenue: 245678,
    monthlyGrowth: {
      users: 12.5,
      retailers: 8.3,
      products: 15.2,
      revenue: 23.1
    }
  },
  userStats: {
    newUsers: 156,
    activeUsers: 1890,
    returningUsers: 410,
    userRetention: 78.5
  },
  productStats: {
    totalListings: 1234,
    soldProducts: 456,
    averagePrice: 18999,
    topCategory: 'Smartphones'
  },
  revenue: {
    total: 245678,
    monthly: 45678,
    averageOrder: 1299,
    growth: 23.1
  }
};

const mockChartData = {
  userGrowth: [
    { month: 'Jan', users: 1200, retailers: 45 },
    { month: 'Feb', users: 1350, retailers: 52 },
    { month: 'Mar', users: 1500, retailers: 58 },
    { month: 'Apr', users: 1680, retailers: 65 },
    { month: 'May', users: 1890, retailers: 72 },
    { month: 'Jun', users: 2100, retailers: 80 },
    { month: 'Jul', users: 2300, retailers: 88 },
    { month: 'Aug', users: 2456, retailers: 95 }
  ],
  revenue: [
    { month: 'Jan', revenue: 15000 },
    { month: 'Feb', revenue: 18000 },
    { month: 'Mar', revenue: 22000 },
    { month: 'Apr', revenue: 28000 },
    { month: 'May', revenue: 35000 },
    { month: 'Jun', revenue: 42000 },
    { month: 'Jul', revenue: 48000 },
    { month: 'Aug', revenue: 45678 }
  ]
};

const mockTopProducts = [
  { name: 'iPhone 14 Pro Max', sales: 45, revenue: 45000, growth: 12.5 },
  { name: 'Samsung Galaxy S23 Ultra', sales: 38, revenue: 38000, growth: 8.3 },
  { name: 'Google Pixel 7 Pro', sales: 32, revenue: 32000, growth: 15.2 },
  { name: 'OnePlus 11', sales: 28, revenue: 28000, growth: 6.7 },
  { name: 'iPhone 13 Pro', sales: 25, revenue: 25000, growth: -2.1 }
];

const mockTopRetailers = [
  { name: 'TechStore NYC', sales: 156, revenue: 156000, rating: 4.9, growth: 15.2 },
  { name: 'Mobile Hub LA', sales: 134, revenue: 134000, rating: 4.8, growth: 12.3 },
  { name: 'Pixel Store Chicago', sales: 98, revenue: 98000, rating: 4.7, growth: 8.9 },
  { name: 'Phone Palace Miami', sales: 87, revenue: 87000, rating: 4.6, growth: 6.4 },
  { name: 'Device Depot Seattle', sales: 76, revenue: 76000, rating: 4.5, growth: 4.2 }
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your marketplace performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.overview.totalUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-green-500">+{mockAnalytics.overview.monthlyGrowth.users}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Retailers</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.overview.activeRetailers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-green-500">+{mockAnalytics.overview.monthlyGrowth.retailers}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.overview.totalProducts.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-green-500">+{mockAnalytics.overview.monthlyGrowth.products}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{mockAnalytics.overview.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-green-500">+{mockAnalytics.overview.monthlyGrowth.revenue}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  Monthly user and retailer growth over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Chart visualization would go here</p>
                    <p className="text-sm text-muted-foreground">Integration with chart library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
                <CardDescription>
                  Monthly revenue trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                  <div className="text-center">
                    <IndianRupee className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Revenue chart would go here</p>
                    <p className="text-sm text-muted-foreground">Integration with chart library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>
                Best performing products this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTopProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.sales} sales • ₹{product.revenue.toLocaleString()} revenue
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={product.growth > 0 ? 'default' : 'destructive'}>
                        {product.growth > 0 ? '+' : ''}{product.growth}%
                      </Badge>
                      <div className="text-right">
                        <div className="font-medium">₹{product.revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{product.sales} sales</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>New Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockAnalytics.userStats.newUsers}</div>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockAnalytics.userStats.activeUsers}</div>
                <p className="text-sm text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockAnalytics.userStats.userRetention}%</div>
                <p className="text-sm text-muted-foreground">Monthly retention rate</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockAnalytics.productStats.totalListings}</div>
                <p className="text-sm text-muted-foreground">Active products</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sold Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockAnalytics.productStats.soldProducts}</div>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{mockAnalytics.productStats.averagePrice.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Per product</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{mockAnalytics.revenue.total.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{mockAnalytics.revenue.monthly.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{mockAnalytics.revenue.averageOrder.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Per transaction</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Top Retailers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Retailers</CardTitle>
          <CardDescription>
            Best performing retailers this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTopRetailers.map((retailer, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{retailer.name}</div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{retailer.rating}</span>
                      <span>•</span>
                      <span>{retailer.sales} sales</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={retailer.growth > 0 ? 'default' : 'destructive'}>
                    {retailer.growth > 0 ? '+' : ''}{retailer.growth}%
                  </Badge>
                  <div className="text-right">
                    <div className="font-medium">₹{retailer.revenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{retailer.sales} sales</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
