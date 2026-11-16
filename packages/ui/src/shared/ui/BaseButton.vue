<script lang="ts" setup>
defineProps<{ disabled?: boolean }>();
</script>

<template>
  <button
    type="button"
    class="flex flex-shrink-0 cursor-pointer items-center justify-center gap-1 border border-blue-600 rounded-md border-solid bg-blue-600 px-2 py-1 c-white transition-colors active:bg-blue-800 hover:bg-blue-700"
    :class="disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''"
    :disabled
  >
    <slot />
  </button>
</template>
