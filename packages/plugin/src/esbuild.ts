import type { Plugin } from 'esbuild';
import { type BuildStats, type Chunk } from '@vite-bundle-explorer/shared';

function versionToNumber(version: string): number | undefined {
  const [
    major,
    minor,
    patch,
  ] = version.split('.').map((i) => Number.parseInt(i, 10));
  if (!Number.isFinite(major) || !Number.isFinite(minor) || !Number.isFinite(patch)) {
    return undefined;
  }
  return major * 10000 + minor * 100 + patch;
}

const SUPPORTED_VERSION = versionToNumber('0.9.0')!;

export const statsPlugin = {
  name: 'stats-plugin',
  setup(build) {
    // che
    const version = versionToNumber(build.esbuild.version);
    if (version === undefined) {
      console.warn('[vite-bundle-explorer] Unknown esbuild version, compatibility unknown');
    } else if (version < SUPPORTED_VERSION) {
      throw new Error('[vite-bundle-explorer] Unsupported esbuild version, version 0.9.0 or higher is required');
    }

    // eslint-disable-next-line no-param-reassign
    build.initialOptions.metafile = true;

    build.onEnd(({ metafile }) => {
      if (metafile === undefined) {
        throw new Error('metafile is undefined');
      }

      const stats: BuildStats = {
        chunks: [],
        entryPoints: [],
        moduleFileNames: [],
        builtInModules: [],
        importGraph: {
          edges: [],
        },
      };

      const inputs = new Map(Object.entries(metafile.inputs));
      // todo refactor to do only one loop
      for (const [path] of inputs.entries()) {
        if (!stats.moduleFileNames.includes(path)) {
          stats.moduleFileNames.push(path);
        }
      }
      for (const [path, { imports }] of inputs.entries()) {
        const source = stats.moduleFileNames.indexOf(path);
        if (source === -1) {
          console.warn(`[vite-bundle-explorer] Could not find module index for ${path}`);
          // eslint-disable-next-line no-continue
          continue;
        }
        const targets = imports.map((imp) => stats.moduleFileNames.indexOf(imp.path));
        for (const target of targets) {
          if (target === -1) {
            console.warn(`[vite-bundle-explorer] Could not find target for ${path}`);
          } else {
            stats.importGraph.edges.push([source, target]);
          }
        }
      }

      for (const [path, { bytes, inputs: inputs2 }] of Object.entries(metafile.outputs)) {
        const chunk: Chunk = {
          fileName: path,
          minifiedLength: bytes,
          compressedLength: 0,
          modules: [],
        };

        Object.keys(inputs2).forEach((input) => {
          chunk.modules.push({
            fileNameIndex: stats.moduleFileNames.indexOf(input),
            renderedLength: inputs.get(input)?.bytes ?? 0,
          });
        });

        stats.chunks.push(chunk);
      }

      console.log(stats);
    });
  },
} satisfies Plugin;
