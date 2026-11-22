<script setup lang="ts" generic="T extends string">
import OptionItem from './OptionItem.vue';

defineProps<{
  options: Array<T>;
  title: string;
}>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
defineSlots<{ description?(): any }>();

const model = defineModel<T>({ required: true });
</script>

<template>
  <OptionItem :title>
    <select
      v-model="model"
      class="cursor-pointer rounded bg-gray-100 px-1.5 py-0.5 text-xs capitalize transition-colors dark:bg-gray-800 hover:bg-gray-200 focus:outline-none dark:hover:bg-gray-700"
    >
      <option
        v-for="option in options"
        :key="option"
        :value="option"
        class="capitalize"
      >
        {{ option }}
      </option>
    </select>

    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
  </OptionItem>
</template>
