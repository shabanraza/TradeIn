import nodemailer from 'nodemailer';

// Check if email credentials are available
if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.warn('⚠️  Gmail credentials not found. Email OTP will not work.');
  console.warn('📝 Please add GMAIL_USER and GMAIL_APP_PASSWORD to .env.local');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  // Add additional options for better compatibility
  tls: {
    rejectUnauthorized: false
  }
});

export async function sendOTPEmail(email: string, otpCode: string) {
  // Always log the OTP for development
  console.log('📧 OTP Code for', email, ':', otpCode);
  
  // Check if email credentials are available
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('⚠️  Email OTP disabled: Gmail credentials not configured');
    console.warn('📝 Please add GMAIL_USER and GMAIL_APP_PASSWORD to .env.local');
    console.warn('📧 For now, use the OTP code above to sign in');
    return; // Don't throw error, just log the OTP for development
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'OldPhone Marketplace - Your Login Code',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Your Login Code</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
            .otp-code { font-size: 32px; font-weight: bold; text-align: center; color: #1f2937; margin: 30px 0; padding: 20px; background: #f3f4f6; border-radius: 10px; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">📱 OldPhone Marketplace</div>
            </div>
            
            <h2>Your Login Code</h2>
            <p>Enter this code to sign in to your account:</p>
            
            <div class="otp-code">${otpCode}</div>
            
            <p><strong>This code will expire in 10 minutes.</strong></p>
            <p>If you didn't request this code, please ignore this email.</p>
            
            <div class="footer">
              <p>© 2025 OldPhone Marketplace. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully to:', email);
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error);
    console.warn('📧 For development, use the OTP code logged above:', otpCode);
    // Don't throw error - just log it for development
    console.warn('⚠️  Email sending failed, but OTP is available in logs');
  }
}
