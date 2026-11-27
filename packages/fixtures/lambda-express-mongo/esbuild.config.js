import { build } from 'esbuild';
import { esbuildStatsPlugin } from '@vite-bundle-explorer/plugin/esbuild';

await build({
  entryPoints: ['./src/index.js'],
  outdir: 'dist-esbuild',
  outExtension: { '.js': '.cjs' },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  plugins: [esbuildStatsPlugin({
    reportDirectoryName: 'bundle-report-esbuild',
    emitHtml: false,
    emitJson: true,
  })],
});
