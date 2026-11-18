<script setup lang="ts">
import {
  computed, nextTick, ref, shallowRef, watch,
} from 'vue';
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui';

import { TreemapView } from '@/widgets/treemap-view';
import { GraphView } from '@/widgets/graph-view';
import type { BuildStats } from '@/entities/bundle-stats';
import { OverviewModal } from '@/features/overview';
import { BaseButton, ThemeSwitcher } from '@/shared/ui';

import ViewToggle from './ViewToggle.vue';

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
  <div class="h-screen w-screen flex flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <header class="h-10 flex flex-none items-center gap-3 border-b border-gray-200 px-2 dark:border-gray-800">
      <div class="flex items-center gap-1.5 pl-1 text-[13px] font-semibold">
        <span class="i-vscode-icons:file-type-vite" />
        Bundle Explorer
      </div>

      <ViewToggle v-model="currentViewKey" />

      <div class="ml-auto flex items-center gap-1.5">
        <OverviewModal v-if="stats" :stats="stats" />

        <ThemeSwitcher />
      </div>
    </header>

    <SplitterGroup direction="horizontal" class="min-h-0 flex-1">
      <SplitterPanel :default-size="20" :min-size="12">
        <div class="h-full overflow-y-auto bg-gray-50 p-1.5 dark:bg-gray-950/40">
          <currentView.OptionsComponent
            v-if="stats && currentViewOptions"
            v-model="currentViewOptions"
            :stats
            @update-view="changeView"
          />
        </div>
      </SplitterPanel>

      <SplitterResizeHandle class="w-1.5 bg-gray-100 outline-none transition-colors dark:bg-gray-800 hover:bg-blue-600" />

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
    <div v-if="selectorVisible" class="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
      <div class="max-w-80 w-full border border-gray-200 rounded-lg bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-3 text-sm font-semibold">
          Select a fixture
        </div>

        <div class="flex gap-2">
          <select
            v-model="selectorValue"
            class="min-w-0 flex-1 cursor-pointer border border-gray-300 rounded bg-white px-2 py-1 text-[13px] outline-none dark:border-gray-700 dark:bg-gray-800"
          >
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
