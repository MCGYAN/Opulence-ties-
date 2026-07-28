import sharp from 'sharp';
import fs from 'fs';

const svg = (label, fill, textFill = '#64748b') =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200">
      <rect width="600" height="200" fill="${fill}" rx="12"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, serif" font-size="36" fill="${textFill}">${label}</text>
    </svg>`
  );

await sharp({
  create: { width: 1600, height: 1067, channels: 3, background: { r: 239, g: 246, b: 255 } },
}).jpeg({ quality: 85 }).toFile('public/hero.jpg');

await sharp(svg('YOUR_LOGO', '#f1f5f9')).png().toFile('public/logo.png');
await sharp(svg('YOUR_LOGO', '#f1f5f9')).png().toFile('public/logo-header.png');
await sharp(svg('YOUR_LOGO', '#1e293b', '#94a3b8')).png().toFile('public/logo-footer.png');
await sharp(svg('YOUR_LOGO', '#f1f5f9')).png().toFile('public/logo-mark.png');
await sharp(svg('YOUR_LOGO', '#eff6ff'))
  .resize(1200, 630, { fit: 'contain', background: '#eff6ff' })
  .png()
  .toFile('public/og-image.png');

if (fs.existsSync('public/logo-source.png')) fs.unlinkSync('public/logo-source.png');
if (fs.existsSync('public/hero.png')) fs.unlinkSync('public/hero.png');

console.log('placeholder brand assets ready');
