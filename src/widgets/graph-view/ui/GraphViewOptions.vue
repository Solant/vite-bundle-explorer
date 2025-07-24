<script setup lang="ts">
import { useModelProxy } from '@/shared/lib';
import { NumberOption } from '@/features/view-options';

import type { GraphOptions } from '../model/graph.ts';

const model = defineModel<GraphOptions>({ required: true });

const forceRepulsion = useModelProxy(model, 'forceRepulsion');
const forceEdgeLength = useModelProxy(model, 'forceEdgeLength');
const forceFriction = useModelProxy(model, 'forceFriction');
const forceGravity = useModelProxy(model, 'forceGravity');
</script>

<template>
  <div>
    <NumberOption title="Repulsion" v-model="forceRepulsion" />
    <NumberOption title="Edge length" v-model="forceEdgeLength" />
    <NumberOption title="Friction" v-model="forceFriction" :step="0.01" :fixed="2" />
    <NumberOption title="Gravity" v-model="forceGravity" :step="0.01" :fixed="2" />
  </div>
</template>
