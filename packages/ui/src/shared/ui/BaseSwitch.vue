<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui';

const model = defineModel<boolean>();
</script>

<template>
  <SwitchRoot
    v-model="model"
    class="relative h-4 w-7 flex cursor-pointer border border-transparent rounded-full transition-colors data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
  >
    <SwitchThumb
      class="my-auto h-3 w-3 translate-x-[2px] rounded-full bg-white shadow-sm transition-transform will-change-transform data-[state=checked]:translate-x-[14px]"
    />
  </SwitchRoot>
</template>
