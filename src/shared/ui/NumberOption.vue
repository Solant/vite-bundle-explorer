<script lang="ts" setup>
import { ref } from 'vue';
import { useEventListener } from '@vueuse/core';

import OptionItem from './OptionItem.vue';

const model = defineModel<number>({ required: true });

const props = defineProps<{ title: string; step?: number; fixed?: number }>();

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
      class="flex items-stretch border-1 border-solid border-gray-300 rounded"
      @mouseenter="scrollEnabled = true"
      @mouseleave="scrollEnabled = false"
    >
      <button
        @click="decrement"
        class="border-r border-solid border-gray-300 w-[24px] flex items-center justify-center"
      >
        <span class="i-mdi:minus block" />
      </button>
      <input
        class="max-w-[70px] appearance-none text-center focus:outline-none"
        :value="model.toFixed(props.fixed ?? 0)"
        @update="
          (event: InputEvent) =>
            (model = Number.parseFloat((event.target as HTMLInputElement).value))
        "
        :step
      />
      <button
        @click="increment"
        class="border-l border-solid border-gray-300 w-[24px] flex items-center justify-center"
      >
        <span class="i-mdi:plus block" />
      </button>
    </div>
  </OptionItem>
</template>
