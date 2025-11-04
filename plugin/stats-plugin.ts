/* eslint-disable no-console */
import { join } from 'node:path';
import { gzip } from 'node:zlib';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { type Plugin } from 'vite';

import type { BuildStats, Chunk } from '@/entities/bundle-stats/model/stats';
import { getBundleOverview } from '@/features/overview/model/overview';

const compress = promisify(gzip);

const REPORT_DIR_NAME = 'bundle-report';

function upsertNodeIndex(nodes: string[], item: string): number {
  const index = nodes.indexOf(item);
  return index === -1 ? nodes.push(item) - 1 : index;
}

interface StatsPluginOptions {
  enabled?: boolean;
  reportDirectoryName?: string;
  reportCompressedSize?: boolean;
  emitHtml?: boolean;
  emitJson?: boolean;
  check?: boolean;
  failOnWarning?: boolean;
}

export function statsPlugin(options?: StatsPluginOptions) {
  const emitHtml = options?.emitHtml ?? true;
  const emitJson = options?.emitJson ?? false;
  const check = options?.check ?? true;
  const failOnWarning = options?.failOnWarning ?? false;

  const root = process.cwd();
  const outDir = '';
  let enabled = options?.enabled ?? true;
  const reportCompressed = true;

  function truncatePath(filePath: string) {
    let index = 0;
    const normalizedPath = filePath.replaceAll('\u0000', '');

    if (outDir && normalizedPath.startsWith(outDir)) {
      index = outDir.length;
    } else if (root && normalizedPath.startsWith(root)) {
      index = root.length;
    }

    return index > 0 ? normalizedPath.substring(index + 1) : normalizedPath;
  }

  const edges = new Set<string>();
  const stats: BuildStats = { chunks: [], importGraph: { edges: [] }, moduleFileNames: [] };

  const plugin: Plugin = {
    name: 'stats-plugin',
    // vite specific hook
    configResolved(config) {
      // disable during dev mode
      enabled &&= config.env.PROD;
    },
    resolveId: {
      order: 'pre',
      async handler(source, importer, resolveOptions) {
        if (!enabled) {
          return;
        }

        // skip bundle root element
        if (!importer) {
          return;
        }

        const result = await this.resolve(source, importer, { ...resolveOptions, skipSelf: true });
        if (!result) {
          return;
        }

        const parent = upsertNodeIndex(stats.moduleFileNames, truncatePath(importer));
        const child = upsertNodeIndex(stats.moduleFileNames, truncatePath(result.id));
        edges.add(`${parent},${child}`);
      },
    },
    generateBundle: {
      async handler(_options, bundle) {
        if (!enabled) {
          return;
        }

        for (const [_name, chunk] of Object.entries(bundle)) {
          if (chunk.type !== 'chunk') {
            // eslint-disable-next-line no-continue
            continue;
          }

          const currentChunk: Chunk = {
            fileName: chunk.fileName,
            modules: [],
            minifiedLength: -1,
            compressedLength: -1,
          };
          stats.chunks.push(currentChunk);

          for (const [moduleName, mod] of Object.entries(chunk.modules)) {
            const fileName = truncatePath(moduleName);
            currentChunk.modules.push({
              fileNameIndex: upsertNodeIndex(stats.moduleFileNames, fileName),
              renderedLength: mod.renderedLength,
              virtual: moduleName.startsWith('\u0000') ? true : undefined,
            });
          }
        }

        stats.importGraph.edges = Array.from(edges).map((edge) => {
          const pair = edge.split(',');
          return [Number.parseInt(pair[0], 10), Number.parseInt(pair[1], 10)];
        });
      },
    },
    async writeBundle(_options, bundle) {
      for (const [_name, chunk] of Object.entries(bundle)) {
        if (chunk.type !== 'chunk') {
          // eslint-disable-next-line no-continue
          continue;
        }

        const chunkStats = stats.chunks.find((c) => c.fileName === chunk.fileName);
        if (!chunkStats) {
          // eslint-disable-next-line no-continue
          continue;
        }

        chunkStats.minifiedLength = chunk.code.length;
        if (reportCompressed) {
          // eslint-disable-next-line no-await-in-loop
          chunkStats.compressedLength = (await compress(chunk.code)).length;
        }
      }
    },
    async closeBundle(error) {
      if (!enabled || error) {
        return;
      }
      // prevent this hook from being called again for a different format
      enabled = false;

      // create a target directory
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
          this.warn('Output bundle has duplicated dependencies');
          for (const dep of report.duplicatedDependencies) {
            this.warn(`- ${dep.name} has ${dep.count} different versions`);
          }
        }

        if (failOnWarning && report.hasWarnings) {
          throw new Error(
            // eslint-disable-next-line vue/max-len
            '[plugin stats-plugin] Cancelling build due to failOnWarning option. Check [plugin stats-plugin] warnings for more details.',
          );
        }
      }
    },
  };

  return plugin;
}
