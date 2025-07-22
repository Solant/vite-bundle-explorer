<script lang="ts">
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GraphChart,
  CanvasRenderer
]);

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
  name: string;
  path: string;
  children: TreeMapChartData[];
}
</script>

<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue';

import type { BuildStats } from '@/entities/bundle-stats';
import type { TreeMapOptions } from '../model/TreeMap.ts';
import { useChart } from '@/shared/lib';

const props = defineProps<{ stats: BuildStats; options: TreeMapOptions }>();

const main = useTemplateRef('main');
const chart = useChart(main);

const data = computed(() => {
  if (!props.stats) {
    return;
  }

  const result: TreeMapChartData[] = [];
  for (const chunk of props.stats.chunks) {
    if (props.options.hiddenChunks.includes(chunk.fileName)) {
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
      if (props.options.hiddenModules.includes(module.fileName)) {
        continue;
      }

      const path = module.fileName.split('/');

      let currentNode = currentChunk;
      for (let index = 0; index < path.length; index += 1) {
        const child = currentNode.children.find((c) => c.name === path[index]);
        if (child) {
          currentNode = child;
        } else {
          const newNode: TreeMapChartData = {
            name: path[index],
            path: path[index],
            value: module.renderedLength,
            children: [],
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

  if (props.options.compact) {
    result.forEach(transformCompact);
  }

  return result;
});

watch([chart, () => props.stats, () => props.options], ([newChart, newStats]) => {
  if (!newChart || !newStats) {
    return;
  }

  newChart.setOption({
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
          'Rendered Size: ' + echarts.format.addCommas((value / 1024).toFixed(2)) + ' KB',
        );

        const moduleName = treePath.slice(1).join('/');
        const currentModuleIndex = props.stats.importGraph.nodes.findIndex(
          (node) => node === moduleName,
        );
        const edges =
          currentModuleIndex >= 0
            ? props.stats.importGraph.edges.filter(
                ([_source, target]) => target === currentModuleIndex,
              )
            : [];
        const parents = edges
          .map((edge) => props.stats.importGraph.nodes[edge[0]])
          .reduce((acc, cur) => acc.add(cur), new Set<string>());
        if (parents.size) {
          result.push(
            '<div class="mt-2">Imported by:</div>',
            '<ul>',
            ...[...parents].map((p) => `<li>${p}</li>`),
            '</ul>',
          );
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
});
</script>

<template>
  <div ref="main" />
</template>
