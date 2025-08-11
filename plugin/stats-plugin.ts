import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gzip } from 'node:zlib';
import { promisify } from 'node:util';

import { type Plugin } from 'vite';

import type { BuildStats, Chunk } from '../src/entities/bundle-stats/model/stats.ts';

const compress = promisify(gzip);

function upsertNodeIndex(nodes: string[], item: string): number {
  const index = nodes.indexOf(item);
  return index === -1 ? nodes.push(item) - 1 : index;
}

export function statsPlugin() {
  let root = '';
  let outDir = '';
  let enabled = true;
  let reportCompressed = false;

  function truncatePath(filePath: string) {
    let index = 0;
    const normalizedPath = filePath.replaceAll('\u0000', '');

    if (normalizedPath.startsWith(outDir)) {
      index = outDir.length;
    } else if (normalizedPath.startsWith(root)) {
      index = root.length;
    }

    return index > 0 ? normalizedPath.substring(index + 1) : normalizedPath;
  }

  const edges = new Set<string>();
  const stats: BuildStats = { chunks: [], importGraph: { edges: [] }, moduleFileNames: [] };

  const plugin: Plugin = {
    name: 'stats-plugin',
    configResolved(config) {
      root = config.root;
      outDir = `${root}/${config.build.outDir}`;
      enabled = config.env.PROD;
      reportCompressed = config.build.reportCompressedSize;
    },
    resolveId: {
      order: 'pre',
      async handler(source, importer, options) {
        if (!enabled) {
          return;
        }

        // skip bundle root element
        if (!importer) {
          return;
        }

        const result = await this.resolve(source, importer, { ...options, skipSelf: true });
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
            continue;
          }

          console.log(`Processing chunk "${chunk.fileName}"`);
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
          continue;
        }

        const c = stats.chunks.find((c) => c.fileName === chunk.fileName);
        if (!c) {
          continue;
        }

        c.minifiedLength = chunk.code.length;
        if (reportCompressed) {
          c.compressedLength = (await compress(chunk.code)).length;
        }
      }
    },
    async closeBundle(error) {
      if (!enabled || error) {
        return;
      }

      await writeFile(join(outDir, 'stats.json'), JSON.stringify(stats));
      console.log(`Bundle stats written to ${join(outDir, 'stats.json')}`);
      console.log(`Run "npx vite-bundle-explorer ${join(outDir, 'stats.json')}" to view the stats`);
    },
  };

  return plugin;
}
