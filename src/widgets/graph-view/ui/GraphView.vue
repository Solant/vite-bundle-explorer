<script lang="ts">
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import { TreemapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TitleComponent, TooltipComponent, TreemapChart, CanvasRenderer]);

function minMax(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const COLORS = [
  '#059669',
  '#2563EB',
  '#CA8A04',
  '#9333EA',
  '#0D9488',
  '#65A30D',
  '#7C3AED',
  '#EA580C',
  '#0284C7',
  '#16A34A',
  '#4F46E5',
  '#D97706',
  '#047857',
  '#1D4ED8',
  '#A16207',
  '#7E22CE',
  '#0F766E',
  '#4D7C0F',
  '#6D28D9',
  '#C2410C',
  '#0369A1',
  '#15803D',
  '#4338CA',
  '#B45309',
  '#0E7490',
];

const EDGE_SYMBOL = [undefined, 'arrow'];

const ROOT_COLOR = '#e7000b';
</script>

<script setup lang="ts">
import { useTemplateRef, watch } from 'vue';

import {
  type BuildStats,
  formatModuleSize,
  getModuleDependencyName,
  getModuleSize,
} from '@/entities/bundle-stats';
import { useChart } from '@/shared/lib';

import type { GraphOptions } from '../model/graph.ts';

const props = defineProps<{ stats: BuildStats; options: GraphOptions }>();

const main = useTemplateRef('main');
const chart = useChart(main);

watch(
  () => props.options,
  (options) => {
    if (!chart.value) {
      return;
    }

    chart.value.setOption({
      series: [
        {
          force: {
            friction: options.forceFriction,
            repulsion: options.forceRepulsion,
            edgeLength: options.forceEdgeLength,
            gravity: options.forceGravity,
          },
        },
      ],
    });
  },
);

watch([chart, () => props.stats], ([newChart, newStats]) => {
  if (!newChart) {
    return;
  }

  const set = new Set<string>();
  for (const node of newStats.importGraph.nodes) {
    const dep = getModuleDependencyName(node);
    if (dep) {
      set.add(dep);
    }
  }
  const dependencies = Array.from(set);

  const selected: Record<string, boolean> = { src: true };
  for (const dep of dependencies) {
    selected[dep] = false;
  }

  newChart.setOption({
    color: COLORS,
    title: {
      text: 'Module Import Graph',
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    legend: {
      data: [
        { name: 'src', itemStyle: { color: COLORS[0] } },
        ...dependencies.map((dep, index) => ({
          name: dep,
          itemStyle: { color: COLORS[index + 1] },
        })),
      ],
      selected,
      top: 20,
      icon: 'circle',
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        force: {
          friction: props.options.forceFriction,
          repulsion: props.options.forceRepulsion,
          edgeLength: props.options.forceEdgeLength,
          gravity: props.options.forceGravity,
        },
        categories: [
          { name: 'src', itemStyle: { color: COLORS[0] } },
          ...dependencies.map((dep, index) => ({
            name: dep,
            itemStyle: { color: COLORS[index + 1] },
          })),
        ],
        data: newStats.importGraph.nodes.map((node, idx) => {
          const isRoot = !newStats.importGraph.edges.some(([_source, target]) => target === idx);
          const size = getModuleSize(node, newStats) ?? 0;
          const categoryIndex =
            dependencies.findIndex((el) => el === getModuleDependencyName(node)) + 1;
          return {
            category: categoryIndex,
            id: idx,
            name: node,
            // max size should be limited so we don't accidentally create a black hole
            symbolSize: minMax(size / 1024, 12, 75),
            itemStyle: {
              borderColor: size === 0 ? COLORS[categoryIndex % COLORS.length] : undefined,
              color: isRoot ? ROOT_COLOR : size === 0 ? '#ffffff' : undefined,
            },
            emphasis: {
              label: {
                show: true,
              },
            },
          };
        }),
        emphasis: {
          focus: 'adjacency',
          label: {
            position: 'right',
            show: true,
          },
        },
        label: {
          show: false,
          formatter(info: any) {
            const moduleInfo: string = info.data.name;
            return `${moduleInfo}\n${formatModuleSize(moduleInfo, newStats)}`;
          },
        },
        edges: newStats.importGraph.edges.map((edge) => {
          return {
            source: edge[0],
            target: edge[1],
            symbol: EDGE_SYMBOL,
          };
        }),
        roam: true,
        lineStyle: {
          width: 0.5,
          opacity: 0.7,
        },
      },
    ],
  });
});
</script>

<template>
  <div ref="main" />
</template>
