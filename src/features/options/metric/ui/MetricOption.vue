<script lang="ts">
import { Metric } from '@/entities/bundle-stats';

const CUSTOM_SORT = [Metric.Rendered, Metric.Minified, Metric.Compressed];
</script>

<script setup lang="ts">
import { type BuildStats, getAvailableMetrics } from '@/entities/bundle-stats';
import { DropdownOption } from '@/shared/ui';

const props = defineProps<{ stats: BuildStats }>();

const model = defineModel<Metric>({ required: true });

const metrics = getAvailableMetrics(props.stats).sort(
  (a, b) => CUSTOM_SORT.indexOf(a) - CUSTOM_SORT.indexOf(b),
);
</script>

<template>
  <DropdownOption title="Stats" :options="metrics" v-model="model" />
</template>
