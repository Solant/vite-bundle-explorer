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
const spreadLayout = useModelProxy(model, 'spreadLayout');
</script>

<template>
  <div>
    <MetricOption v-model="metric" :stats />
    <OptionItem title="Compact">
      <template #description>
        <p>
          Hides modules that contribute no size to the selected metric and import nothing
          themselves.
        </p>

        <p class="mt-2">
          This check repeats, so modules emptied by these removals are hidden as well.
        </p>
      </template>

      <BaseSwitch v-model="compact" />
    </OptionItem>
    <OptionItem title="Spread layout">
      <template #description>
        <p>
          Reduces spring-domination effect in clusters.
          Makes modules spread out more in tight clusters and a bit easier to read.
        </p>

        <p class="mt-2">
          This might obscure direct connections between modules by overlapping edges with nodes and
          spreading out related nodes.
        </p>
      </template>

      <BaseSwitch v-model="spreadLayout" />
    </OptionItem>
    <ModuleFilterOption v-model:options="model" :stats modules="all" />
  </div>
</template>
