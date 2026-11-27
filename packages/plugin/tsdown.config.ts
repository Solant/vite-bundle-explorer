import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/stats-plugin.ts', './src/esbuild.ts'],
  outDir: 'dist',
  deps: {
    neverBundle: ['vite', 'esbuild'],
    alwaysBundle: ['@vite-bundle-explorer/shared'],
  },
  format: ['esm'],
});
