<script lang="ts" setup>
const model = defineModel<'treemap' | 'graph'>({ required: true });

const treemap = { key: 'treemap', label: 'Treemap', icon: 'i-mdi:chart-tree' } as const;
const graph = { key: 'graph', label: 'Graph', icon: 'i-mdi:graph' } as const;

const views = [treemap, graph];
</script>

<template>
  <div class="flex flex-shrink-0 gap-0.5 rounded-md bg-gray-100 p-0.5 dark:bg-gray-800">
    <button
      v-for="view in views"
      :key="view.key"
      type="button"
      class="h-6 flex cursor-pointer items-center gap-1 rounded px-2 text-xs font-medium transition-colors"
      :class="model === view.key
        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'"
      @click="model = view.key"
    >
      <span :class="view.icon" class="text-[13px]" />
      {{ view.label }}
    </button>
  </div>
</template>
