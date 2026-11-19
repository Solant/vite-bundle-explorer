<script lang="ts" setup>
import { ref } from 'vue';

import type { BuildStats } from '@/entities/bundle-stats';
import SplitLayout from '@/shared/layouts/SplitLayout.vue';

import GraphView from './GraphView.vue';
import GraphViewOptions from './GraphViewOptions.vue';
import { optionsFactory } from '../model/graph';

const props = defineProps<{
  stats: BuildStats;
}>();

const options = ref(optionsFactory(props.stats));
</script>

<template>
  <SplitLayout>
    <template #aside>
      <GraphViewOptions v-model="options" :stats />
    </template>
    <template #main>
      <GraphView :stats :options class="h-full w-full" />
    </template>
  </SplitLayout>
</template>
