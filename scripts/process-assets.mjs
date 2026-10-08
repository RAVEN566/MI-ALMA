// scripts/process-assets.mjs
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { execSync } from 'child_process';

const srcDir = path.resolve('c:/Users/TestAdmin/Desktop/Work/projects/moonpaw-pwa/images');
const outDir = path.resolve('c:/Users/TestAdmin/Desktop/Work/projects/moonpaw-pwa/assets/optimized');

// Ensure output directories exist
const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };
ensureDir(path.join(outDir, 'background'));
ensureDir(path.join(outDir, 'tarot'));
ensureDir(path.join(outDir, 'video'));

const inventory = [];

(async () => {
  // ---- Background.jpeg ----
  const bgSrc = path.join(srcDir, 'Background.jpeg');
  if (!fs.existsSync(bgSrc)) { console.error('Background.jpeg not found'); return; }
  const bgMeta = await sharp(bgSrc).metadata();
  const bgBase = path.join(outDir, 'background', 'background');
  const widths = [1920, 1280, 720];
  // WebP variants
  for (const w of widths) {
    const outPath = `${bgBase}-${w}.webp`;
    await sharp(bgSrc).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(outPath);
    inventory.push({ original: 'Background.jpeg', variant: path.basename(outPath), width: w, format: 'webp' });
  }
  // Dark overlay variants (40% black)
  const overlaySvg = Buffer.from('<svg><rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.4)"/></svg>');
  for (const w of widths) {
    const outPath = `${bgBase}-${w}-dark.webp`;
    await sharp(bgSrc)
      .resize({ width: w, withoutEnlargement: true })
      .composite([{ input: overlaySvg, blend: 'over' }])
      .webp({ quality: 80 })
      .toFile(outPath);
    inventory.push({ original: 'Background.jpeg', variant: path.basename(outPath), width: w, format: 'webp', overlay: 'dark' });
  }
  // Low‑resolution placeholder for LQIP
  const placeholderPath = `${bgBase}-placeholder.webp`;
  await sharp(bgSrc).resize({ width: 20 }).blur().webp({ quality: 30 }).toFile(placeholderPath);
  inventory.push({ original: 'Background.jpeg', variant: path.basename(placeholderPath), width: 20, format: 'webp', purpose: 'placeholder' });

  // ---- Tarot 1.jpeg (line art) ----
  const tarotSrc = path.join(srcDir, 'Tarot 1.jpeg');
  if (!fs.existsSync(tarotSrc)) { console.error('Tarot 1.jpeg not found'); return; }
  const tarotBase = path.join(outDir, 'tarot', 'tarot-1');
  // PNG version (white background removed)
  await sharp(tarotSrc)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .toColourspace('b-w')
    .toFile(`${tarotBase}.png`);
  inventory.push({ original: 'Tarot 1.jpeg', variant: 'tarot-1.png', format: 'png' });
  // Lossless WebP version
  await sharp(tarotSrc)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .toColourspace('b-w')
    .webp({ lossless: true })
    .toFile(`${tarotBase}.webp`);
  inventory.push({ original: 'Tarot 1.jpeg', variant: 'tarot-1.webp', format: 'webp', lossless: true });

  // ---- Fav2.mp4 (video) ----
  const videoSrc = path.join(srcDir, 'Fav2.mp4');
  if (!fs.existsSync(videoSrc)) { console.error('Fav2.mp4 not found'); return; }
  const videoBase = path.join(outDir, 'video', 'fav2');
  // Compressed MP4 (CRF 28)
  const compressedPath = `${videoBase}-compressed.mp4`;
  execSync(`ffmpeg -y -i "${videoSrc}" -c:v libx264 -crf 28 -preset veryfast -c:a aac -b:a 128k "${compressedPath}"`);
  inventory.push({ original: 'Fav2.mp4', variant: path.basename(compressedPath), format: 'mp4', crf: 28 });
  // Thumbnail (first frame) as WebP
  const thumbPath = `${videoBase}-thumb.webp`;
  execSync(`ffmpeg -y -i "${videoSrc}" -vf "thumbnail,scale=320:-1" -frames:v 1 "${thumbPath}"`);
  inventory.push({ original: 'Fav2.mp4', variant: path.basename(thumbPath), format: 'webp', purpose: 'thumbnail' });

  // Write inventory JSON
  const invPath = path.resolve('c:/Users/TestAdmin/Desktop/Work/projects/moonpaw-pwa/asset_inventory.json');
  fs.writeFileSync(invPath, JSON.stringify(inventory, null, 2), 'utf8');
  console.log('Asset processing complete. Inventory written to', invPath);
})();
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { execSync } from 'child_process';

const srcDir = path.resolve('c:/Users/TestAdmin/Desktop/Work/projects/moonpaw-pwa/images');
const outDir = path.resolve('c:/Users/TestAdmin/Desktop/Work/projects/moonpaw-pwa/assets/optimized');

// Ensure output subdirs
const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };
ensureDir(path.join(outDir, 'background'));
ensureDir(path.join(outDir, 'tarot'));
ensureDir(path.join(outDir, 'video'));

// Helper to write JSON inventory
const inventory = [];

(async () => {
  // Process Background.jpeg
  const bgSrc = path.join(srcDir, 'Background.jpeg');
  if (!fs.existsSync(bgSrc)) { console.error('Background.jpeg not found'); return; }
  const bgMeta = await sharp(bgSrc).metadata();
  const bgBase = path.join(outDir, 'background', 'background');
  const widths = [1920, 1280, 720];
  for (const w of widths) {
    const outPath = ${bgBase}-.webp;
    await sharp(bgSrc).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(outPath);
    inventory.push({ original: 'Background.jpeg', variant: path.basename(outPath), width: w, format: 'webp' });
  }
  const overlay = Buffer.from('<svg><rect x= 0 y=0 width=100% height=100% fill=rgba 0 0 0 0.4 /></svg>');
  for (const w of widths) {
    const outPath = ${bgBase}--dark.webp;
    await sharp(bgSrc).resize({ width: w, withoutEnlargement: true }).composite([{ input: overlay, blend: 'over' }]).webp({ quality: 80 }).toFile(outPath);
    inventory.push({ original: 'Background.jpeg', variant: path.basename(outPath), width: w, format: 'webp', overlay: 'dark' });
  }
  const placeholderPath = ${bgBase}-placeholder.webp;
  await sharp(bgSrc).resize({ width: 20 }).blur().webp({ quality: 30 }).toFile(placeholderPath);
  inventory.push({ original: 'Background.jpeg', variant: path.basename(placeholderPath), width: 20, format: 'webp', purpose: 'placeholder' });

  // Process Tarot 1.jpeg
  const tarotSrc = path.join(srcDir, 'Tarot 1.jpeg');
  if (!fs.existsSync(tarotSrc)) { console.error('Tarot 1.jpeg not found'); return; }
  const tarotBase = path.join(outDir, 'tarot', 'tarot-1');
  await sharp(tarotSrc).flatten({ background: { r: 255, g: 255, b: 255 } }).toColourspace('b-w').toFile(${tarotBase}.png);
  inventory.push({ original: 'Tarot 1.jpeg', variant: 'tarot-1.png', format: 'png' });
  await sharp(tarotSrc).flatten({ background: { r: 255, g: 255, b: 255 } }).toColourspace('b-w').webp({ lossless: true }).toFile(${tarotBase}.webp);
  inventory.push({ original: 'Tarot 1.jpeg', variant: 'tarot-1.webp', format: 'webp', lossless: true });

  // Process Fav2.mp4
  const videoSrc = path.join(srcDir, 'Fav2.mp4');
  if (!fs.existsSync(videoSrc)) { console.error('Fav2.mp4 not found'); return; }
  const videoBase = path.join(outDir, 'video', 'fav2');
  const compressedPath = ${videoBase}-compressed.mp4;
  execSync(fmpeg -y -i   -c:v libx264 -crf 28 -preset veryfast -c:a aac -b:a 128k );
  inventory.push({ original: 'Fav2.mp4', variant: path.basename(compressedPath), format: 'mp4', crf: 28 });
  const thumbPath = ${videoBase}-thumb.webp;
  execSync(fmpeg -y -i  -vf thumbnail,scale=320:-1 -frames:v 1 );
  inventory.push({ original: 'Fav2.mp4', variant: path.basename(thumbPath), format: 'webp', purpose: 'thumbnail' });

  const invPath = path.resolve('c:/Users/TestAdmin/Desktop/Work/projects/moonpaw-pwa/asset_inventory.json');
  fs.writeFileSync(invPath, JSON.stringify(inventory, null, 2), 'utf8');
  console.log('Asset processing complete. Inventory written to', invPath);
})();
