<script setup lang="ts">
import type { GraphOptions } from '../model/graph.ts';
import { useModelProxy } from '@/shared/lib';

const model = defineModel<GraphOptions>({ required: true });

const forceRepulsion = useModelProxy(model, 'forceRepulsion');
</script>

<template>
  <div>
    Force repulsion
    <input type="number" v-model="forceRepulsion" />
  </div>
</template>
