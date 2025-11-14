<script setup lang="ts">
import { inject } from 'vue';

import { nestedGroupSymbol } from './group-symbol.ts';

defineProps<{ title: string }>();

const nested = inject(nestedGroupSymbol, false);
</script>

<template>
  <div
    class="flex justify-between p-2 c-gray-700 dark:c-white"
    :class="{ 'border-b border-solid border-gray-300 dark:border-gray-700': !nested }"
  >
    {{ title }}

    <slot />
  </div>
</template>
