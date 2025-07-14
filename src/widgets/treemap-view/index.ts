import { default as TreeMapView } from './ui/TreeMapView.vue';
import { default as TreeMapOptions } from './ui/TreeMapViewOptions.vue';
import { getDefaultTreeMapOptions } from './model/TreeMap.ts';

export const TreemapView = {
  ViewComponent: TreeMapView,
  OptionsComponent: TreeMapOptions,
  optionsFactory: () => getDefaultTreeMapOptions(),
};
