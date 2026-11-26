import * as esbuild from 'esbuild';
import { it } from 'vitest';

import { statsPlugin } from './esbuild';

it('should esbuild', { timeout: Infinity }, async () => {
  await esbuild.build({
    entryPoints: ['fixture/index.ts'],
    bundle: true,
    plugins: [statsPlugin],
  });
});
