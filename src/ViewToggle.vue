<script lang="ts" setup>
const model = defineModel<'treemap' | 'tree'>({ required: true });

const activeLeft = 'bg-indigo-700 rounded-l-md c-white';
const activeRight = 'bg-indigo-700 rounded-r-md c-white';
</script>

<template>
  <div class="flex border border-solid border-indigo-700 rounded-lg">
    <div
      class="flex w-1/2 items-center justify-center py-1 cursor-pointer"
      :class="{ [activeLeft]: model === 'treemap' }"
      @click="model = 'treemap'"
    >
      <div class="i-mdi-chart-tree" />
    </div>

    <div
      class="flex w-1/2 items-center justify-center py-1 cursor-pointer"
      :class="{ [activeRight]: model === 'tree' }"
      @click="model = 'tree'"
    >
      <div class="i-mdi-file-tree" />
    </div>
  </div>
</template>
