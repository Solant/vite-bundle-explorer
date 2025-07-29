<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue';

import type { BuildStats } from '@/entities/bundle-stats';
import ViewToggle from './ViewToggle.vue';

import { TreemapView } from './widgets/treemap-view';
import { GraphView } from './widgets/graph-view';
import { OverviewModal } from '@/features/overview';

const stats = shallowRef<BuildStats>();
fetch('stats.json')
  .then((res) => res.json())
  .then((data) => {
    stats.value = data;
  });

const currentViewKey = ref<'treemap' | 'graph'>('treemap');
const currentViewOptions = ref(TreemapView.optionsFactory());
const currentView = computed(() => {
  if (currentViewKey.value === 'treemap') {
    return TreemapView;
  } else if (currentViewKey.value === 'graph') {
    return GraphView;
  }

  return TreemapView;
});
watch(currentView, (newView) => {
  // @ts-expect-error
  currentViewOptions.value = newView.optionsFactory();
});
</script>

<template>
  <div class="w-screen h-screen flex bg-gray-200">
    <div class="w-1/3 max-w-[350px] bg-white rounded-lg m-5 p-2 flex flex-col">
      <ViewToggle v-model="currentViewKey" />

      <currentView.OptionsComponent v-if="stats" v-model="currentViewOptions" :stats />

      <OverviewModal v-if="stats" :stats="stats" class="mt-auto" />
    </div>

    <currentView.ViewComponent
      v-if="stats"
      :stats
      v-model:options="currentViewOptions"
      class="flex-grow-1 flex-shrink-1"
    />
  </div>
</template>
