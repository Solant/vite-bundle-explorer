export { removeEmptyLeafs, removeNodes } from './model/graph';

export { formatSize, getModuleSize, getChunkSize } from './model/size';
import type { BuildStats, Chunk, Module } from './model/stats';
import { Metric, getMetricLabel, getAvailableMetrics } from './model/metric';

export type { BuildStats, Chunk, Module };

export { Metric, getMetricLabel, getAvailableMetrics };

export function isDependency(moduleFileName: string): boolean {
  return moduleFileName.startsWith('node_modules');
}

export function isVirtual(module: string | number, stats: BuildStats): boolean {
  const index = typeof module === 'string' ? stats.moduleFileNames.indexOf(module) : module;

  for (const chunk of stats.chunks) {
    for (const mod of chunk.modules) {
      if (mod.fileNameIndex === index) {
        return mod.virtual ?? false;
      }
    }
  }

  return false;
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
    }
    return parts[4];
  }

  // npm default logic
  const parts = moduleFileName.split('/');
  const index = parts.lastIndexOf('node_modules');
  if (parts[index + 1].startsWith('@')) {
    return `${parts[index + 1]}/${parts[index + 2]}`;
  }
  return parts[index + 1];
}
