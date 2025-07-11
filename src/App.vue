<script setup lang="ts">
import { ref, shallowRef } from 'vue';

import TreeMapView from './views/TreeMapView.vue';
import type { BuildStats } from './stats.ts';
import { getDefaultTreeMapOptions } from './views/TreeMap.ts';
import TreeMapViewOptions from './views/TreeMapViewOptions.vue';
import ModuleFilter from './ModuleFilter.vue';
import ChunkFilter from './ChunkFilter.vue';

const stats = shallowRef<BuildStats>();
fetch('stats.json')
  .then((res) => res.json())
  .then((data) => {
    stats.value = data;
  });

const currentView = ref('treemap');

const options = ref(getDefaultTreeMapOptions());
</script>

<template>
  <div class="w-screen h-screen flex bg-gray-200">
    <div class="w-1/3 max-w-[350px] bg-white rounded-lg m-5 p-2">
      <div class="c-gray-800 flex justify-between">
        Current View
        <select v-model="currentView">
          <option value="treemap">Treemap</option>
        </select>
      </div>

      <TreeMapViewOptions v-model="options" />

      <ChunkFilter v-if="stats" v-model:options="options" :stats />
      <ModuleFilter v-if="stats" v-model:options="options" :stats />
    </div>

    <TreeMapView v-if="stats" :stats :options class="flex-grow-1 flex-shrink-1" />
  </div>
</template>
