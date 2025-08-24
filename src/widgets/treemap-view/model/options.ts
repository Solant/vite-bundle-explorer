import { type BuildStats, getAvailableMetrics, Metric } from '@/entities/bundle-stats';

export interface TreeMapOptions {
  metric: Metric;
  compact: boolean;
  hiddenModules: number[];
  hiddenChunks: string[];
}

export const getDefaultTreeMapOptions = (buildStats: BuildStats): TreeMapOptions => ({
  metric: getAvailableMetrics(buildStats)[0],
  compact: true,
  hiddenModules: [],
  hiddenChunks: [],
});
