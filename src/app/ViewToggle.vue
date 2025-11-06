<script lang="ts" setup>
const model = defineModel<'treemap' | 'graph'>({ required: true });

const activeLeft = 'bg-blue-600 rounded-l-md c-white';
const activeRight = 'bg-blue-600 rounded-r-md c-white';
</script>

<template>
  <div class="flex flex-shrink-0 overflow-hidden border border-blue-600 rounded-lg border-solid">
    <button
      type="button"
      class="w-1/2 flex cursor-pointer items-center justify-center py-2 transition-colors active:bg-blue-800 hover:bg-blue-700 hover:c-white"
      :class="{ [activeLeft]: model === 'treemap' }"
      @click="model = 'treemap'"
    >
      <span class="i-mdi-chart-tree" />
    </button>

    <button
      type="button"
      class="w-1/2 flex cursor-pointer items-center justify-center py-2 transition-colors active:bg-blue-800 hover:bg-blue-700 hover:c-white"
      :class="{ [activeRight]: model === 'graph' }"
      @click="model = 'graph'"
    >
      <span class="i-mdi-graph" />
    </button>
  </div>
</template>
