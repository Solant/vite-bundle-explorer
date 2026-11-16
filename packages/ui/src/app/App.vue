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
import { BaseButton } from '@/shared/ui';

import ViewToggle from './ViewToggle.vue';

const isDark = useDark();
function toggleDarkMode() {
  isDark.value = !isDark.value;
}

const stats = shallowRef<BuildStats>();

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
const selectorVisible = ref(false);
const selectorValue = ref<string | undefined>();
const selectorOptions = ref<string[]>([]);

if (import.meta.env.MODE === 'development' && window.location.hash.length <= 1) {
  selectorVisible.value = true;
  fetch('/list')
    .then((res) => res.json())
    .then((data) => { selectorOptions.value = data.files; })
    .catch(console.error);
} else if (import.meta.env.MODE === 'development' && window.location.hash.length > 1) {
  selectorValue.value = decodeURIComponent(window.location.hash.slice(1));
  fetchStats();
} else {
  const payload = JSON.parse(window.BUNDLE_STATS ?? '');
  stats.value = payload as BuildStats;
}

function fetchStats() {
  if (!selectorValue.value) return;

  const name = encodeURIComponent(selectorValue.value);
  fetch(`/get?name=${name}`)
    .then((res) => res.json())
    .then((data) => {
      stats.value = data;
      selectorVisible.value = false;
      window.location.hash = name;
    })
    .catch(console.error);
}
</script>

<template>
  <div class="h-screen w-screen flex bg-white dark:bg-gray-900">
    <button type="button" class="i-mdi:lightbulb-night-outline absolute right-2 top-2 z-20 h-7 w-7 c-gray-900 dark:c-white" @click="toggleDarkMode" />
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

  <teleport to="body">
    <div v-if="selectorVisible" class="fixed inset-0 z-30 flex items-center justify-center bg-gray-200 opacity-75 dark:bg-gray-700">
      <div
        class="z-30 max-h-[85vh] max-w-[450px] w-[90vw] rounded bg-white c-gray-900 dark:bg-gray-800 dark:c-white"
      >
        <div class="flex justify-center px-4 py-2">
          Select a fixture
        </div>

        <div class="flex gap-2 px-4 py-2">
          <select v-model="selectorValue" class="min-w-0 flex-1 bg-white c-gray-900 dark:bg-gray-700 dark:c-white">
            <option v-for="option in selectorOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>

          <BaseButton :disabled="!selectorValue" @click="fetchStats">
            Select
          </BaseButton>
        </div>
      </div>
    </div>
  </teleport>
</template>
