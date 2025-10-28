<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, watch } from 'vue';

import type { BuildStats } from '@/entities/bundle-stats';
import ViewToggle from './ViewToggle.vue';

import { TreemapView } from './widgets/treemap-view';
import { GraphView } from './widgets/graph-view';
import { OverviewModal } from '@/features/overview';

const stats = shallowRef<BuildStats>();
try {
  const payload = JSON.parse(window.BUNDLE_STATS ?? '');
  stats.value = payload as BuildStats;
} catch (e) {
  fetch('stats.json')
    .then((res) => res.json())
    .then((data) => {
      stats.value = data;
    });
}

const currentViewKey = ref<'treemap' | 'graph'>('treemap');
const currentView = computed(() => {
  if (currentViewKey.value === 'treemap') {
    return TreemapView;
  } else if (currentViewKey.value === 'graph') {
    return GraphView;
  }

  return TreemapView;
});

const currentViewOptions = ref();
watch(
  stats,
  () => {
    if (!stats.value) {
      return;
    }

    currentViewOptions.value = currentView.value.optionsFactory(stats.value);
  },
  { immediate: true },
);

watch(currentView, (newView) => {
  // @ts-expect-error
  currentViewOptions.value = newView.optionsFactory(stats.value);
});

function changeView(view: 'treemap' | 'graph', options: any) {
  currentViewKey.value = view;
  nextTick(() => {
    currentViewOptions.value = { ...currentViewOptions.value, ...options };
  });
}
</script>

<template>
  <div class="w-screen h-screen flex bg-gray-200">
    <div class="w-1/3 max-w-[350px] bg-white rounded-lg m-5 p-2 flex flex-col overflow-auto">
      <ViewToggle v-model="currentViewKey" />

      <currentView.OptionsComponent
        v-if="stats && currentViewOptions"
        v-model="currentViewOptions"
        @update-view="changeView"
        :stats
      />

      <OverviewModal v-if="stats" :stats="stats" class="mt-auto" />
    </div>

    <currentView.ViewComponent
      v-if="stats"
      :stats
      @update-view="changeView"
      v-model:options="currentViewOptions"
      class="flex-grow-1 flex-shrink-1"
    />
  </div>
</template>
