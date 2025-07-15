<script setup lang="ts">
import { useTemplateRef, watch } from 'vue';

import type { BuildStats } from '@/stats.ts';
import { useChart } from '@/shared/lib';

const props = defineProps<{ stats: BuildStats; options: {} }>();

const main = useTemplateRef('main');
const chart = useChart(main);

watch([chart, () => props.stats, () => props.options], ([newChart, newStats, _newOptions]) => {
  if (!newChart) {
    return;
  }

  const dependencies: string[] = [];
  for (const node of newStats.importGraph.nodes) {
    if (node.startsWith('node_modules')) {
      dependencies.push(node.split('/').slice(1, 2).join('/'));
    }
  }

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
        categories: [{ name: 'src' }, ...dependencies.map((dep) => ({ name: dep }))],
        data: newStats.importGraph.nodes.map((node, idx) => ({
          category: node.startsWith('node_modules')
            ? dependencies.findIndex((el) => node.startsWith(`node_modules/${el}`)) + 1
            : 0,
          id: idx,
          name: node,
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
