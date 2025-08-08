<script lang="ts" setup>
const model = defineModel<'treemap' | 'graph'>({ required: true });

const activeLeft = 'bg-blue-700 rounded-l-md c-white';
const activeRight = 'bg-blue-700 rounded-r-md c-white';
</script>

<template>
  <div class="flex border border-solid border-blue-700 rounded-lg">
    <div
      class="flex w-1/2 items-center justify-center py-1 cursor-pointer"
      :class="{ [activeLeft]: model === 'treemap' }"
      @click="model = 'treemap'"
    >
      <div class="i-mdi-chart-tree" />
    </div>

    <div
      class="flex w-1/2 items-center justify-center py-1 cursor-pointer"
      :class="{ [activeRight]: model === 'graph' }"
      @click="model = 'graph'"
    >
      <div class="i-mdi-graph" />
    </div>
  </div>
</template>
