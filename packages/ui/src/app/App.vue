<script setup lang="ts">
import {
  ref, shallowRef,
} from 'vue';

import type { BuildStats } from '@/entities/bundle-stats';
import { OverviewModal } from '@/features/overview';
import { BaseButton, BaseDialog, ThemeSwitcher, BaseToggleGroup } from '@/shared/ui';
import { TreeMapPage } from '@/pages/treemap';
import { GraphPage } from '@/pages/graph';

const stats = shallowRef<BuildStats>();

const views = [
  {
    key: 'treemap',
    label: 'Treemap',
    icon: 'i-mdi:chart-tree',
  },
  {
    key: 'graph',
    label: 'Graph',
    icon: 'i-mdi:graph',
  },
];
const currentView = ref(views[0].key);

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

      <BaseToggleGroup
        v-model="currentView"
        :options="views"
      />

      <div class="ml-auto flex items-center gap-1.5">
        <OverviewModal v-if="stats" :stats="stats" />

        <ThemeSwitcher />
      </div>
    </header>

    <template v-if="stats != null">
      <TreeMapPage v-if="currentView === 'treemap'" :stats />
      <GraphPage v-if="currentView === 'graph'" :stats />
    </template>
  </div>

  <BaseDialog v-model:open="selectorVisible" title="Select a fixture">
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
  </BaseDialog>
</template>
