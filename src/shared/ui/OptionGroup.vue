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
          class="flex justify-between p-2 c-slate-800 hover:bg-gray-200 group w-full items-center border-b border-solid border-gray-300"
        >
          <div>{{ title }}</div>
          <span class="i-mdi:chevron-down group-data-[state=open]:rotate-180" />
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent class="border-b border-solid border-gray-300">
        <slot />
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
