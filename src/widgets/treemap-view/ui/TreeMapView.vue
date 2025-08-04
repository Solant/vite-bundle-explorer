<script lang="ts">
import * as echarts from 'echarts/core';

function getLevelOption() {
  return [
    {
      itemStyle: {
        gapWidth: 10,
      },
      upperLabel: {
        show: false,
      },
    },
    {
      itemStyle: {
        borderColor: '#d3d3d3',
        borderWidth: 5,
        gapWidth: 1,
      },
    },
    {
      colorSaturation: [0.35, 0.5],
      itemStyle: {
        borderWidth: 5,
        gapWidth: 1,
        borderColorSaturation: 0.6,
      },
    },
  ];
}

interface TreeMapChartData {
  value: number;
  moduleIndex?: number;
  name: string;
  path: string;
  children: TreeMapChartData[];
}
</script>

<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue';

import { type BuildStats, getMetricLabel, getModuleSize } from '@/entities/bundle-stats';
import type { TreeMapOptions } from '../model/TreeMap.ts';
import { useChart } from '@/shared/lib';
import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { GraphChart, TreemapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

const props = defineProps<{ stats: BuildStats }>();
const options = defineModel<TreeMapOptions>('options', { required: true });

const main = useTemplateRef('main');
const chart = useChart(
  main,
  [TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer, TreemapChart],
  (c) => {
    c.on('contextmenu', (event) => {
      event.event!.event.preventDefault();
      const data = event.data as TreeMapChartData;

      const hiddenModules = new Set<number>();
      if (data.moduleIndex) {
        hiddenModules.add(data.moduleIndex);
      }

      function traverse(node: TreeMapChartData) {
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
    });

    c.setOption({
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
          name: 'Disk Usage',
          type: 'treemap',
          visibleMin: 300,
          label: {
            show: true,
            formatter: '{b}',
          },
          upperLabel: {
            show: true,
            height: 30,
          },
          itemStyle: {
            borderColor: '#fff',
          },
          levels: getLevelOption(),
          data: data.value,
        },
      ],
    });
  },
);

const data = computed(() => {
  const result: TreeMapChartData[] = [];
  for (const chunk of props.stats.chunks) {
    if (options.value.hiddenChunks.includes(chunk.fileName)) {
      continue;
    }

    const currentChunk: TreeMapChartData = {
      value: 0,
      name: chunk.fileName,
      path: chunk.fileName,
      children: [],
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
          const newNode: TreeMapChartData = {
            name: path[index],
            path: path[index],
            value: getModuleSize(module.fileNameIndex, props.stats, options.value.metric) ?? 0,
            children: [],
            moduleIndex,
          };
          currentNode.children.push(newNode);
          currentNode = newNode;
        }
      }
    }
  }

  function transformSize(node: TreeMapChartData) {
    for (const child of node.children) {
      transformSize(child);
    }

    if (node.children.length) {
      node.value = node.children.reduce((acc, cur) => acc + cur.value, 0);
    }
  }

  result.forEach(transformSize);

  function transformCompact(node: TreeMapChartData) {
    for (const child of node.children) {
      transformCompact(child);
    }

    if (node.children.length === 1) {
      node.path = `${node.path}/${node.children[0].path}`;
      node.name = `${node.name}/${node.children[0].name}`;
      node.children = node.children[0].children;
    }
  }

  if (options.value.compact) {
    result.forEach(transformCompact);
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
  <div ref="main" />
</template>
