import { db } from '../src/lib/db/config.js';
import { users } from '../src/lib/db/schema.js';
import { eq } from 'drizzle-orm';

async function createAdminUser() {
  try {
    console.log('🔍 Checking if admin user already exists...');
    
    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, 'admin@oldphone.com'))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('✅ Admin user already exists!');
      console.log('📧 Email:', existingAdmin[0].email);
      console.log('👤 Name:', existingAdmin[0].name);
      console.log('🔑 Role:', existingAdmin[0].role);
      return;
    }

    console.log('👤 Creating admin user...');
    
    // Create admin user
    const [adminUser] = await db.insert(users).values({
      email: 'ansari.device@gmail.com',
      name: 'Admin User',
      role: 'super_admin',
      isEmailVerified: true,
      isRetailerApproved: false,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@oldphone.com');
    console.log('👤 Name: Admin User');
    console.log('🔑 Role: super_admin');
    console.log('🆔 ID:', adminUser.id);
    console.log('');
    console.log('🚀 You can now login with:');
    console.log('   Email: admin@oldphone.com');
    console.log('   Use Google OAuth or Email OTP to login');
    console.log('');
    console.log('⚠️  IMPORTANT: After first login, update your profile with a secure email!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the script
createAdminUser()
  .then(() => {
    console.log('🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
