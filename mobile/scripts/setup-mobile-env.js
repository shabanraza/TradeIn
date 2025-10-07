#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  
  for (const interfaceName in interfaces) {
    const interface = interfaces[interfaceName];
    for (const alias of interface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  
  return 'localhost';
}

function setupMobileEnvironment() {
  const localIP = getLocalIPAddress();
  const envContent = `# Mobile App Environment Configuration
# Auto-generated - Update IP if needed
EXPO_PUBLIC_API_URL=http://${localIP}:3000

# Alternative URLs to try if the above doesn't work:
# EXPO_PUBLIC_API_URL=http://localhost:3000
# EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
# EXPO_PUBLIC_API_URL=https://your-ngrok-url.ngrok.io

# Google OAuth (if needed)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
`;

  const envPath = path.join(__dirname, '..', '.env.local');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local file with API URL:', `http://${localIP}:3000`);
    console.log('');
    console.log('📱 Next steps:');
    console.log('1. Make sure your web server is running: cd ../web && pnpm dev');
    console.log('2. Restart Expo: npx expo start --clear');
    console.log('3. Test API connection on your phone');
    console.log('');
    console.log('🔧 If API still doesn\'t work, try these alternatives:');
    console.log('- Use ngrok: npx ngrok http 3000');
    console.log('- Use Expo tunnel: npx expo start --tunnel');
    console.log('- Check firewall settings');
    
  } catch (error) {
    console.error('❌ Error creating .env.local:', error.message);
  }
}

setupMobileEnvironment();
