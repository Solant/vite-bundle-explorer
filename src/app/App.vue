<script setup lang="ts">
import {
  computed, nextTick, ref, shallowRef, watch,
} from 'vue';

import { TreemapView } from '@/widgets/treemap-view';
import { GraphView } from '@/widgets/graph-view';
import type { BuildStats } from '@/entities/bundle-stats';
import { OverviewModal } from '@/features/overview';

import ViewToggle from './ViewToggle.vue';

const stats = shallowRef<BuildStats>();
try {
  const payload = JSON.parse(window.BUNDLE_STATS ?? '');
  stats.value = payload as BuildStats;
} catch (_e) {
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
  } if (currentViewKey.value === 'graph') {
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
  // @ts-expect-error view changing
  currentViewOptions.value = newView.optionsFactory(stats.value);
});

function changeView(view: 'treemap' | 'graph', options: Record<string, unknown>) {
  currentViewKey.value = view;
  nextTick(() => {
    currentViewOptions.value = { ...currentViewOptions.value, ...options };
  });
}
</script>

<template>
  <div class="h-screen w-screen flex bg-gray-200">
    <div class="m-5 max-w-[350px] w-1/3 flex flex-col overflow-auto rounded-lg bg-white p-2">
      <ViewToggle v-model="currentViewKey" />

      <currentView.OptionsComponent
        v-if="stats && currentViewOptions"
        v-model="currentViewOptions"
        :stats
        @update-view="changeView"
      />

      <OverviewModal v-if="stats" :stats="stats" class="mt-auto" />
    </div>

    <currentView.ViewComponent
      v-if="stats"
      v-model:options="currentViewOptions"
      :stats
      class="flex-shrink-1 flex-grow-1"
      @update-view="changeView"
    />
  </div>
</template>
