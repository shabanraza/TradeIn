import { auth } from "@/lib/auth/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log('Better Auth sign-out endpoint called');
    
    // Use Better Auth's signOut method
    const result = await auth.api.signOut({
      headers: request.headers,
    });

    if (result) {
      console.log('Better Auth sign-out successful');
      return NextResponse.json({ success: true, message: 'Signed out successfully' });
    } else {
      console.log('Better Auth sign-out failed');
      return NextResponse.json({ success: false, message: 'Sign out failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Better Auth sign-out error:', error);
    return NextResponse.json({ success: false, message: 'Sign out error' }, { status: 500 });
  }
}
