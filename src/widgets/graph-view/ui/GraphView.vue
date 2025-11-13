<script lang="ts">
function minMax(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const EDGE_SYMBOL = [undefined, 'arrow'];

const ROOT_COLOR = '#e7000b';
</script>

<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import { TreemapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import type { ECBasicOption } from 'echarts/types/dist/shared';

import { useChart } from '@/shared/lib';
import {
  type BuildStats,
  formatSize,
  getModuleDependencyName,
  getModuleSize,
  removeEmptyLeafs,
  removeNodes,
} from '@/entities/bundle-stats';
import { accentColors, sourceAccentColor } from '@/shared/config';

import type { GraphOptions } from '../model/graph.ts';

const props = defineProps<{ stats: BuildStats }>();
const options = defineModel<GraphOptions>('options', { required: true });

const main = useTemplateRef('main');
const chart = useChart(
  main,
  [
    TitleComponent,
    TooltipComponent,
    TreemapChart,
    CanvasRenderer,
  ],
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
        text: 'Dependencies',
        top: 20,
        left: 0,
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    newValue.forceEdgeLength === oldValue.forceEdgeLength
    && newValue.forceFriction === oldValue.forceFriction
    && newValue.forceEdgeLength === oldValue.forceEdgeLength
    && newValue.forceGravity === oldValue.forceGravity
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

  for (let i = 0; i < oldValue.length; i += 1) {
    if (oldValue[i] !== options.value.hiddenModules[i]) {
      return options.value.hiddenModules;
    }
  }

  return oldValue;
});
const compact = computed(() => options.value.compact);

const colors = [sourceAccentColor, ...accentColors];

const data = computed<ECBasicOption>(() => {
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

  return {
    legend: {
      data: [
        { name: 'src', itemStyle: { color: colors[0] } },
        ...dependencies.map((dep, index) => ({
          name: dep,
          itemStyle: { color: colors[index + 1] },
        })),
      ],
      top: 50,
      left: 0,
      icon: 'circle',
      orient: 'vertical',
      type: 'scroll',
      backgroundColor: '#e5e7ebd9',
      inactiveColor: '#333',
      inactiveBorderColor: 'blue',
    },
    series: [
      {
        categories: [
          { name: 'src', itemStyle: { color: colors[0] } },
          ...dependencies.map((dep, index) => ({
            name: dep,
            itemStyle: { color: accentColors[index + 1] },
          })),
        ],
        edges: edges.map((edge) => ({
          source: edge[0],
          target: edge[1],
          symbol: EDGE_SYMBOL,
        })),
        data: nodes.map((node, idx) => {
          const isRoot = !edges.some(([_source, target]) => target === idx);
          const size = getModuleSize(node, props.stats, metric.value) ?? 0;
          const categoryIndex = dependencies.findIndex((el) => el === getModuleDependencyName(node)) + 1;

          let color: string | undefined;
          if (isRoot) {
            color = ROOT_COLOR;
          } else if (size === 0) {
            color = '#ffffff';
          }

          return {
            category: categoryIndex,
            id: idx,
            name: node,
            // max size should be limited so we don't accidentally create a black hole
            symbolSize: minMax(size / 1024, 12, 75),
            itemStyle: {
              borderColor: size === 0 ? colors[categoryIndex % accentColors.length] : undefined,
              color,
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
