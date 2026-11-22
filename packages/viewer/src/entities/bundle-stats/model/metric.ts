import type { BuildStats } from './stats';

export const Metric = {
  Rendered: 'rendered',
  Bundled: 'bundled',
  Gzipped: 'gzipped',
};

export type Metric = (typeof Metric)[keyof typeof Metric];

export function getMetricLabel(metric: Metric) {
  return `${metric[0].toUpperCase() + metric.slice(1)} size`;
}

export function getAvailableMetrics(stats: BuildStats): Metric[] {
  const result: Metric[] = [];

  if (stats.chunks.every((c) => c.minifiedLength !== -1)) {
    result.push(Metric.Bundled);
  }

  result.push(Metric.Rendered);

  if (stats.chunks.every((c) => c.compressedLength !== -1)) {
    result.push(Metric.Gzipped);
  }

  return result;
}
