<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <div class="flex items-center justify-between gap-2 px-2 py-1.5 text-[13px] text-gray-700 dark:text-gray-300">
    {{ title }}

    <slot />
  </div>
</template>
