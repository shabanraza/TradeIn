import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { users, accounts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get all users
    const allUsers = await db.select().from(users);
    
    // Get all accounts
    const allAccounts = await db.select().from(accounts);
    
    return NextResponse.json({
      users: allUsers,
      accounts: allAccounts,
      userCount: allUsers.length,
      accountCount: allAccounts.length
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Database query failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
