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
          class="flex justify-between items-center w-full border-none py-2 bg-white c-slate-800 hover:bg-blue-300 group"
        >
          <span>
            <slot name="header" />
          </span>
          <span class="i-mdi:chevron-down group-data-[state=open]:rotate-180" />
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent class="border border-solid border-gray-300 p-1">
        <div>
          <slot />
        </div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
