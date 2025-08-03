export const Metric = {
  Rendered: 'rendered',
  Minified: 'minified',
  Compressed: 'compressed',
};

export type Metric = (typeof Metric)[keyof typeof Metric];

export function getMetricLabel(metric: Metric) {
  return metric[0].toUpperCase() + metric.slice(1) + ' size';
}
