<script setup lang="ts">
import { useModelProxy } from '@/shared/lib';
import { BaseSwitch, NumberOption, OptionGroup, OptionItem } from '@/shared/ui';
import { MetricOption } from '@/features/options/metric';
import type { BuildStats } from '@/entities/bundle-stats';

import type { GraphOptions } from '../model/graph.ts';

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
    <MetricOption :stats v-model="metric" />
    <OptionItem title="Compact">
      <BaseSwitch v-model="compact" />
    </OptionItem>

    <OptionGroup title="Force layout">
      <NumberOption title="Repulsion" v-model="forceRepulsion" />
      <NumberOption title="Edge length" v-model="forceEdgeLength" />
      <NumberOption title="Friction" v-model="forceFriction" :step="0.01" :fixed="2" />
      <NumberOption title="Gravity" v-model="forceGravity" :step="0.01" :fixed="2" />
    </OptionGroup>
  </div>
</template>
