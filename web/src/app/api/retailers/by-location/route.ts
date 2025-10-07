import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    
    if (!location) {
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      );
    }

    console.log('Finding retailers for location:', location);
    
    // Get all approved retailers
    const retailers = await db
      .select({
        id: users.id,
        businessName: users.businessName,
        location: users.location,
        phone: users.phone,
        isRetailerApproved: users.isRetailerApproved
      })
      .from(users)
      .where(
        and(
          eq(users.role, 'retailer'),
          eq(users.isRetailerApproved, true)
        )
      );

    console.log('Found retailers:', retailers.length);

    return NextResponse.json({
      success: true,
      retailers
    });

  } catch (error) {
    console.error('Error fetching retailers by location:', error);
    return NextResponse.json(
      { error: 'Failed to fetch retailers' },
      { status: 500 }
    );
  }
}
