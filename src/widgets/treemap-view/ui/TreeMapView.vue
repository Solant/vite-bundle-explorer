<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
import * as echarts from 'echarts/core';

import {
  type BuildStats,
  getMetricLabel,
  getModuleSize,
  isDependency,
} from '@/entities/bundle-stats';
import type { TreeMapOptions } from '../model/options.ts';
import { useChart } from '@/shared/lib';
import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { GraphChart, TreemapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { accentColors, getColor, palettes, sourcePalette } from '@/shared/config';
import { dfs, type TreeMapChartNode } from '../model/tree-map';
import { BaseContextMenu } from '@/shared/ui';

const props = defineProps<{ stats: BuildStats }>();
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

const main = useTemplateRef('main');
const chart = useChart(
  main,
  [TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer, TreemapChart],
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
        formatter(info: any) {
          const value = info.value;
          const treePathInfo = info.treePathInfo;
          const treePath: string[] = [];
          for (let i = 1; i < treePathInfo.length; i++) {
            treePath.push(treePathInfo[i].name);
          }

          const result: string[] = [];
          result.push(
            '<div class="tooltip-title">' +
              echarts.format.encodeHTML(
                // @ts-expect-error
                treePath.length === 1 ? treePath : treePath.slice(1).join('/'),
              ) +
              '</div>',
            `${getMetricLabel(options.value.metric)}: ` +
              echarts.format.addCommas((value / 1024).toFixed(2)) +
              ' KB',
          );

          const moduleName = treePath.slice(1).join('/');
          const currentModuleIndex = props.stats.moduleFileNames.findIndex(
            (node) => node === moduleName,
          );
          const edges =
            currentModuleIndex >= 0
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
      node.value = node.children.reduce((acc, cur) => acc + cur.value, 0);
    }
  });

  // join groups with only 1 child
  if (options.value.compact) {
    dfs(result, (node) => {
      if (node.children.length === 1) {
        node.path = `${node.path}/${node.children[0].path}`;
        node.name = `${node.name}/${node.children[0].name}`;
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

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <div ref="main" :class="$attrs.class" />
  <base-context-menu
    :x="pos.x"
    :y="pos.y"
    v-model="visible"
    :items="[
      { label: 'Hide', onClick: hideSelectedNode },
      { label: 'Show import path', onClick: () => {} },
    ]"
  />
</template>
