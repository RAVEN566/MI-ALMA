// prepare_assets.js
// This script processes the required media assets for MoonPaw.
// It inspects image dimensions, creates optimized WebP variants,
// adds a dark overlay to the background image, and compresses the video with a thumbnail.

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
let ffmpegPath;
try {
  ffmpegPath = require('ffmpeg-static');
} catch (e) {
  console.warn('ffmpeg-static not available; video processing will be skipped');
}

// Source directory where original assets reside
const srcDir = path.resolve(__dirname, '..', 'images');
// Destination for optimized assets (served publicly)
const outDir = path.resolve(__dirname, '..', 'public', 'assets');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function processImage(fileName) {
  const srcPath = path.join(srcDir, fileName);
  const img = sharp(srcPath);
  const meta = await img.metadata();
  console.log(`\n[Image] ${fileName}: ${meta.width}x${meta.height}, format=${meta.format}`);

  const base = path.parse(fileName).name;
  // Optimized WebP (quality 80)
  const webpPath = path.join(outDir, `${base}.webp`);
  await img.webp({ quality: 80 }).toFile(webpPath);
  console.log(`- Optimized WebP saved: ${webpPath}`);

  // If background, add dark overlay for text readability
  if (base.toLowerCase().includes('background')) {
    const overlaySvg = `<svg width="${meta.width}" height="${meta.height}"><rect width="100%" height="100%" fill="black" opacity="0.4"/></svg>`;
    const overlayPath = path.join(outDir, `${base}_overlay.webp`);
    await img
      .composite([{ input: Buffer.from(overlaySvg), blend: 'over' }])
      .webp({ quality: 80 })
      .toFile(overlayPath);
    console.log(`- Dark overlay WebP saved: ${overlayPath}`);
  }
}

function processVideo(fileName) {
  if (!ffmpegPath) return;
  const srcPath = path.join(srcDir, fileName);
  const base = path.parse(fileName).name;
  const outVideo = path.join(outDir, `${base}_opt.mp4`);
  const thumbPath = path.join(outDir, `${base}_thumb.webp`);

  // Compress video (libx264, medium quality)
  const compressArgs = ['-i', srcPath, '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', '-c:a', 'aac', '-b:a', '128k', outVideo];
  const { execFile } = require('child_process');
  execFile(ffmpegPath, compressArgs, (err) => {
    if (err) console.error('Video compression error:', err);
    else console.log(`- Compressed video saved: ${outVideo}`);
  });

  // Extract thumbnail (first frame) and convert to WebP
  const thumbArgs = ['-i', srcPath, '-ss', '00:00:00.500', '-vframes', '1', '-f', 'image2', '-'];
  execFile(ffmpegPath, thumbArgs, (err, stdout) => {
    if (err) {
      console.error('Thumbnail extraction error:', err);
      return;
    }
    sharp(stdout)
      .webp({ quality: 80 })
      .toFile(thumbPath)
      .then(() => console.log(`- Video thumbnail saved: ${thumbPath}`))
      .catch(e => console.error('Thumbnail conversion error:', e));
  });
}

async function main() {
  const images = ['Background.jpeg', 'Tarot 1.jpeg'];
  const video = 'Fav2.mp4';

  for (const img of images) {
    const imgPath = path.join(srcDir, img);
    if (fs.existsSync(imgPath)) {
      await processImage(img);
    } else {
      console.warn(`Image not found: ${imgPath}`);
    }
  }

  const vidPath = path.join(srcDir, video);
  if (fs.existsSync(vidPath)) {
    processVideo(video);
  } else {
    console.warn(`Video not found: ${vidPath}`);
  }
}

main().catch(e => console.error('Asset processing failed:', e));
