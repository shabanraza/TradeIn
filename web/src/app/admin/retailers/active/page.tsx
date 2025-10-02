'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Store, CheckCircle, XCircle, MapPin, Phone, Mail, Calendar } from 'lucide-react';

interface ActiveRetailer {
  id: string;
  email: string;
  name: string;
  businessName: string;
  businessAddress: string;
  phone: string;
  location: string;
  isRetailerApproved: boolean;
  createdAt: string;
}

export default function ActiveRetailersPage() {
  const [retailers, setRetailers] = useState<ActiveRetailer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchActiveRetailers();
  }, []);

  const fetchActiveRetailers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/retailers');
      const data = await response.json();
      
      if (data.success) {
        // Filter only approved retailers
        const activeRetailers = data.retailers.filter((retailer: ActiveRetailer) => retailer.isRetailerApproved);
        setRetailers(activeRetailers);
      }
    } catch (error) {
      console.error('Error fetching active retailers:', error);
      setAlert({ type: 'error', message: 'Failed to fetch active retailers' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspendRetailer = async (retailerId: string, suspended: boolean) => {
    try {
      const response = await fetch(`/api/admin/retailers/${retailerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRetailerApproved: !suspended })
      });

      const data = await response.json();
      
      if (data.success) {
        setAlert({ type: 'success', message: `Retailer ${suspended ? 'suspended' : 'reactivated'} successfully` });
        fetchActiveRetailers();
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to update retailer' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update retailer' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Active Retailers</h1>
          <p className="text-muted-foreground">Loading active retailers...</p>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
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
        <h1 className="text-3xl font-bold">Active Retailers</h1>
        <p className="text-muted-foreground">
          Manage approved and active retailers
        </p>
      </div>

      {alert && (
        <Alert className={alert.type === 'success' ? 'border-green-500' : 'border-red-500'}>
          <AlertDescription className={alert.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {retailers.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No active retailers</h3>
              <p className="text-muted-foreground">
                No retailers have been approved yet
              </p>
            </CardContent>
          </Card>
        ) : (
          retailers.map((retailer) => (
            <Card key={retailer.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="h-5 w-5" />
                      {retailer.businessName}
                    </CardTitle>
                    <CardDescription>
                      {retailer.name}
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{retailer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{retailer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{retailer.location}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Business Address:</span>
                      <p className="text-muted-foreground">{retailer.businessAddress}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined: {new Date(retailer.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="destructive"
                    onClick={() => handleSuspendRetailer(retailer.id, true)}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Suspend
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
