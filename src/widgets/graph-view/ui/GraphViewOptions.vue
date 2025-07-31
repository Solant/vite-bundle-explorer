<script setup lang="ts">
import { useModelProxy } from '@/shared/lib';
import { NumberOption, OptionGroup, OptionItem } from '@/features/view-options';

import type { GraphOptions } from '../model/graph.ts';
import { BaseSwitch } from '@/shared/ui';

const model = defineModel<GraphOptions>({ required: true });

const forceRepulsion = useModelProxy(model, 'forceRepulsion');
const forceEdgeLength = useModelProxy(model, 'forceEdgeLength');
const forceFriction = useModelProxy(model, 'forceFriction');
const forceGravity = useModelProxy(model, 'forceGravity');
const compact = useModelProxy(model, 'compact');
</script>

<template>
  <div>
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
