import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { glob } from 'node:fs/promises';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';

export default defineConfig({
  base: '',
  plugins: [
    vue(),
    UnoCSS(),
    {
      name: 'json-proxy',
      async configureServer(server) {
        const fixturesPath = resolve(import.meta.dirname, '..', 'fixtures');

        const files: string[] = [];
        const it = glob('*/bundle-report-*/stats.json', {
          cwd: fixturesPath,
        });
        for await (const file of it) {
          files.push(file);
        }

        server.middlewares.use((req, res, next) => {
          // return list of available fixtures
          if (req.url === '/list') {
            res.writeHead(200, { 'content-type': 'application/json' });
            return res.end(JSON.stringify({ files }));
          }

          // return specific fixture
          if (req.url?.startsWith('/get?name=')) {
            const name = decodeURIComponent(req.url.split('=')[1]);
            const fixture = resolve(fixturesPath, name);
            res.writeHead(200, { 'content-type': 'application/json' });
            return res.end(readFileSync(fixture));
          }

          return next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist-ui',
  },
});
