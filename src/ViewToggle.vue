<script lang="ts" setup>
const model = defineModel<'treemap' | 'graph'>({ required: true });

const activeLeft = 'bg-blue-600 rounded-l-md c-white';
const activeRight = 'bg-blue-600 rounded-r-md c-white';
</script>

<template>
  <div class="flex border border-solid border-blue-600 rounded-lg overflow-hidden">
    <button
      type="button"
      class="flex w-1/2 items-center justify-center py-2 cursor-pointer transition-colors hover:bg-blue-700 hover:c-white active:bg-blue-800"
      :class="{ [activeLeft]: model === 'treemap' }"
      @click="model = 'treemap'"
    >
      <span class="i-mdi-chart-tree" />
    </button>

    <button
      type="button"
      class="flex w-1/2 items-center justify-center py-2 cursor-pointer transition-colors hover:bg-blue-700 hover:c-white active:bg-blue-800"
      :class="{ [activeRight]: model === 'graph' }"
      @click="model = 'graph'"
    >
      <span class="i-mdi-graph" />
    </button>
  </div>
</template>
