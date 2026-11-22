<script lang="ts">
function minMax(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
const MIN_SYMBOL_SIZE = 12;
const MAX_SYMBOL_SIZE = 75;

const EDGE_SYMBOL = [undefined, 'arrow'];
const EDGE_SYMBOL_SIZE = 6;

const ROOT_COLOR = '#e7000b';
</script>

<script setup lang="ts">
import {
  computed, useTemplateRef, watch, watchEffect,
} from 'vue';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import { TreemapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import type { ECBasicOption } from 'echarts/types/dist/shared';
import { useDark } from '@vueuse/core';

import { useChart } from '@/shared/lib';
import {
  type BuildStats,
  formatSize,
  getAvailableMetrics,
  getModuleDependencyName,
  getModuleSize,
  removeEmptyLeafs,
  removeNodes,
} from '@/entities/bundle-stats';
import { accentColors, sourceAccentColor } from '@/shared/config';

import type { GraphOptions } from '../model/graph.ts';
import { computeLayout } from '../model/layout.ts';

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
          layout: 'none',
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
          // reduce hairball effect on edges
          lineStyle: {
            width: 0.5,
            opacity: 0.5,
            curveness: 0.3,
          },
        },
      ],
    });
    c.setOption(data.value);
  },
);

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

const isDark = useDark();

watchEffect(() => {
  if (chart.value) {
    const color = isDark.value ? '#ffffff' : '#111827';
    chart.value.setOption({
      title: {
        textStyle: {
          color,
        },
      },
      legend: {
        textStyle: {
          color,
        },
      },
      label: {
        color,
      },
    });
  }
});

const layout = computed(() => {
  const defaultMetric = getAvailableMetrics(props.stats)[0];

  return computeLayout(
    props.stats,
    (node) => minMax(
      (getModuleSize(node, props.stats, defaultMetric) ?? 0) / 1024,
      MIN_SYMBOL_SIZE,
      MAX_SYMBOL_SIZE,
    ),
    options.value.denseLayout,
  );
});

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
  const categories = [
    { name: 'src', itemStyle: { color: sourceAccentColor } },
    ...dependencies.map((dep, index) => ({
      name: dep,
      // wraps within the accents so a dependency never reuses the src color
      itemStyle: { color: accentColors[index % accentColors.length] },
    })),
  ];

  return {
    legend: {
      data: categories,
      top: 50,
      left: 0,
      icon: 'circle',
      orient: 'vertical',
      type: 'scroll',
      inactiveColor: '#333',
    },
    series: [
      {
        categories,
        edges: edges.map((edge) => ({
          source: edge[0],
          target: edge[1],
          symbol: EDGE_SYMBOL,
          symbolSize: EDGE_SYMBOL_SIZE,
        })),
        data: nodes.map((node, idx) => {
          const isRoot = props.stats.entryPoints.includes(node);
          const size = getModuleSize(node, props.stats, metric.value) ?? 0;
          const categoryIndex = dependencies.findIndex((el) => el === getModuleDependencyName(node)) + 1;

          const position = layout.value.get(node)!;

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
            x: position.x,
            y: position.y,
            // max size should be limited so we don't accidentally create a black hole
            symbolSize: minMax(size / 1024, MIN_SYMBOL_SIZE, MAX_SYMBOL_SIZE),
            itemStyle: {
              borderColor: size === 0 ? categories[categoryIndex].itemStyle.color : undefined,
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
