<script setup lang="ts" generic="T extends Record<any, any>">
import { computed, ref, watch } from 'vue';

import { type BuildStats, getModuleSize } from '@/entities/bundle-stats';
import { BaseButton, OptionGroup } from '@/shared/ui';
import { getModuleTree, type ModuleTreeNode } from '../model/module-tree';
import { default as Tree } from './Tree.vue';
import { dfs, sort } from '@/shared/graph';

const props = defineProps<{ stats: BuildStats; modules: 'bundled' | 'all' }>();

const options = defineModel<T>('options', { required: true });

function toggle(modules: number[], flag: boolean) {
  if (!flag) {
    options.value = {
      ...options.value,
      hiddenModules: [...options.value.hiddenModules, ...modules],
    };
  } else {
    options.value = {
      ...options.value,
      hiddenModules: options.value.hiddenModules.filter((m: number) => !modules.includes(m)),
    };
  }
}

const modules = computed(() => {
  const modules: string[] = [];

  if (props.modules === 'bundled') {
    for (const chunk of props.stats.chunks) {
      for (const module of chunk.modules) {
        modules.push(props.stats.moduleFileNames[module.fileNameIndex]);
      }
    }
  } else {
    modules.push(...props.stats.moduleFileNames);
  }

  return modules;
});

function toggleAll() {
  if (options.value.hiddenModules.length === 0) {
    options.value = {
      ...options.value,
      hiddenModules: modules.value.map((m) => props.stats.moduleFileNames.indexOf(m)),
    };
  } else {
    options.value = {
      ...options.value,
      hiddenModules: [],
    };
  }
}

const numberOfModules =
  props.modules === 'all'
    ? props.stats.moduleFileNames.length
    : props.stats.chunks.reduce((acc, cur) => acc + cur.modules.length, 0);

// prepare a file tree
const tree = ref(getModuleTree(modules.value));
watch(
  () => options.value.metric,
  (metric) => {
    dfs(
      tree.value,
      (node) => {
        if (node.fileName) {
          node.size = getModuleSize(node.fileName, props.stats, metric) ?? 0;
        }
        if (node.children) {
          node.size = node.children?.reduce((acc, cur) => acc + (cur.size ?? 0), 0) ?? 0;
        }
      },
      0,
      undefined,
      'post',
    );
  },
  { immediate: true },
);

// sort order
const sortOrder = ref<'size' | 'name'>('size');
watch(
  sortOrder,
  (newOrder) => {
    if (newOrder === 'size') {
      sort(tree.value, (a, b) => (b.size ?? 0) - (a.size ?? 0));
    } else if (newOrder === 'name') {
      sort(tree.value, (a, b) => a.title.localeCompare(b.title));
    }
  },
  { immediate: true },
);

function toggleVisibility(node: ModuleTreeNode) {
  node.visible = !node.visible;

  if (node.fileName != null) {
    toggle([props.stats.moduleFileNames.indexOf(node.fileName)], node.visible);
  }

  if (node.children) {
    const modulesToHide: Array<number> = [];
    dfs(node.children, (child) => {
      child.visible = node.visible;
      if (child.fileName) {
        modulesToHide.push(props.stats.moduleFileNames.indexOf(child.fileName));
      }
    });
    toggle(modulesToHide, node.visible);
  }
}
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
          <option value="name">Name</option>
          <option value="size">Size</option>
        </select>
      </label>
    </div>

    <Tree
      :data="tree"
      @toggle="$event.collapsed = !$event.collapsed"
      @toggle-visibility="toggleVisibility"
    />
  </OptionGroup>
</template>
