'use client';

import { useSession } from '@/lib/auth/session';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DebugSessionPage() {
  const { user, isLoading, isSigningOut } = useSession();

  const checkSessions = async () => {
    console.log('=== MANUAL SESSION CHECK ===');
    
    // Check Better Auth session
    try {
      const betterAuthResponse = await fetch('/api/auth/better-auth-session?' + Date.now());
      const betterAuthData = await betterAuthResponse.json();
      console.log('Better Auth session:', betterAuthData);
    } catch (error) {
      console.log('Better Auth session error:', error);
    }
    
    // Check custom session
    try {
      const customResponse = await fetch('/api/auth/session?' + Date.now());
      const customData = await customResponse.json();
      console.log('Custom session:', customData);
    } catch (error) {
      console.log('Custom session error:', error);
    }
    
    // Check cookies
    console.log('All cookies:', document.cookie);
    console.log('=== END MANUAL CHECK ===');
  };

  return (
    <div className="min-h-screen p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Session Debug</CardTitle>
          <CardDescription>
            Debug information about your current session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Session State:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify({
                isLoading,
                isSigningOut,
                user: user ? {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  role: user.role
                } : null
              }, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold">User Role Check:</h3>
            <p className="text-sm">
              Role: <code className="bg-gray-100 px-2 py-1 rounded">{user?.role || 'null'}</code>
            </p>
            <p className="text-sm">
              Is Super Admin: <code className="bg-gray-100 px-2 py-1 rounded">{user?.role === 'super_admin' ? 'true' : 'false'}</code>
            </p>
          </div>

          <Button onClick={checkSessions} className="w-full">
            Check Sessions Manually
          </Button>

          <div className="text-sm text-muted-foreground">
            <p>Check the browser console for detailed session information.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
