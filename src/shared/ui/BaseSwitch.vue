<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui';

const model = defineModel<boolean>();
</script>

<template>
  <SwitchRoot
    v-model="model"
    class="relative h-[20px] w-[32px] flex border border-stone-300 rounded-full shadow-sm data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-stone-300"
  >
    <SwitchThumb
      class="my-auto h-3.5 w-3.5 translate-x-0.5 rounded-full bg-white transition-transform will-change-transform data-[state=checked]:translate-x-full"
    />
  </SwitchRoot>
</template>
