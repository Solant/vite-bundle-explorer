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
  <AccordionRoot
    type="single"
    :collapsible="true"
  >
    <AccordionItem value="1">
      <AccordionHeader class="m-0">
        <AccordionTrigger class="flex justify-between w-full border-none px-4 py-3 bg-white c-gray-900 hover:bg-gray-200">
          <span>
            <slot name="header" />
          </span>
          V
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
