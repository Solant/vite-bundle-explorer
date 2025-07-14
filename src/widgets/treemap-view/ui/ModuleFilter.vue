<script setup lang="ts">
import { ref } from 'vue';

import type { BaseOptions } from '../model/TreeMap.ts';
import type { BuildStats, Module } from '../../../stats.ts';

defineProps<{ stats: BuildStats }>();

const options = defineModel<BaseOptions>('options', { required: true });

const visible = ref(false);

function toggleModule(module: Module, value: boolean) {
  if (!value) {
    options.value = {
      ...options.value,
      hiddenModules: [...options.value.hiddenModules, module.fileName],
    };
  } else {
    options.value = {
      ...options.value,
      hiddenModules: options.value.hiddenModules.filter((m) => m !== module.fileName),
    };
  }
}

function formatFileName(fileName: string): string {
  const parts = fileName.split('/');
  if (parts.length > 3) {
    return `${parts[0]}/.../${parts[parts.length - 1]}`;
  }
  return fileName;
}
</script>

<template>
  <div>
    <div class="c-gray-800 flex justify-between">
      Modules

      <input type="checkbox" v-model="visible" />
    </div>

    <div v-if="visible">
      <label v-for="module in stats.chunks[0].modules" class="block">
        <input
          type="checkbox"
          :checked="!options.hiddenModules.includes(module.fileName)"
          @change="toggleModule(module, ($event.target as HTMLInputElement).checked)"
        />
        {{ formatFileName(module.fileName) }}
      </label>
    </div>
  </div>
</template>
