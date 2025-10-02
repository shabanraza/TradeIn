import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { users, accounts, sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Clear all users, accounts, and sessions
    await db.delete(sessions);
    await db.delete(accounts);
    await db.delete(users);
    
    return NextResponse.json({
      message: 'All users, accounts, and sessions cleared',
      success: true
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to clear data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
