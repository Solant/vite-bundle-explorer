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
import { getBundleOverview } from '@/features/overview/model/overview.ts';
import type { BuildStats } from '@/entities/bundle-stats';
import { BaseButton } from '@/shared/ui';

const props = defineProps<{ stats: BuildStats }>();

const overview = getBundleOverview(props.stats);
</script>

<template>
  <DialogRoot>
    <DialogTrigger as-child>
      <BaseButton :class="$attrs.class">
        <span v-if="overview.hasWarnings" class="i-mdi:warning-outline" />
        <span v-else class="i-mdi:info" />
        Overview
      </BaseButton>
      <slot />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-30 bg-gray-200 opacity-75" />
      <DialogContent
        class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] bg-white rounded z-30"
      >
        <DialogTitle class="py-2 px-4 flex justify-center"> Overview</DialogTitle>
        <DialogDescription class="px-4 py-2">
          <div>Number of chunks: {{ overview.numberOfChunks }}</div>
          <div>
            Number of modules: {{ overview.numberOfModules }} ({{ overview.numberOfVirtualModules }}
            virtual)
          </div>
          <div>Number of dependencies: {{ overview.numberOfDependencies }}</div>
          <div class="flex items-center gap-1">
            <div
              v-if="overview.numberOfDependencies > 0"
              class="i-mdi:alert-circle-outline c-yellow-500"
            />
            Duplicated dependencies: {{ overview.duplicatedDependencies.length }}
          </div>
          <ul v-if="overview.duplicatedDependencies.length > 0">
            <li
              v-for="item of overview.duplicatedDependencies"
              :key="item.name"
              class="flex items-center gap-1"
            >
              <div class="i-mdi:alert-circle-outline c-yellow-500" />
              {{ item.name }} - {{ item.count }} versions
            </li>
          </ul>
        </DialogDescription>
        <DialogClose class="absolute top-3 right-2">
          <div class="i-mdi:close" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
