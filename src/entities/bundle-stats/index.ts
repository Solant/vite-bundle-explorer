export { removeEmptyLeafs, removeNodes } from './model/graph.ts';

import type { BuildStats, Chunk, Module } from './model/stats.ts';

export type { BuildStats, Chunk, Module };

export const Metric = {
  Rendered: 'rendered-size',
  Minified: 'minified-size',
  Compressed: 'compressed-size',
};

export type Metric = (typeof Metric)[keyof typeof Metric];

export function getModuleSize(
  moduleFileName: string | number,
  stats: BuildStats,
  metric: Metric,
): number | undefined {
  const index =
    typeof moduleFileName === 'string'
      ? stats.moduleFileNames.indexOf(moduleFileName)
      : moduleFileName;
  if (index === -1) {
    return undefined;
  }

  for (const chunk of stats.chunks) {
    for (const mod of chunk.modules) {
      if (mod.fileNameIndex === index) {
        if (metric === Metric.Rendered) {
          return mod.renderedLength;
        }
        const total = getChunkSize(chunk.fileName, stats, Metric.Rendered)!;
        const ratio = mod.renderedLength / total;
        if (metric === Metric.Minified) {
          return chunk.minifiedLength * ratio;
        }
        if (metric === Metric.Compressed) {
          return chunk.compressedLength * ratio;
        }
      }
    }
  }
}

export function getChunkSize(
  chunkFileName: string,
  stats: BuildStats,
  metric: Metric,
): number | undefined {
  const chunk = stats.chunks.find((c) => c.fileName === chunkFileName);
  if (!chunk) {
    return undefined;
  }

  switch (metric) {
    case Metric.Rendered:
      return chunk.modules.reduce((acc, cur) => acc + cur.renderedLength, 0);
    case Metric.Minified:
      return chunk.minifiedLength;
    case Metric.Compressed:
      return chunk.compressedLength;
  }
}

export function getAvailableMetrics(stats: BuildStats): Metric[] {
  const result: Metric[] = [];

  if (stats.chunks.every((c) => c.minifiedLength !== -1)) {
    result.push(Metric.Minified);
  }

  result.push(Metric.Rendered);

  if (stats.chunks.every((c) => c.compressedLength !== -1)) {
    result.push(Metric.Compressed);
  }

  return result;
}

export function formatSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  }
}

export function isDependency(moduleFileName: string): boolean {
  return moduleFileName.startsWith('node_modules');
}

export function getModuleDependencyName(moduleFileName: string): string {
  if (!isDependency(moduleFileName)) {
    return '';
  }

  // pnpm-specific logic
  if (moduleFileName.startsWith('node_modules/.pnpm')) {
    const parts = moduleFileName.split('/');
    if (parts[4].startsWith('@')) {
      return `${parts[4]}/${parts[5]}`;
    } else {
      return parts[4];
    }
  }

  // npm default logic
  const parts = moduleFileName.split('/');
  const index = parts.lastIndexOf('node_modules');
  if (parts[index + 1].startsWith('@')) {
    return `${parts[index + 1]}/${parts[index + 2]}`;
  } else {
    return parts[index + 1];
  }
}
