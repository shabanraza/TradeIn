import { NextRequest, NextResponse } from 'next/server';
import { sendOTPEmail } from '@/lib/auth/email';
import { db } from '@/lib/db/config';
import { otpCodes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now (more generous)
    
    console.log('📧 Sending OTP to:', email);
    console.log('🕐 Expires at:', expiresAt.toISOString());
    console.log('🕐 Current time:', new Date().toISOString());

    // Delete any existing OTP for this email
    await db.delete(otpCodes).where(eq(otpCodes.email, email));

    // Insert new OTP with correct column names
    await db.insert(otpCodes).values({
      email,
      code: otp,
      expiresAt: expiresAt,
      isUsed: false,
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    console.log('📧 OTP sent to:', email, 'Code:', otp);

    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent successfully' 
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' }, 
      { status: 500 }
    );
  }
}
