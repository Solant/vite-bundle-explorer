<script setup lang="ts" generic="T extends Record<any, any>">
import { computed, ref, watch } from 'vue';

import { type BuildStats, getModuleSize } from '@/entities/bundle-stats';
import { BaseButton, BaseContextMenu, OptionGroup } from '@/shared/ui';
import { dfs, sort } from '@/shared/graph';
import { getPath } from '@/widgets/treemap-view/model/path.ts';

import { default as Tree } from './Tree.vue';
import { getModuleTree, type ModuleTreeNode } from '../model/module-tree';

const props = defineProps<{ stats: BuildStats; modules: 'bundled' | 'all' }>();

const emit = defineEmits<{
  updateView: [view: string, options: Record<string, unknown>];
}>();

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
  const result: string[] = [];

  if (props.modules === 'bundled') {
    for (const chunk of props.stats.chunks) {
      for (const module of chunk.modules) {
        result.push(props.stats.moduleFileNames[module.fileNameIndex]);
      }
    }
  } else {
    result.push(...props.stats.moduleFileNames);
  }

  return result;
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

const numberOfModules = props.modules === 'all'
  ? props.stats.moduleFileNames.length
  : props.stats.chunks.reduce((acc, cur) => acc + cur.modules.length, 0);

// prepare a file tree
const tree = ref(getModuleTree(modules.value, props.stats));
watch(
  () => options.value.metric,
  (metric) => {
    dfs(
      tree.value,
      (node) => {
        if (node.fileName) {
          // eslint-disable-next-line no-param-reassign
          node.size = getModuleSize(node.fileName, props.stats, metric) ?? 0;
        }
        if (node.children) {
          // eslint-disable-next-line no-param-reassign
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
watch(
  () => options.value.hiddenModules,
  (hiddenModules) => {
    dfs(tree.value, (node) => {
      const index = node.fileName ? props.stats.moduleFileNames.indexOf(node.fileName) : -1;
      if (hiddenModules.includes(index)) {
        // eslint-disable-next-line no-param-reassign
        node.visible = false;
      } else if (index !== -1) {
        // eslint-disable-next-line no-param-reassign
        node.visible = true;
      }
    });

    dfs(
      tree.value,
      (node) => {
        if (node.children) {
          // eslint-disable-next-line no-param-reassign
          node.visible = !node.children.every((c) => c.visible === false);
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
  // eslint-disable-next-line no-param-reassign
  node.visible = !node.visible;

  if (node.fileName != null) {
    toggle([props.stats.moduleFileNames.indexOf(node.fileName)], node.visible);
  }

  if (node.children) {
    const modulesToHide: Array<number> = [];
    dfs(node.children, (child) => {
      // eslint-disable-next-line no-param-reassign
      child.visible = node.visible;
      if (child.fileName) {
        modulesToHide.push(props.stats.moduleFileNames.indexOf(child.fileName));
      }
    });
    toggle(modulesToHide, node.visible);
  }
}

const selectedNode = ref<ModuleTreeNode>();
const open = ref(false);
const pos = ref({ x: 0, y: 0 });
function onContextMenu(payload: { event: MouseEvent; node: ModuleTreeNode }) {
  const { event, node } = payload;

  pos.value.x = event.clientX;
  pos.value.y = event.clientY;
  selectedNode.value = node;
  open.value = true;
}

function toggleSelectedNode() {
  if (selectedNode.value) {
    toggleVisibility(selectedNode.value);
  }
}

function printPath() {
  const data = selectedNode.value;
  if (!data) {
    return;
  }

  const { fileName } = data;
  if (fileName == null) {
    return;
  }

  const target = props.stats.moduleFileNames.indexOf(fileName);
  const source = 0;
  const path = getPath(props.stats.importGraph.edges, source, target);
  if (!path) {
    return;
  }

  const hiddenModules = props.stats.moduleFileNames
    .map((_, index) => index)
    .filter((index) => !path.includes(index));
  emit('updateView', 'graph', { hiddenModules });
}
</script>

<template>
  <OptionGroup
    :title="`Visible modules (${numberOfModules - options.hiddenModules.length}/${numberOfModules})`"
  >
    <div class="flex justify-between p-1">
      <BaseButton @click="toggleAll">
        Toggle all
      </BaseButton>

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
      @context-menu="onContextMenu"
    />

    <BaseContextMenu
      v-model="open"
      :x="pos.x"
      :y="pos.y"
      :items="[
        {
          label: 'Toggle visibility',
          onClick: toggleSelectedNode,
        },
        {
          label: 'Show import path',
          onClick: printPath,
        },
      ]"
    />
  </OptionGroup>
</template>
