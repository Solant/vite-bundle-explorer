<script lang="ts">
function minMax(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const EDGE_SYMBOL = [undefined, 'arrow'];

const ROOT_COLOR = '#e7000b';
</script>

<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue';

import {
  type BuildStats,
  formatSize,
  getModuleDependencyName,
  getModuleSize,
  removeEmptyLeafs,
  removeNodes,
} from '@/entities/bundle-stats';
import { useChart } from '@/shared/lib';

import type { GraphOptions } from '../model/graph.ts';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import { TreemapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import type { ECBasicOption } from 'echarts/types/dist/shared';
import { accentColors } from '@/shared/config';

const props = defineProps<{ stats: BuildStats }>();
const options = defineModel<GraphOptions>('options', { required: true });

const main = useTemplateRef('main');
const chart = useChart(
  main,
  [TitleComponent, TooltipComponent, TreemapChart, CanvasRenderer],
  (c) => {
    c.on('contextmenu', (event) => {
      event.event!.event.preventDefault();
      options.value = {
        ...options.value,
        hiddenModules: [...options.value.hiddenModules, (event.data as { id: number }).id],
      };
    });

    c.setOption({
      color: accentColors,
      title: {
        text: 'Module Import Graph',
      },
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          layout: 'force',
          force: {
            friction: options.value.forceFriction,
            repulsion: options.value.forceRepulsion,
            edgeLength: options.value.forceEdgeLength,
            gravity: options.value.forceGravity,
          },
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
              return `${moduleInfo}\n${formatSize(getModuleSize(moduleInfo, props.stats, options.value.metric) ?? 0)}`;
            },
          },
          roam: true,
          lineStyle: {
            width: 0.5,
            opacity: 0.7,
          },
        },
      ],
    });
    c.setOption(data.value);
  },
);

watch(options, (newValue, oldValue) => {
  if (!chart.value) {
    return;
  }

  if (
    newValue.forceEdgeLength === oldValue.forceEdgeLength &&
    newValue.forceFriction === oldValue.forceFriction &&
    newValue.forceEdgeLength === oldValue.forceEdgeLength &&
    newValue.forceGravity === oldValue.forceGravity
  ) {
    return;
  }

  chart.value.setOption({
    series: [
      {
        force: {
          friction: newValue.forceFriction,
          repulsion: newValue.forceRepulsion,
          edgeLength: newValue.forceEdgeLength,
          gravity: newValue.forceGravity,
        },
      },
    ],
  });
});

const metric = computed(() => options.value.metric);
const hiddenModules = computed<(typeof options)['value']['hiddenModules']>((oldValue) => {
  if (oldValue?.length !== options.value.hiddenModules.length) {
    return options.value.hiddenModules;
  }

  for (let i = 0; i < oldValue.length; i++) {
    if (oldValue[i] !== options.value.hiddenModules[i]) {
      return options.value.hiddenModules;
    }
  }

  return oldValue;
});
const compact = computed(() => options.value.compact);

const data = computed<ECBasicOption>((prev) => {
  let { edges } = props.stats.importGraph;
  let nodes = props.stats.moduleFileNames;

  if (compact.value) {
    const result = removeEmptyLeafs(nodes, edges, props.stats, metric.value);
    edges = result.edges;
    nodes = result.nodes;
  }

  if (hiddenModules.value.length) {
    const result = removeNodes(nodes, edges, hiddenModules.value);
    edges = result.edges;
    nodes = result.nodes;
  }

  const set = new Set<string>();
  for (const node of nodes) {
    const dep = getModuleDependencyName(node);
    if (dep) {
      set.add(dep);
    }
  }
  const dependencies = Array.from(set);

  const selected: Record<string, boolean> = { src: true };
  if (prev === undefined) {
    for (const dep of dependencies) {
      selected[dep] = false;
    }
  }

  return {
    legend: {
      data: [
        { name: 'src', itemStyle: { color: accentColors[0] } },
        ...dependencies.map((dep, index) => ({
          name: dep,
          itemStyle: { color: accentColors[index + 1] },
        })),
      ],
      selected,
      top: 20,
      icon: 'circle',
    },
    series: [
      {
        categories: [
          { name: 'src', itemStyle: { color: accentColors[0] } },
          ...dependencies.map((dep, index) => ({
            name: dep,
            itemStyle: { color: accentColors[index + 1] },
          })),
        ],
        edges: edges.map((edge) => {
          return {
            source: edge[0],
            target: edge[1],
            symbol: EDGE_SYMBOL,
          };
        }),
        data: nodes.map((node, idx) => {
          const isRoot = !edges.some(([_source, target]) => target === idx);
          const size = getModuleSize(node, props.stats, metric.value) ?? 0;
          const categoryIndex =
            dependencies.findIndex((el) => el === getModuleDependencyName(node)) + 1;
          return {
            category: categoryIndex,
            id: idx,
            name: node,
            // max size should be limited so we don't accidentally create a black hole
            symbolSize: minMax(size / 1024, 12, 75),
            itemStyle: {
              borderColor: size === 0 ? accentColors[categoryIndex % accentColors.length] : undefined,
              color: isRoot ? ROOT_COLOR : size === 0 ? '#ffffff' : undefined,
            },
            emphasis: {
              label: {
                show: true,
              },
            },
          };
        }),
      },
    ],
  };
});

watch(data, (newData) => {
  chart.value?.setOption(newData);
});
</script>

<template>
  <div ref="main" />
</template>
