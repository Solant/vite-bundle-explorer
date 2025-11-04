<script setup lang="ts">
import { computed } from 'vue';

import type { TreeMapOptions } from '../model/options.ts';
import ChunkFilter from './ChunkFilter.vue';

import { BaseSwitch, OptionGroup, OptionItem } from '@/shared/ui';
import { type BuildStats } from '@/entities/bundle-stats';
import { MetricOption } from '@/features/options/metric';
import { ModuleFilterOption } from '@/features/options/module';
import { useModelProxy } from '@/shared/lib';

defineProps<{ stats: BuildStats }>();

const emit = defineEmits<{
  updateView: [view: string, options: unknown];
}>();

const model = defineModel<TreeMapOptions>({ required: true });

const compact = computed({
  get: () => model.value.compact,
  set: (value) => {
    model.value = { ...model.value, compact: value };
  },
});

const metric = useModelProxy(model, 'metric');

function updateView(view: string, options: unknown) {
  emit('updateView', view, options);
}
</script>

<template>
  <div>
    <MetricOption v-model="metric" :stats />
    <OptionItem title="Compact">
      <BaseSwitch v-model="compact" />
    </OptionItem>
    <OptionGroup
      :title="`Visible chunks (${stats.chunks.length - model.hiddenChunks.length}/${stats.chunks.length})`"
    >
      <ChunkFilter v-model:options="model" :stats />
    </OptionGroup>

    <ModuleFilterOption
      v-model:options="model"
      :stats
      modules="bundled"
      @update-view="updateView"
    />
  </div>
</template>
