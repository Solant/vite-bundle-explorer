<script setup lang="ts">
import {
  computed, ref, useTemplateRef, watch,
} from 'vue';
import * as echarts from 'echarts/core';
import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { GraphChart, TreemapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

import type { TreeMapOptions } from '../model/options.ts';
import { dfs, type TreeMapChartNode } from '../model/tree-map';
import { getPath } from '../model/path.ts';

import {
  accentColors, getColor, palettes, sourcePalette,
} from '@/shared/config';
import { useChart } from '@/shared/lib';
import { BaseContextMenu } from '@/shared/ui';
import {
  type BuildStats,
  getMetricLabel,
  getModuleSize,
  isDependency,
} from '@/entities/bundle-stats';

defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{ stats: BuildStats }>();
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateView: [view: string, options: Record<any, any>];
}>();
const options = defineModel<TreeMapOptions>('options', { required: true });

const selectedNode = ref<TreeMapChartNode>();
const visible = ref(false);
const pos = ref({ x: 0, y: 0 });

function hideSelectedNode() {
  const data = selectedNode.value;
  if (!data) {
    return;
  }

  const hiddenModules = new Set<number>();
  if (data.moduleIndex) {
    hiddenModules.add(data.moduleIndex);
  }

  function traverse(node: TreeMapChartNode) {
    node.children.forEach((child) => traverse(child));
    if (node.moduleIndex) {
      hiddenModules.add(node.moduleIndex);
    }
  }

  traverse(data);

  options.value = {
    ...options.value,
    hiddenModules: [...options.value.hiddenModules, ...Array.from(hiddenModules)],
  };
}

function printPath() {
  const data = selectedNode.value;
  if (!data) {
    return;
  }

  const target = data.moduleIndex;
  if (target == null) {
    return;
  }

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

const main = useTemplateRef('main');
const chart = useChart(
  main,
  [
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GraphChart,
    CanvasRenderer,
    TreemapChart,
  ],
  (c) => {
    c.on('contextmenu', (event) => {
      event.event!.event.preventDefault();
      const e = event.event!.event as MouseEvent;
      pos.value = { x: e.clientX, y: e.clientY };
      visible.value = true;
      selectedNode.value = event.data as TreeMapChartNode;
    });

    const upperLabel = {
      show: true,
      textBorderColor: 'black',
      textBorderWidth: 0,
      height: 30,
    };

    function level() {
      return {
        upperLabel: {
          ...upperLabel,
          color: 'white',
        },
        itemStyle: {
          textColor: 'black',
          borderWidth: 8,
          gapWidth: 4,
        },
      };
    }

    c.setOption({
      color: accentColors,
      tooltip: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter(info: any) {
          const { value } = info;
          const { treePathInfo } = info;
          const treePath: string[] = [];
          for (let i = 1; i < treePathInfo.length; i += 1) {
            treePath.push(treePathInfo[i].name);
          }

          const result: string[] = [];
          result.push(
            `<div class="tooltip-title">${
              echarts.format.encodeHTML(
                // @ts-expect-error echarts info is any
                treePath.length === 1 ? treePath : treePath.slice(1).join('/'),
              )
            }</div>`,
            `${getMetricLabel(options.value.metric)}: ${
              echarts.format.addCommas((value / 1024).toFixed(2))
            } KB`,
          );

          const moduleName = treePath.slice(1).join('/');
          const currentModuleIndex = props.stats.moduleFileNames.findIndex(
            (node) => node === moduleName,
          );
          if (currentModuleIndex >= 0) {
            result.push(`<div>Module index: ${currentModuleIndex}</div>`);
          }

          const edges = currentModuleIndex >= 0
            ? props.stats.importGraph.edges.filter(
              ([_source, target]) => target === currentModuleIndex,
            )
            : [];
          const parents = edges.map((edge) => props.stats.moduleFileNames[edge[0]]);
          if (parents.length) {
            result.push('<div class="mt-2">Imported by:</div>', '<ul>');

            if (parents.length > 8) {
              result.push(...parents.slice(0, 7).map((p) => `<li>${p}</li>`));
              result.push(`and ${parents.length - 8} more`);
            } else {
              result.push(...parents.map((p) => `<li>${p}</li>`));
            }

            result.push('</ul>');
          }

          return result.join('');
        },
      },
      series: [
        {
          name: 'Chunks',
          type: 'treemap',
          label: {
            show: true,
            formatter: '{b}',
          },
          upperLabel,
          itemStyle: {
            borderColor: 'white',
          },
          levels: [
            {
              itemStyle: {
                gapWidth: 8,
              },
            },
            ...Array.from({ length: 30 }).map(level),
          ],
          // eslint-disable-next-line no-use-before-define
          data: data.value,
        },
      ],
    });
  },
);

const data = computed(() => {
  const result: TreeMapChartNode[] = [];
  for (let chunkIndex = 0; chunkIndex < props.stats.chunks.length; chunkIndex += 1) {
    const chunk = props.stats.chunks[chunkIndex];
    const chunkColor = palettes[chunkIndex % palettes.length];
    if (options.value.hiddenChunks.includes(chunk.fileName)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const currentChunk: TreeMapChartNode = {
      value: 0,
      name: chunk.fileName,
      path: chunk.fileName,
      children: [],
      upperLabel: {
        backgroundColor: chunkColor[0],
      },
      itemStyle: {
        color: chunkColor[0],
        borderColor: chunkColor[0],
      },
    };
    result.push(currentChunk);

    for (const module of chunk.modules) {
      const moduleIndex = module.fileNameIndex;
      if (options.value.hiddenModules.includes(moduleIndex)) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const path = props.stats.moduleFileNames[module.fileNameIndex].split('/');

      let currentNode = currentChunk;
      for (let index = 0; index < path.length; index += 1) {
        const child = currentNode.children.find((c) => c.name === path[index]);
        if (child) {
          currentNode = child;
        } else {
          const newNode: TreeMapChartNode = {
            name: path[index],
            path: path[index],
            value: getModuleSize(module.fileNameIndex, props.stats, options.value.metric) ?? 0,
            children: [],
            moduleIndex,
            upperLabel: {
              backgroundColor: isDependency(path[0])
                ? getColor(chunkColor, index + 1)
                : getColor(sourcePalette, index),
            },
            itemStyle: {
              color: isDependency(path[0])
                ? getColor(chunkColor, index + 1)
                : getColor(sourcePalette, index),
              borderColor: isDependency(path[0])
                ? getColor(chunkColor, index + 1)
                : getColor(sourcePalette, index),
            },
          };
          currentNode.children.push(newNode);
          currentNode = newNode;
        }
      }
    }
  }

  // calculate the total size for groups
  dfs(result, (node) => {
    if (node.children.length) {
      // eslint-disable-next-line no-param-reassign
      node.value = node.children.reduce((acc, cur) => acc + cur.value, 0);
    }
  });

  // join groups with only 1 child
  if (options.value.compact) {
    dfs(result, (node) => {
      if (node.children.length === 1) {
        // eslint-disable-next-line no-param-reassign
        node.path = `${node.path}/${node.children[0].path}`;
        // eslint-disable-next-line no-param-reassign
        node.name = `${node.name}/${node.children[0].name}`;
        // eslint-disable-next-line no-param-reassign
        node.children = node.children[0].children;
      }
    });
  }

  return result;
});

watch(data, () => {
  chart.value?.setOption({
    series: [
      {
        data: data.value,
      },
    ],
  });
});

</script>

<template>
  <div ref="main" :class="$attrs.class" />
  <BaseContextMenu
    v-model="visible"
    :x="pos.x"
    :y="pos.y"
    :items="[
      { label: 'Hide', onClick: hideSelectedNode },
      { label: 'Show import path', onClick: printPath },
    ]"
  />
</template>
