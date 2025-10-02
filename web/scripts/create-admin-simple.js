// Simple admin creation script using fetch API
async function createAdminUser() {
  try {
    console.log('🔍 Creating admin user via API...');
    
    const response = await fetch('http://localhost:3000/api/admin/create-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'ansari.device@gmail.com',
        name: 'Admin User'
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email:', data.user.email);
      console.log('👤 Name:', data.user.name);
      console.log('🔑 Role:', data.user.role);
      console.log('🆔 ID:', data.user.id);
      console.log('');
      console.log('🚀 You can now login with:');
      console.log('   Email: ansari.device@gmail.com');
      console.log('   Use Google OAuth or Email OTP to login');
      console.log('');
      console.log('⚠️  IMPORTANT: Make sure your dev server is running!');
    } else {
      console.error('❌ Error creating admin user:', data.error);
    }

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    console.log('');
    console.log('💡 Make sure your development server is running:');
    console.log('   pnpm dev');
    console.log('');
    console.log('💡 Then run this script again:');
    console.log('   pnpm admin:create');
  }
}

// Run the script
createAdminUser();
