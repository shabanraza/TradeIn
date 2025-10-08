'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee
} from 'lucide-react';

// TanStack Query hooks
import { useLeads } from '../../../shared/hooks';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorBoundary } from '@/components/common/error-boundary';

interface Lead {
  id: string;
  customerId: string;
  retailerId: string | null;
  phoneBrand?: {
    id: string;
    name: string;
    icon: string;
  };
  phoneModel?: {
    id: string;
    name: string;
    image: string;
  };
  phoneVariant?: {
    id: string;
    name: string;
    storage: string;
    color: string;
    price: number | null;
  };
  condition: string;
  storage?: string;
  color?: string;
  purchaseDate?: string;
  warrantyStatus?: string;
  accessories?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  preferredContactMethod: string;
  preferredContactTime?: string;
  estimatedValue?: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes?: string;
  retailerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface RetailerStats {
  retailerId: string;
  retailerName: string;
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  interestedLeads: number;
  closedLeads: number;
  rejectedLeads: number;
}

export default function AdminLeadsPage() {
  // TanStack Query hooks
  const { data: leads, isLoading, error } = useLeads();
  
  // Local state for UI
  const [retailerStats, setRetailerStats] = useState<RetailerStats[]>([]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [retailerFilter, setRetailerFilter] = useState<string>('all');



  const calculateRetailerStats = () => {
    if (!leads) return;
    
    const statsMap = new Map<string, RetailerStats>();
    
    leads.forEach(lead => {
      if (!lead.retailerId) return; // Skip leads without retailer
      
      if (!statsMap.has(lead.retailerId)) {
        statsMap.set(lead.retailerId, {
          retailerId: lead.retailerId,
          retailerName: lead.retailerId, // We'll need to fetch retailer names separately
          totalLeads: 0,
          newLeads: 0,
          contactedLeads: 0,
          interestedLeads: 0,
          closedLeads: 0,
          rejectedLeads: 0
        });
      }
      
      const stats = statsMap.get(lead.retailerId)!;
      stats.totalLeads++;
      
      switch (lead.status) {
        case 'pending':
          stats.newLeads++;
          break;
        case 'approved':
          stats.contactedLeads++;
          break;
        case 'completed':
          stats.closedLeads++;
          break;
        case 'rejected':
          stats.rejectedLeads++;
          break;
      }
    });
    
    setRetailerStats(Array.from(statsMap.values()));
  };

  // Update stats when leads data changes
  useEffect(() => {
    calculateRetailerStats();
  }, [leads]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'interested': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="h-4 w-4" />;
      case 'contacted': return <Phone className="h-4 w-4" />;
      case 'interested': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phoneBrand?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phoneModel?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesRetailer = retailerFilter === 'all' || lead.retailerId === retailerFilter;
    
    return matchesSearch && matchesStatus && matchesRetailer;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-muted-foreground">Loading leads...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <h3 className="text-lg font-medium">Error Loading Leads</h3>
          <p className="text-sm">Failed to load leads. Please try again.</p>
        </div>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Leads Overview</h1>
        <p className="text-muted-foreground">
          Monitor all customer leads across all retailers
        </p>
      </div>

      {alert && (
        <Alert className={alert.type === 'success' ? 'border-green-500' : 'border-red-500'}>
          <AlertDescription className={alert.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Retailer Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {retailerStats.map((retailer) => (
          <Card key={retailer.retailerId}>
            <CardHeader>
              <CardTitle className="text-lg">Retailer {retailer.retailerId.slice(0, 8)}</CardTitle>
              <CardDescription>Lead Performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Total Leads</span>
                <span className="font-medium">{retailer.totalLeads}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>New</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {retailer.newLeads}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Contacted</span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  {retailer.contactedLeads}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Interested</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {retailer.interestedLeads}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Closed</span>
                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                  {retailer.closedLeads}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Conversion Rate</span>
                <span className="font-medium">
                  {retailer.totalLeads > 0 ? Math.round((retailer.closedLeads / retailer.totalLeads) * 100) : 0}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="interested">Interested</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={retailerFilter} onValueChange={setRetailerFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by retailer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Retailers</SelectItem>
            {retailerStats.map((retailer) => (
              <SelectItem key={retailer.retailerId} value={retailer.retailerId}>
                {retailer.retailerId.slice(0, 8)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
          <CardDescription>
            Complete overview of all customer leads and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold">{lead.customerName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {lead.phoneBrand?.name} {lead.phoneModel?.name} {lead.phoneVariant?.name}
                          </p>
                        </div>
                        <Badge className={getStatusColor(lead.status)}>
                          {getStatusIcon(lead.status)}
                          <span className="ml-1 capitalize">{lead.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{lead.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{lead.customerEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{lead.customerAddress || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span>Retailer: {lead.retailerId ? lead.retailerId.slice(0, 8) : 'Unassigned'}</span>
                        <span className="mx-2">•</span>
                        <span>Condition: {lead.condition}</span>
                        {lead.estimatedValue && (
                          <>
                            <span className="mx-2">•</span>
                            <span>Est. Value: ₹{lead.estimatedValue.toLocaleString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredLeads.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No leads found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || retailerFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No customer leads have been submitted yet.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
