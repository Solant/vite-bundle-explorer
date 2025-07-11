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
        <AccordionTrigger class="flex justify-between w-full border-none">
          <span>
            <slot name="header" />
          </span>
          V
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent>
        <div>
          <slot />
        </div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
