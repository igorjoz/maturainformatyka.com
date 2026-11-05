import { readdir, readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

// Sum every emitted JS file once. This is the whole site's output, not initial transfer.
const directory = new URL('../dist/_astro/', import.meta.url);
const files = await Promise.all((await readdir(directory)).filter(name => name.endsWith('.js')).sort().map(async name => {
  const bytes = await readFile(new URL(name, directory));
  return { name, bytes: bytes.length, gzipBytes: gzipSync(bytes).length };
}));
console.log(JSON.stringify({ directory: fileURLToPath(directory),
  bytes: files.reduce((sum, file) => sum + file.bytes, 0),
  gzipBytes: files.reduce((sum, file) => sum + file.gzipBytes, 0), files }, null, 2));
