<script setup lang="ts" generic="T extends Record<any, any>">
import { computed, ref } from 'vue';

import { type BuildStats, formatSize, getModuleSize, type Module } from '@/entities/bundle-stats';
import { BaseButton, OptionGroup } from '@/shared/ui';

const props = defineProps<{ stats: BuildStats }>();

const options = defineModel<T>('options', { required: true });

function toggle(module: ModuleWithFileName, value: boolean) {
  if (!value) {
    options.value = {
      ...options.value,
      hiddenModules: [...options.value.hiddenModules, module.fileNameIndex],
    };
  } else {
    options.value = {
      ...options.value,
      hiddenModules: options.value.hiddenModules.filter((m: number) => m !== module.fileNameIndex),
    };
  }
}

function toggleAll() {
  if (options.value.hiddenModules.length === 0) {
    options.value = {
      ...options.value,
      hiddenModules: modules.value.map((m) => m.fileNameIndex),
    };
  } else {
    options.value = {
      ...options.value,
      hiddenModules: [],
    };
  }
}

interface ModuleWithFileName extends Module {
  fileName: string;
}

const modules = computed(() => {
  const modules: ModuleWithFileName[] = [];
  for (const name of props.stats.moduleFileNames) {
    modules.push({
      fileName: name,
      fileNameIndex: props.stats.moduleFileNames.indexOf(name),
      renderedLength: 0,
    });
  }
  return modules;
});

const sortOrder = ref<'' | 'size-asc' | 'name-asc' | 'size-desc' | 'name-desc'>('');
const sortedModules = computed(() => {
  if (sortOrder.value === 'size-asc') {
    return modules.value.sort(
      (a, b) =>
        (getModuleSize(a.fileName, props.stats, options.value.metric) ?? 0) -
        (getModuleSize(b.fileName, props.stats, options.value.metric) ?? 0),
    );
  } else if (sortOrder.value === 'size-desc') {
    return modules.value.sort(
      (a, b) =>
        (getModuleSize(b.fileName, props.stats, options.value.metric) ?? 0) -
        (getModuleSize(a.fileName, props.stats, options.value.metric) ?? 0),
    );
  } else if (sortOrder.value === 'name-asc') {
    return modules.value.sort((a, b) => a.fileName.localeCompare(b.fileName));
  } else if (sortOrder.value === 'name-desc') {
    return modules.value.sort((a, b) => b.fileName.localeCompare(a.fileName));
  }

  return modules.value;
});

const numberOfModules = props.stats.moduleFileNames.length;
</script>

<template>
  <OptionGroup
    :title="`Visible modules (${numberOfModules - options.hiddenModules.length}/${numberOfModules})`"
  >
    <div class="flex justify-between p-1">
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

    <div class="overflow-auto p-1">
      <div
        v-for="module in sortedModules"
        class="flex gap-1 cursor-pointer hover:bg-gray-300"
        @click="toggle(module, options.hiddenModules.includes(module.fileNameIndex))"
        :title="module.fileName"
        :key="module.fileNameIndex"
      >
        <input
          type="checkbox"
          :checked="!options.hiddenModules.includes(module.fileNameIndex)"
          @change="toggle(module, ($event.target as HTMLInputElement).checked)"
        />
        <div class="flex-grow-1 flex-shrink-1 min-w-0 truncate">
          {{ module.fileName }}
        </div>
        <div class="ml-auto whitespace-nowrap">
          {{ formatSize(getModuleSize(module.fileNameIndex, props.stats, options.metric) ?? 0) }}
        </div>
      </div>
    </div>
  </OptionGroup>
</template>
