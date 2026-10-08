// scripts/debug-bg.mjs
import sharp from 'sharp';
import path from 'path';

const filePath = path.resolve('c:/Users/TestAdmin/Desktop/Work/projects/moonpaw-pwa/images/Background.jpeg');

sharp(filePath).metadata()
  .then(meta => {
    console.log('Background.jpeg', meta.width, 'x', meta.height, 'format', meta.format);
  })
  .catch(err => {
    console.error('Error reading Background.jpeg', err);
  });
