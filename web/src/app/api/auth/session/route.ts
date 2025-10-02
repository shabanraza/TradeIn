import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db/config';
import { users, sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    console.log('Unified Session API - Checking both Better Auth and custom sessions...');
    
    // First try Better Auth session (for Google OAuth)
    try {
      const betterAuthSession = await auth.api.getSession({
        headers: request.headers,
      });

      if (betterAuthSession) {
        console.log('Better Auth session found:', betterAuthSession.user.email);
        
        // Get the full user data from our database
        const userData = await db
          .select()
          .from(users)
          .where(eq(users.id, betterAuthSession.user.id))
          .limit(1);

        if (userData.length > 0) {
          const fullUserData = {
            ...betterAuthSession.user,
            role: userData[0].role,
            isEmailVerified: userData[0].emailVerified,
            isRetailerApproved: userData[0].isRetailerApproved,
            businessName: userData[0].businessName,
            businessAddress: userData[0].businessAddress,
            phone: userData[0].phone,
            location: userData[0].location
          };

          return NextResponse.json({ 
            user: fullUserData, 
            session: betterAuthSession,
            loginMethod: 'google'
          });
        }
      }
    } catch (error) {
      console.log('Better Auth session check failed:', error);
    }

    // If no Better Auth session, try custom OTP session
    const sessionToken = request.cookies.get('better-auth.session_token')?.value || 
                        request.cookies.get('better-auth.session-token')?.value ||
                        request.cookies.get('session_token')?.value;

    if (sessionToken) {
      console.log('Checking custom OTP session...');
      
      // Find session in database
      const sessionRecord = await db
        .select()
        .from(sessions)
        .where(eq(sessions.token, sessionToken))
        .limit(1);

      if (sessionRecord.length > 0) {
        // Check if session is expired
        const now = new Date();
        if (sessionRecord[0].expiresAt < now) {
          // Delete expired session
          await db.delete(sessions).where(eq(sessions.token, sessionToken));
          return NextResponse.json({ user: null, session: null });
        }

        // Get user data
        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, sessionRecord[0].userId))
          .limit(1);

        if (user.length > 0) {
          console.log('Custom OTP session found:', user[0].email);
          return NextResponse.json({ 
            user: user[0], 
            session: sessionRecord[0],
            loginMethod: 'otp'
          });
        }
      }
    }

    return NextResponse.json({ user: null, session: null });

  } catch (error) {
    console.error('Unified session API error:', error);
    return NextResponse.json(
      { error: 'Failed to get session' }, 
      { status: 500 }
    );
  }
}
