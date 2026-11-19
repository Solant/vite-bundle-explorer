<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui';

defineProps<{ title: string }>();

const open = defineModel<boolean>('open', { default: false });
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-30 bg-black/50" />
      <DialogContent
        :aria-describedby="undefined"
        class="fixed left-[50%] top-[50%] z-30 max-h-[85vh] max-w-96 w-[90vw] flex flex-col translate-x-[-50%] translate-y-[-50%] overflow-hidden border border-gray-200 rounded-md bg-white text-gray-900 shadow-lg outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      >
        <DialogTitle
          class="flex flex-none items-center justify-between gap-2 border-b border-gray-200 px-3 py-2 text-[13px] font-semibold dark:border-gray-800"
        >
          {{ title }}
          <DialogClose
            class="h-6 w-6 flex cursor-pointer items-center justify-center rounded text-gray-500 transition-colors -mr-1 hover:bg-gray-100 dark:text-gray-400 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span class="i-mdi:close" />
          </DialogClose>
        </DialogTitle>
        <div class="min-h-0 overflow-y-auto px-3 py-2.5 text-[13px] text-gray-700 dark:text-gray-300">
          <slot />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
