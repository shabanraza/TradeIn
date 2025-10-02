'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, CheckCircle, XCircle, Clock, MapPin, Phone, Mail } from 'lucide-react';

interface RetailerApplication {
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

export default function RetailerApplicationsPage() {
  const [applications, setApplications] = useState<RetailerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/retailers');
      const data = await response.json();
      
      if (data.success) {
        // Filter only pending applications (not approved)
        const pendingApplications = data.retailers.filter((retailer: RetailerApplication) => !retailer.isRetailerApproved);
        setApplications(pendingApplications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setAlert({ type: 'error', message: 'Failed to fetch applications' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveApplication = async (retailerId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/admin/retailers/${retailerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRetailerApproved: approved })
      });

      const data = await response.json();
      
      if (data.success) {
        setAlert({ type: 'success', message: `Application ${approved ? 'approved' : 'rejected'} successfully` });
        fetchApplications();
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to update application' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update application' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Retailer Applications</h1>
          <p className="text-muted-foreground">Loading applications...</p>
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
        <h1 className="text-3xl font-bold">Retailer Applications</h1>
        <p className="text-muted-foreground">
          Review and approve new retailer applications
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
        {applications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No pending applications</h3>
              <p className="text-muted-foreground">
                All retailer applications have been reviewed
              </p>
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {application.businessName}
                    </CardTitle>
                    <CardDescription>
                      Application from {application.name}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{application.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{application.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{application.location}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Business Address:</span>
                      <p className="text-muted-foreground">{application.businessAddress}</p>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Applied:</span>
                      <p className="text-muted-foreground">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => handleApproveApplication(application.id, true)}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleApproveApplication(application.id, false)}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
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
