import path, { dirname } from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: '',
  plugins: [
    vue(),
    UnoCSS(),
    {
      name: 'json-proxy',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === 'stats.json') {
            res.writeHead(200, { 'content-type': 'application/json' });
            return res.end(fs.readFileSync(path.resolve(import.meta.dirname, 'stats.json')));
          }

          return next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist-ui',
  },
});
