<script setup lang="ts">
import {
  computed, nextTick, ref, shallowRef, watch,
} from 'vue';
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui';
import { useDark } from '@vueuse/core';

import { TreemapView } from '@/widgets/treemap-view';
import { GraphView } from '@/widgets/graph-view';
import type { BuildStats } from '@/entities/bundle-stats';
import { OverviewModal } from '@/features/overview';

import ViewToggle from './ViewToggle.vue';

const isDark = useDark();
function toggleDarkMode() {
  isDark.value = !isDark.value;
}

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

function resize() {
  window.dispatchEvent(new Event('resize'));
}
</script>

<template>
  <div class="h-screen w-screen flex bg-white dark:bg-gray-900">
    <button class="i-mdi:lightbulb-night-outline absolute right-2 top-2 z-20 h-7 w-7 c-gray-900 dark:c-white" @click="toggleDarkMode" />
    <SplitterGroup direction="horizontal">
      <SplitterPanel :default-size="20">
        <div class="h-full flex flex-col overflow-auto bg-white p-2 dark:bg-gray-900">
          <ViewToggle v-model="currentViewKey" />

          <currentView.OptionsComponent
            v-if="stats && currentViewOptions"
            v-model="currentViewOptions"
            :stats
            @update-view="changeView"
          />

          <OverviewModal v-if="stats" :stats="stats" class="mt-auto" />
        </div>
      </SplitterPanel>

      <SplitterResizeHandle class="w-1.5 bg-gray-200 transition-colors dark:bg-gray-700 hover:bg-gray-600 dark:hover:bg-gray-500" />

      <SplitterPanel class="flex" @resize="resize">
        <currentView.ViewComponent
          v-if="stats"
          v-model:options="currentViewOptions"
          :stats
          class="flex-shrink-1 flex-grow-1"
          @update-view="changeView"
        />
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>
