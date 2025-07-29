<script setup lang="ts">
import { computed } from 'vue';

import { BaseSwitch } from '@/shared/ui';
import type { BuildStats } from '@/entities/bundle-stats';

import type { TreeMapOptions } from '../model/TreeMap.ts';
import ChunkFilter from './ChunkFilter.vue';
import { OptionGroup, OptionItem } from '@/features/view-options';

const model = defineModel<TreeMapOptions>({ required: true });

defineProps<{ stats: BuildStats }>();

const compact = computed({
  get: () => model.value.compact,
  set: (value) => (model.value = { ...model.value, compact: value }),
});
</script>

<template>
  <div>
    <OptionItem title="Compact">
      <BaseSwitch v-model="compact" />
    </OptionItem>
    <OptionGroup
      :title="`Visible chunks (${stats.chunks.length - model.hiddenChunks.length}/${stats.chunks.length})`"
    >
      <ChunkFilter v-model:options="model" :stats />
    </OptionGroup>
  </div>
</template>
