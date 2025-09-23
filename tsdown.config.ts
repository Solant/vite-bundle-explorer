import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./plugin/stats-plugin.ts'],
  format: ['esm'],
  dts: {
    build: true,
  },
  outDir: './dist-plugin',
});
