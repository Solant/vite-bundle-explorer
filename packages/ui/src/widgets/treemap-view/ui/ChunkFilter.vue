<script setup lang="ts">
import { computed, ref } from 'vue';

import { type BuildStats, type Chunk, formatSize } from '@/entities/bundle-stats';
import { BaseButton } from '@/shared/ui';
import { Tree, type ModuleTreeNode, getModuleIcons } from '@/features/options/module';

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

const tree = computed<ModuleTreeNode[]>(() => sortedChunks.value.map((c) => {
  const node: ModuleTreeNode = {
    title: c.fileName,
    size: getChunkLength(c),
    visible: true,
    fileName: c.fileName,
  };
  node.icons = getModuleIcons(node, props.stats);
  return node;
}));
</script>

<template>
  <div>
    <div class="flex items-center justify-between gap-2 px-2 pb-1.5">
      <BaseButton @click="toggleAll">
        Toggle all
      </BaseButton>

      <label class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        Sort
        <select
          v-model="sortOrder"
          class="cursor-pointer rounded bg-gray-100 px-1 py-0.5 text-xs capitalize transition-colors dark:bg-gray-800 hover:bg-gray-200 focus:outline-none dark:hover:bg-gray-700"
        >
          <option value="">-</option>
          <option value="name-asc">Name asc</option>
          <option value="name-desc">Name desc</option>
          <option value="size-asc">Size asc</option>
          <option value="size-desc">Size desc</option>
        </select>
      </label>
    </div>

    <Tree :data="tree" />
  </div>
</template>
