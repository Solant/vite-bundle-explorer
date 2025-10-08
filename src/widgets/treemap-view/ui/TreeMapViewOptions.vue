<script setup lang="ts">
import { computed } from 'vue';

import { BaseSwitch, OptionGroup, OptionItem } from '@/shared/ui';
import { type BuildStats } from '@/entities/bundle-stats';
import { MetricOption } from '@/features/options/metric';
import { ModuleFilterOption } from '@/features/options/module';
import { useModelProxy } from '@/shared/lib';

import type { TreeMapOptions } from '../model/options.ts';
import ChunkFilter from './ChunkFilter.vue';

const model = defineModel<TreeMapOptions>({ required: true });

defineProps<{ stats: BuildStats }>();

const compact = computed({
  get: () => model.value.compact,
  set: (value) => (model.value = { ...model.value, compact: value }),
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
    <ModuleFilterOption v-model:options="model" :stats />
  </div>
</template>
