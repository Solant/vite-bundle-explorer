import {
  type BuildStats,
  getAvailableMetrics,
  isDependency,
  isVirtual,
  type Metric,
} from '@/entities/bundle-stats';

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
  const hiddenModules = buildStats.moduleFileNames.reduce((acc, name, index) => {
    if (isDependency(name) || isVirtual(name, buildStats)) {
      acc.push(index);
    }

    return acc;
  }, [] as number[]);

  return {
    metric: getAvailableMetrics(buildStats)[0],
    forceRepulsion: 50,
    forceGravity: 0.1,
    forceEdgeLength: 30,
    forceFriction: 0.6,
    compact: false,
    hiddenModules,
  };
}
