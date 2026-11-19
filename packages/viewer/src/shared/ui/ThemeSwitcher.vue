<script lang="ts" setup>
import { useDark } from '@vueuse/core';

const isDark = useDark();
function toggleDarkMode() {
  isDark.value = !isDark.value;
}
</script>

<template>
  <button
    type="button"
    class="h-7 w-7 flex cursor-pointer items-center justify-center rounded text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
    :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggleDarkMode"
  >
    <span :class="isDark ? 'i-mdi:weather-sunny' : 'i-mdi:weather-night'" />
  </button>
</template>
