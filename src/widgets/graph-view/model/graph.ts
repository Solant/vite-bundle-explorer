import { type BuildStats, getAvailableMetrics, type Metric } from '@/entities/bundle-stats';

export interface GraphOptions {
  metric: Metric;
  forceRepulsion: number;
  forceGravity: number;
  forceEdgeLength: number;
  forceFriction: number;
  compact: boolean;
  hiddenModules: number[];
}

export function optionsFactory(buildStats: BuildStats): GraphOptions {
  return {
    metric: getAvailableMetrics(buildStats)[0],
    forceRepulsion: 50,
    forceGravity: 0.1,
    forceEdgeLength: 30,
    forceFriction: 0.6,
    compact: false,
    hiddenModules: [],
  };
}
