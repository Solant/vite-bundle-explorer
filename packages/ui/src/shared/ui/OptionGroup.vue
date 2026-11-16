<script setup lang="ts">
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from 'reka-ui';

defineProps<{ title: string }>();
</script>

<template>
  <AccordionRoot
    type="single"
    collapsible
    default-value="1"
    class="mt-2 border-t border-gray-200 dark:border-gray-800"
  >
    <AccordionItem value="1">
      <AccordionHeader>
        <AccordionTrigger
          class="group w-full flex cursor-pointer items-center gap-1 px-2 py-1.5 text-[11px] text-gray-400 font-semibold tracking-wide uppercase transition-colors dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <div class="min-w-0 flex-1 truncate text-left">
            {{ title }}
          </div>
          <span class="i-mdi:chevron-down flex-none text-[14px] transition-transform group-data-[state=open]:rotate-180" />
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent>
        <slot />
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
