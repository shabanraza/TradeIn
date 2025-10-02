import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { sessions } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    console.log('NUCLEAR SIGN OUT - Clearing ALL sessions');
    
    // Delete ALL sessions from database (nuclear option)
    const result = await db.delete(sessions);
    console.log('Deleted ALL sessions from database');

    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Nuclear sign out completed - all sessions cleared' 
    });

    // Clear all possible session cookies
    const cookiesToClear = [
      'better-auth.session_token',
      'better-auth.session-token',
      'session_token',
      'session',
      'auth-token',
      'auth_token',
      'next-auth.session-token',
      'next-auth.csrf-token'
    ];

    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
        expires: new Date(0)
      });
    });

    return response;

  } catch (error) {
    console.error('Nuclear sign out error:', error);
    return NextResponse.json(
      { error: 'Failed to perform nuclear sign out' }, 
      { status: 500 }
    );
  }
}
