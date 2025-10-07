import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { users } from '@/lib/db/schema';
import { eq, ne } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching all users...');
    
    // Get all users except super_admin
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        emailVerified: users.emailVerified,
        isRetailerApproved: users.isRetailerApproved,
        businessName: users.businessName,
        businessAddress: users.businessAddress,
        phone: users.phone,
        location: users.location,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .where(ne(users.role, 'super_admin'))
      .orderBy(users.createdAt);

    console.log('Users found:', allUsers.length);

    // Group users by role
    const usersByRole = {
      customer: allUsers.filter((user: any) => user.role === 'customer'),
      retailer: allUsers.filter((user: any) => user.role === 'retailer'),
      admin: allUsers.filter((user: any) => user.role === 'admin')
    };

    return NextResponse.json({
      success: true,
      users: allUsers,
      usersByRole,
      stats: {
        total: allUsers.length,
        customers: usersByRole.customer.length,
        retailers: usersByRole.retailer.length,
        admins: usersByRole.admin.length
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
