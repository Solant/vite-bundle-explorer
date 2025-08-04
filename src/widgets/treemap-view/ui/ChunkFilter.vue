<script setup lang="ts">
import { computed, ref } from 'vue';

import { type BuildStats, type Chunk, formatSize } from '@/entities/bundle-stats';
import { BaseButton } from '@/shared/ui';

import type { TreeMapOptions } from '../model/TreeMap.ts';

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
    return props.stats.chunks.sort((a, b) => getChunkLength(a) - getChunkLength(b));
  } else if (sortOrder.value === 'size-desc') {
    return props.stats.chunks.sort((a, b) => getChunkLength(b) - getChunkLength(a));
  } else if (sortOrder.value === 'name-asc') {
    return props.stats.chunks.sort((a, b) => a.fileName.localeCompare(b.fileName));
  } else if (sortOrder.value === 'name-desc') {
    return props.stats.chunks.sort((a, b) => b.fileName.localeCompare(a.fileName));
  }

  return props.stats.chunks;
});
</script>

<template>
  <div>
    <div class="flex justify-between">
      <BaseButton @click="toggleAll">Toggle all</BaseButton>

      <label>
        Sort by
        <select v-model="sortOrder">
          <option value="">-</option>
          <option value="name-asc">Name asc</option>
          <option value="name-desc">Name desc</option>
          <option value="size-asc">Size asc</option>
          <option value="size-desc">Size desc</option>
        </select>
      </label>
    </div>

    <div class="max-h-400px overflow-auto">
      <div
        v-for="chunk in sortedChunks"
        class="flex gap-1 cursor-pointer hover:bg-gray-300"
        @click="toggle(chunk, options.hiddenChunks.includes(chunk.fileName))"
        :key="chunk.fileName"
        :title="chunk.fileName"
      >
        <input
          type="checkbox"
          :checked="!options.hiddenChunks.includes(chunk.fileName)"
          @change="toggle(chunk, ($event.target as HTMLInputElement).checked)"
        />
        <div class="flex-grow-1 flex-shrink-1 min-w-0 truncate">
          {{ chunk.fileName }}
        </div>
        <div class="ml-auto whitespace-nowrap">{{ formatSize(getChunkLength(chunk)) }}</div>
      </div>
    </div>
  </div>
</template>
