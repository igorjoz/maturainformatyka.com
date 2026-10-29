// Derive small, transparent brand assets without changing the supplied artwork.
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../images/logo-book-code.png', import.meta.url));
const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let left = info.width, top = info.height, right = 0, bottom = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 32) {
      left = Math.min(left, x); top = Math.min(top, y);
      right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
  }
}
if (left > right || top > bottom) throw new Error('The brand artwork is empty.');
const cropped = await sharp(source).extract({ left, top, width: right - left + 1, height: bottom - top + 1 }).png().toBuffer();
await mkdir(new URL('../src/assets/', import.meta.url), { recursive: true });
await sharp(cropped).resize(152, 152, { fit: 'contain', background: '#00000000' })
  .png().toFile(fileURLToPath(new URL('../src/assets/logo-book-code.png', import.meta.url)));

const sizes = [16, 32, 48];
const icons = [];
for (const size of sizes) {
  const margin = Math.max(1, Math.round(size * .06));
  const icon = await sharp(cropped).resize(size - margin * 2, size - margin * 2, { fit: 'contain', background: '#00000000' })
    .extend({ top: margin, bottom: margin, left: margin, right: margin, background: '#00000000' }).png().toBuffer();
  icons.push(icon);
  if (size !== 16) await writeFile(new URL(`../public/favicon-${size}.png`, import.meta.url), icon);
}
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
icons.forEach((icon, index) => {
  const entry = 6 + index * 16;
  header[entry] = sizes[index]; header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4); header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(icon.length, entry + 8); header.writeUInt32LE(offset, entry + 12);
  offset += icon.length;
});
await writeFile(new URL('../public/favicon.ico', import.meta.url), Buffer.concat([header, ...icons]));
console.log('Generated header logo and 16/32/48px favicon assets.');
