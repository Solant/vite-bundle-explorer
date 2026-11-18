<script lang="ts" setup>
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui';

function resize() {
  window.dispatchEvent(new Event('resize'));
}
</script>

<template>
  <SplitterGroup direction="horizontal" class="min-h-0 flex-1">
    <SplitterPanel :default-size="20" :min-size="12">
      <div class="h-full overflow-y-auto bg-gray-50 p-1.5 dark:bg-gray-950/40">
        <slot name="aside" />
      </div>
    </SplitterPanel>

    <SplitterResizeHandle class="w-1.5 bg-gray-100 outline-none transition-colors dark:bg-gray-800 hover:bg-blue-600" />

    <SplitterPanel class="flex" @resize="resize">
      <slot name="main" />
    </SplitterPanel>
  </SplitterGroup>
</template>
