import type { BuildStats } from '@/entities/bundle-stats';

import { default as TreeMapView } from './ui/TreeMapView.vue';
import { default as TreeMapOptions } from './ui/TreeMapViewOptions.vue';
import { getDefaultTreeMapOptions } from './model/options';

export const TreemapView = {
  ViewComponent: TreeMapView,
  OptionsComponent: TreeMapOptions,
  optionsFactory: (stats: BuildStats) => getDefaultTreeMapOptions(stats),
};
