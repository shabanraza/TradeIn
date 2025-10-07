import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    console.log('Custom sign-out endpoint called');
    
    // Clear the session cookie
    const cookieStore = await cookies();
    
    // Clear the session cookie by setting it to expire in the past
    cookieStore.set('better-auth.session_token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    // Also clear any other auth-related cookies
    cookieStore.set('better-auth.csrf_token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    console.log('Custom sign-out successful - cookies cleared');
    return NextResponse.json({ success: true, message: 'Signed out successfully' });
  } catch (error) {
    console.error('Custom sign-out error:', error);
    return NextResponse.json({ success: false, message: 'Sign out error' }, { status: 500 });
  }
}
