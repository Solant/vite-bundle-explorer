<script setup lang="ts">
import { type BuildStats, getAvailableMetrics, Metric } from '@/entities/bundle-stats';
import { DropdownOption } from '@/shared/ui';

const props = defineProps<{ stats: BuildStats }>();

const model = defineModel<Metric>({ required: true });

const CUSTOM_SORT = [
  Metric.Rendered,
  Metric.Bundled,
  Metric.Gzipped,
];

const metrics = getAvailableMetrics(props.stats).sort(
  (a, b) => CUSTOM_SORT.indexOf(a) - CUSTOM_SORT.indexOf(b),
);
</script>

<template>
  <DropdownOption v-model="model" title="Size metric" :options="metrics">
    <template #description>
      Choose which size is displayed.

      <p class="mt-2">
        <b>Rendered</b>: code after transforms and tree-shaking. This is the size of the processed code.
      </p>

      <p class="mt-2">
        <b>Bundled</b>: rendered code after bundling. Each module's size is accurately estimated from the percentage
        of the chunk it occupies. This is the size of an actual bundle file.
      </p>

      <p class="mt-2">
        <b>Gzipped</b>: bundled code after gzip compression. This value is calculated using Node.js's default gzip
        settings, so the real network transfer size may differ slightly. This is the size of the data transferred over
        the network.
      </p>
    </template>
  </DropdownOption>
</template>
