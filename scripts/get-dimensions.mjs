// scripts/get-dimensions.mjs
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { execSync } from 'child_process';

const imageDir = path.resolve('c:/Users/TestAdmin/Desktop/Work/projects/moonpaw-pwa/images');
const videoDir = imageDir; // videos are in same folder
const assets = [
  { type: 'image', name: 'Background.jpeg' },
  { type: 'image', name: 'Tarot 1.jpeg' },
  { type: 'video', name: 'Fav2.mp4' },
];

(async () => {
  const results = [];
  for (const asset of assets) {
    const filePath = path.join(asset.type === 'image' ? imageDir : videoDir, asset.name);
    if (!fs.existsSync(filePath)) {
      results.push({ name: asset.name, error: 'File not found' });
      continue;
    }
    if (asset.type === 'image') {
      try {
        const meta = await sharp(filePath).metadata();
        results.push({
          name: asset.name,
          type: 'image',
          width: meta.width,
          height: meta.height,
          aspect: (meta.width / meta.height).toFixed(2),
        });
      } catch (e) {
        results.push({ name: asset.name, type: 'image', error: e.message });
      }
    } else {
      try {
        const cmd = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${filePath}"`;
        const output = execSync(cmd, { encoding: 'utf8' }).trim();
        const [width, height] = output.split('x');
        results.push({
          name: asset.name,
          type: 'video',
          width: Number(width),
          height: Number(height),
          aspect: (Number(width) / Number(height)).toFixed(2),
        });
      } catch (e) {
        results.push({ name: asset.name, type: 'video', error: e.message });
      }
    }
  }
  const outPath = path.resolve('c:/Users/TestAdmin/Desktop/Work/projects/moonpaw-pwa/asset-dimensions.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log('Dimensions written to', outPath);
})();
