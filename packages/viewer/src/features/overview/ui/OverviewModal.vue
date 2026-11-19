<script setup lang="ts">
import { getBundleOverview } from '@vite-bundle-explorer/shared';

import type { BuildStats } from '@/entities/bundle-stats';
import { BaseButton, BaseDialog } from '@/shared/ui';

const props = defineProps<{ stats: BuildStats }>();

const overview = getBundleOverview(props.stats);
</script>

<template>
  <BaseDialog title="Report">
    <template #trigger>
      <BaseButton :class="$attrs.class">
        <span v-if="overview.hasWarnings" class="i-mdi:warning-outline text-amber-500" />
        <span v-else class="i-mdi:information-outline" />
        Report
      </BaseButton>
    </template>

    <div class="space-y-1">
      <div>Number of chunks: {{ overview.numberOfChunks }}</div>
      <div>
        Number of modules: {{ overview.numberOfModules }} ({{ overview.numberOfVirtualModules }}
        virtual)
      </div>
      <div>Number of dependencies: {{ overview.numberOfDependencies }}</div>
      <div>Duplicated dependencies: {{ overview.duplicatedDependencies.length }}</div>
      <ul v-if="overview.duplicatedDependencies.length > 0" class="mt-2 space-y-1">
        <li
          v-for="item of overview.duplicatedDependencies"
          :key="item.name"
          class="flex items-center gap-1"
        >
          <div class="i-mdi:alert-circle-outline text-amber-500" />
          {{ item.name }} - {{ item.count }} versions
        </li>
      </ul>
    </div>
  </BaseDialog>
</template>
