<script lang="ts" setup>
import { ref } from 'vue';
import { useEventListener } from '@vueuse/core';

import OptionItem from './OptionItem.vue';

const props = defineProps<{ title: string; step?: number; fixed?: number }>();

const model = defineModel<number>({ required: true });

function increment() {
  model.value += props.step ?? 1;
}

function decrement() {
  model.value -= props.step ?? 1;
}

const scrollEnabled = ref(false);
useEventListener(
  'wheel',
  (e) => {
    if (!scrollEnabled.value) {
      return;
    }

    if (e.deltaY < 0) {
      increment();
    } else {
      decrement();
    }
  },
  { passive: false },
);
</script>

<template>
  <OptionItem :title>
    <div
      class="flex items-stretch border-1 border-gray-300 rounded border-solid"
      @mouseenter="scrollEnabled = true"
      @mouseleave="scrollEnabled = false"
    >
      <button
        class="w-[24px] flex items-center justify-center border-r border-gray-300 border-solid"
        @click="decrement"
      >
        <span class="i-mdi:minus block" />
      </button>
      <input
        class="max-w-[70px] appearance-none text-center focus:outline-none"
        :value="model.toFixed(props.fixed ?? 0)"
        :step
        @update="
          (event: InputEvent) =>
            (model = Number.parseFloat((event.target as HTMLInputElement).value))
        "
      >
      <button
        class="w-[24px] flex items-center justify-center border-l border-gray-300 border-solid"
        @click="increment"
      >
        <span class="i-mdi:plus block" />
      </button>
    </div>
  </OptionItem>
</template>
