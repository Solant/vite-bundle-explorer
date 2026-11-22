<script setup lang="ts">
import BaseTooltip from './BaseTooltip.vue';

defineProps<{ title: string }>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
defineSlots<{ description?(): any; default(): any }>();
</script>

<template>
  <div class="flex items-center gap-2 px-2 py-1.5 text-[13px] text-gray-700 dark:text-gray-300">
    <span class="min-w-0 flex-1 truncate" :title>
      {{ title }}
    </span>

    <BaseTooltip v-if="$slots.description">
      <div class="i-mdi:information-outline" />

      <template #content>
        <slot name="description" />
      </template>
    </BaseTooltip>

    <slot />
  </div>
</template>
