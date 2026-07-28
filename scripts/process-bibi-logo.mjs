import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

/**
 * Build one black Bibi Beauty logo and copy it to every logo path.
 * Usage: node scripts/process-bibi-logo.mjs [path-to-source.png]
 */
const SRC =
  process.argv[2] ||
  path.join(
    process.env.USERPROFILE || '',
    '.cursor/projects/c-Users-user-Desktop-demos-Bibi-beauty/assets',
    'c__Users_user_AppData_Roaming_Cursor_User_workspaceStorage_48dada690406a32c3a4d16476e137905_images_8d946503-6ed2-4bc4-bfc3-3b1ab94f20ea-bdac1a4f-fd60-4437-862b-7bfbe39c18f6.png'
  );

if (!fs.existsSync(SRC)) {
  console.error('Logo source not found:', SRC);
  process.exit(1);
}

fs.copyFileSync(SRC, 'public/logo-source.png');

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  if (lum < 18) {
    data[i] = 0;
    data[i + 1] = 0;
    data[i + 2] = 0;
    data[i + 3] = 0;
  } else {
    data[i] = 10;
    data[i + 1] = 10;
    data[i + 2] = 10;
    data[i + 3] = 255;
  }
}

const logoBuf = await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toBuffer();

const padded = await sharp({
  create: {
    width: info.width + 80,
    height: info.height + 80,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{ input: logoBuf, gravity: 'centre' }])
  .png()
  .toBuffer();

for (const out of [
  'public/logo.png',
  'public/logo-header.png',
  'public/logo-footer.png',
  'public/logo-mark.png',
]) {
  fs.writeFileSync(out, padded);
}

const forOg = await sharp(padded).resize({ width: 720 }).png().toBuffer();
await sharp({
  create: { width: 1200, height: 630, channels: 3, background: { r: 255, g: 247, b: 251 } },
})
  .composite([{ input: forOg, gravity: 'centre' }])
  .png()
  .toFile('public/og-image.png');

await sharp({
  create: { width: 1600, height: 1067, channels: 3, background: { r: 255, g: 240, b: 246 } },
})
  .composite([
    {
      input: await sharp(padded).resize({ width: 700 }).png().toBuffer(),
      gravity: 'centre',
    },
  ])
  .jpeg({ quality: 92 })
  .toFile('public/hero.jpg');

for (const [file, size] of [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
]) {
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: { r: 255, g: 247, b: 251 },
    },
  })
    .composite([
      {
        input: await sharp(padded)
          .resize(Math.round(size * 0.85), Math.round(size * 0.85), {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .png()
          .toBuffer(),
        gravity: 'centre',
      },
    ])
    .png()
    .toFile(`public/${file}`);
}

console.log('Bibi Beauty logo synced everywhere (black)');
