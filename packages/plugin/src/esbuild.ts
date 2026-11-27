/* eslint-disable no-console */
import { join } from 'node:path';
import { gzip } from 'node:zlib';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { isBuiltin } from 'node:module';

import { type Plugin } from 'esbuild';
import { type BuildStats, type Chunk, getBundleOverview } from '@vite-bundle-explorer/shared';

const compress = promisify(gzip);

const REPORT_DIR_NAME = 'bundle-report';

function upsertNodeIndex(nodes: string[], item: string): number {
  const index = nodes.indexOf(item);
  return index === -1 ? nodes.push(item) - 1 : index;
}

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

interface EsbuildStatsPluginOptions {
  reportDirectoryName?: string;
  emitHtml?: boolean;
  emitJson?: boolean;
  check?: boolean;
  failOnWarning?: boolean;
}

export function esbuildStatsPlugin(options?: EsbuildStatsPluginOptions): Plugin {
  const emitHtml = options?.emitHtml ?? true;
  const emitJson = options?.emitJson ?? false;
  const check = options?.check ?? true;
  const failOnWarning = options?.failOnWarning ?? false;

  return {
    name: 'esbuild-stats-plugin',
    setup(build) {
      const version = versionToNumber(build.esbuild.version);
      if (version === undefined) {
        console.warn('[vite-bundle-explorer] Unknown esbuild version, compatibility unknown');
      } else if (version < SUPPORTED_VERSION) {
        throw new Error('[vite-bundle-explorer] Unsupported esbuild version, version 0.9.0 or higher is required');
      }

      // eslint-disable-next-line no-param-reassign
      build.initialOptions.metafile = true;

      build.onEnd(async ({ metafile, outputFiles }) => {
        if (metafile === undefined) {
          throw new Error('metafile is undefined');
        }

        const stats: BuildStats = {
          chunks: [],
          entryPoints: [],
          moduleFileNames: Object.keys(metafile.inputs),
          builtInModules: [],
          importGraph: {
            edges: [],
          },
        };
        const edges = new Set<string>();

        for (const [path, { imports }] of Object.entries(metafile.inputs)) {
          const source = stats.moduleFileNames.indexOf(path);
          for (const imp of imports) {
            // external imports are not part of the bundle, only node builtins are tracked
            if (imp.external) {
              if (isBuiltin(imp.path)) {
                const target = upsertNodeIndex(stats.moduleFileNames, imp.path);
                if (!stats.builtInModules.includes(target)) {
                  stats.builtInModules.push(target);
                }
                edges.add(`${source},${target}`);
              }
              // eslint-disable-next-line no-continue
              continue;
            }

            const target = stats.moduleFileNames.indexOf(imp.path);
            if (target === -1) {
              console.warn(`[vite-bundle-explorer] Could not find target for ${imp.path}`);
            } else {
              edges.add(`${source},${target}`);
            }
          }
        }
        stats.importGraph.edges = Array.from(edges).map((edge) => {
          const [source, target] = edge.split(',');
          return [Number.parseInt(source, 10), Number.parseInt(target, 10)];
        });

        for (const [path, output] of Object.entries(metafile.outputs)) {
          // source maps are emitted as outputs but are not chunks
          if (path.endsWith('.map')) {
            // eslint-disable-next-line no-continue
            continue;
          }

          if (output.entryPoint !== undefined && !stats.entryPoints.includes(output.entryPoint)) {
            stats.entryPoints.push(output.entryPoint);
          }

          const chunk: Chunk = {
            fileName: path,
            minifiedLength: output.bytes,
            compressedLength: -1,
            modules: Object.entries(output.inputs).map(([input, { bytesInOutput }]) => ({
              fileNameIndex: stats.moduleFileNames.indexOf(input),
              renderedLength: bytesInOutput,
            })),
          };

          // outputFiles is only populated with write: false, otherwise read the file from disk
          const contents = outputFiles?.find((file) => file.path === path)?.contents
            // eslint-disable-next-line no-await-in-loop
            ?? await fs.readFile(path).catch(() => undefined);
          if (contents !== undefined) {
            // eslint-disable-next-line no-await-in-loop
            chunk.compressedLength = (await compress(contents)).length;
          }

          stats.chunks.push(chunk);
        }

        const root = process.cwd();
        const target = join(root, options?.reportDirectoryName ?? REPORT_DIR_NAME);
        try {
          const stat = await fs.stat(target);
          if (stat.isDirectory()) {
            await fs.rm(target, { recursive: true });
          }
        } catch { /* empty */ }

        await fs.mkdir(target);

        if (emitHtml) {
          const source = join(fileURLToPath(import.meta.url), '..', '..', 'dist-ui');
          const names = await fs.readdir(source);

          await Promise.all(
            names.map((name) => fs.cp(join(source, name), join(target, name), { recursive: true })),
          );

          let html = await fs.readFile(join(target, 'index.html'), 'utf-8');
          html = html.replace('%BUNDLE_STATS%', JSON.stringify(stats).replaceAll("'", "\\'"));
          await fs.writeFile(join(target, 'index.html'), html);
        }

        if (emitJson) {
          await fs.writeFile(join(target, 'stats.json'), JSON.stringify(stats, null, 2));
        }

        console.log(`Bundle stats saved to ${target}`);
        if (emitHtml) {
          console.log(`Run "npx vite-bundle-explorer ${target}" to view the stats`);
        }

        if (check) {
          const report = getBundleOverview(stats);
          if (report.duplicatedDependencies.length > 0) {
            console.warn('Output bundle has duplicated dependencies');
            for (const dep of report.duplicatedDependencies) {
              console.warn(`- ${dep.name} has ${dep.count} different versions`);
            }
          }

          if (failOnWarning && report.hasWarnings) {
            throw new Error(
              // eslint-disable-next-line vue/max-len
              '[plugin esbuild-stats-plugin] Cancelling build due to failOnWarning option. Check [plugin esbuild-stats-plugin] warnings for more details.',
            );
          }
        }
      });
    },
  };
}
