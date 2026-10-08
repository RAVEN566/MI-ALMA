/* scripts/optimize-assets.mjs */
import sharp from 'sharp';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const exec = promisify(execFile);

const imagesDir = path.resolve('images');
const publicImagesDir = path.resolve('public', 'assets', 'images');
const publicVideosDir = path.resolve('public', 'assets', 'videos');

await fs.promises.mkdir(publicImagesDir, { recursive: true });
await fs.promises.mkdir(publicVideosDir, { recursive: true });

async function processBackground() {
  const src = path.join(imagesDir, 'Background.jpeg');
  const metadata = await sharp(src).metadata();
  console.log(`Background: ${metadata.width}x${metadata.height}, aspect ${(metadata.width/metadata.height).toFixed(2)}`);
  const widths = [1080, 720, 480];
  for (const w of widths) {
    const outPath = path.join(publicImagesDir, `background-${w}.webp`);
    await sharp(src)
      .resize({ width: w })
      .webp({ quality: 80 })
      .toFile(outPath);
    console.log(`Created ${outPath}`);
  }
  // Dark overlay variant (reduce brightness)
  const darkPath = path.join(publicImagesDir, 'background-dark.webp');
  await sharp(src)
    .modulate({ brightness: 0.6 })
    .webp({ quality: 80 })
    .toFile(darkPath);
  console.log(`Created dark overlay ${darkPath}`);
}

async function processTarot1() {
  const src = path.join(imagesDir, 'Tarot 1.jpeg');
  const metadata = await sharp(src).metadata();
  console.log(`Tarot 1: ${metadata.width}x${metadata.height}, aspect ${(metadata.width/metadata.height).toFixed(2)}`);
  // Original size WebP
  const outOrig = path.join(publicImagesDir, 'tarot1.webp');
  await sharp(src).webp({ quality: 80 }).toFile(outOrig);
  console.log(`Created ${outOrig}`);
  // Thumbnail 300px wide
  const thumb = path.join(publicImagesDir, 'tarot1-thumb.webp');
  await sharp(src).resize({ width: 300 }).webp({ quality: 80 }).toFile(thumb);
  console.log(`Created thumbnail ${thumb}`);
}

async function processVideo() {
  const src = path.join(imagesDir, 'Fav2.mp4');
  const dest = path.join(publicVideosDir, 'fav2.mp4');
  await fs.promises.copyFile(src, dest);
  console.log(`Copied video to ${dest}`);
  // Create lower bitrate version (720p) using ffmpeg-static
  const ffmpegPath = (await import('ffmpeg-static')).default;
  const outLow = path.join(publicVideosDir, 'fav2-720p.mp4');
  try {
    await exec(ffmpegPath, ['-i', dest, '-vf', 'scale=-2:720', '-c:v', 'libx264', '-crf', '28', '-preset', 'veryfast', '-c:a', 'aac', '-b:a', '128k', outLow]);
    console.log(`Created low‑bitrate video ${outLow}`);
  } catch (e) {
    console.warn('ffmpeg processing failed:', e.message);
  }
  // Generate thumbnail (first frame)
  const thumbImg = path.join(publicImagesDir, 'fav2-thumb.jpg');
  try {
    await exec(ffmpegPath, ['-i', dest, '-ss', '00:00:01.000', '-vframes', '1', thumbImg]);
    console.log(`Created video thumbnail ${thumbImg}`);
  } catch (e) {
    console.warn('ffmpeg thumbnail failed:', e.message);
  }
}

async function main() {
  await processBackground();
  await processTarot1();
  await processVideo();
}

main().catch(err => console.error('Asset processing error:', err));
