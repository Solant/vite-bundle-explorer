<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui';

const model = defineModel<boolean>();
</script>

<template>
  <SwitchRoot
    id="airplane-mode"
    v-model="model"
    class="w-[32px] h-[20px] shadow-sm flex data-[state=unchecked]:bg-stone-300 data-[state=checked]:bg-blue-700 border border-stone-300 data-[state=checked]:border-blue-700 rounded-full relative"
  >
    <SwitchThumb
      class="w-3.5 h-3.5 my-auto bg-white rounded-full transition-transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-full"
    />
  </SwitchRoot>
</template>
