<script setup lang="ts">
import { computed, ref } from 'vue';

import { type BuildStats, type Chunk, formatSize } from '@/entities/bundle-stats';
import { BaseButton } from '@/shared/ui';

import type { TreeMapOptions } from '../model/options.ts';

const props = defineProps<{ stats: BuildStats }>();

const options = defineModel<TreeMapOptions>('options', { required: true });

function toggle(module: Chunk, value: boolean) {
  if (!value) {
    options.value = {
      ...options.value,
      hiddenChunks: [...options.value.hiddenChunks, module.fileName],
    };
  } else {
    options.value = {
      ...options.value,
      hiddenChunks: options.value.hiddenChunks.filter((m) => m !== module.fileName),
    };
  }
}

function toggleAll() {
  if (options.value.hiddenChunks.length === 0) {
    options.value = {
      ...options.value,
      hiddenChunks: props.stats.chunks.map((c) => c.fileName),
    };
  } else {
    options.value = {
      ...options.value,
      hiddenChunks: [],
    };
  }
}

function getChunkLength(chunk: Chunk) {
  return chunk.modules.reduce((acc, cur) => acc + cur.renderedLength, 0);
}

const sortOrder = ref<'' | 'size-asc' | 'name-asc' | 'size-desc' | 'name-desc'>('');
const sortedChunks = computed<Chunk[]>(() => {
  if (sortOrder.value === 'size-asc') {
    return props.stats.chunks.toSorted((a, b) => getChunkLength(a) - getChunkLength(b));
  } if (sortOrder.value === 'size-desc') {
    return props.stats.chunks.toSorted((a, b) => getChunkLength(b) - getChunkLength(a));
  } if (sortOrder.value === 'name-asc') {
    return props.stats.chunks.toSorted((a, b) => a.fileName.localeCompare(b.fileName));
  } if (sortOrder.value === 'name-desc') {
    return props.stats.chunks.toSorted((a, b) => b.fileName.localeCompare(a.fileName));
  }

  return props.stats.chunks;
});
</script>

<template>
  <div class="c-gray-900 dark:c-white">
    <div class="flex justify-between p-1">
      <BaseButton @click="toggleAll">
        Toggle all
      </BaseButton>

      <label>
        Sort by
        <select
          v-model="sortOrder"
          class="border-none bg-transparent capitalize focus:outline-none"
        >
          <option value="">-</option>
          <option value="name-asc">Name asc</option>
          <option value="name-desc">Name desc</option>
          <option value="size-asc">Size asc</option>
          <option value="size-desc">Size desc</option>
        </select>
      </label>
    </div>

    <div class="overflow-auto p-1">
      <div
        v-for="chunk in sortedChunks"
        :key="chunk.fileName"
        class="flex cursor-pointer gap-1 hover:bg-gray-300 dark:hover:bg-gray-700"
        :title="chunk.fileName"
        @click="toggle(chunk, options.hiddenChunks.includes(chunk.fileName))"
      >
        <input
          type="checkbox"
          :checked="!options.hiddenChunks.includes(chunk.fileName)"
          @change="toggle(chunk, ($event.target as HTMLInputElement).checked)"
        >
        <div class="min-w-0 flex-shrink-1 flex-grow-1 truncate">
          {{ chunk.fileName }}
        </div>
        <div class="ml-auto whitespace-nowrap">
          {{ formatSize(getChunkLength(chunk)) }}
        </div>
      </div>
    </div>
  </div>
</template>
