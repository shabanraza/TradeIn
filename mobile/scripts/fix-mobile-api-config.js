#!/usr/bin/env node

const os = require('os');
const { exec } = require('child_process');

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

function updateMobileConfig() {
  const localIP = getLocalIPAddress();
  const apiUrl = `http://${localIP}:3000`;
  
  console.log('🔧 Mobile API Configuration Fix');
  console.log('================================');
  console.log(`📱 Detected local IP: ${localIP}`);
  console.log(`🌐 API URL: ${apiUrl}`);
  console.log('');
  
  console.log('📋 Steps to fix mobile API connection:');
  console.log('');
  console.log('1. 📱 Make sure your phone and computer are on the same WiFi network');
  console.log('2. 🖥️  Start your web server:');
  console.log('   cd d:\\oldsellerapp\\web');
  console.log('   pnpm dev');
  console.log('');
  console.log('3. 📱 Update your mobile app config:');
  console.log(`   Set EXPO_PUBLIC_API_URL=${apiUrl}`);
  console.log('');
  console.log('4. 🔄 Restart your Expo development server:');
  console.log('   cd d:\\oldsellerapp\\mobile');
  console.log('   npx expo start --clear');
  console.log('');
  console.log('5. 📱 Test the connection:');
  console.log(`   Open ${apiUrl}/api/categories in your phone browser`);
  console.log('');
  
  console.log('🔍 Alternative solutions:');
  console.log('');
  console.log('Option A: Use ngrok for public URL');
  console.log('1. Install ngrok: npm install -g ngrok');
  console.log('2. Start ngrok: ngrok http 3000');
  console.log('3. Use the ngrok URL in your mobile config');
  console.log('');
  console.log('Option B: Use your computer\'s hostname');
  console.log(`   Try: http://${os.hostname()}.local:3000`);
  console.log('');
  console.log('Option C: Use localhost with Expo tunnel');
  console.log('   Set EXPO_PUBLIC_API_URL=http://localhost:3000');
  console.log('   Run: npx expo start --tunnel');
  console.log('');
  
  console.log('🚨 Common issues:');
  console.log('- Firewall blocking port 3000');
  console.log('- Phone and computer on different networks');
  console.log('- Web server not running');
  console.log('- Wrong IP address in config');
  console.log('');
  
  console.log('✅ Quick test:');
  console.log(`   Open this URL on your phone: ${apiUrl}/api/categories`);
  console.log('   If you see JSON data, the connection works!');
}

// Run the fix
updateMobileConfig();
