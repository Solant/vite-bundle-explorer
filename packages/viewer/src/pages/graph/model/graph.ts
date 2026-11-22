import {
  type BuildStats,
  getAvailableMetrics,
  isDependency,
  isVirtual,
  type Metric,
} from '@/entities/bundle-stats';

export interface GraphOptions {
  metric: Metric;
  compact: boolean;
  denseLayout: boolean;
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
    compact: false,
    denseLayout: false,
    hiddenModules,
  };
}
