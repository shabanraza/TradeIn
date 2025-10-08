'use client';

import { useSession } from '@/lib/auth/session';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertCircle, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import AdminDashboard from '@/components/admin/admin-dashboard';

export default function AdminPage() {
  const { user, isLoading } = useSession();
  const router = useRouter();

  // Debug logging
  console.log('AdminPage - isLoading:', isLoading);
  console.log('AdminPage - user:', user);
  console.log('AdminPage - user role:', user?.role);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'super_admin')) {
      // Don't redirect immediately, show the access denied page
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-destructive rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-destructive-foreground" />
            </div>
            <CardTitle className="text-2xl">Admin Access Required</CardTitle>
            <CardDescription>
              You need to be logged in as an admin to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-orange-500">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <AlertDescription className="text-orange-700">
                You must be logged in with an admin account to access the admin panel.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Link href="/auth/signin" className="block">
                <Button className="w-full">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login with Admin Account
                </Button>
              </Link>
              
              <Link href="/admin/setup" className="block">
                <Button variant="outline" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Admin Account
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>If you don&apos;t have an admin account yet:</p>
              <ol className="mt-2 space-y-1 text-left">
                <li>1. Click &quot;Create Admin Account&quot; above</li>
                <li>2. Fill in your admin details</li>
                <li>3. Login with your admin account</li>
                <li>4. Access the admin panel</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is logged in as admin, show the admin dashboard
  return <AdminDashboard />;
}