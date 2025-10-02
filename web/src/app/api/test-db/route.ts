import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { users } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    
    // Test database connection by counting users
    const userCount = await db.select().from(users);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount: userCount.length
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
