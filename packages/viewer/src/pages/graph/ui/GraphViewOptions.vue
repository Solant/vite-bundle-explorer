<script setup lang="ts">
import type { BuildStats } from '@/entities/bundle-stats';
import { useModelProxy } from '@/shared/lib';
import {
  BaseSwitch, OptionItem,
} from '@/shared/ui';
import { MetricOption } from '@/features/options/metric';
import { ModuleFilterOption } from '@/features/options/module';

import type { GraphOptions } from '../model/graph.ts';

defineProps<{ stats: BuildStats }>();

const model = defineModel<GraphOptions>({ required: true });

const compact = useModelProxy(model, 'compact');
const metric = useModelProxy(model, 'metric');
const denseLayout = useModelProxy(model, 'denseLayout');
</script>

<template>
  <div>
    <MetricOption v-model="metric" :stats />
    <OptionItem title="Compact">
      <BaseSwitch v-model="compact" />
    </OptionItem>
    <OptionItem title="Dense layout">
      <BaseSwitch v-model="denseLayout" />
    </OptionItem>
    <ModuleFilterOption v-model:options="model" :stats modules="all" />
  </div>
</template>
