<script setup lang="ts">
import { computed } from 'vue';

import { BaseSwitch } from '@/shared/ui';
import type { BuildStats } from '@/entities/bundle-stats';

import type { TreeMapOptions } from '../model/TreeMap.ts';
import ChunkFilter from './ChunkFilter.vue';

const model = defineModel<TreeMapOptions>({ required: true });

defineProps<{ stats: BuildStats }>();

const compact = computed({
  get: () => model.value.compact,
  set: (value) => (model.value = { ...model.value, compact: value }),
});
</script>

<template>
  <div>
    <div class="c-slate-800 flex justify-between my-2">
      Compact

      <BaseSwitch v-model="compact" />
    </div>
    <ChunkFilter v-model:options="model" :stats />
  </div>
</template>
