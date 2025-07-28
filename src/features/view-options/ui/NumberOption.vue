<script lang="ts" setup>
import { ref } from 'vue';
import { useEventListener } from '@vueuse/core';

import OptionItem from './OptionItem.vue';

const model = defineModel<number>({ required: true });

const props = defineProps<{ title: string; step?: number; fixed?: number }>();

const scrollEnabled = ref(false);
useEventListener(
  'wheel',
  (e) => {
    if (!scrollEnabled.value) {
      return;
    }

    if (e.deltaY < 0) {
      model.value += props.step ?? 1;
    } else {
      model.value -= props.step ?? 1;
    }
  },
  { passive: false },
);
</script>

<template>
  <OptionItem :title>
    <input
      type="number"
      :value="model.toFixed(props.fixed ?? 0)"
      @update="
        (event: InputEvent) => (model = Number.parseFloat((event.target as HTMLInputElement).value))
      "
      :step
      @mouseenter="scrollEnabled = true"
      @mouseleave="scrollEnabled = false"
    />
  </OptionItem>
</template>
