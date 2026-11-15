import { defineConfig } from 'tsdown';
import { statsPlugin } from '@vite-bundle-explorer/plugin';

export default defineConfig({
  entry: ['./src/index.js'],
  outDir: 'dist',
  format: ['cjs'],
  plugins: [statsPlugin({
    emitHtml: false,
    emitJson: true
  })],
  deps: {
    alwaysBundle: ['express', 'mongodb', 'serverless-http']
  }
});
