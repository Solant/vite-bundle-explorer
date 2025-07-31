<script setup lang="ts">
import { inject } from 'vue';

import { nestedGroupSymbol } from './group-symbol.ts';

defineProps<{ title: string }>();

const nested = inject(nestedGroupSymbol, false);
</script>

<template>
  <div
    class="c-slate-800 flex justify-between p-2"
    :class="{ 'border-b border-solid border-gray-300': !nested }"
  >
    {{ title }}

    <slot />
  </div>
</template>
