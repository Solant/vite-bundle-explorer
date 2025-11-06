<script setup lang="ts">
import type { GraphOptions } from '../model/graph.ts';

import type { BuildStats } from '@/entities/bundle-stats';
import { useModelProxy } from '@/shared/lib';
import {
  BaseSwitch, NumberOption, OptionGroup, OptionItem,
} from '@/shared/ui';
import { MetricOption } from '@/features/options/metric';
import { ModuleFilterOption } from '@/features/options/module';

defineProps<{ stats: BuildStats }>();

const model = defineModel<GraphOptions>({ required: true });

const forceRepulsion = useModelProxy(model, 'forceRepulsion');
const forceEdgeLength = useModelProxy(model, 'forceEdgeLength');
const forceFriction = useModelProxy(model, 'forceFriction');
const forceGravity = useModelProxy(model, 'forceGravity');
const compact = useModelProxy(model, 'compact');
const metric = useModelProxy(model, 'metric');
</script>

<template>
  <div>
    <MetricOption v-model="metric" :stats />
    <OptionItem title="Compact">
      <BaseSwitch v-model="compact" />
    </OptionItem>
    <ModuleFilterOption v-model:options="model" :stats modules="all" />

    <OptionGroup title="Force layout">
      <NumberOption v-model="forceRepulsion" title="Repulsion" />
      <NumberOption v-model="forceEdgeLength" title="Edge length" />
      <NumberOption
        v-model="forceFriction"
        title="Friction"
        :step="0.01"
        :fixed="2"
      />
      <NumberOption
        v-model="forceGravity"
        title="Gravity"
        :step="0.01"
        :fixed="2"
      />
    </OptionGroup>
  </div>
</template>
