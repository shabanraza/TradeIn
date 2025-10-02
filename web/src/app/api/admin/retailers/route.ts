import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching retailers...');
    
    // Get all users with retailer role
    const retailers = await db
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
      .where(eq(users.role, 'retailer'));

    console.log('Retailers found:', retailers.length);

    return NextResponse.json({
      success: true,
      retailers
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('Error fetching retailers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch retailers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, businessName, businessAddress, phone, location } = await request.json();
    
    console.log('Creating retailer:', { email, name, businessName });

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create retailer user
    const [retailer] = await db.insert(users).values({
      email,
      name,
      role: 'retailer',
      emailVerified: false,
      isRetailerApproved: false,
      businessName,
      businessAddress,
      phone,
      location,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    console.log('Retailer created:', retailer.id);

    return NextResponse.json({
      success: true,
      message: 'Retailer created successfully',
      retailer: {
        id: retailer.id,
        email: retailer.email,
        name: retailer.name,
        businessName: retailer.businessName,
        isRetailerApproved: retailer.isRetailerApproved
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('Error creating retailer:', error);
    return NextResponse.json(
      { error: 'Failed to create retailer' },
      { status: 500 }
    );
  }
}
