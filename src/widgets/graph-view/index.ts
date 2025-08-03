import { default as GraphViewComponent } from './ui/GraphView.vue';
import { default as GraphOptions } from './ui/GraphViewOptions.vue';
import { optionsFactory } from './model/graph.ts';
import type { BuildStats } from '@/entities/bundle-stats';

export const GraphView = {
  ViewComponent: GraphViewComponent,
  OptionsComponent: GraphOptions,
  optionsFactory: (stats: BuildStats) => optionsFactory(stats),
};
