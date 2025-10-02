import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db/config';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Use Better Auth's built-in session handling
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    console.log('Better Auth session API - Session:', session);

    if (session) {
      // Get the full user data from our database to include the role
      const userData = await db
        .select()
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1);

      if (userData.length > 0) {
        const fullUserData = {
          ...session.user,
          role: userData[0].role,
          isEmailVerified: userData[0].emailVerified,
          isRetailerApproved: userData[0].isRetailerApproved,
          businessName: userData[0].businessName,
          businessAddress: userData[0].businessAddress,
          phone: userData[0].phone,
          location: userData[0].location
        };

        console.log('Better Auth session - Full user data:', {
          id: fullUserData.id,
          email: fullUserData.email,
          name: fullUserData.name,
          role: fullUserData.role
        });
        
        return NextResponse.json({ 
          user: fullUserData, 
          session: session 
        });
      } else {
        console.log('User not found in database:', session.user.id);
        return NextResponse.json({ user: null, session: null });
      }
    } else {
      return NextResponse.json({ user: null, session: null });
    }

  } catch (error) {
    console.error('Better Auth session API error:', error);
    return NextResponse.json(
      { error: 'Failed to get session' }, 
      { status: 500 }
    );
  }
}
