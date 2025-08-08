export { removeEmptyLeafs, removeNodes } from './model/graph';

export { formatSize, getModuleSize, getChunkSize } from './model/size';

import type { BuildStats, Chunk, Module } from './model/stats.ts';

export type { BuildStats, Chunk, Module };

import { Metric, getMetricLabel, getAvailableMetrics } from './model/metric';

export { Metric, getMetricLabel, getAvailableMetrics };

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
