import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    console.log('Comprehensive sign out API called');
    
    // Get all possible session tokens from cookies
    const sessionTokens = [
      request.cookies.get('better-auth.session_token')?.value,
      request.cookies.get('session_token')?.value,
      request.cookies.get('session')?.value
    ].filter(Boolean);

    console.log('Session tokens found:', sessionTokens);

    // Delete all sessions from database
    for (const sessionToken of sessionTokens) {
      if (sessionToken) {
        try {
          await db.delete(sessions).where(eq(sessions.token, sessionToken));
          console.log('Session deleted from database:', sessionToken);
        } catch (error) {
          console.log('Error deleting session:', sessionToken, error);
        }
      }
    }

    // Also try to get user ID from the session and delete ALL sessions for that user
    try {
      for (const sessionToken of sessionTokens) {
        if (sessionToken) {
          // Get the session to find the user ID
          const sessionRecord = await db
            .select()
            .from(sessions)
            .where(eq(sessions.token, sessionToken))
            .limit(1);

          if (sessionRecord.length > 0) {
            const userId = sessionRecord[0].userId;
            console.log('Found user ID from session:', userId);
            
            // Delete ALL sessions for this user
            await db.delete(sessions).where(eq(sessions.userId, userId));
            console.log('Deleted all sessions for user:', userId);
          }
        }
      }
    } catch (error) {
      console.log('Error deleting all user sessions:', error);
    }

    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Signed out successfully' 
    });

    // Clear all possible session cookies
    const cookiesToClear = [
      'better-auth.session_token',
      'better-auth.session-token',
      'session_token',
      'session',
      'auth-token',
      'auth_token'
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
    console.error('Error signing out:', error);
    return NextResponse.json(
      { error: 'Failed to sign out' }, 
      { status: 500 }
    );
  }
}
