import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';

export async function POST(request: NextRequest) {
  try {
    console.log('Comprehensive Better Auth sign out API called');
    
    // Use Better Auth's built-in sign out functionality
    try {
      const response = await auth.api.signOut({
        headers: request.headers,
      });
      console.log('Better Auth sign out response:', response);
    } catch (error) {
      console.log('Better Auth sign out error (normal for OTP sessions):', error);
    }

    // Create response with cleared cookies
    const nextResponse = NextResponse.json({ 
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
      nextResponse.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
        expires: new Date(0)
      });
    });

    return nextResponse;

  } catch (error) {
    console.error('Better Auth sign out error:', error);
    return NextResponse.json(
      { error: 'Failed to sign out' }, 
      { status: 500 }
    );
  }
}
