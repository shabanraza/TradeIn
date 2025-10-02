import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    console.log('Create admin API called');
    const { email, name } = await request.json();
    console.log('Received data:', { email, name });

    if (!email || !name) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingAdmin.length > 0) {
      return NextResponse.json(
        { error: 'Admin user with this email already exists' },
        { status: 409 }
      );
    }

    // Create admin user
    const [adminUser] = await db.insert(users).values({
      email: email,
      name: name,
      role: 'super_admin',
      emailVerified: true,
      isRetailerApproved: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    console.log('Admin user created:', {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}
