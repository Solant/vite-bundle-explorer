import { default as GraphViewComponent } from './ui/GraphView.vue';
import { default as GraphOptions } from './ui/GraphViewOptions.vue';
import { optionsFactory } from './model/graph.ts';

export const GraphView = {
  ViewComponent: GraphViewComponent,
  OptionsComponent: GraphOptions,
  optionsFactory: () => optionsFactory(),
};
