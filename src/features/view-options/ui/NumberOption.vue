<script lang="ts" setup>
import { ref } from 'vue';
import { useEventListener } from '@vueuse/core';

import Option from '@/features/view-options/ui/Option.vue';

const model = defineModel<number>({ required: true });

const props = defineProps<{ title: string; step?: number; fixed?: number }>();

const scrollEnabled = ref(false);
useEventListener('wheel', (e) => {
  if (!scrollEnabled.value) {
    return;
  }

  if (e.deltaY < 0) {
    model.value += props.step ?? 1;
  } else {
    model.value -= props.step ?? 1;
  }
}, { passive: false });
</script>

<template>
  <Option :title>
    <input
      type="number"
      :value="model.toFixed(props.fixed ?? 0)"
      @update="event => model = Number.parseFloat(event.target.value)"
      :step
      @mouseenter="scrollEnabled = true"
      @mouseleave="scrollEnabled = false"
    />
  </Option>
</template>
