const fs = require('fs');
const path = require('path');

// Create icons directory
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate a simple SVG icon
const generateIcon = (size) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${size * 0.1}" fill="#0ea5e9"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">📱</text>
  </svg>`;
};

// Icon sizes to generate
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  const svgContent = generateIcon(size);
  const filePath = path.join(iconsDir, `icon-${size}x${size}.png`);
  
  // For now, create SVG files (in production, you'd convert to PNG)
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svgContent);
  
  console.log(`Generated icon-${size}x${size}.svg`);
});

// Generate shortcut icons
const shortcuts = ['browse', 'sell', 'account'];
shortcuts.forEach(shortcut => {
  const svgContent = generateIcon(96);
  const filePath = path.join(iconsDir, `shortcut-${shortcut}.svg`);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Generated shortcut-${shortcut}.svg`);
});

// Generate badge icon
const badgeSvg = generateIcon(72);
fs.writeFileSync(path.join(iconsDir, 'badge-72x72.svg'), badgeSvg);
console.log('Generated badge-72x72.svg');

// Generate action icons
const actions = ['view', 'close'];
actions.forEach(action => {
  const svgContent = generateIcon(24);
  const filePath = path.join(iconsDir, `action-${action}.svg`);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Generated action-${action}.svg`);
});

console.log('✅ PWA icons generated successfully!');
console.log('📝 Note: These are SVG placeholders. In production, convert to PNG format.');
