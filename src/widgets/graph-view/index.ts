import { default as GraphViewComponent } from './ui/GraphView.vue';
import { default as GraphOptions } from './ui/GraphViewOptions.vue';

export const GraphView = {
  ViewComponent: GraphViewComponent,
  OptionsComponent: GraphOptions,
  optionsFactory: () => ({}),
};
