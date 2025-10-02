'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Store, Search, Mail, Calendar, MapPin, Phone, Grid3X3, List, CheckCircle, XCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

interface Retailer {
  id: string;
  email: string;
  name: string;
  role: string;
  isEmailVerified: boolean;
  isRetailerApproved: boolean;
  businessName: string;
  businessAddress: string;
  phone: string;
  location: string;
  createdAt: string;
}

export default function RetailersPage() {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [filteredRetailers, setFilteredRetailers] = useState<Retailer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchRetailers();
  }, []);

  useEffect(() => {
    filterRetailers();
  }, [retailers, searchTerm]);

  const fetchRetailers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (data.success) {
        // Filter only retailers
        const retailerUsers = data.users.filter((user: Retailer) => user.role === 'retailer');
        setRetailers(retailerUsers);
      }
    } catch (error) {
      console.error('Error fetching retailers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRetailers = () => {
    let filtered = retailers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(retailer => 
        retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        retailer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (retailer.businessName && retailer.businessName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredRetailers(filtered);
  };

  const handleApproveRetailer = async (retailerId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/admin/retailers/${retailerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRetailerApproved: approved })
      });

      const data = await response.json();
      
      if (data.success) {
        setAlert({ type: 'success', message: `Retailer ${approved ? 'approved' : 'suspended'} successfully` });
        fetchRetailers();
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to update retailer' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update retailer' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Retailers</h1>
          <p className="text-muted-foreground">
            Manage all retailer accounts
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {alert && (
        <Alert className={alert.type === 'success' ? 'border-green-500' : 'border-red-500'}>
          <AlertDescription className={alert.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search retailers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Store className="h-3 w-3" />
          {filteredRetailers.length} retailers
        </Badge>
      </div>

      <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
        {filteredRetailers.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">
                {searchTerm ? 'No retailers found' : 'No retailers yet'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'No retailer accounts have been created yet'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRetailers.map((retailer) => (
            <Card key={retailer.id} className="hover:shadow-md transition-shadow">
              {viewMode === 'grid' ? (
                <>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="h-5 w-5" />
                      {retailer.businessName || retailer.name}
                    </CardTitle>
                    <CardDescription>{retailer.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={retailer.isRetailerApproved ? 'default' : 'secondary'}>
                          {retailer.isRetailerApproved ? 'Approved' : 'Pending'}
                        </Badge>
                        <Badge variant={retailer.isEmailVerified ? 'default' : 'outline'}>
                          {retailer.isEmailVerified ? 'Verified' : 'Unverified'}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{retailer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{retailer.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>Joined {new Date(retailer.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        {!retailer.isRetailerApproved ? (
                          <Button
                            size="sm"
                            onClick={() => handleApproveRetailer(retailer.id, true)}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Approve
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleApproveRetailer(retailer.id, false)}
                            className="flex items-center gap-1"
                          >
                            <XCircle className="h-3 w-3" />
                            Suspend
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Store className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">{retailer.businessName || retailer.name}</h3>
                        <p className="text-sm text-muted-foreground">{retailer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={retailer.isRetailerApproved ? 'default' : 'secondary'}>
                          {retailer.isRetailerApproved ? 'Approved' : 'Pending'}
                        </Badge>
                        <Badge variant={retailer.isEmailVerified ? 'default' : 'outline'}>
                          {retailer.isEmailVerified ? 'Verified' : 'Unverified'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(retailer.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2">
                        {!retailer.isRetailerApproved ? (
                          <Button
                            size="sm"
                            onClick={() => handleApproveRetailer(retailer.id, true)}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Approve
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleApproveRetailer(retailer.id, false)}
                            className="flex items-center gap-1"
                          >
                            <XCircle className="h-3 w-3" />
                            Suspend
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
