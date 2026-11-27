import * as esbuild from 'esbuild';
import { it } from 'vitest';

import { esbuildStatsPlugin } from './esbuild';

it('should esbuild', { timeout: Infinity }, async () => {
  await esbuild.build({
    entryPoints: ['fixture/index.ts'],
    bundle: true,
    plugins: [
      esbuildStatsPlugin({
        reportDirectoryName: 'bundle-report-esbuild',
        emitHtml: false,
        emitJson: true,
      }),
    ],
  });
});
