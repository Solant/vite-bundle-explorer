<script setup lang="ts">
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from 'reka-ui';
</script>

<template>
  <AccordionRoot type="single" :collapsible="true">
    <AccordionItem value="1">
      <AccordionHeader class="my-2">
        <AccordionTrigger
          class="group w-full flex items-center justify-between border-none bg-white py-2 c-slate-800 hover:bg-blue-300"
        >
          <span>
            <slot name="header" />
          </span>
          <span class="i-mdi:chevron-down group-data-[state=open]:rotate-180" />
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent class="border border-gray-300 border-solid p-1">
        <div>
          <slot />
        </div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
