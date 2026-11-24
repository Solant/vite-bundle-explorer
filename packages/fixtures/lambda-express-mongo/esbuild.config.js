import { build } from 'esbuild';

await build({
  entryPoints: ['./src/index.js'],
  outdir: 'dist-esbuild',
  outExtension: { '.js': '.cjs' },
  bundle: true,
  platform: 'node',
  format: 'cjs',
});
