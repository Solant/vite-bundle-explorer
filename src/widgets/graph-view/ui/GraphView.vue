<script lang="ts">
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import { TreemapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TitleComponent, TooltipComponent, TreemapChart, CanvasRenderer]);

function minMax(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
</script>

<script setup lang="ts">
import { useTemplateRef, watch } from 'vue';

import {
  type BuildStats,
  getModuleDependencyName,
  getModuleSize,
  isDependency,
} from '@/entities/bundle-stats';
import { useChart } from '@/shared/lib';

import type { GraphOptions } from '../model/graph.ts';

const props = defineProps<{ stats: BuildStats; options: GraphOptions }>();

const main = useTemplateRef('main');
const chart = useChart(main);

watch([chart, () => props.stats, () => props.options], ([newChart, newStats, newOptions]) => {
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
    title: {
      text: 'Module Import Graph',
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    legend: {
      data: ['src', ...dependencies],
      selected,
      top: 20,
      icon: 'circle',
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        force: {
          friction: newOptions.forceFriction,
          repulsion: newOptions.forceRepulsion,
          edgeLength: newOptions.forceEdgeLength,
          gravity: newOptions.forceGravity,
        },
        categories: [{ name: 'src' }, ...dependencies.map((dep) => ({ name: dep }))],
        data: newStats.importGraph.nodes.map((node, idx) => ({
          category: isDependency(node)
            ? dependencies.findIndex((el) => el === getModuleDependencyName(node)) + 1
            : 0,
          id: idx,
          name: node,
          // max size should be limited so we don't accidentally create a black hole
          symbolSize: minMax((getModuleSize(node, newStats) ?? 0) / 1024, 12, 75),
          emphasis: {
            label: {
              show: true,
            },
          },
        })),
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
            return `${moduleInfo}\n${((getModuleSize(moduleInfo, newStats) ?? 0) / 1024).toFixed(2)} KB`;
          },
        },
        edges: newStats.importGraph.edges.map((edge) => {
          return {
            source: edge[0],
            target: edge[1],
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
