<script setup lang="ts">
import { computed } from 'vue';

import { BaseSwitch, OptionGroup, OptionItem } from '@/shared/ui';
import { type BuildStats } from '@/entities/bundle-stats';
import { MetricOption } from '@/features/options/metric';
import ModuleFilter from '@/widgets/treemap-view/ui/ModuleFilter.vue';
import { useModelProxy } from '@/shared/lib';

import type { TreeMapOptions } from '../model/TreeMap.ts';
import ChunkFilter from './ChunkFilter.vue';

const model = defineModel<TreeMapOptions>({ required: true });

const props = defineProps<{ stats: BuildStats }>();

const compact = computed({
  get: () => model.value.compact,
  set: (value) => (model.value = { ...model.value, compact: value }),
});

const numberOfModules = computed(() => {
  let total = 0;
  for (const chunk of props.stats.chunks) {
    total += chunk.modules.length;
  }

  return total;
});

const metric = useModelProxy(model, 'metric');
</script>

<template>
  <div>
    <MetricOption :stats v-model="metric" />
    <OptionItem title="Compact">
      <BaseSwitch v-model="compact" />
    </OptionItem>
    <OptionGroup
      :title="`Visible chunks (${stats.chunks.length - model.hiddenChunks.length}/${stats.chunks.length})`"
    >
      <ChunkFilter v-model:options="model" :stats />
    </OptionGroup>
    <OptionGroup
      :title="`Visible modules (${numberOfModules - model.hiddenModules.length}/${numberOfModules})`"
    >
      <ModuleFilter v-model:options="model" :stats />
    </OptionGroup>
  </div>
</template>
