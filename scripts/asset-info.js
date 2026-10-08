/* scripts/asset-info.js */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const assets = [
  { name: 'Background', file: path.resolve(__dirname, '../images/Background.jpeg') },
  { name: 'Tarot1', file: path.resolve(__dirname, '../images/Tarot 1.jpeg') },
];

(async () => {
  for (const asset of assets) {
    try {
      const metadata = await sharp(asset.file).metadata();
      const aspect = (metadata.width / metadata.height).toFixed(2);
      console.log(`${asset.name}: ${metadata.width}x${metadata.height} (aspect ${aspect})`);
    } catch (e) {
      console.error(`Failed to process ${asset.name}:`, e.message);
    }
  }
})();
