<script lang="ts" setup>
import { ref } from 'vue';

import type { BuildStats } from '@/entities/bundle-stats';
import SplitLayout from '@/shared/layouts/SplitLayout.vue';

import TreeMapView from './TreeMapView.vue';
import TreeMapViewOptions from './TreeMapViewOptions.vue';
import { getDefaultTreeMapOptions } from '../model/options';

const props = defineProps<{
  stats: BuildStats;
}>();

const options = ref(getDefaultTreeMapOptions(props.stats));
</script>

<template>
  <SplitLayout>
    <template #aside>
      <TreeMapViewOptions v-model="options" :stats />
    </template>
    <template #main>
      <TreeMapView :stats :options class="h-full w-full" />
    </template>
  </SplitLayout>
</template>
