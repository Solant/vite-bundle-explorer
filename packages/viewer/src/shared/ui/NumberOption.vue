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
      class="h-6 inline-flex items-stretch overflow-hidden border border-gray-300 rounded dark:border-gray-700"
      @mouseenter="scrollEnabled = true"
      @mouseleave="scrollEnabled = false"
    >
      <button
        type="button"
        class="w-5 flex cursor-pointer items-center justify-center text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
        @click="decrement"
      >
        <span class="i-mdi:minus block text-xs" />
      </button>
      <input
        class="w-11 border-x border-gray-300 bg-transparent text-center text-xs tabular-nums outline-none dark:border-gray-700"
        :value="model.toFixed(props.fixed ?? 0)"
        :step
        @update="
          (event: InputEvent) =>
            (model = Number.parseFloat((event.target as HTMLInputElement).value))
        "
      >
      <button
        type="button"
        class="w-5 flex cursor-pointer items-center justify-center text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
        @click="increment"
      >
        <span class="i-mdi:plus block text-xs" />
      </button>
    </div>
  </OptionItem>
</template>
