import path from 'node:path';
import fs from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';

import { statsPlugin } from './plugin/stats-plugin.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    statsPlugin({
      emitJson: true,
    }),
    {
      name: 'json-proxy',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === 'stats.json') {
            res.writeHead(200, { 'content-type': 'application/json' });
            return res.end(fs.readFileSync(path.resolve(import.meta.dirname, 'stats.json')));
          }

          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
