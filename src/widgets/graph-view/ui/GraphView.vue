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

  newChart.setOption({
    title: {
      text: 'Module Import Graph',
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    legend: [{ data: ['src', 'node_modules'], selected: { src: true, node_modules: false } }],
    series: [
      {
        type: 'graph',
        layout: 'force',
        categories: [{ name: 'src' }, { name: 'node_modules' }],
        data: newStats.importGraph.nodes.map((node, idx) => ({
          category: node.startsWith('node_modules') ? 1 : 0,
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
