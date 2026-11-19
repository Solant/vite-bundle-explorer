<script lang="ts" setup>
defineProps<{ disabled?: boolean }>();
</script>

<template>
  <button
    type="button"
    class="h-6 inline-flex flex-shrink-0 cursor-pointer items-center justify-center gap-1 border border-gray-300 rounded bg-white px-2 text-xs text-gray-700 transition-colors dark:border-gray-700 active:bg-gray-200 dark:bg-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
    :class="disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''"
    :disabled
  >
    <slot />
  </button>
</template>
