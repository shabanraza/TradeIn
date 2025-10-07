'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth/session';
import { useLeads } from '@/hooks/api/useLeads';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/header';
import { 
  Smartphone, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  IndianRupee,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

interface Lead {
  id: string;
  phoneBrand: string;
  phoneModel: string;
  condition: string;
  phoneAge: string;
  hasBill: boolean;
  hasBox: boolean;
  screenReplacement: string;
  batteryPercentage: string;
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  estimatedValue?: number;
  createdAt: string;
  retailerNotes?: string;
}

export default function MyListingsPage() {
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();
  const { user, isLoading: sessionLoading } = useSession();

  // TanStack Query for fetching leads
  const { data: leadsData, isLoading, error } = useLeads({ customerId: user?.id });

  useEffect(() => {
    // Check if user is logged in
    if (!sessionLoading && !user) {
      router.push('/auth/signin');
      return;
    }
  }, [user, sessionLoading, router]);

  useEffect(() => {
    if (error) {
      setAlert({ type: 'error', message: 'Failed to fetch your listings' });
    }
  }, [error]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading while checking session or fetching data
  if (sessionLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="text-muted-foreground">
              {sessionLoading ? 'Checking authentication...' : 'Loading your listings...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Listings</h1>
            <p className="text-muted-foreground">Track your phone selling requests</p>
          </div>
          <Link href="/sell">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              List New Phone
            </Button>
          </Link>
        </div>

        {alert && (
          <Alert variant={alert.type === 'error' ? 'destructive' : 'default'} className="mb-6">
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        {(!leadsData || leadsData.leads.length === 0) ? (
          <Card>
            <CardContent className="text-center py-12">
              <Smartphone className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Listings Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't listed any phones for sale yet. Start by listing your first phone!
              </p>
              <Link href="/sell">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  List Your First Phone
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {leadsData?.leads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {lead.phoneBrand} {lead.phoneModel}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Listed on {formatDate(lead.createdAt.toString())}
                      </CardDescription>
                    </div>
                    {getStatusBadge(lead.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Phone Details */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Phone Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-muted-foreground" />
                          <span>Condition: <strong>{lead.condition}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Screen: <strong>{lead.screenReplacement || 'Not specified'}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Bill: <strong>{lead.hasBill ? 'Yes' : 'No'}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Box: <strong>{lead.hasBox ? 'Yes' : 'No'}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{lead.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{lead.customerLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Value */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Status & Value</h4>
                      <div className="space-y-2 text-sm">
                        {lead.estimatedValue && (
                          <div className="flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold text-lg">₹{lead.estimatedValue.toLocaleString()}</span>
                          </div>
                        )}
                        {lead.retailerNotes && (
                          <div className="mt-3">
                            <p className="text-xs text-muted-foreground mb-1">Retailer Notes:</p>
                            <p className="text-sm bg-muted p-2 rounded">{lead.retailerNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {lead.status === 'pending' && (
                          <Button variant="destructive" size="sm">
                            Cancel Request
                          </Button>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {lead.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
