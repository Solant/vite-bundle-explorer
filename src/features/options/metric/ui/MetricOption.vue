<script setup lang="ts">
import { type BuildStats, getAvailableMetrics, Metric } from '@/entities/bundle-stats';
import { DropdownOption } from '@/shared/ui';

const props = defineProps<{ stats: BuildStats }>();

const model = defineModel<Metric>({ required: true });

const CUSTOM_SORT = [
  Metric.Rendered,
  Metric.Minified,
  Metric.Compressed,
];

const metrics = getAvailableMetrics(props.stats).sort(
  (a, b) => CUSTOM_SORT.indexOf(a) - CUSTOM_SORT.indexOf(b),
);
</script>

<template>
  <DropdownOption v-model="model" title="Stats" :options="metrics" />
</template>
