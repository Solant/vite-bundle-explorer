<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui';
import { getBundleOverview } from '@vite-bundle-explorer/shared';

import type { BuildStats } from '@/entities/bundle-stats';
import { BaseButton } from '@/shared/ui';

const props = defineProps<{ stats: BuildStats }>();

const overview = getBundleOverview(props.stats);
</script>

<template>
  <DialogRoot>
    <DialogTrigger as-child>
      <BaseButton :class="$attrs.class">
        <span v-if="overview.hasWarnings" class="i-mdi:warning-outline text-amber-500" />
        <span v-else class="i-mdi:information-outline" />
        Report
      </BaseButton>
      <slot />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-30 bg-black/50" />
      <DialogContent
        class="fixed left-[50%] top-[50%] z-30 max-h-[85vh] max-w-96 w-[90vw] translate-x-[-50%] translate-y-[-50%] overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900"
      >
        <DialogTitle class="flex items-center justify-between border-b border-gray-200 px-4 py-2.5 text-sm font-semibold dark:border-gray-800">
          Report
          <DialogClose class="h-6 w-6 flex cursor-pointer items-center justify-center rounded text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100">
            <span class="i-mdi:close" />
          </DialogClose>
        </DialogTitle>
        <DialogDescription class="px-4 py-3 text-[13px] text-gray-600 space-y-1 dark:text-gray-300">
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
        </DialogDescription>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
