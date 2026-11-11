import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/stats-plugin.ts'],
  outDir: 'dist',
  deps: {
    neverBundle: ['vite'],
  },
  format: ['esm'],
});
