const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'src', 'logo.jpeg');
const publicDir = path.join(__dirname, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

const run = async () => {
  try {
    const inputBuffer = fs.readFileSync(inputPath);
    
    // Generate pwa-192x192.png
    await sharp(inputBuffer)
      .resize(192, 192)
      .toFile(path.join(publicDir, 'pwa-192x192.png'));
    console.log('Created pwa-192x192.png');

    // Generate pwa-512x512.png
    await sharp(inputBuffer)
      .resize(512, 512)
      .toFile(path.join(publicDir, 'pwa-512x512.png'));
    console.log('Created pwa-512x512.png');

    // Generate apple-touch-icon.png (usually 180x180)
    await sharp(inputBuffer)
      .resize(180, 180)
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('Created apple-touch-icon.png');

    // Generate favicon.ico (often 32x32)
    // Sharp might not directly output .ico, but creating a 32x32 png renamed to .ico works in modern browsers
    await sharp(inputBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.ico'));
    console.log('Created favicon.ico');

    // Generate mask-icon.svg - Sharp can't convert JPEG to vector SVG easily.
    // As a workaround, we will just use the apple-touch-icon in vite config or skip mask-icon if not strictly needed.
    // Let's just create a basic placeholder or copy the png
    fs.copyFileSync(path.join(publicDir, 'pwa-512x512.png'), path.join(publicDir, 'mask-icon.png'));
    
  } catch (error) {
    console.error('Error processing images:', error);
  }
};

run();
