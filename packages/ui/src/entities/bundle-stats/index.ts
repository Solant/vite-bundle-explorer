export { removeEmptyLeafs, removeNodes } from './model/graph';

export { formatSize, getModuleSize, getChunkSize } from './model/size';
import type { BuildStats, Chunk, Module } from './model/stats';
import { Metric, getMetricLabel, getAvailableMetrics } from './model/metric';

export type { BuildStats, Chunk, Module };

export { isDependency, getModuleDependencyName } from '@vite-bundle-explorer/shared';

export { Metric, getMetricLabel, getAvailableMetrics };

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
