// Astro includes sharp for its local image pipeline. Keep the social preview
// opaque while the original portrait and its responsive variants stay transparent.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

await mkdir(new URL('../src/assets/', import.meta.url), { recursive: true });
await sharp(fileURLToPath(new URL('../images/portrait-art.png', import.meta.url)))
  .flatten({ background: '#faf9f6' })
  .png()
  .toFile(fileURLToPath(new URL('../src/assets/portrait-social.png', import.meta.url)));
