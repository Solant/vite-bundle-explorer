import path from 'node:path';
import fs from 'node:fs';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';

import { statsPlugin } from './plugin/stats-plugin.ts';

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    statsPlugin(),
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
});
