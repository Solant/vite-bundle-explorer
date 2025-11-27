<script lang="ts" setup>
const model = defineModel<'treemap' | 'graph'>({ required: true });

const buttonCls = 'w-1/2 flex cursor-pointer items-center justify-center py-2.5 gap-1 dark:c-gray-600 c-gray-400';

// eslint-disable-next-line
const activeCls = 'w-1/2 flex cursor-pointer items-center justify-center py-2.5 gap-1 bg-gray-200 dark:bg-gray-600 dark:c-white c-gray-900';
</script>

<template>
  <div class="flex flex-shrink-0 overflow-hidden bg-gray-100 text-sm -mx-2 -mt-2 dark:bg-gray-800">
    <button
      type="button"
      :class="model === 'treemap' ? activeCls : buttonCls"
      @click="model = 'treemap'"
    >
      <span class="i-mdi-chart-tree" />
      Tree Map
    </button>

    <button
      type="button"
      :class="model === 'graph' ? activeCls : buttonCls"
      @click="model = 'graph'"
    >
      <span class="i-mdi-graph" />
      Graph
    </button>
  </div>
</template>
