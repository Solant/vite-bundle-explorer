<script setup lang="ts">
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from 'reka-ui';
import { provide } from 'vue';

import { nestedGroupSymbol } from './group-symbol.ts';

defineProps<{ title: string }>();

provide(nestedGroupSymbol, true);
</script>

<template>
  <AccordionRoot type="single" :collapsible="true">
    <AccordionItem value="1">
      <AccordionHeader>
        <AccordionTrigger
          class="group w-full flex items-center justify-between border-gray-300 border-solid p-2 c-gray-900 data-[state=closed]:border-b dark:border-gray-700 hover:bg-gray-200 dark:c-white dark:hover-bg-gray-600"
        >
          <div>{{ title }}</div>
          <span class="i-mdi:chevron-down group-data-[state=open]:rotate-180" />
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent class="border-b border-gray-300 border-solid dark:border-gray-700">
        <slot />
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
