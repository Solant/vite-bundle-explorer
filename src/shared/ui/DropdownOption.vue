<script setup lang="ts" generic="T extends string">
import OptionItem from './OptionItem.vue';

defineProps<{
  options: Array<T>;
  title: string;
}>();

const model = defineModel<T>({ required: true });
</script>

<template>
  <OptionItem :title>
    <select
      v-model="model"
      class="bg-transparent border-px border-solid border-blue-400 rounded capitalize focus:outline-none"
    >
      <option v-for="option in options" :key="option" :value="option" class="capitalize">
        {{ option }}
      </option>
    </select>
  </OptionItem>
</template>
