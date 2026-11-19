<script setup lang="ts">
import BaseDisclosure from './BaseDisclosure.vue';

defineProps<{ title: string }>();
</script>

<template>
  <BaseDisclosure label-class="text-[13px] text-gray-700 dark:text-gray-300 px-2 py-1.5 flex w-full items-center justify-between" open>
    <template #label="{ isOpen }">
      {{ title }}
      <span class="i-mdi:chevron-down flex-none text-[14px] transition-transform" :class="isOpen ? 'rotate-180' : ''" />
    </template>

    <slot />
  </BaseDisclosure>
</template>
