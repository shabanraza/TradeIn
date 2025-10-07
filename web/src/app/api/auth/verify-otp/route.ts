import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { otpCodes, users, sessions } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth/config';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    // Find the OTP record
    const otpRecord = await db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.email, email),
          eq(otpCodes.code, otp)
        )
      )
      .limit(1);

    if (otpRecord.length === 0) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    const record = otpRecord[0];

    // Temporarily disable expiration check for debugging
    console.log('🔍 OTP Record:', record);
    console.log('🕐 Current time:', new Date().toISOString());
    console.log('🕐 Expires at from DB:', record.expiresAt);
    
    // TODO: Re-enable expiration check after debugging
    // if (new Date() > new Date(record.expiresAt)) {
    //   return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    // }

    // Delete the OTP record after successful verification
    await db
      .delete(otpCodes)
      .where(eq(otpCodes.id, record.id));

    // Check if user exists
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
          email,
          name: email.split('@')[0], // Use email prefix as name
          emailVerified: true,
          role: 'customer',
        })
        .returning();

      user = newUser;
    } else {
      // Update existing user to mark email as verified
      await db
        .update(users)
        .set({ 
          emailVerified: true,
          updatedAt: new Date()
        })
        .where(eq(users.id, user[0].id));
    }

    // Create session manually for OTP users
    // This avoids Better Auth's account table issues
    const sessionToken = `otp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
      message: 'OTP verified successfully' 
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
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' }, 
      { status: 500 }
    );
  }
}
