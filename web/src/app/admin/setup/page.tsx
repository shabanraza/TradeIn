'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminSetupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const router = useRouter();

  // Debug: Log when component mounts
  console.log('AdminSetupPage mounted');

  const createAdminUser = async () => {
    if (!email || !name) {
      setResult({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    setIsCreating(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ 
          type: 'success', 
          message: `Admin user created successfully! You can now login with ${email}. Redirecting to login page...` 
        });
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      } else {
        setResult({ type: 'error', message: data.error || 'Failed to create admin user' });
      }
    } catch (error) {
      setResult({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Admin Setup</CardTitle>
          <CardDescription>
            Create your first admin user to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result && (
            <Alert className={result.type === 'success' ? 'border-green-500' : 'border-red-500'}>
              {result.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription className={result.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                {result.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Admin User"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isCreating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@oldphone.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isCreating}
              />
              <p className="text-sm text-muted-foreground">
                This email will be used for admin login
              </p>
            </div>

            <Button 
              onClick={createAdminUser} 
              className="w-full" 
              disabled={isCreating}
            >
              {isCreating ? 'Creating Admin...' : 'Create Admin User'}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>After creating the admin user, you will be redirected to login where you can:</p>
            <ul className="mt-2 space-y-1">
              <li>• Login with Google OAuth using this email</li>
              <li>• Use Email OTP authentication</li>
              <li>• Access the admin panel at /admin</li>
            </ul>
            <p className="mt-3 text-xs text-orange-600">
              ⚠️ You must login with the admin account to access /admin
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
