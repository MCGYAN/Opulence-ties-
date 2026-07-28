import sharp from 'sharp';
import fs from 'fs';

// Preserve original full logo once
if (!fs.existsSync('public/logo-source.png')) {
  fs.copyFileSync('public/logo.png', 'public/logo-source.png');
}

const src = 'public/logo-source.png';
const meta = await sharp(src).metadata();
const w = meta.width;
const h = meta.height;

// Emblem is the circular mark in the upper portion of the artwork
const emblemH = Math.round(h * 0.72);
const { data, info } = await sharp(src)
  .extract({ left: 0, top: 0, width: w, height: emblemH })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  // Knock out black background / silhouette so pink mark pops on any bg
  if (r < 30 && g < 30 && b < 30) data[i + 3] = 0;
}

const emblem = await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
}).png().toBuffer();

async function withWordmark(fill, outPath) {
  const pad = Math.round(emblemH * 0.28);
  const fontSize = Math.round(pad * 0.48);
  const svg = Buffer.from(
    `<svg width="${w}" height="${pad}" xmlns="http://www.w3.org/2000/svg">
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}"
        fill="${fill}">YOUR_SITE_SHORT_NAME</text>
    </svg>`
  );
  await sharp({
    create: {
      width: w,
      height: emblemH + pad,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: emblem, top: 0, left: 0 },
      { input: await sharp(svg).png().toBuffer(), top: emblemH, left: 0 },
    ])
    .png()
    .toFile(outPath);
}

await sharp(emblem).png().toFile('public/logo-mark.png');
await withWordmark('#000000', 'public/logo-header.png');
await withWordmark('#FFFFFF', 'public/logo-footer.png');
await withWordmark('#2563EB', 'public/logo.png');

await sharp('public/hero.jpg').jpeg({ quality: 92 }).toFile('public/hero-tmp.jpg');
fs.renameSync('public/hero-tmp.jpg', 'public/hero.jpg');
if (fs.existsSync('public/hero.png')) fs.unlinkSync('public/hero.png');

console.log('brand assets ready', { w, h, emblemH });
