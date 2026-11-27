import { defineConfig } from 'tsdown';
import { statsPlugin } from '@vite-bundle-explorer/plugin';

export default defineConfig({
  entry: ['./src/index.js'],
  outDir: 'dist-tsdown',
  format: ['cjs'],
  plugins: [statsPlugin({
    reportDirectoryName: 'bundle-report-tsdown',
    emitHtml: false,
    emitJson: true
  })],
  deps: {
    alwaysBundle: ['express', 'mongodb', 'serverless-http']
  }
});
