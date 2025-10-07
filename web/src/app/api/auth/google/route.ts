import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { users, sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔍 Google auth request body:', body);
    
    const { accessToken, email, name, image } = body;

    if (!accessToken || !email) {
      console.log('❌ Missing required fields:', { accessToken: !!accessToken, email: !!email });
      return NextResponse.json({ 
        error: 'Missing required fields', 
        details: { accessToken: !!accessToken, email: !!email }
      }, { status: 400 });
    }

    // Verify the Google access token by fetching user info
    const googleResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
    );

    if (!googleResponse.ok) {
      return NextResponse.json({ error: 'Invalid Google token' }, { status: 401 });
    }

    const googleUser = await googleResponse.json();

    // Check if user exists in our database
    let user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Create user if doesn't exist
    if (user.length === 0) {
      const newUser = await db
        .insert(users)
        .values({
          email: googleUser.email,
          name: googleUser.name,
          image: googleUser.picture,
          emailVerified: true,
          role: 'customer',
        })
        .returning();

      user = newUser;
    } else {
      // Update existing user with Google info
      await db
        .update(users)
        .set({ 
          name: googleUser.name,
          image: googleUser.picture,
          emailVerified: true,
          updatedAt: new Date()
        })
        .where(eq(users.id, user[0].id));
    }

    // Create session manually for Google users
    const sessionToken = `google-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    await db.insert(sessions).values({
      token: sessionToken,
      userId: user[0].id,
      expiresAt: expires,
    });

    // Set session cookie
    const response = NextResponse.json({ 
      success: true, 
      user: user[0],
      message: 'Google authentication successful' 
    });
    
    response.cookies.set('better-auth.session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Error with Google authentication:', error);
    return NextResponse.json(
      { error: 'Google authentication failed' }, 
      { status: 500 }
    );
  }
}
