// scripts/debug-tarot.mjs
import sharp from 'sharp';
import path from 'path';

const filePath = path.resolve('c:/Users/TestAdmin/Desktop/Work/projects/moonpaw-pwa/images/Tarot 1.jpeg');

sharp(filePath).metadata()
  .then(meta => {
    console.log('Tarot 1.jpeg', meta.width, 'x', meta.height, 'format', meta.format);
  })
  .catch(err => {
    console.error('Error reading Tarot 1.jpeg', err);
  });
