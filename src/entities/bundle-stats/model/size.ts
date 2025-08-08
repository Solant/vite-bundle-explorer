import type { BuildStats } from './stats';
import { Metric } from './metric';

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

export function formatSize(size: number) {
  if (size < 1024) {
    return `${Math.ceil(size)} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  }
}

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
