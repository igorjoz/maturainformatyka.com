import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  site: 'https://maturainformatyka.com',
  integrations: [
    react(),
    {
      name: 'separate-command-caches',
      hooks: {
        'astro:config:setup': ({ command, updateConfig }) => {
          // Check/sync and build must not replace React's live development runtime.
          updateConfig({
            vite: {
              cacheDir: fileURLToPath(new URL(`./node_modules/.vite/${command}/`, import.meta.url)),
            },
          });
        },
      },
    },
  ],
});
