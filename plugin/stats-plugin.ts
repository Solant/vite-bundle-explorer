import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { type Plugin } from 'vite';

import type { BuildStats, Chunk } from '../src/stats.ts';

function upsertNodeIndex(nodes: string[], item: string): number {
  const index = nodes.indexOf(item);
  return index === -1 ? nodes.push(item) - 1 : index;
}

export function statsPlugin() {
  let root = '';
  let outDir = '';

  function truncatePath(filePath: string) {
    let index = 0;

    if (filePath.startsWith(outDir)) {
      index = outDir.length;
    } else if (filePath.startsWith(root)) {
      index = root.length;
    }

    return index > 0 ? filePath.substring(index + 1) : filePath;
  }

  const stats: BuildStats = { chunks: [], importGraph: { nodes: [], edges: [] } };

  const plugin: Plugin = {
    name: 'stats-plugin',
    configResolved(config) {
      root = config.root;
      outDir = `${root}/${config.build.outDir}`;
    },
    resolveId: {
      order: 'pre',
      async handler(source, importer, options) {
        // skip bundle root element
        if (!importer) {
          return;
        }

        const result = await this.resolve(source, importer, { ...options, skipSelf: true });
        if (!result) {
          return;
        }

        const parent = upsertNodeIndex(stats.importGraph.nodes, truncatePath(importer));
        const child = upsertNodeIndex(stats.importGraph.nodes, truncatePath(result.id));
        stats.importGraph.edges.push([parent, child]);
      },
    },
    generateBundle: {
      async handler(_options, bundle) {
        for (const [_name, chunk] of Object.entries(bundle)) {
          if (chunk.type !== 'chunk') {
            continue;
          }

          const currentChunk: Chunk = { fileName: chunk.fileName, modules: [] };
          stats.chunks.push(currentChunk);

          for (const [moduleName, mod] of Object.entries(chunk.modules)) {
            const fileName = truncatePath(moduleName);
            currentChunk.modules.push({ fileName, renderedLength: mod.renderedLength });
          }
        }

        await writeFile(join(outDir, 'stats.json'), JSON.stringify(stats));
      },
    },
  };

  return plugin;
}
