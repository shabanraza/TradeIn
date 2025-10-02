'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  Search
} from 'lucide-react';
import { useSession } from '@/lib/auth/session';

interface Lead {
  id: string;
  customerId: string;
  retailerId: string;
  phoneBrand: string;
  phoneModel: string;
  phoneVariant?: string;
  condition: string;
  storage?: string;
  color?: string;
  purchaseDate?: string;
  warrantyStatus?: string;
  accessories?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerLocation: string;
  preferredContactMethod: string;
  preferredContactTime?: string;
  estimatedValue?: number;
  status: string;
  notes?: string;
  retailerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function RetailerLeadsPage() {
  const { user } = useSession();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchLeads();
    }
  }, [user?.id]);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/leads?retailerId=${user?.id}`);
      const data = await response.json();
      
      if (data.success) {
        setLeads(data.leads);
      } else {
        setAlert({ type: 'error', message: 'Failed to load leads' });
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      setAlert({ type: 'error', message: 'Failed to fetch leads' });
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: string, retailerNotes?: string, estimatedValue?: number) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          retailerNotes,
          estimatedValue
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setAlert({ type: 'success', message: 'Lead updated successfully' });
        fetchLeads();
        setSelectedLead(null);
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to update lead' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update lead' });
    }
  };

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

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phoneBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phoneModel.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customer Leads</h1>
        <p className="text-muted-foreground">
          Manage customer phone selling requests and close deals
        </p>
      </div>

      {alert && (
        <Alert className={alert.type === 'success' ? 'border-green-500' : 'border-red-500'}>
          <AlertDescription className={alert.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

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
            <SelectItem value="all">All Leads</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="interested">Interested</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{lead.customerName}</CardTitle>
                <Badge className={getStatusColor(lead.status)}>
                  {getStatusIcon(lead.status)}
                  <span className="ml-1 capitalize">{lead.status}</span>
                </Badge>
              </div>
              <CardDescription>
                {lead.phoneBrand} {lead.phoneModel} {lead.phoneVariant}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.customerLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Prefer: {lead.preferredContactMethod}</span>
                </div>
                {lead.estimatedValue && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>₹{lead.estimatedValue.toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Lead Details</DialogTitle>
                      <DialogDescription>
                        Customer: {lead.customerName} • {lead.phoneBrand} {lead.phoneModel}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      {/* Customer Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Customer Name</Label>
                          <p className="text-sm text-muted-foreground">{lead.customerName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Phone</Label>
                          <p className="text-sm text-muted-foreground">{lead.customerPhone}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Email</Label>
                          <p className="text-sm text-muted-foreground">{lead.customerEmail}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Location</Label>
                          <p className="text-sm text-muted-foreground">{lead.customerLocation}</p>
                        </div>
                      </div>

                      {/* Phone Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Phone Brand</Label>
                          <p className="text-sm text-muted-foreground">{lead.phoneBrand}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Model</Label>
                          <p className="text-sm text-muted-foreground">{lead.phoneModel}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Condition</Label>
                          <p className="text-sm text-muted-foreground capitalize">{lead.condition}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Storage</Label>
                          <p className="text-sm text-muted-foreground">{lead.storage || 'Not specified'}</p>
                        </div>
                      </div>

                      {/* Notes */}
                      {lead.notes && (
                        <div>
                          <Label className="text-sm font-medium">Customer Notes</Label>
                          <p className="text-sm text-muted-foreground">{lead.notes}</p>
                        </div>
                      )}

                      {/* Retailer Actions */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="retailerNotes">Your Notes</Label>
                          <Textarea
                            id="retailerNotes"
                            placeholder="Add your notes about this lead..."
                            defaultValue={lead.retailerNotes || ''}
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => updateLeadStatus(lead.id, 'contacted')}
                            variant="outline"
                            size="sm"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Mark as Contacted
                          </Button>
                          <Button
                            onClick={() => updateLeadStatus(lead.id, 'interested')}
                            variant="outline"
                            size="sm"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Interested
                          </Button>
                          <Button
                            onClick={() => updateLeadStatus(lead.id, 'closed')}
                            size="sm"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Close Lead
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No leads found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'You don\'t have any customer leads yet. Customers will submit phone selling requests here.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
