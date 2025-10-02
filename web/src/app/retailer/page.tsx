'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowRight
} from 'lucide-react';
import { useSession } from '@/lib/auth/session';
import Link from 'next/link';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  interestedLeads: number;
  closedLeads: number;
  rejectedLeads: number;
}

export default function RetailerDashboard() {
  const { user } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    interestedLeads: 0,
    closedLeads: 0,
    rejectedLeads: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user?.id]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/leads?retailerId=${user?.id}`);
      const data = await response.json();
      
      if (data.success) {
        const leads = data.leads;
        const stats = {
          totalLeads: leads.length,
          newLeads: leads.filter((lead: any) => lead.status === 'new').length,
          contactedLeads: leads.filter((lead: any) => lead.status === 'contacted').length,
          interestedLeads: leads.filter((lead: any) => lead.status === 'interested').length,
          closedLeads: leads.filter((lead: any) => lead.status === 'closed').length,
          rejectedLeads: leads.filter((lead: any) => lead.status === 'rejected').length,
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
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
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Manage your customer leads and grow your business
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              All customer requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newLeads}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interested</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interestedLeads}</div>
            <p className="text-xs text-muted-foreground">
              Potential customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contactedLeads}</div>
            <p className="text-xs text-muted-foreground">
              In communication
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.closedLeads}</div>
            <p className="text-xs text-muted-foreground">
              Successful deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejectedLeads}</div>
            <p className="text-xs text-muted-foreground">
              Not interested
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Manage Leads
            </CardTitle>
            <CardDescription>
              View and manage all your customer leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/retailer/leads">
              <Button className="w-full">
                View All Leads
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance
            </CardTitle>
            <CardDescription>
              Track your lead conversion and success rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Conversion Rate</span>
                <span className="font-medium">
                  {stats.totalLeads > 0 ? Math.round((stats.closedLeads / stats.totalLeads) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Response Rate</span>
                <span className="font-medium">
                  {stats.totalLeads > 0 ? Math.round(((stats.contactedLeads + stats.interestedLeads + stats.closedLeads + stats.rejectedLeads) / stats.totalLeads) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {stats.newLeads > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Clock className="h-5 w-5" />
              New Leads Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 mb-3">
              You have {stats.newLeads} new customer leads waiting for your response. 
              Quick response times lead to higher conversion rates!
            </p>
            <Link href="/retailer/leads">
              <Button variant="outline" className="border-orange-300 text-orange-800 hover:bg-orange-100">
                View New Leads
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
