import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/server';

export default async function RetailerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }
  
  // For now, allow all authenticated users to access retailer dashboard
  // TODO: Add proper role-based access control
  // if (session.user.role !== 'retailer' && session.user.role !== 'super_admin') {
  //   redirect('/');
  // }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Retailer Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/retailer/leads" className="text-sm font-medium hover:text-primary">
                Leads
              </a>
              <a href="/auth/signout" className="text-sm font-medium hover:text-primary">
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
