import { type BuildStats, getAvailableMetrics, Metric } from '@/entities/bundle-stats';

export interface TreeMapOptions {
  metric: Metric;
  compact: boolean;
  hiddenModules: number[];
  hiddenChunks: string[];
}

export function getDefaultTreeMapOptions(buildStats: BuildStats): TreeMapOptions {
  return {
    metric: getAvailableMetrics(buildStats)[0],
    compact: true,
    hiddenModules: [],
    hiddenChunks: [],
  };
}
